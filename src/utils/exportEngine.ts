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
