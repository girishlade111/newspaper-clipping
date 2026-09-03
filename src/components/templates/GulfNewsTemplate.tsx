import React from 'react';

export interface GulfNewsProps {
  headline?: string;
  story?: string;
  date?: string;
  image?: string | null;
  author?: string;
  subheadline?: string;
  newspaperName?: string;
  tagline?: string;
  photoCaption?: string;
  section?: string;
  price?: string;
  weather?: string;
  className?: string;
}

export default function GulfNewsTemplate({
  headline = 'GROUNDBREAKING MULTILATERAL ACCORD RATIFIED IN SUMMIT BREAKTHROUGH',
  story = `Delegates concluded an exhaustive seventy-two-hour high-level summit yesterday, formally ratifying a comprehensive economic, industrial, and clean energy partnership framework.

The landmark blueprint outlines substantial strategic investments across regional renewable infrastructure, digital trade corridors, and streamlined cross-border transit logistics. Senior economists characterized the outcome as a pivotal stabilizer for global supply chain resilience.

"Constructive engagement and reciprocal pragmatism laid the bedrock for today's historic breakthrough," noted the chief coordinator during the closing plenary. Working groups will convene quarterly to monitor milestones and ensure swift implementation across all member territories.

Commercial chambers across the Middle East welcomed the announcement, projecting significant expansion in trade volumes over the next three fiscal quarters. Financial markets responded positively with key regional indices touching new quarterly highs.`,
  date = 'Wednesday, September 2, 2026',
  image = null,
  author = 'By Staff Reporter / Dubai',
  subheadline = 'Regional Leaders Unveil Landmark Multibillion-Dollar Economic Blueprint to Accelerate Sustainable Growth Across Key Sectors',
  newspaperName = 'GULF NEWS',
  tagline = 'THE VOICE OF THE REGION • ESTABLISHED 1978',
  photoCaption = 'Delegates formalizing the economic accord during the concluding plenary session at the international trade center.',
  section = 'UAE / SPECIAL REPORT',
  price = 'AED 5.00 • OMR 0.500',
  weather = 'DUBAI 34°C • ABU DHABI 35°C • SUNNY',
  className = '',
}: GulfNewsProps) {
  // Parse paragraphs
  const paragraphs = (story || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const leadParagraph = paragraphs[0] || '';
  const remainingParagraphs = paragraphs.slice(1);

  return (
    <div
      className={`w-full max-w-5xl mx-auto bg-[#ffffff] text-[#111111] p-5 sm:p-8 md:p-10 shadow-2xl border border-neutral-300 rounded-xs select-none font-gulfBody transition-all duration-200 relative overflow-hidden ${className}`}
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(0, 0, 0, 0.02) inset',
      }}
    >
      {/* ========================================================================= */}
      {/* 1. TOP UTILITY BAR (Prayer times, Weather, Edition & Price)               */}
      {/* ========================================================================= */}
      <div className="border-b border-neutral-200 pb-2 mb-3 flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] font-gulfSans text-neutral-600 font-semibold tracking-wide">
        <div className="flex items-center gap-3">
          <span className="text-neutral-900 font-bold">{weather}</span>
          <span className="hidden sm:inline text-neutral-300">|</span>
          <span className="hidden sm:inline">PRAYER: FAJR 04:45 • MAGHRIB 18:40</span>
        </div>
        <div className="flex items-center gap-3">
          <span>DUBAI, UAE</span>
          <span className="text-neutral-300">|</span>
          <span className="font-bold text-neutral-900">{price}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CONTEMPORARY MASTHEAD WITH ICONIC RED ACCENT SQUARE                   */}
      {/* ========================================================================= */}
      <div className="w-full py-2 sm:py-3 flex flex-col items-center justify-center text-center">
        <div className="flex flex-nowrap items-center justify-center">
          {/* Trademark Accent Symbol */}
          <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#e52e2e] rounded-xs inline-block"></span>
          <h1
            className="font-gulfTitle whitespace-nowrap text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-neutral-950 leading-none"
            style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
          >
            {newspaperName}
          </h1>
        </div>

        {/* Crisp Sub-tagline */}
        <p className="font-gulfSans text-[10px] sm:text-[11px] font-bold tracking-widest text-neutral-500 uppercase mt-1.5">
          {tagline}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTION NAVIGATION RIBBON & DATE STRIP                                 */}
      {/* ========================================================================= */}
      <div className="border-t-2 border-b border-neutral-900 my-2 py-1.5 flex flex-wrap items-center justify-between text-[10px] sm:text-xs font-gulfSans font-bold uppercase tracking-wider text-neutral-900">
        <div className="flex items-center gap-3 sm:gap-4 text-xs">
          <span className="text-[#e52e2e] font-black">{section}</span>
          <span className="hidden sm:inline text-neutral-400">/</span>
          <span className="hidden sm:inline hover:text-neutral-600">BUSINESS</span>
          <span className="hidden md:inline hover:text-neutral-600">WORLD</span>
          <span className="hidden md:inline hover:text-neutral-600">OPINION</span>
          <span className="hidden lg:inline hover:text-neutral-600">SPORT</span>
        </div>
        <div className="font-semibold text-neutral-600">
          {date}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MODERN BROADSHEET COMMANDING HEADLINE & AIRY DECK                      */}
      {/* ========================================================================= */}
      <div className="pt-3 pb-4 mb-4 border-b border-neutral-200">
        <span className="inline-block px-2.5 py-0.5 mb-2 rounded-xs bg-neutral-900 text-white font-gulfSans text-[10px] font-extrabold uppercase tracking-wider">
          EXCLUSIVE
        </span>

        {/* Crisp High-Contrast Editorial Serif Headline */}
        <h2
          className="font-gulfHeadline text-2xl sm:text-4xl md:text-5xl font-black text-neutral-950 tracking-tight leading-tight mb-3"
          style={{ fontFamily: '"Playfair Display", "Libre Baskerville", Georgia, serif' }}
        >
          {headline}
        </h2>

        {/* Airy, Crisp Sans-Serif Subheadline */}
        {subheadline && (
          <p className="font-gulfSans text-sm sm:text-base md:text-lg font-medium text-neutral-700 leading-relaxed max-w-4xl">
            {subheadline}
          </p>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. CONTEMPORARY AIRY 12-COLUMN ASYMMETRIC GRID                           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-[13px] leading-[1.55] font-gulfBody">
        
        {/* LEFT / CENTER MODULE: Main Story & Hero Image (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Modern Hero Image with Clean Minimalist Border */}
          {image && (
            <div className="w-full bg-neutral-100 border border-neutral-200 overflow-hidden shadow-xs">
              <div className="relative overflow-hidden max-h-[380px]">
                <img
                  src={image}
                  alt="Gulf News Article Media"
                  className="w-full h-auto max-h-[360px] object-cover"
                />
              </div>
              {photoCaption && (
                <div className="p-2.5 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-baseline justify-between text-[11px] text-neutral-600 font-gulfSans">
                  <p className="leading-snug">
                    {photoCaption}
                  </p>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase whitespace-nowrap ml-2 mt-1 sm:mt-0">
                    GN Focus
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Author Byline & Dateline Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2 text-[11px] font-gulfSans text-neutral-600 font-semibold">
            <span className="text-neutral-900 font-bold uppercase tracking-wider">
              {author}
            </span>
            <span>Published at 08:00 AM GST</span>
          </div>

          {/* Lead Paragraph with Clean Modern Editorial Drop Cap */}
          {leadParagraph && (
            <p className="text-neutral-900 text-justify text-[14px] leading-relaxed">
              <span className="float-left text-4xl font-gulfTitle whitespace-nowrap font-black mr-2.5 leading-none text-neutral-950 select-none">
                {leadParagraph.charAt(0)}
              </span>
              <strong className="font-gulfSans font-bold text-neutral-900 tracking-wide uppercase">
                DUBAI —{' '}
              </strong>
              {leadParagraph.slice(1)}
            </p>
          )}

          {/* 2-Column Split for Subsequent Paragraphs (Classic Modern Broadsheet Flow) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-neutral-800 text-justify mt-1">
            {remainingParagraphs.map((para, idx) => (
              <p key={idx} className="leading-relaxed">
                {para}
              </p>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: Sidebar Highlights, Fast Facts & Quotes (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l lg:border-neutral-200 lg:pl-6">
          
          {/* Key Takeaways Card */}
          <div className="p-4 bg-neutral-50 rounded-xs border border-neutral-200">
            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-neutral-200">
              <span className="w-2 h-2 rounded-full bg-[#e52e2e]"></span>
              <h4 className="font-gulfSans font-black text-xs uppercase tracking-wider text-neutral-900">
                KEY HIGHLIGHTS
              </h4>
            </div>
            <ul className="space-y-2 text-[12px] font-gulfSans text-neutral-700 leading-snug list-disc list-inside">
              <li>Comprehensive multilateral framework signed after marathon deliberations.</li>
              <li>Priority focus directed towards digital infrastructure and trade corridors.</li>
              <li>Joint implementation council to meet quarterly starting next month.</li>
            </ul>
          </div>

          {/* Pull Quote Callout Box */}
          <div className="p-4 border-l-4 border-neutral-900 bg-neutral-100 my-1">
            <p className="font-gulfHeadline italic text-sm font-semibold text-neutral-900 leading-snug">
              "This agreement represents a decisive leap toward sustainable economic integration."
            </p>
            <span className="font-gulfSans text-[10px] font-bold text-neutral-600 block mt-2 uppercase tracking-wide">
              — Chief Strategic Coordinator
            </span>
          </div>

          {/* Market Insight Module */}
          <div className="p-3 border border-neutral-200 text-xs font-gulfSans text-neutral-700">
            <h5 className="font-black uppercase text-[11px] tracking-wider text-neutral-900 mb-1">
              MARKET RESPONSE
            </h5>
            <p className="text-[11px] leading-relaxed text-neutral-600">
              Regional benchmark indices climbed by 1.8% in early trading following the joint press briefing.
            </p>
          </div>

          <div className="mt-auto pt-3 border-t border-neutral-200 text-center font-gulfSans text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Full Coverage Online at GulfNews.com
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 6. MODERN BOTTOM FOOTER REGISTER                                         */}
      {/* ========================================================================= */}
      <div className="mt-8 pt-3 border-t border-neutral-900 flex flex-wrap items-center justify-between text-[9px] font-gulfSans font-bold uppercase tracking-wider text-neutral-500">
        <span>© Al Nisr Publishing LLC • All Rights Reserved</span>
        <span>P.O. Box 6519, Dubai, UAE • Member of the Audit Bureau of Circulations</span>
        <span className="text-neutral-900 font-extrabold">★ CITY FINAL EDITION ★</span>
      </div>
    </div>
  );
}
