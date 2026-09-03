/**
 * Foolproof Browser-only Export Engine
 * Uses asynchronous dynamic imports inside functions to fix Vite errors in Astro.
 * Targets document.getElementById('newspaper-export-target') to survive hydration.
 * Implements "Off-screen Pristine Clone" technique to bypass transform/scale viewport bugs.
 */

export type ImageFormat = 'png' | 'jpeg';

const BASE_FILENAME = 'vintage-newspaper-clipping';

// Shared onclone handler to fix html2canvas rendering bugs:
// - Removes transform scaling that breaks line-height calculations
// - Forces text-wrap: balance/pretty -> initial (html2canvas does not support it)
// - Forces text-justify -> left (html2canvas calculates justified text incorrectly)
// - Normalizes letter-spacing that causes word overlap
function getOnClone() {
  return (clonedDoc: Document) => {
    const el = clonedDoc.getElementById('newspaper-export-target');
    if (el) {
      el.style.transform = 'none';

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
          } else if (window.getComputedStyle(target).textWrap === 'balance') {
            target.style.textWrap = 'initial';
          }
          const inlineWrap = target.style.textWrap;
          if (inlineWrap === 'balance' || inlineWrap === 'pretty') {
            target.style.textWrap = 'initial';
          }
          if (target.classList.contains('text-balance') || target.classList.contains('text-pretty')) {
            target.style.textWrap = 'initial';
          }
        } catch {
          if (window.getComputedStyle(target).textWrap === 'balance') {
            (target as HTMLElement).style.textWrap = 'initial';
          }
          if ((target as HTMLElement).style.textWrap === 'balance' || (target as HTMLElement).style.textWrap === 'pretty') {
            (target as HTMLElement).style.textWrap = 'initial';
          }
        }

        const style = window.getComputedStyle(node as Element);
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
    if (!source) { alert('Export failed: Could not find the newspaper element in the DOM.'); return; }

    // 1. Clone the Target deeply
    const clone = source.cloneNode(true) as HTMLElement;
    clone.style.transform = 'none';

    // 2. Off-screen Container with strict inline styles
    container = createOffscreenContainer();
    // Sanitize pristine clone before append
    sanitizePristineClone(clone);
    container.appendChild(clone);
    document.body.appendChild(container);

    // 3. Append and Render: wait for fonts and paint
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 300));
    await new Promise(resolve => setTimeout(resolve, 500));

    const html2canvas = (await import('html2canvas')).default;
    const onclone = getOnClone();
    // 4. Run html2canvas ON THIS HIDDEN CLONE, not the visible UI element
    const canvas = is4K
      ? await html2canvas(clone as HTMLElement, { useCORS: true, allowTaint: true, scale: 4, logging: true, backgroundColor: '#ffffff', onclone })
      : await html2canvas(clone as HTMLElement, { useCORS: true, allowTaint: true, scale: 2, logging: true, backgroundColor: '#ffffff', onclone });

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
    alert('Error generating image: ' + error.message);
  } finally {
    // 5. Cleanup strictly
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
    if (!source) { alert('Export failed: Could not find the newspaper element in the DOM.'); return; }

    const clone = source.cloneNode(true) as HTMLElement;
    container = createOffscreenContainer();
    sanitizePristineClone(clone);
    container.appendChild(clone);
    document.body.appendChild(container);

    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 300));

    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(clone as HTMLElement, { useCORS: true, allowTaint: true, scale: 2, logging: true, backgroundColor: '#ffffff', onclone: getOnClone() });
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${BASE_FILENAME}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error: any) {
    console.error('Failed to export JPG:', error);
    alert('Error generating image: ' + error.message);
  } finally {
    if (container) container.remove();
  }
}

// =========================================================================
// Public API: Generic Image Export (kept for backward compat)
// =========================================================================

