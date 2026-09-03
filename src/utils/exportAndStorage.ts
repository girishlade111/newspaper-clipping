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
  story: string;
  base64Image?: string | null;
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
    db.version(1).stores({
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
  data: Omit<ClippingRecord, 'id' | 'timestamp'> & { thumbnail?: string | null }
): Promise<number> {
  const db = await getDatabase();
  if (!db) return Date.now();

  try {
    const id = await db.clippingHistory.add({
      template: data.template,
      newspaperName: data.newspaperName,
      tagline: data.tagline,
      date: data.date,
      headline: data.headline,
      story: data.story,
      base64Image: data.thumbnail || data.base64Image || null,
      photoCaption: data.photoCaption,
      timestamp: Date.now(),
    });
    return id;
  } catch (err) {
    console.error('Failed to save draft:', err);
    return Date.now();
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
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    windowWidth: element.scrollWidth,
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
