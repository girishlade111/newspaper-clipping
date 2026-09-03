import React from 'react';

/**
 * TOITemplate — The Times of India (classic Indian broadsheet).
 *
 * Design intent (1:1 match to classic TOI clippings):
 *  - Typography: 'Merriweather' (black weights) for masthead/headlines — bold & legible;
 *    'Inter' for small UI elements (date bar, byline, captions, kickers).
 *  - Layout: 3-column dense text grid with column rules, drop cap + dateline lead.
 *  - Aggressive density: tight leading, heavy rules, bold ALL-CAPS sub-headlines.
 */

export interface TOITemplateProps {
  headline?: string;
  subheadline?: string;
  date?: string;
  author?: string;
  story?: string;
  image?: string | null;
  newspaperName?: string;
  tagline?: string;
  photoCaption?: string;
  edition?: string;
  price?: string;
  className?: string;
}

export default function TOITemplate({
  headline = 'NATION AWAKES TO FREEDOM AS HISTORIC BELLS TOLL AT MIDNIGHT',
  subheadline = 'HISTORIC CONSTITUENT ASSEMBLY RATIFIES SOVEREIGN PROCLAMATION IN PARLIAMENT HALL',
  date = 'Friday, August 15, 1947',
  author = 'Times News Network',
  story = `Amidst tumultuous scenes of rejoicing and jubilation that surpassed anything witnessed in modern history, millions of citizens poured into illuminated public squares last night to celebrate the dawn of a new era.

Conch shells echoed across every district and national standards fluttered proudly atop civic institutions as solemn vows were delivered before the Constituent Assembly. Observers noted the deep stillness that fell over the gallery as primary covenants were affirmed into the public ledger.

"At the stroke of the midnight hour, our long-suppressed spirit finds utterance," proclaimed the inaugural address to thunderous applause. Leaders appealed for peace, collective fortitude, and tireless service to the commonwealth.

Spontaneous celebrations continued well into the morning hours, with confections distributed freely throughout neighborhood quarters and civic buildings adorned in tricolor illumination. Delegations from across the globe extended formal felicitations to the presiding council.`,
  image = null,
  newspaperName = 'THE TIMES OF INDIA',
  tagline = 'ESTABLISHED 1838 • LARGEST CIRCULATION IN THE WORLD',
  photoCaption = 'Celebratory gathering at the illuminated public square during midnight proceedings.',
  edition = 'NEW DELHI LATE CITY EDITION',
  price = 'TWO ANNAS',
  className = '',
}: TOITemplateProps) {
  // Parse story into paragraphs
  const paragraphs = (story || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const leadParagraph = paragraphs[0] || '';
  const remainingParagraphs = paragraphs.slice(1);

  // Distribute remaining paragraphs across the three columns (aggressive density)
  const third = Math.ceil(remainingParagraphs.length / 3);
  const col1Paras = remainingParagraphs.slice(0, third);
  const col2Paras = remainingParagraphs.slice(third, third * 2);
  const col3Paras = remainingParagraphs.slice(third * 2);

  return (
    <div
      className={`w-full max-w-5xl mx-auto bg-[#f8f5ec] text-[#141414] p-4 sm:p-7 md:p-9 shadow-2xl border border-black/40 rounded-xs select-none relative overflow-hidden ${className}`}
      style={{
        fontFamily: 'Merriweather, Georgia, "Times New Roman", serif',
        boxShadow:
          '0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 18px rgba(0, 0, 0, 0.06) inset',
      }}
    >

      {/* ================================================================ */}
      {/* 1. TOP UTILITY STRIP (Edition / Date / Price) — Inter sans       */}
      {/* ================================================================ */}
      <div
        className="relative z-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-black/30 pb-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-neutral-800"
        style={{ fontFamily: 'Inter, Roboto, sans-serif' }}
      >
        <span>{edition}</span>
        <span className="font-black tracking-[0.2em]">{date}</span>
        <span>PRICE: {price}</span>
      </div>

      {/* ================================================================ */}
      {/* 2. MASTHEAD — Merriweather Black                                 */}
      {/* ================================================================ */}
      <div className="relative z-10 text-center py-2.5 sm:py-3.5">
        <div
          className="flex items-center justify-center gap-3 mb-1 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-neutral-700"
          style={{ fontFamily: 'Inter, Roboto, sans-serif' }}
        >
          <span className="h-px w-12 sm:w-24 bg-black/40" aria-hidden="true" />
          <span>★ LET TRUTH PREVAIL ★</span>
          <span className="h-px w-12 sm:w-24 bg-black/40" aria-hidden="true" />
        </div>

        <h1
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none text-black py-1"
          style={{ fontFamily: 'Merriweather, Georgia, serif' }}
        >
          {newspaperName}
        </h1>

        <p
          className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-700 mt-1"
          style={{ fontFamily: 'Inter, Roboto, sans-serif' }}
        >
          {tagline}
        </p>
      </div>

      {/* Heavy structural rule: separates masthead from dateline/content  */}
      <div className="relative z-10 border-t-[3px] border-black" aria-hidden="true" />

      {/* Dateline bar — bold TOI cities register (Inter) */}
      <div
        className="relative z-10 flex flex-wrap items-center justify-between border-b-2 border-black py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-black"
        style={{ fontFamily: 'Inter, Roboto, sans-serif' }}
      >
        <span>DELHI • BOMBAY • CALCUTTA • MADRAS</span>
        <span className="tracking-[0.2em]">{date}</span>
        <span>FINAL EDITION</span>
      </div>

      {/* ================================================================ */}
      {/* 3. HEADLINE BLOCK — Merriweather Black + BOLD CAPS SUBHEADLINE   */}
      {/* ================================================================ */}
      <div className="relative z-10 pt-3 pb-3 border-b-2 border-black/85 text-center">
        <h2
          className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[1.08] text-black max-w-4xl mx-auto"
          style={{ fontFamily: 'Merriweather, Georgia, serif' }}
        >
          {headline}
        </h2>

        {subheadline && (
          <div className="mt-3 pt-2 border-t border-black/25 max-w-3xl mx-auto">
            <h3
              className="text-[11px] sm:text-sm font-extrabold uppercase tracking-wider leading-snug text-black/90 px-2"
              style={{ fontFamily: 'Inter, Roboto, sans-serif' }}
            >
              {subheadline}
            </h3>
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* 4. DENSE 3-COLUMN BODY WITH COLUMN RULES                         */}
      {/* ================================================================ */}
      <div
        className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-4 pt-3 text-[11.5px] leading-[1.5] text-justify text-black"
        style={{ fontFamily: 'Merriweather, Georgia, serif' }}
      >
        {/* — COLUMN 1: Byline, Drop Cap Lead + Dateline, Lead Paras — */}
        <div className="md:border-r md:border-black/25 md:pr-5 flex flex-col gap-2.5">
          <div
            className="pb-1.5 border-b border-black/20"
            style={{ fontFamily: 'Inter, Roboto, sans-serif' }}
          >
            <span className="block text-[10px] font-black uppercase tracking-wider text-black">
              By {author}
            </span>
            <span className="block text-[9px] uppercase tracking-wide text-neutral-600">
              Special Correspondent
            </span>
          </div>

          {leadParagraph && (
            <p className="leading-relaxed">
              <span
                className="float-left text-4xl sm:text-5xl font-black leading-[0.85] mr-2 mt-1 select-none text-black"
                aria-hidden="true"
              >
                {leadParagraph.charAt(0)}
              </span>
              <strong
                className="font-black uppercase tracking-wider text-black"
                style={{ fontFamily: 'Inter, Roboto, sans-serif' }}
              >
                NEW DELHI:{' '}
              </strong>
              {leadParagraph.slice(1)}
            </p>
          )}

          {col1Paras.map((para, idx) => (
            <p key={idx} className="indent-3">
              {para}
            </p>
          ))}
        </div>

        {/* — COLUMN 2: Photo Dispatch + Continuation — */}
        <div className="md:border-r md:border-black/25 md:pr-5 flex flex-col gap-2.5">
          {image && (
            <figure className="border border-black bg-white p-1 mb-1">
              <img
                src={image}
                alt="News photograph"
                className="w-full h-auto max-h-[280px] object-cover grayscale contrast-125 brightness-95"
              />
              {photoCaption && (
                <figcaption
                  className="pt-1.5 mt-1 border-t border-black/20 text-[9px] italic leading-tight text-neutral-800 text-center"
                  style={{ fontFamily: 'Inter, Roboto, sans-serif' }}
                >
                  {photoCaption}
                </figcaption>
              )}
            </figure>
          )}

          {col2Paras.map((para, idx) => (
            <p key={idx} className="indent-3">
              {para}
            </p>
          ))}
        </div>

        {/* — COLUMN 3: Continuation + Pull Quote — */}
        <div className="flex flex-col gap-2.5">
          {col3Paras.map((para, idx) => (
            <p key={idx} className="indent-3">
              {para}
            </p>
          ))}

          {leadParagraph && (
            <blockquote
              className="mt-auto border-l-[3px] border-black bg-black/[0.04] px-2.5 py-2 text-[11px] font-medium leading-snug text-neutral-800"
              style={{ fontFamily: 'Inter, Roboto, sans-serif' }}
            >
              “At the stroke of the midnight hour, our long-suppressed spirit finds
              utterance.”
            </blockquote>
          )}

          <div
            className="pt-2 border-t border-black/25 text-center text-[8px] font-black uppercase tracking-[0.25em] text-neutral-600"
            style={{ fontFamily: 'Inter, Roboto, sans-serif' }}
          >
            Continued on Page 4, Column 1
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 5. BOTTOM FOOTER REGISTER                                        */}
      {/* ================================================================ */}
      <div
        className="relative z-10 mt-6 pt-1.5 border-t border-black/40 flex flex-wrap items-center justify-between gap-x-4 text-[8px] font-bold uppercase tracking-widest text-neutral-600"
        style={{ fontFamily: 'Inter, Roboto, sans-serif' }}
      >
        <span>The Times of India Press • Bennett, Coleman &amp; Co. Ltd.</span>
        <span>Registered with Registrar of Newspapers for India</span>
        <span>★ DAK EDITION ★</span>
      </div>
    </div>
  );
}

