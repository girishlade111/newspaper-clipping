/**
 * Standalone Client-side Export Engine
 * Handles DOM-to-Image (PNG/JPG/4K), PDF (jsPDF) and Print conversion.
 * Heavy libraries (html2canvas, jspdf) are dynamically imported on demand
 * so they never leak into the initial server-side render/hydration bundle.
 */

export type ImageFormat = 'png' | 'jpeg';

const BASE_FILENAME = 'vintage-newspaper-clipping';

// =========================================================================
// Internal helpers
// =========================================================================

/** Guard: these functions are browser-only, never run during SSR. */
function assertBrowser(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('Export functions can only be called in the browser.');
  }
}

/** Dynamically import html2canvas (handles default/interop differences). */
async function getHtml2canvas(): Promise<typeof import('html2canvas')['default']> {
  assertBrowser();
  const cached = (window as any).html2canvas;
  if (cached) return cached;
  const mod = await import('html2canvas');
  const fn = (mod as any).default ?? (mod as any).html2canvas ?? mod;
  (window as any).html2canvas = fn; // cache for subsequent calls
  return fn;
}

/**
 * Render an HTMLElement to a canvas.
 * `useCORS: true` allows cross-origin images (e.g. remote stock photos)
 * to render as long as the remote server sends CORS headers.
 */
async function renderToCanvas(element: HTMLElement, scale: number): Promise<HTMLCanvasElement> {
  const html2canvas = await getHtml2canvas();
  return html2canvas(element, {
    scale,
    useCORS: true,      // gracefully handle cross-origin images
    allowTaint: true,   // fallback: taint canvas rather than hard-fail
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });
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
// Public API: Image Export (PNG / JPG, with 4K support)
// =========================================================================

/**
 * Export an element as a PNG or JPEG image and trigger a download.
 *
 * @param element - The DOM node to capture (e.g. the preview panel).
 * @param format  - 'png' | 'jpeg'
 * @param is4K    - When true, renders at 4x scale for high-resolution 4K output.
 */
export async function exportAsImage(
  element: HTMLElement,
  format: ImageFormat = 'png',
  is4K: boolean = false
): Promise<void> {
  assertBrowser();

  // Standard export uses 2x for retina sharpness; 4K export uses 4x scale
  const scale = is4K ? 4 : 2;

  try {
    const canvas = await renderToCanvas(element, scale);
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const dataUrl = canvas.toDataURL(mimeType, format === 'jpeg' ? 0.95 : undefined);

    const extension = format === 'jpeg' ? 'jpg' : 'png';
    const suffix = is4K ? '-4k' : '';
    triggerDownload(dataUrl, `${BASE_FILENAME}${suffix}.${extension}`);
  } catch (err) {
    console.error(`Failed to export image as ${format}:`, err);
    throw new Error(
      'Image export failed. If the clipping contains external images, they may be ' +
      'blocked by CORS. Try re-uploading the image or use a different host.'
    );
  }
}

// =========================================================================
// Public API: PDF Export
// =========================================================================

/**
 * Export an element as a single-page A4 PDF using jsPDF.
 * The element is captured as an image first, then scaled to fit an A4 page
 * while preserving its aspect ratio and centered on the page.
 */
export async function exportAsPDF(element: HTMLElement): Promise<void> {
  assertBrowser();

  try {
    // Capture element as a high-resolution JPEG (scale 3 = good PDF quality)
    const canvas = await renderToCanvas(element, 3);
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Dynamically import jsPDF (v2+/v3+ exposes a named `jsPDF` export)
    const jspdfModule = await import('jspdf');
    const JsPDF = (jspdfModule as any).jsPDF ?? (jspdfModule as any).default ?? jspdfModule;

    // Pick orientation based on the element's aspect ratio
    const orientation = canvas.width > canvas.height ? 'landscape' : 'portrait';

    const pdf = new JsPDF({ orientation, unit: 'mm', format: 'a4' });

    // Page dimensions honour orientation (portrait: 210x297, landscape: 297x210)
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Fit image inside the page while preserving aspect ratio
    const aspectRatio = canvas.width / canvas.height;
    let renderWidth = pageWidth;
    let renderHeight = renderWidth / aspectRatio;

    if (renderHeight > pageHeight) {
      renderHeight = pageHeight;
      renderWidth = renderHeight * aspectRatio;
    }

    // Center the image on the page
    const offsetX = (pageWidth - renderWidth) / 2;
    const offsetY = (pageHeight - renderHeight) / 2;

    pdf.addImage(imgData, 'JPEG', offsetX, offsetY, renderWidth, renderHeight);
    pdf.save(`${BASE_FILENAME}.pdf`);
  } catch (err) {
    console.error('Failed to export PDF:', err);
    throw new Error('PDF export failed. Please try again.');
  }
}

// =========================================================================
// Public API: Print
// =========================================================================

/**
 * Print the clipping by opening a new window containing only the element's
 * HTML plus the current page's stylesheets, then invoking the print dialog.
 */
export function printClipping(element: HTMLElement): void {
  assertBrowser();

  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) {
    alert('Popup blocked! Please allow popups for this site to print your clipping.');
    return;
  }

  // Collect current page CSS: <link rel="stylesheet"> + inline <style> tags
  const styles = Array.from(
    document.querySelectorAll<HTMLLinkElement | HTMLStyleElement>(
      'link[rel="stylesheet"], style'
    )
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
      /* Print-specific reset: isolate the clipping and avoid page breaks */
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

  // Wait for styles/images inside the print window to load before printing
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    // Give the browser a moment before closing (Safari quirk)
    setTimeout(() => printWindow.close(), 500);
  };

  // Fallback if onload already fired (document.write timing differences)
  setTimeout(() => {
    if (!printWindow.closed) {
      try {
        printWindow.focus();
        printWindow.print();
        setTimeout(() => printWindow.close(), 500);
      } catch {
        /* window already closed by the onload handler */
      }
    }
  }, 1000);
}

