import type { NewspaperPreset } from './presets';

/**
 * Central render dimensions for the newspaper canvas (CSS pixels @ scale 1).
 * Tune these to change output size/aspect — all draw routines read from here.
 */
export const ENGINE_CONFIG = {
  /** Canvas width in px (800 → 1200px @ default 1.5x scale). */
  baseWidth: 800,
  /** Canvas height in px (1000 → 1500px @ default 1.5x scale). */
  baseHeight: 1000,
  /** Fixed photo block height in px (caption sits below it). */
  photoH: 240,
} as const;

export interface RenderOptions extends NewspaperPreset {
  userImage?: HTMLImageElement | null;
  scale?: number;
}

/**
 * FNV-1a string hash → 32-bit unsigned seed.
 * Stable across renders so procedural detail is reproducible (Bug M-11).
 */
function hashSeed(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/**
 * Mulberry32 — fast, deterministic, seedable PRNG.
 * Replaces Math.random() so the live preview and the exported PNG are
 * pixel-identical for the same clipping.
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class NewspaperEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    // Bug L-04: `willReadFrequently` forces a CPU-backed surface. The main canvas
    // is write-only (only the throwaway photo buffer does getImageData), so the
    // hint belongs there instead — keeping it here made the whole 1200×1500
    // canvas a software bitmap.
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D canvas context');
    this.ctx = context;
  }

  /** Seeded PRNG scoped to one render pass / one visual channel. */
  private createRng(options: RenderOptions, salt: string): () => number {
    return mulberry32(hashSeed(`${options.newspaperName}|${options.headline}|${salt}`));
  }

  public async render(options: RenderOptions): Promise<void> {
    const scale = options.scale || 1.5; // High-res rendering factor
    const width = ENGINE_CONFIG.baseWidth * scale;
    const height = ENGINE_CONFIG.baseHeight * scale;

    this.canvas.width = width;
    this.canvas.height = height;

    const ctx = this.ctx;
    ctx.save();
    ctx.scale(scale, scale);

    // 1. Draw Paper Background & Aging
    this.drawPaperBackground(options);

    // 2. Draw Torn Paper Path if enabled
    if (options.tornEdges) {
      this.drawTornEdgesOverlay();
    }

    // 3. Draw Newspaper Chrome / Masthead / Headers
    const contentStartY = this.drawMasthead(options);

    // 4. Draw Main Headline & Subheadline
    const bodyStartY = this.drawHeadlines(options, contentStartY);

    // 5. Draw Photo / Illustration (if present)
    const photoHeight = options.userImage ? this.drawPhoto(options, bodyStartY) : 0;

    // 6. Draw Columns of Article Body Text
    this.drawBodyText(options, bodyStartY + (photoHeight ? photoHeight + 20 : 0));

    // 7. Draw Creases & Coffee Stains
    if (options.creaseLines) {
      this.drawCreaseLines();
    }
    if (options.coffeeStain) {
      this.drawCoffeeStain();
    }

    ctx.restore();
  }

  private drawPaperBackground(options: RenderOptions) {
    const ctx = this.ctx;
    const w = ENGINE_CONFIG.baseWidth;
    const h = ENGINE_CONFIG.baseHeight;

    let baseBg = '#f4ede1';
    let grainColor = 'rgba(70, 50, 20, 0.04)';

    if (options.paperStyle === '1920') {
      baseBg = '#ecdcc2';
      grainColor = 'rgba(80, 55, 20, 0.08)';
    } else if (options.paperStyle === '1950') {
      baseBg = '#e8dec7';
      grainColor = 'rgba(60, 45, 15, 0.06)';
    } else if (options.paperStyle === 'burnt') {
      baseBg = '#dfcdab';
      grainColor = 'rgba(50, 30, 10, 0.12)';
    } else if (options.paperStyle === 'clean') {
      baseBg = '#f9f6ef';
      grainColor = 'rgba(40, 35, 25, 0.03)';
    }

    // Fill base tone
    ctx.fillStyle = baseBg;
    ctx.fillRect(0, 0, w, h);

    // Subtle edge gradient / yellowing
    const aging = (options.agingLevel || 50) / 100;
    const radialGrad = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.75);
    radialGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    radialGrad.addColorStop(0.7, `rgba(180, 140, 80, ${0.12 * aging})`);
    radialGrad.addColorStop(1, `rgba(130, 85, 35, ${0.28 * aging})`);
    ctx.fillStyle = radialGrad;
    ctx.fillRect(0, 0, w, h);

    // Procedural paper grain dots — deterministic so preview === export (Bug M-11)
    ctx.fillStyle = grainColor;
    const grainCount = Math.floor(6000 * aging);
    const rand = this.createRng(options, 'paper-grain');
    for (let i = 0; i < grainCount; i++) {
      const gx = rand() * w;
      const gy = rand() * h;
      const gr = rand() * 1.5 + 0.5;
      ctx.fillRect(gx, gy, gr, gr);
    }
  }

  private drawTornEdgesOverlay() {
    const ctx = this.ctx;
    const w = ENGINE_CONFIG.baseWidth;
    const h = ENGINE_CONFIG.baseHeight;

    ctx.save();
    ctx.strokeStyle = 'rgba(100, 70, 30, 0.15)';
    ctx.lineWidth = 1.5;

    // Outer subtle border
    ctx.strokeRect(10, 10, w - 20, h - 20);
    ctx.restore();
  }

  private drawMasthead(options: RenderOptions): number {
    const ctx = this.ctx;
    const w = ENGINE_CONFIG.baseWidth;
    const margin = 40;

    // Top Earpiece Header Band (Bug M-12: shrink to fit instead of overflowing)
    ctx.fillStyle = '#1c1815';
    const usableW = w - margin * 2;
    const buildEarFont = (size: number) => `bold ${size}px Inter, sans-serif`;
    const earMaxW = usableW * 0.46;
    const earSize = Math.min(
      this.fitFontSize(options.weatherLeft.toUpperCase(), earMaxW, 11, 7, buildEarFont),
      this.fitFontSize(options.weatherRight.toUpperCase(), earMaxW, 11, 7, buildEarFont)
    );

    ctx.textAlign = 'left';
    ctx.font = buildEarFont(earSize);
    ctx.fillText(options.weatherLeft.toUpperCase(), margin, 38);

    ctx.textAlign = 'right';
    ctx.font = buildEarFont(earSize);
    ctx.fillText(options.weatherRight.toUpperCase(), w - margin, 38);

    // Top Border Double Line
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1c1815';
    ctx.beginPath();
    ctx.moveTo(margin, 46);
    ctx.lineTo(w - margin, 46);
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin, 50);
    ctx.lineTo(w - margin, 50);
    ctx.stroke();

    // Newspaper Masthead Title (Bug M-12: shrink to fit the 800px canvas)
    ctx.fillStyle = '#110f0e';
    ctx.textAlign = 'center';

    const MASTHEAD_STYLES: Record<string, { weight: string; size: number; family: string }> = {
      gothic: { weight: 'bold', size: 54, family: 'UnifrakturMaguntia, serif' },
      serif: { weight: '900', size: 50, family: '"Playfair Display", serif' },
      headline: { weight: '900', size: 48, family: 'Cinzel, serif' },
      tabloid: { weight: '900', size: 58, family: '"Bebas Neue", sans-serif' },
      typewriter: { weight: 'bold', size: 44, family: '"Special Elite", monospace' },
    };
    const masthead = MASTHEAD_STYLES[options.fontStyle] || MASTHEAD_STYLES.gothic;
    const buildMastheadFont = (size: number) => `${masthead.weight} ${size}px ${masthead.family}`;
    const mastheadSize = this.fitFontSize(options.newspaperName, usableW, masthead.size, 18, buildMastheadFont);

    ctx.font = buildMastheadFont(mastheadSize);
    ctx.fillText(options.newspaperName, w / 2, 104);

    // Masthead Tagline / Slogan (Bug M-12)
    if (options.tagline) {
      const buildTaglineFont = (size: number) => `italic ${size}px "Playfair Display", Georgia, serif`;
      const taglineSize = this.fitFontSize(options.tagline, usableW, 12, 7, buildTaglineFont);
      ctx.font = buildTaglineFont(taglineSize);
      ctx.fillStyle = '#3a342f';
      ctx.fillText(options.tagline, w / 2, 126);
    }

    // Publication Info Bar (Date, Issue, Price)
    const barY = 138;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin, barY);
    ctx.lineTo(w - margin, barY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(margin, barY + 22);
    ctx.lineTo(w - margin, barY + 22);
    ctx.stroke();

    // Publication Info Bar (Date, Issue, Price) — each cell shrinks to fit (Bug M-12)
    const barSegmentW = usableW / 3 - 16;
    const buildBarFont = (size: number) => `600 ${size}px Inter, sans-serif`;
    const issueSize = this.fitFontSize(options.issue.toUpperCase(), barSegmentW, 11, 7, buildBarFont);
    const dateSize = this.fitFontSize(options.date.toUpperCase(), barSegmentW, 11, 7, buildBarFont);
    const priceSize = this.fitFontSize(options.price.toUpperCase(), barSegmentW, 11, 7, buildBarFont);
    ctx.fillStyle = '#1c1815';
    ctx.textAlign = 'left';
    ctx.font = buildBarFont(issueSize);
    ctx.fillText(options.issue.toUpperCase(), margin + 8, barY + 15);

    ctx.textAlign = 'center';
    ctx.font = buildBarFont(dateSize);
    ctx.fillText(options.date.toUpperCase(), w / 2, barY + 15);

    ctx.textAlign = 'right';
    ctx.font = buildBarFont(priceSize);
    ctx.fillText(options.price.toUpperCase(), w - margin - 8, barY + 15);

    return barY + 40;
  }

  private drawHeadlines(options: RenderOptions, startY: number): number {
    const ctx = this.ctx;
    const w = ENGINE_CONFIG.baseWidth;
    const margin = 40;
    const usableWidth = w - margin * 2;

    let currY = startY;

    // Main Headline (All caps, heavy broadsheet impact)
    ctx.fillStyle = '#0e0c0b';
    ctx.textAlign = 'center';
    ctx.font = '900 34px "Playfair Display", "Plus Jakarta Sans", serif';

    const headlineLines = this.wrapText(options.headline.toUpperCase(), usableWidth, ctx);
    for (const line of headlineLines) {
      ctx.fillText(line, w / 2, currY);
      currY += 38;
    }

    // Decorative divider below headline
    currY += 4;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#221e1a';
    ctx.beginPath();
    ctx.moveTo(margin + 40, currY);
    ctx.lineTo(w - margin - 40, currY);
    ctx.stroke();
    currY += 16;

    // Subheadline / Deck
    if (options.subheadline) {
      ctx.font = 'italic 16px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#2c2723';
      const subLines = this.wrapText(options.subheadline, usableWidth * 0.9, ctx);
      for (const line of subLines) {
        ctx.fillText(line, w / 2, currY);
        currY += 22;
      }
      currY += 8;
    }

    // Byline / Author
    if (options.author) {
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillStyle = '#443e39';
      ctx.fillText(`— ${options.author.toUpperCase()} —`, w / 2, currY);
      currY += 18;
    }

    // Divider before story
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(30, 25, 20, 0.4)';
    ctx.beginPath();
    ctx.moveTo(margin, currY);
    ctx.lineTo(w - margin, currY);
    ctx.stroke();

    return currY + 16;
  }

  private drawPhoto(options: RenderOptions, startY: number): number {
    if (!options.userImage) return 0;

    const ctx = this.ctx;
    const w = ENGINE_CONFIG.baseWidth;
    const margin = 40;
    const photoW = w - margin * 2;
    const photoH = ENGINE_CONFIG.photoH;

    // Draw frame
    ctx.strokeStyle = '#1a1614';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(margin, startY, photoW, photoH);

    // Apply Filter & Render to temporary buffer canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = photoW;
    tempCanvas.height = photoH;
    // Bug L-04: this buffer IS read back pixel-by-pixel, so the hint belongs here.
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    if (!tempCtx) return 0;

    // Draw user image scaled & cropped
    const img = options.userImage;
    const imgAspect = img.width / img.height;
    const targetAspect = photoW / photoH;
    let sx = 0, sy = 0, sw = img.width, sh = img.height;

    if (imgAspect > targetAspect) {
      sw = img.height * targetAspect;
      sx = (img.width - sw) / 2;
    } else {
      sh = img.width / targetAspect;
      sy = (img.height - sh) / 2;
    }

    tempCtx.drawImage(img, sx, sy, sw, sh, 0, 0, photoW, photoH);

    // Filter processing
    const imgData = tempCtx.getImageData(0, 0, photoW, photoH);
    const data = imgData.data;
    // Deterministic noise channel (Bug M-11) — seeded from the clipping identity.
    const noiseRng = this.createRng(options, 'photo-grain');

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;

      if (options.filter === 'halftone') {
        // High contrast dithering
        const threshold = 128;
        const val = gray > threshold ? 240 : 25;
        data[i] = val;
        data[i + 1] = Math.max(15, val - 10);
        data[i + 2] = Math.max(10, val - 20);
      } else if (options.filter === 'sepia') {
        data[i] = Math.min(255, gray * 1.15 + 20);
        data[i + 1] = Math.min(255, gray * 0.95 + 10);
        data[i + 2] = Math.min(255, gray * 0.75);
      } else if (options.filter === 'contrast') {
        const factor = 1.6;
        const cVal = Math.min(255, Math.max(0, factor * (gray - 128) + 128));
        data[i] = cVal;
        data[i + 1] = cVal;
        data[i + 2] = cVal;
      } else if (options.filter === 'grain') {
        const noise = (noiseRng() - 0.5) * 45;
        const gVal = Math.min(255, Math.max(0, gray + noise));
        data[i] = gVal;
        data[i + 1] = gVal;
        data[i + 2] = gVal;
      }
    }

    tempCtx.putImageData(imgData, 0, 0);

    // Draw filtered image to main canvas
    ctx.drawImage(tempCanvas, margin, startY);

    // Photo Caption — wraps and shrinks so long captions never run off-canvas (Bug M-12)
    if (options.photoCaption) {
      const captionMaxW = w - margin * 2;
      const buildCaptionFont = (size: number) => `italic ${size}px Georgia, serif`;
      let size = 11;
      ctx.font = buildCaptionFont(size);
      let lines = this.wrapText(options.photoCaption, captionMaxW, ctx);
      while (size > 8 && lines.length > 2) {
        size -= 1;
        ctx.font = buildCaptionFont(size);
        lines = this.wrapText(options.photoCaption, captionMaxW, ctx);
      }

      ctx.fillStyle = '#2b2622';
      ctx.textAlign = 'center';
      lines.forEach((line, i) => ctx.fillText(line, w / 2, startY + photoH + 15 + i * 13));
      return photoH + 24 + (lines.length - 1) * 13;
    }

    return photoH + 10;
  }

  private drawBodyText(options: RenderOptions, startY: number) {
    const ctx = this.ctx;
    const w = ENGINE_CONFIG.baseWidth;
    const margin = 40;
    const numCols = options.columns || 2;
    const colGap = 24;
    const totalUsableW = w - margin * 2;
    const colW = (totalUsableW - colGap * (numCols - 1)) / numCols;

    const paragraphs = options.body.split('\n\n').filter(p => p.trim().length > 0);
    ctx.font = '13.5px "Merriweather", Georgia, serif';
    ctx.fillStyle = '#1c1916';
    ctx.textAlign = 'left';

    const lineHeight = 19;
    let currentCol = 0;
    let colX = margin;
    let colY = startY;

    // Draw Column Separator Lines
    for (let c = 1; c < numCols; c++) {
      const sepX = margin + c * colW + (c - 0.5) * colGap;
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = 'rgba(25, 20, 15, 0.25)';
      ctx.beginPath();
      ctx.moveTo(sepX, startY);
      ctx.lineTo(sepX, ENGINE_CONFIG.baseHeight - margin - 20);
      ctx.stroke();
    }

    // Render paragraphs
    let isFirstParagraph = true;
    // Bug C-03: once the LAST column is full we must stop rendering paragraphs
    // entirely, otherwise colY stays out of bounds and every remaining paragraph
    // is painted on top of itself past the page bottom.
    let overflowed = false;

    for (const para of paragraphs) {
      let textToRender = para.trim();

      // Drop Cap for the very first letter of article
      if (isFirstParagraph && options.dropCap && textToRender.length > 0) {
        const dropLetter = textToRender.charAt(0);
        textToRender = textToRender.slice(1);

        ctx.font = 'bold 44px "Playfair Display", serif';
        ctx.fillStyle = '#0f0c0a';
        ctx.fillText(dropLetter, colX, colY + 36);

        // Resume text wrapped around drop cap
        ctx.font = '13.5px "Merriweather", Georgia, serif';
        ctx.fillStyle = '#1c1916';
        const lines = this.wrapText(textToRender, colW - 40, ctx);

        let linesDrawn = 0;
        for (const line of lines) {
          const drawX = linesDrawn < 2 ? colX + 38 : colX;
          ctx.fillText(line, drawX, colY);
          colY += lineHeight;
          linesDrawn++;
        }
        colY += 10;
        isFirstParagraph = false;
        continue;
      }

      ctx.font = '13.5px "Merriweather", Georgia, serif';
      const lines = this.wrapText(textToRender, colW, ctx);

      for (const line of lines) {
        if (colY + lineHeight > ENGINE_CONFIG.baseHeight - margin - 20) {
          if (currentCol + 1 >= numCols) {
            // No columns left — stop instead of drawing outside the page.
            overflowed = true;
            break;
          }
          currentCol++;
          colX = margin + currentCol * (colW + colGap);
          colY = startY;
        }

        ctx.fillText(line, colX, colY);
        colY += lineHeight;
      }

      if (overflowed) break;

      colY += 10;
      isFirstParagraph = false;
    }
  }

  private drawCreaseLines() {
    const ctx = this.ctx;
    const w = ENGINE_CONFIG.baseWidth;
    const h = ENGINE_CONFIG.baseHeight;

    ctx.save();
    // Horizontal center fold crease
    const midY = h * 0.48;
    const gradH = ctx.createLinearGradient(0, midY - 6, 0, midY + 6);
    gradH.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    gradH.addColorStop(0.5, 'rgba(70, 45, 15, 0.15)');
    gradH.addColorStop(1, 'rgba(0, 0, 0, 0.08)');
    ctx.fillStyle = gradH;
    ctx.fillRect(20, midY - 6, w - 40, 12);

    // Subtle vertical crease
    const midX = w * 0.52;
    const gradV = ctx.createLinearGradient(midX - 4, 0, midX + 4, 0);
    gradV.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    gradV.addColorStop(0.5, 'rgba(70, 45, 15, 0.1)');
    gradV.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
    ctx.fillStyle = gradV;
    ctx.fillRect(midX - 4, 20, 8, h - 40);
    ctx.restore();
  }

  private drawCoffeeStain() {
    const ctx = this.ctx;
    const w = ENGINE_CONFIG.baseWidth;
    const h = ENGINE_CONFIG.baseHeight;

    ctx.save();
    const cx = w * 0.78;
    const cy = h * 0.72;
    const radius = 55;

    ctx.strokeStyle = 'rgba(110, 70, 25, 0.16)';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(90, 50, 15, 0.22)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx + 2, cy - 2, radius - 2, 0.4, Math.PI * 1.8);
    ctx.stroke();

    // Inner soft stain tint
    const innerGrad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
    innerGrad.addColorStop(0, 'rgba(140, 95, 40, 0.02)');
    innerGrad.addColorStop(0.8, 'rgba(120, 75, 25, 0.08)');
    innerGrad.addColorStop(1, 'rgba(100, 60, 20, 0)');
    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Steps the active font size down (1px at a time) until `text` fits `maxWidth`.
   * Leaves `ctx.font` set to the fitted size so the caller can immediately fillText.
   * Returns the chosen size. Prevents long mastheads / taglines / captions from
   * spilling outside the fixed 800px canvas (Bug M-12).
   */
  private fitFontSize(
    text: string,
    maxWidth: number,
    initialSize: number,
    minSize: number,
    buildFont: (size: number) => string
  ): number {
    const ctx = this.ctx;
    let size = initialSize;
    ctx.font = buildFont(size);
    while (size > minSize && ctx.measureText(text).width > maxWidth) {
      size = Math.max(minSize, size - 1);
      ctx.font = buildFont(size);
    }
    return size;
  }

  private wrapText(text: string, maxWidth: number, ctx: CanvasRenderingContext2D): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    return lines;
  }

  public download(filename = 'vintage-newspaper-clipping.png', format: 'png' | 'jpeg' = 'png'): void {
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const link = document.createElement('a');
    link.download = filename;
    link.href = this.canvas.toDataURL(mimeType, 0.95);
    // Bug L-03: the anchor must be in the document for the synthetic click to be
    // honoured consistently across browsers.
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public async copyToClipboard(): Promise<boolean> {
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        this.canvas.toBlob((b) => resolve(b), 'image/png')
      );
      if (!blob) return false;
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      return true;
    } catch {
      return false;
    }
  }
}
