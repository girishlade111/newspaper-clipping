import React from 'react';

export interface JapanTimesProps {
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

export default function JapanTimesTemplate({
  headline = 'GOVERNMENT UNVEILS COMPREHENSIVE GREEN TECH & DIGITAL ROADMAP',
  story = `In an extraordinary joint briefing held at the prime minister’s official residence late yesterday, Cabinet ministers unveiled an ambitious multi-trillion-yen industrial modernization blueprint.

The targeted strategic initiative focuses on next-generation clean energy, advanced semiconductor research, and streamlined automated transportation networks spanning key regional hubs. Financial analysts characterized the policy document as a decisive catalyst for long-term domestic economic resilience.

"Constructive public-private collaboration provides the bedrock for Japan's technological leadership in the coming decades," remarked the chief cabinet secretary during an extensive question-and-answer session with domestic and foreign press correspondents. Specialized advisory councils will convene on a monthly schedule to monitor benchmark compliance.

Industrial federations across Tokyo, Osaka, and Nagoya signaled strong institutional backing, projecting measurable capital investments across manufacturing corridors over the upcoming fiscal quarters. Commercial exchanges responded with steady gains in early morning trading.`,
  date = 'Wednesday, October 28, 2026',
  image = null,
  author = 'By STAFF WRITER / KYODO NEWS',
  subheadline = 'Cabinet Ministers Announce Coordinated Policy Package to Spur Sustainable Innovation Across Key Industrial Corridors',
  newspaperName = 'The Japan Times',
  tagline = 'ALL THE NEWS WITHOUT FEAR OR FAVOR • ESTABLISHED 1897',
  photoCaption = 'Ministers and industry leaders concluding the formal policy briefing in Tokyo yesterday.',
  edition = 'TOKYO • OSAKA PRINT EDITION',
  price = '¥250 (TAX INCL.)',
  weather = 'TOKYO: 19°C / 12°C • CLOUDY WITH SCATTERED SHOWERS',
  className = '',
}: JapanTimesProps) {
  // Parse paragraphs
  const paragraphs = (story || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const leadParagraph = paragraphs[0] || '';
  const remainingParagraphs = paragraphs.slice(1);

  return (
    <div
      className={`w-full max-w-5xl mx-auto bg-[#fbfaf6] text-[#111111] p-4 sm:p-7 md:p-8 shadow-2xl border border-black/35 rounded-xs select-none font-jtBody transition-all duration-200 relative overflow-hidden ${className}`}
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 15px rgba(0, 0, 0, 0.03) inset',
      }}
    >
      {/* ========================================================================= */}
      {/* 1. MINIMALIST TOP UTILITY BAR (1px solid precision borders)               */}
      {/* ========================================================================= */}
      <div className="border-b border-black/25 pb-1 mb-1.5 flex flex-wrap items-center justify-between text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-700">
        <span>{weather}</span>
        <span className="font-extrabold text-neutral-900">{edition}</span>
        <span>{price}</span>
      </div>

      {/* ========================================================================= */}
      {/* 2. THE JAPAN TIMES DIGNIFIED MASTHEAD                                     */}
      {/* ========================================================================= */}
      <div className="text-center py-1 sm:py-2">
        <h1
          className="font-jtTitle text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-950 leading-none py-0.5"
          style={{ fontFamily: '"Playfair Display", "Times New Roman", Merriweather, serif' }}
        >
          {newspaperName}
        </h1>

        {/* Minimalist Subtitle Motto */}
        <p className="font-sans text-[8.5px] sm:text-[9.5px] font-bold tracking-widest text-neutral-600 uppercase mt-1">
          {tagline}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3. DATE & REGISTRATION BARS (Strict 1px Double Rules)                     */}
      {/* ========================================================================= */}
      <div className="border-t border-b border-black/40 py-1 my-1.5 flex items-center justify-between text-[9px] sm:text-[10px] font-sans font-semibold uppercase tracking-wider text-neutral-800">
        <span>VOL. 127 NO. 45,210</span>
        <span className="font-serif font-bold text-center tracking-widest text-black">
          {date}
        </span>
        <span>NATIONAL EDITION</span>
      </div>

      {/* ========================================================================= */}
      {/* 4. COMPACT & DISCIPLINED SERIF HEADLINE & DECK                            */}
      {/* ========================================================================= */}
      <div className="pt-2 pb-2.5 mb-3 border-b border-black/30">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 bg-neutral-900 inline-block"></span>
          <span className="font-sans text-[9.5px] font-black uppercase tracking-widest text-neutral-900">
            NATIONAL / POLICY IN FOCUS
          </span>
        </div>

        {/* Compact, Highly Readable Serif Headline */}
        <h2
          className="font-jtHeadline font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-neutral-950 leading-[1.12]"
          style={{ fontFamily: '"Libre Baskerville", "Playfair Display", Georgia, serif' }}
        >
          {headline}
        </h2>

