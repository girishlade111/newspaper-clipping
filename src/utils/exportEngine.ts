/**
 * Foolproof Browser-only Export Engine
 * Uses document.getElementById('newspaper-export-target') instead of React refs
 * to survive Astro hydration / nested component edge-cases.
 */

export type ImageFormat = 'png' | 'jpeg';

const BASE_FILENAME = 'vintage-newspaper-clipping';

// =========================================================================
// Internal helpers
// =========================================================================

async function getHtml2canvas(): Promise<typeof import('html2canvas')['default']> {
  if (typeof window === 'undefined') return undefined as unknown as typeof import('html2canvas')['default'];
  const cached = (window as unknown as Record<string, unknown>).html2canvas as typeof import('html2canvas')['default'] | undefined;
  if (cached) return cached;
  const mod = await import('html2canvas');
  const fn = (mod as unknown as Record<string, unknown>).default ?? (mod as unknown as Record<string, unknown>).html2canvas ?? mod;
  (window as unknown as Record<string, unknown>).html2canvas = fn;
  return fn as typeof import('html2canvas')['default'];
}

// =========================================================================
// Public API: PNG Export (supports 4K via is4K flag)
// =========================================================================

export async function exportAsPNG(element?: HTMLElement, is4K: boolean = false): Promise<void> {
  if (typeof window === 'undefined') return;
  // Handle overloaded call where first arg is boolean (is4K without element)
  if (typeof element === 'boolean') {
    is4K = element as unknown as boolean;
    element = undefined;
  }
  try {
    const element = document.getElementById('newspaper-export-target');
    if (!element) { alert('Export failed: Could not find the newspaper element in the DOM.'); return; }
    const html2canvas = await getHtml2canvas();
    // Use exact safe options; scale 4 for 4K download, otherwise 2
    const canvas = is4K
      ? await html2canvas(element as HTMLElement, { useCORS: true, allowTaint: true, scale: 4, logging: true, backgroundColor: '#ffffff' })
      : await html2canvas(element as HTMLElement, { useCORS: true, allowTaint: true, scale: 2, logging: true, backgroundColor: '#ffffff' });
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
  }
}

// =========================================================================
// Public API: JPG Export
// =========================================================================

export async function exportAsJPG(element?: HTMLElement): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const element = document.getElementById('newspaper-export-target');
    if (!element) { alert('Export failed: Could not find the newspaper element in the DOM.'); return; }
    const html2canvas = await getHtml2canvas();
    const canvas = await html2canvas(element as HTMLElement, { useCORS: true, allowTaint: true, scale: 2, logging: true, backgroundColor: '#ffffff' });
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
  // Normalize overloaded signatures: exportAsImage('png'), exportAsImage(el,'png',true)
  if (typeof element === 'string') {
    is4K = format as unknown as boolean;
    format = element as ImageFormat;
    element = undefined;
  }
  try {
    const target = document.getElementById('newspaper-export-target');
    if (!target) { alert('Export failed: Could not find the newspaper element in the DOM.'); return; }
    if (format === 'jpeg') {
      if (is4K) {
        const html2canvas = await getHtml2canvas();
        const canvas = await html2canvas(target as HTMLElement, { useCORS: true, allowTaint: true, scale: 4, logging: true, backgroundColor: '#ffffff' });
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${BASE_FILENAME}-4k.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        await exportAsJPG();
      }
      return;
    }
    await exportAsPNG(undefined, is4K);
  } catch (error: any) {
    console.error(`Failed to export image as ${format}:`, error);
    alert('Error generating image: ' + error.message);
  }
}

// =========================================================================
// Public API: PDF Export
// =========================================================================

export async function exportAsPDF(element?: HTMLElement): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const element = document.getElementById('newspaper-export-target');
    if (!element) { alert('Export failed: Could not find the newspaper element in the DOM.'); return; }
    const html2canvas = await getHtml2canvas();
    const canvas = await html2canvas(element as HTMLElement, { useCORS: true, allowTaint: true, scale: 2, logging: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    const jspdfModule = await import('jspdf');
    const jsPDF: any = (jspdfModule as unknown as Record<string, unknown>).jsPDF ?? (jspdfModule as unknown as Record<string, unknown>).default ?? jspdfModule;

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
