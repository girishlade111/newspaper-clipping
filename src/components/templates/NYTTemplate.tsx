import React from 'react';

/**
 * NYTTemplate — A pixel-perfect replica of the classic New York Times front page
 * for use in the Live Preview of the clipping generator.
 *
 * Typography:
 *  - Masthead: 'Chomsky' (local, if installed) with Google Fonts 'UnifrakturMaguntia'
 *    as the closest Old-English blackletter fallback.
 *  - Headlines: 'Cheltenham' (local) with Google Fonts 'PT Serif' as the classic serif fallback.
 *  - Body: 'Georgia' system serif.
 */

export interface NYTTemplateProps {
  headline?: string;
  subheadline?: string;
  date?: string;
  author?: string;
  story?: string;
  /** URL of the lead photograph. No placeholder images are used — rendered only when provided. */
  image?: string | null;
  /** Optional extras for authenticity */
  newspaperName?: string;
  photoCaption?: string;
  price?: string;
  issueNumber?: string;
  className?: string;
}

// Inject Google Fonts once (idempotent across hot reloads / multiple mounts).
const FONT_LINK_ID = 'nyt-template-google-fonts';
function ensureFonts() {
  if (typeof document !== 'undefined' && !document.getElementById(FONT_LINK_ID)) {
    const link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap';
    document.head.appendChild(link);
  }
}

