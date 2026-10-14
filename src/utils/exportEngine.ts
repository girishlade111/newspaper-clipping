/**
 * Foolproof Browser-only Export Engine
 * Uses asynchronous dynamic imports inside functions to fix Vite errors in Astro.
 * Targets document.getElementById('newspaper-export-target') to survive hydration.
 * Implements "Off-screen Pristine Clone" technique to bypass transform/scale viewport bugs.
 */

export type ImageFormat = 'png' | 'jpeg';

declare global {
  interface Window {
    // Second argument is either an explicit duration (ms) or a variant hint
    // ('info' | 'error' | ...) — see components/common/Toast.astro.
    showToast?: (message: string, durationOrType?: number | string) => void;
  }
}

const BASE_FILENAME = 'vintage-newspaper-clipping';

// Browsers cap canvas area (iOS Safari ≈ 16.7M px); anything beyond this can
// yield a blank canvas or crash the tab (Bug H-09).
const MAX_CANVAS_AREA = 16_000_000;

// Two animation frames instead of a hardcoded 300ms + 500ms stall (Bug M-07):
// long enough for layout/paint of the freshly appended clone, without dead time.
function nextPaint(): Promise<void> {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

// Shared onclone handler to fix html2canvas rendering bugs:
// - Operates ONLY on the off-screen export clone (matched by [data-export-clone]),
//   never on the live on-screen preview that shares the same id (Bug H-02 / M-28).
// - Removes transform scaling that breaks line-height calculations
// - Forces text-wrap: balance/pretty -> initial (html2canvas does not support it)
// - Forces text-justify -> left (html2canvas calculates justified text incorrectly)
// - Normalizes letter-spacing that causes word overlap
function getOnClone() {
  return (clonedDoc: Document) => {
    const el = clonedDoc.querySelector('[data-export-clone="true"]');
    if (el) {
      (el as HTMLElement).style.transform = 'none';

      const allElements = el.querySelectorAll('*');
      allElements.forEach((node) => {
        const target = node as HTMLElement;
        const view = clonedDoc.defaultView || window;
        try {
          const computed = view.getComputedStyle(target);
          const tw: string = (computed as any).textWrap || computed.getPropertyValue('text-wrap') || '';
          if (tw === 'balance' || tw === 'pretty' || tw.includes('balance') || tw.includes('pretty')) {
            target.style.textWrap = 'initial';
            target.style.setProperty('text-wrap', 'initial');
          }
          const inlineWrap = target.style.textWrap;
          if (inlineWrap === 'balance' || inlineWrap === 'pretty') {
            target.style.textWrap = 'initial';
          }
          if (target.classList.contains('text-balance') || target.classList.contains('text-pretty')) {
            target.style.textWrap = 'initial';
          }
        } catch {
          const inlineWrap = target.style.textWrap;
          if (inlineWrap === 'balance' || inlineWrap === 'pretty') {
            target.style.textWrap = 'initial';
          }
          if (target.classList.contains('text-balance') || target.classList.contains('text-pretty')) {
            target.style.textWrap = 'initial';
          }
        }

        const style = view.getComputedStyle(node as Element);
        if (style.textAlign === 'justify') {
          (node as HTMLElement).style.textAlign = 'left';
        }
        if (style.letterSpacing !== 'normal' && style.letterSpacing !== '0px') {
          (node as HTMLElement).style.letterSpacing = 'normal';
        }
      });
    }
  };
}

/**
 * Sanitize a cloned element directly (pristine clone) before html2canvas.
 * Mirrors getOnClone but operates on the off-screen clone itself.
 *
 * IMPORTANT (Bug H-01): this MUST be called only AFTER the clone has been
 * appended to document.body — `getComputedStyle()` returns an empty
 * CSSStyleDeclaration for detached nodes, so the sanitisation silently no-ops.
 */
function sanitizePristineClone(clone: HTMLElement) {
  clone.style.transform = 'none';
  // Ensure clone also has correct width handling
  clone.style.maxWidth = 'none';
  const allElements = clone.querySelectorAll('*');
  allElements.forEach((node) => {
    const target = node as HTMLElement;
    const style = window.getComputedStyle(target);
    // text-wrap
    const tw: string = (style as any).textWrap || style.getPropertyValue('text-wrap') || '';
    if (tw === 'balance' || tw === 'pretty' || tw.includes('balance') || tw.includes('pretty')) {
      target.style.textWrap = 'initial';
      target.style.setProperty('text-wrap', 'initial');
    }
    if (target.style.textWrap === 'balance' || target.style.textWrap === 'pretty') {
      target.style.textWrap = 'initial';
    }
    if (target.classList.contains('text-balance') || target.classList.contains('text-pretty')) {
      target.style.textWrap = 'initial';
    }
    if (style.textAlign === 'justify') {
      target.style.textAlign = 'left';
    }
    if (style.letterSpacing !== 'normal' && style.letterSpacing !== '0px') {
      target.style.letterSpacing = 'normal';
    }
  });
}

function createOffscreenContainer(): HTMLDivElement {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.transform = 'none';
  container.style.setProperty('transform', 'none', 'important');
  container.style.width = '1000px';
  container.style.maxWidth = 'none';
  container.style.margin = '0';
  container.style.padding = '0';
  // Ensure no scaling/overflow interferes with html2canvas bounding box
  container.style.overflow = 'visible';
  container.style.pointerEvents = 'none';
  return container;
}

// =========================================================================
// Public API: PNG Export (supports 4K via is4K flag)
// =========================================================================

export async function exportAsPNG(element?: HTMLElement | boolean, is4K: boolean = false): Promise<void> {
  if (typeof window === 'undefined') return;
  await document.fonts.ready;
  if (typeof element === 'boolean') {
    is4K = element as unknown as boolean;
    element = undefined;
  }
  let container: HTMLDivElement | null = null;
  try {
    const source = document.getElementById('newspaper-export-target') as HTMLElement | null;
    if (!source) { window.showToast?.('Export failed: Could not find the newspaper element in the DOM.', 'error'); return; }

    // 1. Clone the Target deeply. The duplicate id is dropped immediately so the
    //    cloned document can never resolve `newspaper-export-target` back to the
    //    LIVE on-screen preview (Bug H-02 / M-28).
    const clone = source.cloneNode(true) as HTMLElement;
    clone.removeAttribute('id');
    clone.setAttribute('data-export-clone', 'true');
    clone.style.transform = 'none';

    // 2. Off-screen container. Sanitisation runs AFTER the clone is attached,
    //    otherwise getComputedStyle() returns '' and nothing is fixed (Bug H-01).
    container = createOffscreenContainer();
    container.appendChild(clone);
    document.body.appendChild(container);
    sanitizePristineClone(clone);

    // 3. Append and Render: wait for fonts and paint (no fixed 800ms stall).
    await document.fonts.ready;
    await nextPaint();

    // 4. Guard against the browser canvas area limit on huge 4K renders (Bug H-09).
    let scale = 2;
    if (is4K) {
      scale = 4;
      const targetWidth = clone.scrollWidth || 1000;
      const targetHeight = clone.scrollHeight || 1400;
      if (targetWidth * targetHeight * 16 > MAX_CANVAS_AREA) {
        const safeScale = Math.floor(Math.sqrt(MAX_CANVAS_AREA / (targetWidth * targetHeight)) * 10) / 10;
        scale = Math.max(2, safeScale);
        window.showToast?.('Canvas size capped to prevent browser crash', 'info');
      }
    }

    const html2canvas = (await import('html2canvas')).default;
    // 5. Run html2canvas ON THIS HIDDEN CLONE, not the visible UI element
    const canvas = await html2canvas(clone, {
      useCORS: true,
      // allowTaint:false guarantees toDataURL() can never throw a SecurityError
      allowTaint: false,
      logging: false,
      scale,
      backgroundColor: '#ffffff',
      onclone: getOnClone(),
    });

    const dataUrl = canvas.toDataURL('image/png');
    const suffix = is4K ? '-4k' : '';
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${BASE_FILENAME}${suffix}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error: any) {
    console.error('Failed to export PNG:', error);
    window.showToast?.('Error generating image: ' + error.message, 'error');
  } finally {
    // 6. Cleanup strictly
    if (container) container.remove();
  }
}

// =========================================================================
// Public API: JPG Export
// =========================================================================

export async function exportAsJPG(element?: HTMLElement): Promise<void> {
  if (typeof window === 'undefined') return;
  await document.fonts.ready;
  let container: HTMLDivElement | null = null;
  try {
    const source = document.getElementById('newspaper-export-target') as HTMLElement | null;
    if (!source) { window.showToast?.('Export failed: Could not find the newspaper element in the DOM.', 'error'); return; }

    const clone = source.cloneNode(true) as HTMLElement;
    clone.removeAttribute('id');
    clone.setAttribute('data-export-clone', 'true');
    container = createOffscreenContainer();
    container.appendChild(clone);
    document.body.appendChild(container);
    sanitizePristineClone(clone);

    await document.fonts.ready;
    await nextPaint();

    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(clone, {
      useCORS: true,
      allowTaint: false,
      logging: false,
      scale: 2,
      backgroundColor: '#ffffff',
      onclone: getOnClone(),
    });
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${BASE_FILENAME}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error: any) {
    console.error('Failed to export JPG:', error);
    window.showToast?.('Error generating image: ' + error.message, 'error');
  } finally {
    if (container) container.remove();
  }
}

// =========================================================================
// Public API: PDF Export
// =========================================================================

export async function exportAsPDF(element?: HTMLElement): Promise<void> {
  if (typeof window === 'undefined') return;
  await document.fonts.ready;
  let container: HTMLDivElement | null = null;
  try {
    const source = document.getElementById('newspaper-export-target') as HTMLElement | null;
    if (!source) { window.showToast?.('Export failed: Could not find the newspaper element in the DOM.', 'error'); return; }

    const clone = source.cloneNode(true) as HTMLElement;
    clone.removeAttribute('id');
    clone.setAttribute('data-export-clone', 'true');
    container = createOffscreenContainer();
    container.appendChild(clone);
    document.body.appendChild(container);
    sanitizePristineClone(clone);

    await document.fonts.ready;
    await nextPaint();

    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(clone, {
      useCORS: true,
      allowTaint: false,
      logging: false,
      scale: 2,
      backgroundColor: '#ffffff',
      onclone: getOnClone(),
    });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    const { jsPDF } = await import('jspdf');

    // Bug C-05: landscape pages for wide clippings, and actually USE the fitted
    // dimensions (previously the raw, overflowing values were passed and the
    // bottom of every tall clipping was silently cropped).
    const orientation: 'p' | 'l' = canvas.width > canvas.height ? 'l' : 'p';
    const pdf = new jsPDF(orientation, 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    let finalWidth = pdfWidth;
    let finalHeight = pdfHeight;
    if (finalHeight > pageHeight) {
      finalHeight = pageHeight;
      finalWidth = (canvas.width * finalHeight) / canvas.height;
    }
    // Center the fitted image on the page.
    const xOffset = (pdfWidth - finalWidth) / 2;
    const yOffset = (pageHeight - finalHeight) / 2;

    pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight);
    pdf.save(`${BASE_FILENAME}.pdf`);
  } catch (error: any) {
    console.error('Failed to export PDF:', error);
    window.showToast?.('Error generating image: ' + error.message, 'error');
  } finally {
    if (container) container.remove();
  }
}

// =========================================================================
// Public API: Print
// =========================================================================

export function printClipping(element?: HTMLElement): void {
  if (typeof window === 'undefined') return;
  try {
    const target = (element as HTMLElement) ?? document.getElementById('newspaper-export-target') as HTMLElement | null;
    if (!target) { window.showToast?.('Export failed: Could not find the newspaper element in the DOM.', 'error'); return; }
    const printWindow = window.open('', '_blank', 'width=900,height=1000');
    if (!printWindow) {
      window.showToast?.('Popup blocked! Please allow popups for this site to print your clipping.', 'error');
      return;
    }
    const styles = Array.from(
      document.querySelectorAll<HTMLLinkElement | HTMLStyleElement>('link[rel="stylesheet"], style')
    )
      .map((node) => node.outerHTML)
      .join('\n');

    printWindow.document.open();
    printWindow.document.write(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Newspaper Clipping</title>
    ${styles}
    <style>
      html, body { margin: 0; padding: 0; background: #fff; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        @page { margin: 0; }
      }
    </style>
  </head>
  <body>${target.innerHTML}</body>
</html>`);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      setTimeout(() => printWindow.close(), 500);
    };
    setTimeout(() => {
      if (!printWindow.closed) {
        try {
          printWindow.focus();
          printWindow.print();
          setTimeout(() => printWindow.close(), 500);
        } catch {
          /* already closed */
        }
      }
    }, 1000);
  } catch (error: any) {
    console.error('Failed to print clipping:', error);
    window.showToast?.('Error generating image: ' + error.message, 'error');
  }
}
