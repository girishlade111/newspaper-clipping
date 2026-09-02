import type { NewspaperPreset } from './presets';

export interface RenderOptions extends NewspaperPreset {
  userImage?: HTMLImageElement | null;
  scale?: number;
}

export class NewspaperEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private baseWidth: number = 800;
  private baseHeight: number = 1000;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Could not get 2D canvas context');
    this.ctx = context;
  }

  public async render(options: RenderOptions): Promise<void> {
    const scale = options.scale || 1.5; // High-res rendering factor
    const width = this.baseWidth * scale;
    const height = this.baseHeight * scale;

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
    const w = this.baseWidth;
    const h = this.baseHeight;

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

    // Procedural paper grain dots
    ctx.fillStyle = grainColor;
    const grainCount = Math.floor(6000 * aging);
    for (let i = 0; i < grainCount; i++) {
      const gx = Math.random() * w;
      const gy = Math.random() * h;
      const gr = Math.random() * 1.5 + 0.5;
      ctx.fillRect(gx, gy, gr, gr);
    }
  }

  private drawTornEdgesOverlay() {
    const ctx = this.ctx;
    const w = this.baseWidth;
    const h = this.baseHeight;

    ctx.save();
    ctx.strokeStyle = 'rgba(100, 70, 30, 0.15)';
    ctx.lineWidth = 1.5;

    // Outer subtle border
    ctx.strokeRect(10, 10, w - 20, h - 20);
    ctx.restore();
  }

  private drawMasthead(options: RenderOptions): number {
    const ctx = this.ctx;
    const w = this.baseWidth;
    const margin = 40;

    // Top Earpiece Header Band
    ctx.fillStyle = '#1c1815';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(options.weatherLeft.toUpperCase(), margin, 38);

    ctx.textAlign = 'right';
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

    // Newspaper Masthead Title
    ctx.fillStyle = '#110f0e';
    ctx.textAlign = 'center';

    let mastheadFont = 'bold 54px UnifrakturMaguntia, serif';
    if (options.fontStyle === 'serif') mastheadFont = '900 50px "Playfair Display", serif';
    else if (options.fontStyle === 'headline') mastheadFont = '900 48px Cinzel, serif';
    else if (options.fontStyle === 'tabloid') mastheadFont = '900 58px "Bebas Neue", sans-serif';
    else if (options.fontStyle === 'typewriter') mastheadFont = 'bold 44px "Special Elite", monospace';

    ctx.font = mastheadFont;
    ctx.fillText(options.newspaperName, w / 2, 104);

    // Masthead Tagline / Slogan
    if (options.tagline) {
      ctx.font = 'italic 12px "Playfair Display", Georgia, serif';
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

    ctx.font = '600 11px Inter, sans-serif';
    ctx.fillStyle = '#1c1815';
    ctx.textAlign = 'left';
    ctx.fillText(options.issue.toUpperCase(), margin + 8, barY + 15);

    ctx.textAlign = 'center';
    ctx.fillText(options.date.toUpperCase(), w / 2, barY + 15);

    ctx.textAlign = 'right';
    ctx.fillText(options.price.toUpperCase(), w - margin - 8, barY + 15);

    return barY + 40;
  }

  private drawHeadlines(options: RenderOptions, startY: number): number {
    const ctx = this.ctx;
    const w = this.baseWidth;
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
    const w = this.baseWidth;
    const margin = 40;
    const photoW = w - margin * 2;
    const photoH = 240;

    // Draw frame
    ctx.strokeStyle = '#1a1614';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(margin, startY, photoW, photoH);

    // Apply Filter & Render to temporary buffer canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = photoW;
    tempCanvas.height = photoH;
    const tempCtx = tempCanvas.getContext('2d');
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
        const noise = (Math.random() - 0.5) * 45;
        const gVal = Math.min(255, Math.max(0, gray + noise));
        data[i] = gVal;
        data[i + 1] = gVal;
        data[i + 2] = gVal;
      }
    }

    tempCtx.putImageData(imgData, 0, 0);

    // Draw filtered image to main canvas
    ctx.drawImage(tempCanvas, margin, startY);

    // Photo Caption
    if (options.photoCaption) {
      ctx.font = 'italic 11px Georgia, serif';
      ctx.fillStyle = '#2b2622';
      ctx.textAlign = 'center';
      ctx.fillText(options.photoCaption, w / 2, startY + photoH + 15);
      return photoH + 24;
    }

    return photoH + 10;
  }

  private drawBodyText(options: RenderOptions, startY: number) {
    const ctx = this.ctx;
    const w = this.baseWidth;
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
      ctx.lineTo(sepX, this.baseHeight - margin - 20);
      ctx.stroke();
    }

    // Render paragraphs
    let isFirstParagraph = true;

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
        if (colY + lineHeight > this.baseHeight - margin - 20) {
          currentCol++;
          if (currentCol >= numCols) break;
          colX = margin + currentCol * (colW + colGap);
          colY = startY;
        }

        ctx.fillText(line, colX, colY);
        colY += lineHeight;
      }

      colY += 10;
      isFirstParagraph = false;
    }
  }

  private drawCreaseLines() {
    const ctx = this.ctx;
    const w = this.baseWidth;
    const h = this.baseHeight;

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
    const w = this.baseWidth;
    const h = this.baseHeight;

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
    link.click();
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