export async function exportAsImage(
  element?: HTMLElement | ImageFormat,
  format: ImageFormat = 'png',
  is4K: boolean = false
): Promise<void> {
  if (typeof window === 'undefined') return;
  await document.fonts.ready;
  if (typeof element === 'string') {
    is4K = format as unknown as boolean;
    format = element as ImageFormat;
    element = undefined;
  }
  let container: HTMLDivElement | null = null;
  try {
    const source = document.getElementById('newspaper-export-target') as HTMLElement | null;
    if (!source) { alert('Export failed: Could not find the newspaper element in the DOM.'); return; }

    if (format === 'jpeg') {
      // Delegate to JPG path with pristine clone (scale 2 for non-4K)
      // For is4K jpeg we handle directly here to reuse container
      if (!is4K) {
        // Reuse container logic via exportAsJPG would create second container; just call directly
        // Create pristine clone for jpeg non-4K
        const clone = source.cloneNode(true) as HTMLElement;
        container = createOffscreenContainer();
        sanitizePristineClone(clone);
        container.appendChild(clone);
        document.body.appendChild(container);
        await document.fonts.ready;
        await new Promise(resolve => setTimeout(resolve, 300));
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(clone as HTMLElement, { useCORS: true, allowTaint: true, scale: 2, logging: true, backgroundColor: '#ffffff', onclone: getOnClone() });
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${BASE_FILENAME}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      // is4K jpeg path - fall through to is4K handling below with same container
      const clone = source.cloneNode(true) as HTMLElement;
      container = createOffscreenContainer();
      sanitizePristineClone(clone);
      container.appendChild(clone);
      document.body.appendChild(container);
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 300));
      const html2canvas = (await import('html2canvas')).default;
      const onclone = getOnClone();
      const canvas = await html2canvas(clone as HTMLElement, { useCORS: true, allowTaint: true, scale: 4, logging: true, backgroundColor: '#ffffff', onclone });
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${BASE_FILENAME}-4k.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const clone = source.cloneNode(true) as HTMLElement;
    container = createOffscreenContainer();
    sanitizePristineClone(clone);
    container.appendChild(clone);
    document.body.appendChild(container);

    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 300));
    await new Promise(resolve => setTimeout(resolve, 500));

    const html2canvas = (await import('html2canvas')).default;
    const onclone = getOnClone();
    const canvas = is4K
      ? await html2canvas(clone as HTMLElement, { useCORS: true, allowTaint: true, scale: 4, logging: true, backgroundColor: '#ffffff', onclone })
      : await html2canvas(clone as HTMLElement, { useCORS: true, allowTaint: true, scale: 2, logging: true, backgroundColor: '#ffffff', onclone });
    const dataUrl = canvas.toDataURL('image/png');
    const suffix = is4K ? '-4k' : '';
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${BASE_FILENAME}${suffix}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error: any) {
    console.error(`Failed to export image as ${format}:`, error);
    alert('Error generating image: ' + error.message);
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
    if (!source) { alert('Export failed: Could not find the newspaper element in the DOM.'); return; }

    const clone = source.cloneNode(true) as HTMLElement;
    container = createOffscreenContainer();
    sanitizePristineClone(clone);
    container.appendChild(clone);
    document.body.appendChild(container);

    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 300));

    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(clone as HTMLElement, { useCORS: true, allowTaint: true, scale: 2, logging: true, backgroundColor: '#ffffff', onclone: (clonedDoc) => {
      const el = clonedDoc.getElementById('newspaper-export-target');
      if (el) {
        el.style.transform = 'none';
        const allElements = el.querySelectorAll('*');
        allElements.forEach(node => {
          if (window.getComputedStyle(node as Element).textWrap === 'balance') {
            (node as HTMLElement).style.textWrap = 'initial';
          }
          const target = node as HTMLElement;
          const computedWrap = (window.getComputedStyle(target as Element) as any).textWrap;
          if (computedWrap === 'pretty' || target.style.textWrap === 'pretty' || target.style.textWrap === 'balance') {
            target.style.textWrap = 'initial';
          }
          if (target.classList.contains('text-balance') || target.classList.contains('text-pretty')) {
            target.style.textWrap = 'initial';
          }
          const style = window.getComputedStyle(node as Element);
          if (style.textAlign === 'justify') {
            (node as HTMLElement).style.textAlign = 'left';
          }
          if (style.letterSpacing !== 'normal' && style.letterSpacing !== '0px') {
            (node as HTMLElement).style.letterSpacing = 'normal';
          }
        });
      }
      // Also sanitize pristine clone path for any additional nodes in clonedDoc
      const pristineFallback = clonedDoc.getElementById('newspaper-export-target');
      if (pristineFallback) {
        // ensure transform none already handled
      }
    } });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    const { jsPDF } = await import('jspdf');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    const pageHeight = pdf.internal.pageSize.getHeight();
    let finalWidth = pdfWidth;
    let finalHeight = pdfHeight;
    if (pdfHeight > pageHeight) {
      finalHeight = pageHeight;
      finalWidth = (canvas.width * finalHeight) / canvas.height;
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${BASE_FILENAME}.pdf`);
  } catch (error: any) {
    console.error('Failed to export PDF:', error);
    alert('Error generating image: ' + error.message);
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
    if (!target) { alert('Export failed: Could not find the newspaper element in the DOM.'); return; }
    const printWindow = window.open('', '_blank', 'width=900,height=1000');
    if (!printWindow) {
      alert('Popup blocked! Please allow popups for this site to print your clipping.');
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
    alert('Error generating image: ' + error.message);
  }
}