        {/* Compact Deck */}
        {subheadline && (
          <p className="font-jtBody italic text-xs sm:text-[13px] text-neutral-700 leading-snug mt-1.5 max-w-4xl">
            {subheadline}
          </p>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. HIGHLY STRUCTURED 4-COLUMN JAPANESE BROADSHEET GRID                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 divide-y md:divide-y-0 md:divide-x divide-black/20 text-[11px] leading-[1.4] text-justify font-jtBody">
        
        {/* COLUMN 1: Byline & Lead Story Opening */}
        <div className="pr-0 md:pr-3 flex flex-col gap-2.5">
          {/* Japanese Newspaper Style Byline */}
          <div className="pb-1 border-b border-black/20">
            <span className="font-sans font-black text-[10px] uppercase tracking-wider text-black block">
              {author}
            </span>
            <span className="font-sans text-[8.5px] text-neutral-500 uppercase">
              Staff Correspondent
            </span>
          </div>

          {/* Lead Paragraph with Clean Compact Drop Cap and Dateline */}
          {leadParagraph && (
            <p className="text-neutral-900 leading-relaxed">
              <span className="float-left text-3xl sm:text-4xl font-black mr-1.5 leading-none font-serif text-black select-none">
                {leadParagraph.charAt(0)}
              </span>
              <strong className="font-sans font-bold tracking-wider text-black uppercase">
                TOKYO —{' '}
              </strong>
              {leadParagraph.slice(1)}
            </p>
          )}

          {remainingParagraphs[0] && (
            <p className="text-neutral-900 leading-relaxed indent-2">
              {remainingParagraphs[0]}
            </p>
          )}
        </div>

        {/* COLUMNS 2 & 3: Photo Module & Central Narrative (2 Columns Span) */}
        <div className="md:col-span-2 px-0 md:px-3 flex flex-col gap-2.5">
          {/* Crisp Minimalist Photo Block */}
          {image && (
            <div className="border border-black/40 p-0.5 bg-white shadow-2xs">
              <div className="relative overflow-hidden max-h-[260px] bg-neutral-100">
                <img
                  src={image}
                  alt="The Japan Times Media"
                  className="w-full h-auto max-h-[250px] object-cover filter grayscale contrast-115 brightness-98"
                />
              </div>
              {photoCaption && (
                <div className="p-1 border-t border-black/15 flex flex-col sm:flex-row sm:items-baseline justify-between text-[9.5px] text-neutral-600 font-sans">
                  <p className="italic leading-tight">
                    {photoCaption}
                  </p>
                  <span className="text-[8px] font-bold text-neutral-500 uppercase whitespace-nowrap ml-2">
                    KYODO
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Subheader */}
          <div className="border-t border-b border-black/20 py-0.5 text-center my-0.5">
            <h3 className="font-sans font-black uppercase text-[9.5px] tracking-wider text-black">
              PARLIAMENTARY COMMITTEE SCRUTINY SCHEDULED
            </h3>
          </div>

          {/* 2-Column Split for Balanced High-Density Reading */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {remainingParagraphs.slice(1, 3).map((para, idx) => (
              <p key={idx} className="text-neutral-900 leading-relaxed indent-2">
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* COLUMN 4: Sidebar "News in Brief" with Precision Square Bullets */}
        <div className="pl-0 md:pl-3 flex flex-col gap-2.5">
          <div className="border-b border-black/25 pb-1">
            <h4 className="font-sans font-black uppercase text-[10px] tracking-wider text-neutral-950 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-neutral-900 inline-block"></span>
              INSIDE TODAY
            </h4>
          </div>

          <div className="p-2 border border-black/20 bg-black/[0.02] text-[10px] font-sans space-y-1.5">
            <div className="flex items-start gap-1.5">
              <span className="text-neutral-900 font-bold mt-0.5">■</span>
              <p className="leading-snug text-neutral-800">
                <strong>Fiscal Review:</strong> Ministry officials project resilient quarterly output.
              </p>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-neutral-900 font-bold mt-0.5">■</span>
              <p className="leading-snug text-neutral-800">
                <strong>Diplomatic Exchange:</strong> Bilateral summit scheduled for late November.
              </p>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-neutral-900 font-bold mt-0.5">■</span>
              <p className="leading-snug text-neutral-800">
                <strong>Energy Targets:</strong> Grid modernizations receive cross-party consensus.
              </p>
            </div>
          </div>

          {remainingParagraphs.slice(3).map((para, idx) => (
            <p key={idx} className="text-neutral-900 leading-relaxed indent-2">
              {para}
            </p>
          ))}

          <div className="mt-auto pt-2 border-t border-black/20 text-center font-sans text-[8.5px] font-bold uppercase tracking-widest text-neutral-500">
            CONTINUED ON PAGE 3
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 6. MINIMALIST BOTTOM REGISTER                                             */}
      {/* ========================================================================= */}
      <div className="mt-5 pt-1.5 border-t border-black/30 flex flex-wrap items-center justify-between text-[8px] font-sans font-bold uppercase tracking-wider text-neutral-500">
        <span>The Japan Times, Ltd. • 4-5-4 Shibaura, Minato-ku, Tokyo 108-0023</span>
        <span>Registered as a Third-Class Postal Matter</span>
        <span className="text-neutral-800 font-black">★ TOKYO EDITION ★</span>
      </div>
    </div>
  );
}
