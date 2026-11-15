/**
 * Client-side Export & IndexedDB Storage Engine
 * Dynamically imports heavy libraries (html2canvas, jsPDF, dexie) on demand
 * to ensure instant, error-free client-side module hydration.
 */

export interface ClippingRecord {
  id?: number;
  template: string;
  newspaperName: string;
  tagline?: string;
  date: string;
  headline: string;
  /** Deck / kicker under the headline (Bug C-02 — was silently dropped). */
  subheadline?: string;
  /** Byline (Bug C-02 — was silently dropped). */
  author?: string;
  story: string;
  /** The user's actual uploaded photo, as a data URL (Bug C-01). */
  base64Image?: string | null;
  /** Low-res screenshot of the whole preview page, used only by the history drawer. */
  thumbnail?: string | null;
  photoCaption?: string;
  timestamp: number;
}

let dbInstance: any = null;

async function getDatabase(): Promise<any> {
  if (typeof window === 'undefined') return null;
  if (dbInstance) return dbInstance;

  try {
    const DexieModule = await import('dexie');
    const Dexie = (DexieModule as any).default || DexieModule;
    const db = new Dexie('NewspaperAppDB');
    // v1 is kept registered so existing databases upgrade cleanly instead of being reset.
    db.version(1).stores({
      clippingHistory: '++id, template, headline, timestamp',
    });
    db.version(2).stores({
      clippingHistory: '++id, template, headline, timestamp',
    });
    dbInstance = db;
    return dbInstance;
  } catch (err) {
    console.warn('Dexie DB initialization failed:', err);
    return null;
  }
}

/**
 * Save current editor state to Dexie.js
 */
export async function saveToDrafts(
  data: Omit<ClippingRecord, 'id' | 'timestamp'>
): Promise<number> {
  const db = await getDatabase();
  // Bug M-19: never fake success. The caller surfaces an error toast.
  if (!db) throw new Error('IndexedDB storage is unavailable');

  try {
    const id = await db.clippingHistory.add({
      template: data.template,
      newspaperName: data.newspaperName,
      tagline: data.tagline,
      date: data.date,
      headline: data.headline,
      subheadline: data.subheadline || '',
      author: data.author || '',
      story: data.story,
      // Bug C-01: the real photo must survive. The preview screenshot is stored separately.
      base64Image: data.base64Image || null,
      thumbnail: data.thumbnail || null,
      photoCaption: data.photoCaption,
      timestamp: Date.now(),
    });
    return id;
  } catch (err) {
    console.error('Failed to save draft:', err);
    throw err instanceof Error ? err : new Error(String(err));
  }
}

/**
 * Fetch all clippings ordered by most recent first
 */
export async function getRecentClippings(limit = 20): Promise<ClippingRecord[]> {
  const db = await getDatabase();
  if (!db) return [];

  try {
    return await db.clippingHistory.orderBy('timestamp').reverse().limit(limit).toArray();
  } catch (err) {
    console.error('Failed to get clippings:', err);
    return [];
  }
}

/**
 * Delete a clipping by ID
 */
export async function deleteClipping(id: number): Promise<void> {
  const db = await getDatabase();
  if (!db) return;

  try {
    await db.clippingHistory.delete(id);
  } catch (err) {
    console.error('Failed to delete clipping:', err);
  }
}

/**
 * Clear all clippings from database
 */
export async function clearAllClippings(): Promise<void> {
  const db = await getDatabase();
  if (!db) return;

  try {
    await db.clippingHistory.clear();
  } catch (err) {
    console.error('Failed to clear clippings:', err);
  }
}

/**
 * Capture mini-thumbnail for Dexie.js
 */
export async function captureThumbnail(element: HTMLElement): Promise<string> {
  try {
    const canvas = await renderElementCanvas(element, 0.4);
    return canvas.toDataURL('image/jpeg', 0.65);
  } catch {
    return '';
  }
}

// =========================================================================
// EXPORT ENGINE: Functions targeting the Live Preview container
// =========================================================================

function triggerDownload(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Dynamically import html2canvas
 */
async function getHtml2canvas(): Promise<any> {
  if (typeof window !== 'undefined' && (window as any).html2canvas) {
    return (window as any).html2canvas;
  }
  const mod = await import('html2canvas');
  return (mod as any).default || mod;
}

/**
 * Render HTMLElement to high-resolution canvas
 */
async function renderElementCanvas(element: HTMLElement, scale = 2): Promise<HTMLCanvasElement> {
  const html2canvas = await getHtml2canvas();
  return await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: false,
    // Bug M-16: a transparent background becomes black gutters once encoded to JPEG.
    backgroundColor: '#ffffff',
    logging: false,
    // Bug H-03: lock the render viewport to a desktop broadsheet width so
    // Tailwind `sm:`/`md:`/`lg:` breakpoints evaluate identically on every device
    // (otherwise a 375px phone produces a 1-column thumbnail, a desktop 3-column).
    windowWidth: 1200,
    windowHeight: element.scrollHeight,
  });
}

/**
 * Export PreviewPanel as PNG
 */
export async function downloadAsPNG(
  element: HTMLElement,
  filename = 'vintage-newspaper-clipping.png'
): Promise<void> {
  const canvas = await renderElementCanvas(element, 2);
  const dataUrl = canvas.toDataURL('image/png');
  triggerDownload(dataUrl, filename);
}

/**
 * Export PreviewPanel as JPG
 */
export async function downloadAsJPG(
  element: HTMLElement,
  filename = 'vintage-newspaper-clipping.jpg',
  quality = 0.95
): Promise<void> {
  const canvas = await renderElementCanvas(element, 2);
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  triggerDownload(dataUrl, filename);
}

/**
 * Export PreviewPanel as SVG
 */
export async function downloadAsSVG(
  element: HTMLElement,
  filename = 'vintage-newspaper-clipping.svg'
): Promise<void> {
  const canvas = await renderElementCanvas(element, 2);
  const dataUrl = canvas.toDataURL('image/png');
  const width = element.offsetWidth || 800;
  const height = element.offsetHeight || 1000;

  const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <title>Newspaper Clipping</title>
  <desc>Generated by The Vintage Press</desc>
  <image width="${width}" height="${height}" xlink:href="${dataUrl}"/>
</svg>`;

  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  URL.revokeObjectURL(url);
}

/**
 * Export PreviewPanel as PDF (jsPDF)
 */
export async function downloadAsPDF(
  element: HTMLElement,
  filename = 'vintage-newspaper-clipping.pdf'
): Promise<void> {
  const canvas = await renderElementCanvas(element, 2);
  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';

  const jspdfModule = await import('jspdf');
  const jsPDFClass = (jspdfModule as any).jsPDF || (jspdfModule as any).default || jspdfModule;

  const pdf = new jsPDFClass({
    orientation,
    unit: 'px',
    format: [imgWidth, imgHeight],
  });

  pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
  pdf.save(filename);
}