export default function NYTTemplate({
  headline = 'EXTRAORDINARY SCIENTIFIC REVELATION SHAKES ACADEMY',
  subheadline = 'Scholars Across the Nation Marvel as Long-Standing Theories Are Overturned in Midnight Demonstration',
  date = 'Friday, October 25, 1929',
  author = 'By SPECIAL CORRESPONDENT TO THE TIMES',
  story = `In an unprecedented series of events that unfolded late yesterday evening, international researchers disclosed startling new findings before a packed assembly of scholars.

Key witnesses detailed confidential archives documenting behind-the-scenes experiments spanning several decades. Observers noted the solemn stillness that swept across the grand auditorium as primary evidence was formally introduced into the public record.

"We stand at a critical juncture in our technological traditions," remarked committee chairmen during an impromptu press conference. Additional witnesses are summoned to testify later this week as the special inquiry broadens its scope across multiple institutions.

Telegrams received from overseas universities confirm that duplicate experiments achieved identical results under rigorous observation. Civic authorities have announced plans to convene a symposium next month to address the widespread implications.`,
  image = null,
  newspaperName = 'The New York Times',
  photoCaption = 'Scene outside the laboratory as delegates gathered to inspect the calibrated instruments yesterday afternoon.',
  price = 'TWO CENTS IN GREATER NEW YORK',
  issueNumber = 'VOL. LXXVIII . . . No. 25,844.',
  className = '',
}: NYTTemplateProps) {
  React.useMemo(ensureFonts, []);

  const paragraphs = (story || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const leadParagraph = paragraphs[0] || '';
  const remainingParagraphs = paragraphs.slice(1);

  // Font stacks: prefer the authentic commercial faces when available locally.
  const mastheadFont = "'Chomsky', 'UnifrakturMaguntia', serif";
  const headlineFont = "'Cheltenham', 'PT Serif', Georgia, serif";
  const bodyFont = "Georgia, 'Times New Roman', serif";

  return (
    <div
      className={`w-full max-w-5xl mx-auto bg-[#f7f4ea] text-[#111111] border border-black/60 shadow-2xl select-none px-4 sm:px-6 py-5 ${className}`}
      style={{ fontFamily: bodyFont }}
    >
      {/* ==================================================================== */}
      {/* 1. MASTHEAD — date & price flanking the Old-English title            */}
      {/* ==================================================================== */}
      <header className="border-b-2 border-black">
        {/* Top hairline row: issue number / edition */}
        <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-neutral-700 pb-1">
          <span>{issueNumber}</span>
          <span>★ Final City Edition ★</span>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-1.5">
          {/* Left flank: date */}
          <div className="text-[10px] sm:text-[11px] font-semibold text-neutral-800 text-left leading-tight">
            {date}
            <span className="block text-[8px] font-normal uppercase tracking-wider text-neutral-500 mt-0.5">
              © 1929 The New York Times Company
            </span>
          </div>

          {/* Center: blackletter masthead */}
          <h1
            className="whitespace-nowrap text-4xl sm:text-5xl md:text-6xl text-center leading-none text-black whitespace-nowrap"
            style={{ fontFamily: mastheadFont, fontWeight: 400 }}
          >
            {newspaperName}
          </h1>

          {/* Right flank: price */}
          <div className="text-[10px] sm:text-[11px] font-semibold text-neutral-800 text-right leading-tight">
            {price}
            <span className="block text-[8px] font-normal uppercase tracking-wider text-neutral-500 mt-0.5">
              All the News That's Fit to Print
            </span>
          </div>
        </div>

        {/* Double rule under masthead — signature NYT detail */}
        <div className="mt-1 border-t-2 border-black" />
      </header>

      {/* ==================================================================== */}
      {/* 2. LEAD HEADLINE BLOCK (Cheltenham / PT Serif)                        */}
      {/* ==================================================================== */}
      <div className="w-full text-center py-3 border-b border-gray-300">
        <h2
          className="font-bold text-3xl sm:text-4xl md:text-[2.75rem] leading-tight tracking-tight text-black"
          style={{ fontFamily: headlineFont }}
        >
          {headline}
        </h2>
        {subheadline && (
          <p
            className="mt-2 text-sm sm:text-base italic text-neutral-800 max-w-3xl mx-auto leading-snug"
            style={{ fontFamily: headlineFont }}
          >
            {subheadline}
          </p>
        )}
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
          {author}
        </p>
      </div>

      {/* ==================================================================== */}
      {/* 3. BODY — classic 6-column dense grid with 1px gray column rules      */}
      {/* ==================================================================== */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 grid-flow-row-dense auto-rows-auto divide-x divide-y divide-gray-300 [&>*]:p-2.5">
        {/* --- Columns 1–2: lead story with drop cap --- */}
        <article className="col-span-2 md:row-span-2">
          {leadParagraph && (
            <p className="text-justify text-[13px] leading-[1.45] text-black">
              <span
                className="float-left text-[3.25rem] leading-[0.85] font-bold mr-2 mt-1 text-black"
                style={{ fontFamily: headlineFont }}
              >
                {leadParagraph.charAt(0)}
              </span>
              {leadParagraph.slice(1)}
            </p>
          )}
          {remainingParagraphs[0] && (
            <p className="mt-2 text-justify text-[13px] leading-[1.45] indent-5 text-black">
              {remainingParagraphs[0]}
            </p>
          )}
        </article>

        {/* --- Columns 3–4: lead photograph (uses `image` prop; no placeholder) --- */}
        {image && (
          <figure className="col-span-2 sm:col-span-3 md:row-span-2 flex flex-col">
            <img
              src={image}
              alt={photoCaption}
              className="w-full h-40 sm:h-44 object-cover grayscale contrast-[1.05] sepia-[0.15] border border-black/30"
            />
            <figcaption className="mt-1 text-[9px] leading-tight text-neutral-700 italic">
              {photoCaption}
              <span className="block mt-0.5 not-italic font-bold uppercase tracking-wider text-neutral-600 text-right">
                Times Wide World Photos
              </span>
            </figcaption>
          </figure>
        )}

        {/* --- Remaining body text flows across the dense 6-column grid --- */}
        {remainingParagraphs.slice(1).map((para, idx) => (
          <article key={idx} className="col-span-1">
            {idx === 1 && (
              <h3
                className="text-[10px] font-bold uppercase tracking-widest text-center border-t border-b border-gray-300 py-1 mb-1.5"
                style={{ fontFamily: headlineFont }}
              >
                Congressional Reaction
              </h3>
            )}
            <p className="text-justify text-[13px] leading-[1.45] indent-4 text-black">
              {para}
            </p>
          </article>
        ))}

        {/* --- Tail ornament: "Continued on Page..." --- */}
        <div className="col-span-2 sm:col-span-3 md:col-span-1 flex items-end justify-center">
          <span className="text-[9px] tracking-widest text-neutral-600 border-t border-gray-300 pt-1.5 w-full text-center">
            — Continued on Page 12, Column 3 —
          </span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. FOOTER REGISTER STRIP                                             */}
      {/* ==================================================================== */}
      <footer className="mt-3 pt-1.5 border-t border-gray-300 flex flex-wrap items-center justify-between gap-1 text-[8px] font-bold uppercase tracking-wider text-neutral-600">
        <span>The New York Times Archives • Vol. LXXVIII</span>
        <span>Entered as Second Class Matter, Post Office, New York, N.Y.</span>
        <span>★ Final City Edition ★</span>
      </footer>
    </div>
  );
}
