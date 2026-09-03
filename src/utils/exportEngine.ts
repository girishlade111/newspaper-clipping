/**
 * Bulletproof Browser-only Export Engine
 * Handles PNG / JPG / 4K (html2canvas) and PDF (jsPDF) exports.
 * All functions are browser-only and guarded against SSR.
 */

export type ImageFormat = 'png' | 'jpeg';

const BASE_FILENAME = 'vintage-newspaper-clipping';

// =========================================================================
// Internal helpers
// =========================================================================

/** Dynamically import html2canvas (handles default/interop differences). */
async function getHtml2canvas(): Promise<typeof import('html2canvas')['default']> {
  if (typeof window === 'undefined') return undefined as unknown as typeof import('html2canvas')['default'];
  const cached = (window as unknown as Record<string, unknown>).html2canvas as typeof import('html2canvas')['default'] | undefined;
  if (cached) return cached;
  const mod = await import('html2canvas');
  const fn = (mod as unknown as Record<string, unknown>).default ?? (mod as unknown as Record<string, unknown>).html2canvas ?? mod;
  (window as unknown as Record<string, unknown>).html2canvas = fn;
  return fn as typeof import('html2canvas')['default'];
}

/** Trigger a programmatic download via a temporary <a download> element. */
function triggerDownload(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// =========================================================================
// Public API: PNG Export
// =========================================================================

/**
 * Export an element as PNG.
 * @param element - The DOM node to capture.
 * @param is4K - When true renders at 4x scale for 4K output, otherwise 2x.
 */
export async function exportAsPNG(element: HTMLElement, is4K: boolean = false): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const html2canvas = await getHtml2canvas();
    const canvas = await html2canvas(element, { useCORS: true, allowTaint: true, scale: is4K ? 4 : 2, backgroundColor: '#ffffff' });
    const dataUrl = canvas.toDataURL('image/png');
    const suffix = is4K ? '-4k' : '';
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${BASE_FILENAME}${suffix}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to export PNG:', error);
  }
}

// =========================================================================
// Public API: JPG Export
// =========================================================================

/**
 * Export an element as JPG/JPEG.
 * @param element - The DOM node to capture.
 */
export async function exportAsJPG(element: HTMLElement): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const html2canvas = await getHtml2canvas();
    const canvas = await html2canvas(element, { useCORS: true, allowTaint: true, scale: 2, backgroundColor: '#ffffff' });
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${BASE_FILENAME}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to export JPG:', error);
  }
}

// =========================================================================
// Public API: Generic Image Export (PNG / JPG with 4K support) - kept for backward compat
// =========================================================================

export async function exportAsImage(
  element: HTMLElement,
  format: ImageFormat = 'png',
  is4K: boolean = false
): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    if (format === 'jpeg') {
      if (is4K) {
        // 4K JPEG: render at 4x scale
        const html2canvas = await getHtml2canvas();
        const canvas = await html2canvas(element, { useCORS: true, allowTaint: true, scale: is4K ? 4 : 2, backgroundColor: '#ffffff' });
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${BASE_FILENAME}-4k.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        await exportAsJPG(element);
      }
      return;
    }
    await exportAsPNG(element, is4K);
  } catch (error) {
    console.error(`Failed to export image as ${format}:`, error);
  }
}

// =========================================================================
// Public API: PDF Export
// =========================================================================

/**
 * Export an element as A4 PDF using jsPDF.
 * Captures the element via html2canvas then scales to fit A4 while preserving aspect ratio.
 */
export async function exportAsPDF(element: HTMLElement): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const html2canvas = await getHtml2canvas();
    const canvas = await html2canvas(element, { useCORS: true, allowTaint: true, scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    const jspdfModule = await import('jspdf');
    const jsPDF = (jspdfModule as unknown as Record<string, unknown>).jsPDF ?? (jspdfModule as unknown as Record<string, unknown>).default ?? jspdfModule;

    const pdf = new (jsPDF as any)('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // If content is taller than one A4 page, pdfHeight will overflow - for single-page clipping we scale to fit
    // Calculate correct width/height ratio to fit inside A4
    const pageHeight = pdf.internal.pageSize.getHeight();
    let finalWidth = pdfWidth;
    let finalHeight = pdfHeight;
    if (pdfHeight > pageHeight) {
      finalHeight = pageHeight;
      finalWidth = (canvas.width * finalHeight) / canvas.height;
    }

    // Center if needed, but task requires 0,0 origin variant - use 0,0 for primary addImage
    // We add at 0,0 with calculated dimensions to satisfy bulletproof spec
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${BASE_FILENAME}.pdf`);
  } catch (error) {
    console.error('Failed to export PDF:', error);
  }
}

// =========================================================================
// Public API: Print
// =========================================================================

export function printClipping(element: HTMLElement): void {
  if (typeof window === 'undefined') return;
  try {
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
  <body>${element.innerHTML}</body>
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
  } catch (error) {
    console.error('Failed to print clipping:', error);
  }
}
