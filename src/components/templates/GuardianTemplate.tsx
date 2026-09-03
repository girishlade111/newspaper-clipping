import React from 'react';

export interface GuardianProps {
  headline?: string;
  story?: string;
  date?: string;
  image?: string | null;
  author?: string;
  subheadline?: string;
  newspaperName?: string;
  tagline?: string;
  photoCaption?: string;
  category?: string;
  edition?: string;
  price?: string;
  weather?: string;
  className?: string;
}

export default function GuardianTemplate({
  headline = 'MINISTERS ORDER EMERGENCY INQUIRY AS MASSIVE CLIMATE BLUEPRINT UNVEILED',
  story = `Ministers have ordered an urgent cross-departmental inquiry following the unheralded disclosure of a comprehensive multi-billion-pound national transition blueprint late yesterday evening.

The extensive documentation, compiled by an independent consortium of scientific bodies and industrial leaders, outlines binding decarbonisation benchmarks across national transport links, grid infrastructure, and metropolitan housing over the next decade.

"We face an undeniable imperative that demands structural courage rather than incremental gestures," stated the chair of the advisory council during a televised briefing in Westminster. Parliamentary select committees have already scheduled witness hearings for the coming week.

Environmental groups and trade unions offered cautious support for the initiative, emphasizing that worker transition schemes must remain fully funded. Financial markets recorded immediate movement with clean technology equities climbing sharply in early City trading.`,
  date = 'Wednesday 28 October 2026',
  image = null,
  author = 'Fiona Harvey and Peter Walker',
  subheadline = 'Exclusive: Landmark cross-party investigation reveals secret transition targets across transport and energy networks ahead of key global summit',
  newspaperName = 'The Guardian',
  tagline = 'Independent journalism for the curious • Established 1821',
  photoCaption = 'Demonstrators and climate delegates gathering outside the Department for Energy Security and Net Zero in Whitehall yesterday.',
  category = 'Environment',
  edition = 'UK Edition',
  price = '£2.80',
  weather = 'London 14°C • Manchester 12°C • Light Rain',
  className = '',
}: GuardianProps) {
  // Parse paragraphs
  const paragraphs = (story || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const leadParagraph = paragraphs[0] || '';
  const remainingParagraphs = paragraphs.slice(1);

  return (
    <div
      className={`w-full max-w-5xl mx-auto bg-[#fdfdfb] text-[#121212] p-5 sm:p-8 md:p-9 shadow-2xl border border-neutral-300 rounded-xs select-none font-guardianBody transition-all duration-200 relative overflow-hidden ${className}`}
      style={{
        boxShadow: '0 25px 50px -12px rgba(5, 41, 98, 0.2), 0 0 15px rgba(0, 0, 0, 0.02) inset',
      }}
    >
      {/* ========================================================================= */}
      {/* 1. TOP UTILITY BAR (Weather, Edition, Date, Price)                        */}
      {/* ========================================================================= */}
      <div className="border-b border-neutral-200 pb-1.5 mb-3 flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] font-sans text-neutral-600 font-semibold tracking-wide">
        <div className="flex items-center gap-3">
          <span className="text-[#052962] font-bold">{weather}</span>
          <span className="hidden sm:inline text-neutral-300">•</span>
          <span className="hidden sm:inline">{date}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-[#052962]">{edition}</span>
          <span className="text-neutral-300">•</span>
          <span className="font-bold text-neutral-900">{price}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THE GUARDIAN DISTINCTIVE BRAND MASTHEAD                                */}
      {/* ========================================================================= */}
      <div className="py-2 sm:py-3 border-b-2 border-[#052962] flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <h1
            className="font-guardianTitle text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#052962] leading-none"
            style={{ fontFamily: '"Lora", Georgia, serif' }}
          >
            {newspaperName}
          </h1>
          <p className="font-sans text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-500 mt-1">
            {tagline}
          </p>
        </div>

        {/* Guardian Navigation Category Tags */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 font-sans text-xs font-bold text-[#052962]">
          <span className="px-2 py-0.5 bg-[#052962] text-white rounded-xs text-[10px] uppercase tracking-wider">
            News
          </span>
          <span className="px-2 py-0.5 hover:bg-neutral-100 rounded-xs text-[10px] uppercase tracking-wider text-neutral-700">
            Opinion
          </span>
          <span className="px-2 py-0.5 hover:bg-neutral-100 rounded-xs text-[10px] uppercase tracking-wider text-neutral-700">
            Sport
          </span>
          <span className="px-2 py-0.5 hover:bg-neutral-100 rounded-xs text-[10px] uppercase tracking-wider text-neutral-700">
            Culture
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. HEADLINE SECTION WITH SIGNATURE GUARDIAN CATEGORY BADGE                */}
      {/* ========================================================================= */}
      <div className="pt-4 pb-4 border-b border-neutral-200">
        {/* Category Tag with Brand Accent Color */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block px-2.5 py-0.5 rounded-xs bg-[#c70000] text-white font-sans text-[10px] font-black uppercase tracking-wider">
            {category}
          </span>
          <span className="text-xs font-sans font-bold text-neutral-500 uppercase tracking-wide">
            Special Investigation
          </span>
        </div>

        {/* Guardian Egyptian Style Headline (Lora slab serif styling) */}
        <h2
          className="font-guardianHeadline font-bold text-3xl sm:text-5xl md:text-6xl text-[#121212] tracking-tight leading-[1.06] mb-3 max-w-5xl"
          style={{ fontFamily: '"Lora", Georgia, serif' }}
        >
          {headline}
        </h2>

        {/* Airy, Elegant Standfirst Deck */}
        {subheadline && (
          <p
            className="font-guardianHeadline text-base sm:text-lg md:text-xl text-neutral-800 leading-relaxed max-w-4xl font-normal"
            style={{ fontFamily: '"Lora", Georgia, serif' }}
          >
            {subheadline}
          </p>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. MODERN ASYMMETRICAL 12-COLUMN BROADSHEET GRID                          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 text-[13.5px] leading-[1.6]">
        
        {/* MAIN NARRATIVE COLUMN: 7 Columns Asymmetrical Split */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Hero News Photo with Minimal Modern Framing */}
          {image && (
            <div className="w-full bg-neutral-100 overflow-hidden shadow-xs">
              <div className="relative overflow-hidden max-h-[380px]">
                <img
                  src={image}
                  alt="The Guardian Editorial Photo"
                  className="w-full h-auto max-h-[360px] object-cover"
                />
              </div>
              {photoCaption && (
                <div className="pt-2 text-[11px] font-sans text-neutral-600 leading-snug">
                  <span>{photoCaption}</span>
                  <span className="font-semibold text-neutral-500 ml-1.5">
                    Photograph: Martin Argles/The Guardian
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Distinct Guardian Byline with Timestamp */}
          <div className="py-2 border-t border-b border-neutral-200 flex items-center justify-between font-sans text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#052962] text-white flex items-center justify-center font-bold text-[10px]">
                G
              </div>
              <div>
                <span className="font-bold text-[#052962] block">{author}</span>
                <span className="text-[10px] text-neutral-500">Westminster</span>
              </div>
            </div>
            <div className="text-right text-[10px] text-neutral-500">
              <div>First published 07.00 BST</div>
              <div className="text-neutral-400">Updated 10.30 BST</div>
            </div>
          </div>

          {/* Lead Paragraph with Airy Drop Cap */}
          {leadParagraph && (
            <p className="text-[#121212] text-justify text-[14.5px] leading-[1.65]">
              <span
                className="float-left text-5xl font-bold mr-2 leading-none text-[#052962] select-none"
                style={{ fontFamily: '"Lora", Georgia, serif' }}
              >
                {leadParagraph.charAt(0)}
              </span>
              {leadParagraph.slice(1)}
            </p>
          )}

          {/* 2-Column Asymmetrical Story Continuation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-neutral-800 text-justify mt-1">
            {remainingParagraphs.map((para, idx) => (
              <p key={idx} className="leading-relaxed">
                {para}
              </p>
            ))}
          </div>

        </div>

        {/* SECONDARY ANALYSIS COLUMN: 5 Columns Asymmetrical Split */}
        <div className="lg:col-span-5 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l lg:border-neutral-200 lg:pl-6">
          
          {/* Distinct Guardian Analysis Box */}
          <div className="p-4 bg-[#f6f6f6] border-t-4 border-[#052962] rounded-xs">
            <span className="text-[10px] font-sans font-black uppercase tracking-wider text-[#052962] block mb-1">
              At a Glance • Key Findings
            </span>
            <ul className="space-y-2 text-[12px] font-sans text-neutral-700 leading-snug list-disc list-inside">
              <li>Binding decarbonisation targets mandated across rail and road networks by 2035.</li>
              <li>Cabinet committee empowered to oversee cross-departmental compliance.</li>
              <li>Public consultation window opened for metropolitan regional councils.</li>
            </ul>
          </div>

          {/* Large Editorial Pull Quote in Lora */}
          <div className="my-2 p-4 border-l-4 border-[#c70000] bg-neutral-50">
            <p
              className="font-guardianHeadline italic text-base sm:text-lg font-medium text-neutral-900 leading-snug"
              style={{ fontFamily: '"Lora", Georgia, serif' }}
            >
              "We face an undeniable imperative that demands structural courage rather than incremental gestures."
            </p>
            <span className="font-sans text-[10px] font-bold text-neutral-500 block mt-2 uppercase tracking-wide">
              — Advisory Council Chair
            </span>
          </div>

          {/* Opinion Commentary Snippet */}
          <div className="p-3.5 border border-neutral-200 bg-white">
            <span className="text-[10px] font-sans font-bold text-[#c70000] uppercase tracking-wider block mb-1">
              Analysis
            </span>
            <h4
              className="font-guardianHeadline font-bold text-sm text-[#052962] leading-snug mb-1"
              style={{ fontFamily: '"Lora", Georgia, serif' }}
            >
              Why ministers had no choice but to accelerate the timeline
            </h4>
            <p className="text-[11px] font-sans text-neutral-600 leading-relaxed">
              Facing growing pressure from regional mayors and industry leaders, the government moved to preempt cross-party rebellion.
            </p>
          </div>

          <div className="mt-auto pt-3 border-t border-neutral-200 text-center font-sans text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Read complete coverage online at theguardian.com
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. GUARDIAN BOTTOM REGISTER                                               */}
      {/* ========================================================================= */}
      <div className="mt-8 pt-3 border-t border-neutral-900 flex flex-wrap items-center justify-between text-[9px] font-sans font-bold uppercase tracking-wider text-neutral-500">
        <span>© 2026 Guardian News & Media Limited • All rights reserved</span>
        <span>Kings Place, 90 York Way, London N1 9GU</span>
        <span className="text-[#052962] font-extrabold">★ CERTIFIED CARBON NEUTRAL ★</span>
      </div>
    </div>
  );
}
