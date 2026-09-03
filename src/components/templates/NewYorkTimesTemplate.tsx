import React from 'react';

export interface NewYorkTimesProps {
  headline?: string;
  story?: string;
  date?: string;
  image?: string | null;
  author?: string;
  subheadline?: string;
  newspaperName?: string;
  photoCaption?: string;
  issueNumber?: string;
  price?: string;
  weather?: string;
  className?: string;
}

export default function NewYorkTimesTemplate({
  headline = 'EXTRAORDINARY SCIENTIFIC REVELATION SHAKES ACADEMY',
  story = `In an unprecedented series of events that unfolded late yesterday evening, international researchers disclosed startling new findings before a packed assembly of scholars.

Key witnesses detailed confidential archives documenting behind-the-scenes experiments spanning several decades. Observers noted the solemn stillness that swept across the grand auditorium as primary evidence was formally introduced into the public record.

"We stand at a critical juncture in our technological traditions," remarked committee chairmen during an impromptu press conference. Additional witnesses are summoned to testify later this week as the special inquiry broadens its scope across multiple institutions.

Telegrams received from overseas universities confirm that duplicate experiments achieved identical results under rigorous observation. Civic authorities have announced plans to convene a symposium next month to address the widespread implications.`,
  date = 'Friday, October 25, 1929',
  image = null,
  author = 'By SPECIAL CORRESPONDENT TO THE TIMES',
  subheadline = 'Scholars Across the Nation Marvel as Long-Standing Theories Are Overturned in Midnight Demonstration',
  newspaperName = 'The New York Times',
  photoCaption = 'Scene outside the laboratory as delegates gathered to inspect the calibrated instruments yesterday afternoon.',
  issueNumber = 'VOL. LXXVIII....No. 25,844.',
  price = 'TWO CENTS IN GREATER NEW YORK',
  weather = 'THE WEATHER: Rain and colder today; tomorrow cloudy, fresh north winds.',
  className = '',
}: NewYorkTimesProps) {
  // Parse paragraphs
  const paragraphs = (story || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const leadParagraph = paragraphs[0] || '';
  const remainingParagraphs = paragraphs.slice(1);

  return (
    <div
      className={`w-full max-w-5xl mx-auto bg-[#f4efe3] text-[#111111] p-4 sm:p-7 md:p-9 shadow-2xl border border-black/40 rounded-xs select-none font-nytBody transition-all duration-200 relative overflow-hidden ${className}`}
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 0, 0, 0.05) inset',
      }}
    >
      {/* Subtle Newsprint Paper Grain Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 mix-blend-multiply"
        style={{
          backgroundImage:
            'radial-gradient(#222 0.75px, transparent 0.75px), radial-gradient(#222 0.75px, #f4efe3 0.75px)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px',
        }}
      />

      {/* ========================================================================= */}
      {/* 1. TOP HEADER & FAMOUS EAR PIECES                                         */}
      {/* ========================================================================= */}
      <div className="relative z-10 grid grid-cols-12 items-center gap-2 pb-2">
        {/* Left Ear: "All the News That's Fit to Print" */}
        <div className="col-span-3 hidden sm:flex flex-col items-center justify-center p-1.5 border border-black/80 text-center bg-black/[0.02]">
          <span className="font-nytHeadline italic text-[11px] sm:text-[12px] font-bold text-black leading-tight">
            "All the News That's
          </span>
          <span className="font-nytHeadline italic text-[11px] sm:text-[12px] font-bold text-black leading-tight">
            Fit to Print"
          </span>
        </div>

        {/* Center Masthead Title */}
        <div className="col-span-12 sm:col-span-6 text-center">
          <h1
            className="font-nytTitle whitespace-nowrap text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-black leading-none py-1 drop-shadow-xs"
            style={{ fontFamily: '"UnifrakturMaguntia", "Old English Text MT", serif' }}
          >
            {newspaperName}
          </h1>
        </div>

        {/* Right Ear: Weather Forecast */}
        <div className="col-span-3 hidden sm:flex flex-col items-center justify-center p-1.5 border border-black/80 text-center bg-black/[0.02]">
          <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-black leading-tight">
            {weather}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DOUBLE HAIRLINE RULE & EDITION INFO STRIP                              */}
      {/* ========================================================================= */}
      <div className="relative z-10 border-t-2 border-b border-black py-1 my-1.5 flex flex-wrap items-center justify-between text-[9px] sm:text-[10px] font-sans font-bold tracking-wider uppercase text-black">
        <span className="w-full sm:w-auto text-left">{issueNumber}</span>
        <span className="w-full sm:w-auto text-center font-nytHeadline font-black text-xs tracking-widest text-black">
          {date}
        </span>
        <span className="w-full sm:w-auto text-right">{price}</span>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN CHELTENHAM BANNER HEADLINE & DECK                                 */}
      {/* ========================================================================= */}
      <div className="relative z-10 text-center pt-2 pb-3 border-b-2 border-black/85 mb-3">
        {/* Kicker / Pre-Headline */}
        <div className="text-[11px] sm:text-xs font-nytHeadline font-bold uppercase tracking-widest text-black/90 mb-1">
          — SPECIAL DISPATCH TO THE NATION —
        </div>

        {/* Master Cheltenham / Chomsky Headline */}
        <h2
          className="font-nytHeadline font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-black leading-tight max-w-4xl mx-auto px-2"
          style={{ fontFamily: '"Libre Baskerville", "Playfair Display", Georgia, serif' }}
        >
          {headline}
        </h2>

        {/* 2-Tier Subheadline / Deck */}
        {subheadline && (
          <div className="mt-2.5 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <span className="h-px w-10 bg-black/40"></span>
              <span className="text-[10px] font-serif tracking-widest text-black/70">✦ ✦ ✦</span>
              <span className="h-px w-10 bg-black/40"></span>
            </div>
            <p className="font-nytHeadline italic text-xs sm:text-sm md:text-base font-semibold text-neutral-800 leading-snug px-4">
              {subheadline}
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. CLASSIC 6-COLUMN DENSE BROADSHEET GRID                                */}
      {/* ========================================================================= */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 text-[11px] leading-[1.38] text-justify font-nytBody">
        
        {/* COLUMN 1: Left Wire Column / Sidebar Dispatches */}
        <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-black/25 pr-0 md:pr-2.5 flex flex-col gap-2.5">
          <div className="border-b border-black/30 pb-1 mb-1 text-center">
            <h4 className="font-nytHeadline font-bold uppercase text-[10px] tracking-wider text-black">
              LATE WIRE BULLETIN
            </h4>
            <span className="text-[8px] italic text-neutral-600">Telegraphic Summary</span>
          </div>

          <p className="text-black/90 indent-2">
            <strong>LONDON, Oct. 24 —</strong> Official sources at the Admiralty verified today that telegraph cables connecting European relay centers operated uninterruptedly through the night.
          </p>

          <p className="text-black/90 indent-2">
            Commercial shipping lines reported clear passage across western nautical routes with barometric pressure holding steady.
          </p>

          <div className="my-1 border-t border-b border-black/20 py-1 text-center text-[9px] font-bold uppercase tracking-wider text-black/70">
            ★ CITY WEATHER NOTE ★
          </div>

          <p className="text-black/90 indent-2">
            Early dawn inspections confirmed brisk autumn temperatures across metropolitan boroughs. Municipal ferries ran according to established timetable.
          </p>
        </div>

        {/* COLUMN 2 & 3: Photo Engraving & Lead Story Column */}
        <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-black/25 pr-0 md:pr-3 flex flex-col gap-3">
          {/* Authentic Newsprint Photo Halftone Engraving (If image supplied) */}
          {image && (
            <div className="border border-black p-1 bg-black/[0.03] shadow-xs">
              <div className="relative overflow-hidden bg-black/10 max-h-[340px]">
                <img
                  src={image}
                  alt="New York Times Engraving"
                  className="w-full h-auto max-h-[320px] object-cover filter grayscale contrast-125 brightness-95"
                />
              </div>
              {photoCaption && (
                <div className="pt-1.5 px-1 border-t border-black/20 mt-1">
                  <p className="font-nytBody italic text-[10px] text-neutral-800 text-center leading-tight">
                    {photoCaption}
                  </p>
                  <p className="text-[8px] font-sans font-bold text-neutral-600 text-right uppercase tracking-wider mt-0.5">
                    Times Wide World Photo
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Lead Byline & Dateline */}
          <div className="text-center pt-1 border-b border-black/15 pb-1">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-black block">
              {author}
            </span>
          </div>

          {/* Lead Paragraph with Authentic Large Linotype Drop Cap */}
          {leadParagraph && (
            <p className="text-black text-justify leading-[1.4] indent-0">
              <span
                className="float-left text-4xl sm:text-5xl font-nytHeadline font-black leading-none mr-2 text-black select-none"
                style={{ fontFamily: '"Libre Baskerville", Georgia, serif' }}
              >
                {leadParagraph.charAt(0)}
              </span>
              <strong className="tracking-wide">WASHINGTON, Oct. 24 — </strong>
              {leadParagraph.slice(1)}
            </p>
          )}

          {/* Subsequent paragraph continuing down column */}
          {remainingParagraphs[0] && (
            <p className="text-black text-justify leading-[1.4] indent-3">
              {remainingParagraphs[0]}
            </p>
          )}
        </div>

        {/* COLUMN 4 & 5: Body Columns with Sub-Headers */}
        <div className="md:col-span-2 flex flex-col gap-2.5">
          <div className="border-b border-black/20 pb-1 text-center">
            <h4 className="font-nytHeadline font-bold uppercase text-[10px] tracking-wider text-black">
              CONGRESSIONAL REACTION
            </h4>
          </div>

          {remainingParagraphs.slice(1).map((para, idx) => (
            <React.Fragment key={idx}>
              <p className="text-black text-justify leading-[1.4] indent-3">
                {para}
              </p>
              {idx === 0 && (
                <div className="text-center my-1">
                  <span className="text-[9px] font-nytHeadline font-bold uppercase tracking-widest text-black/80 block border-t border-b border-black/20 py-0.5">
                    Unanimous Accord Anticipated
                  </span>
                </div>
              )}
            </React.Fragment>
          ))}

          {/* Authentic Tail Ornament */}
          <div className="pt-3 mt-auto text-center border-t border-black/20">
            <span className="text-[9px] font-serif tracking-widest text-black/60">
              — Continued on Page 12, Column 3 —
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. FOOTER REGISTER STRIP                                                  */}
      {/* ========================================================================= */}
      <div className="relative z-10 mt-5 pt-1.5 border-t border-black/40 flex items-center justify-between text-[8px] font-sans font-bold uppercase tracking-wider text-neutral-600">
        <span>The New York Times Archives • Vol. LXXVIII</span>
        <span>Entered as Second Class Matter, Post Office, New York, N.Y.</span>
        <span>★ FINAL CITY EDITION ★</span>
      </div>
    </div>
  );
}
