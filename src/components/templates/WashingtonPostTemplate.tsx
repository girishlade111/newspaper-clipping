import React from 'react';

export interface WashingtonPostProps {
  headline?: string;
  story?: string;
  date?: string;
  image?: string | null;
  author?: string;
  subheadline?: string;
  newspaperName?: string;
  tagline?: string;
  photoCaption?: string;
  edition?: string;
  price?: string;
  weather?: string;
  className?: string;
}

const WAPO_HEADLINE_FONT = '"Bodoni Moda", "Bodoni MT", Didot, serif';

export default function WashingtonPostTemplate({
  headline = 'HISTORIC REVELATIONS SHAKE THE NATION AS INQUIRY EXPANDS',
  story = `In an unprecedented series of events that unfolded late yesterday evening, federal investigators disclosed startling new testimony before a packed Senate hearing room.

Key witnesses detailed confidential archives documenting behind-the-scenes negotiations spanning several months. Observers noted the solemn stillness that swept across the gallery as primary documents were formally introduced into the public record.

"We stand at a critical juncture in our constitutional traditions," remarked committee leaders during an impromptu press conference on Capitol Hill. Additional witnesses are subpoenaed to testify later this week as the special inquiry broadens its scope across multiple federal departments.

Legal scholars and constitutional historians gathered on television panels throughout the night, characterizing the newly released transcripts as the most significant documentary development in decades. Judicial observers anticipate preliminary rulings before Friday.`,
  date = 'Tuesday, June 17, 1972',
  image = null,
  author = 'Bob Woodward and Carl Bernstein',
  subheadline = 'Senate Committee Unveils Confidential Archives Amid Solemn Silence Across Capitol Hill',
  newspaperName = 'The Washington Post',
  tagline = 'Democracy Dies in Darkness',
  photoCaption = 'Witnesses conferring with special counsel during closed-door testimony in the Capitol late yesterday.',
  edition = 'CAPITAL FINAL EDITION',
  price = '35 CENTS',
  weather = 'Mostly Sunny • High 78°, Low 58°',
  className = '',
}: WashingtonPostProps) {
  /* ---------------------------------------------------------------- */
  /* Content derivation — all copy is props-driven, nothing hardcoded */
  /* ---------------------------------------------------------------- */
  const paragraphs = (story || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const leadParagraph = paragraphs[0] || '';
  const remainingParagraphs = paragraphs.slice(1);
  const midColumns = remainingParagraphs.slice(0, 2);
  const sidebarParagraphs = remainingParagraphs.slice(2);
  const authorNames = (author || '').replace(/^By\s+/i, '');

  return (
    <div
      className={`w-full max-w-5xl mx-auto bg-[#f7f4ec] text-[#141414] p-4 sm:p-8 md:p-10 shadow-2xl border border-neutral-900/40 rounded-xs select-none font-wapoBody transition-all duration-200 relative overflow-hidden ${className}`}
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 0, 0, 0.05) inset',
      }}
    >
      {/* Subtle Newsprint Paper Grain Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
        style={{
          backgroundImage:
            'radial-gradient(#111 0.75px, transparent 0.75px), radial-gradient(#111 0.75px, #f7f4ec 0.75px)',
          backgroundSize: '28px 28px',
          backgroundPosition: '0 0, 14px 14px',
        }}
      />

      {/* 1. TOP UTILITY STRIP (Weather | Edition • Price) */}
      <div className="relative z-10 border-b border-black/30 pb-1.5 mb-2 flex items-center justify-between text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-800">
        <span>{weather}</span>
        <div className="flex items-center gap-3">
          <span className="font-semibold">{edition}</span>
          <span>•</span>
          <span className="font-black">{price}</span>
        </div>
      </div>


      {/* 2. ICONIC MASTHEAD & "DEMOCRACY DIES IN DARKNESS" TAGLINE */}
      <div className="relative z-10 text-center py-2 sm:py-3">
        <h1
          className="font-wapoTitle text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-black leading-none drop-shadow-xs"
          style={{ fontFamily: '"UnifrakturMaguntia", "Old English Text MT", serif' }}
        >
          {newspaperName}
        </h1>

        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="h-px w-12 sm:w-24 bg-black/40"></span>
          <span
            className="font-wapoHeadline italic text-xs sm:text-sm font-semibold tracking-wide text-neutral-800"
            style={{ fontFamily: WAPO_HEADLINE_FONT }}
          >
            {tagline}
          </span>
          <span className="h-px w-12 sm:w-24 bg-black/40"></span>
        </div>
      </div>

      {/* 3. DATE & CIRCULATION REGISTRATION BAR */}
      <div className="relative z-10 border-t-2 border-b border-black py-1 my-2 flex items-center justify-between text-[10px] sm:text-xs font-sans font-bold uppercase text-black">
        <span>YEAR 95 • NO. 195</span>
        <span className="tracking-widest text-center">{date}</span>
        <span>WASHINGTON, D.C.</span>
      </div>

      {/* 4. COMMANDING BODONI HEADLINE, DECK & DISTINCT BYLINE */}
      <div className="relative z-10 pt-2 pb-3 mb-4 border-b-2 border-black/85">
        <h2
          className="font-wapoHeadline font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-black leading-[1.04] text-center"
          style={{ fontFamily: WAPO_HEADLINE_FONT }}
        >
          {headline}
        </h2>

        {subheadline && (
          <p
            className="font-wapoHeadline italic text-sm sm:text-lg text-neutral-800 text-center mt-2.5 max-w-3xl mx-auto leading-snug"
            style={{ fontFamily: WAPO_HEADLINE_FONT }}
          >
            {subheadline}
          </p>
        )}

        {authorNames && (
          <div className="mt-4 pt-2 border-t border-black/30 text-center">
            <div className="font-sans font-extrabold uppercase text-[11px] sm:text-xs tracking-widest text-black">
              By {authorNames}
            </div>
            <div className="font-serif italic text-[11px] text-neutral-700 mt-0.5">
              The Washington Post
            </div>
          </div>
        )}
      </div>

      {/* 5. PHOTOGRAPH — spans 3 of 4 columns below the headline */}
      {image && (
        <figure className="relative z-10 md:w-3/4 md:mx-auto mb-5 border border-black/60 p-1 bg-white shadow-xs">
          <div className="relative overflow-hidden bg-black/10 max-h-[340px]">
            <img
              src={image}
              alt={photoCaption || 'The Washington Post Illustration'}
              className="w-full h-auto max-h-[320px] object-cover filter grayscale contrast-125 brightness-95"
            />
          </div>
          {photoCaption && (
            <figcaption className="pt-1.5 px-0.5 border-t border-black/15 mt-1 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-[10px] text-neutral-700">
              <p className="font-serif italic leading-tight">{photoCaption}</p>
              <span className="font-sans font-bold text-[9px] uppercase tracking-wider text-neutral-500 sm:whitespace-nowrap">
                The Washington Post
              </span>
            </figcaption>
          )}
        </figure>
      )}

      {/* 6. 3-TO-4 COLUMN RESPONSIVE BROADSHEET BODY GRID */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs leading-[1.5] text-justify font-wapoBody">

        {/* COLUMN 1: Lead paragraph with dateline & drop cap */}
        <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-black/20 pr-0 md:pr-3.5 flex flex-col gap-3">
          {leadParagraph && (
            <p className="text-black text-justify leading-relaxed">
              <span
                className="float-left text-4xl font-black mr-1.5 leading-[0.85] text-black select-none"
                style={{ fontFamily: WAPO_HEADLINE_FONT }}
              >
                {leadParagraph.charAt(0)}
              </span>
              <span className="font-sans font-black text-black tracking-wider uppercase text-[10px]">
                WASHINGTON —{' '}
              </span>
              {leadParagraph.slice(1)}
            </p>
          )}
        </div>

        {/* COLUMNS 2 & 3: Story continuation in a dense two-up split */}
        <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-black/20 pr-0 md:pr-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {midColumns.map((para, idx) => (
            <p key={idx} className="text-black text-justify leading-relaxed indent-2">
              {para}
            </p>
          ))}
        </div>

        {/* COLUMN 4: Sidebar with closing copy & pull quote */}
        <div className="md:col-span-1 flex flex-col gap-2.5">
          {sidebarParagraphs.map((para, idx) => (
            <p key={idx} className="text-black text-justify leading-relaxed indent-2">
              {para}
            </p>
          ))}

          <div className="mt-auto my-2 p-2.5 border-t-2 border-b-2 border-black/70 text-center bg-black/[0.02]">
            <p
              className="font-wapoHeadline font-bold italic text-xs leading-snug text-black"
              style={{ fontFamily: WAPO_HEADLINE_FONT }}
            >
              “We stand at a critical juncture in our constitutional traditions.”
            </p>
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-neutral-600 block mt-1">
              — On Capitol Hill
            </span>
          </div>

          <div className="pt-2 border-t border-black/20 text-center">
            <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-neutral-600">
              See INQUIRY, A8, Col. 1
            </span>
          </div>
        </div>
      </div>

      {/* 7. BOTTOM METROPOLITAN REGISTER STRIP */}
      <div className="relative z-10 mt-6 pt-2 border-t border-black/30 flex flex-wrap items-center justify-between gap-2 text-[8px] font-sans font-bold uppercase tracking-wider text-neutral-600">
        <span>{newspaperName} • Washington, D.C. 20071</span>
        <span>INDEX: Editorials A14 • Classified D1 • Comics B12 • Sports C1</span>
        <span>★ FINAL PRINT EDITION ★</span>
      </div>
    </div>
  );
}

