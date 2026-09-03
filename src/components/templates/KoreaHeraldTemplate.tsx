import React from 'react';

export interface KoreaHeraldProps {
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

export default function KoreaHeraldTemplate({
  headline = 'GOVERNMENT UNVEILS MULTIBILLION-DOLLAR STRATEGY TO SECURE GLOBAL TECH SUPREMACY',
  story = `South Korea’s financial and science ministries finalized a landmark national strategic roadmap yesterday, allocating substantial public capital toward next-generation semiconductor fabrication, artificial intelligence platforms, and advanced bio-pharmaceutical research.

The high-level policy council convened at the Government Complex in Seoul, bringing together senior cabinet ministers, leading academic deans, and chief executive officers from premier industrial conglomerates. Observers emphasized the unified consensus behind accelerating domestic technological sovereignty amid shifting global trade dynamics.

"This coordinated investment package represents a decisive foundation for sustained national competitiveness," the finance minister stated during a nationally televised joint press briefing. Specialized task forces will supervise implementation across dedicated regional technology clusters.

Financial markets responded promptly to the policy declaration, with bellwether semiconductor and technology equities pushing benchmark indices higher during morning trading. Major business associations released statements expressing comprehensive support for the government-backed innovation agenda.`,
  date = 'Wednesday, September 2, 2026',
  image = null,
  author = 'By KIM MIN-SEOK',
  subheadline = 'Ministries and Conglomerates Forge Unified Public-Private Alliance to Bolster Next-Generation Innovation and Semiconductor Supply Chains',
  newspaperName = 'The Korea Herald',
  tagline = "KOREA'S NO. 1 ENGLISH NEWSPAPER • FOUNDED IN 1953",
  photoCaption = 'Cabinet ministers and technology executives formalizing the public-private partnership accord in Seoul yesterday.',
  edition = 'SEOUL METROPOLITAN EDITION',
  price = '1,500 WON',
  weather = 'SEOUL: 22°C / 16°C • BUSAN: 24°C / 18°C • SUNNY',
  className = '',
}: KoreaHeraldProps) {
  // Parse paragraphs
  const paragraphs = (story || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const leadParagraph = paragraphs[0] || '';
  const remainingParagraphs = paragraphs.slice(1);

  return (
    <div
      className={`w-full max-w-5xl mx-auto bg-[#ffffff] text-[#111111] p-5 sm:p-8 md:p-10 shadow-2xl border border-neutral-300 rounded-xs select-none font-khBody transition-all duration-200 relative overflow-hidden ${className}`}
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.28), 0 0 15px rgba(0, 0, 0, 0.02) inset',
      }}
    >
      {/* ========================================================================= */}
      {/* 1. CORPORATE TOP UTILITY BAR                                              */}
      {/* ========================================================================= */}
      <div className="border-b border-neutral-200 pb-2 mb-3 flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] font-sans text-neutral-600 font-semibold tracking-wide">
        <div className="flex items-center gap-3">
          <span className="text-neutral-900 font-bold">{weather}</span>
          <span className="hidden sm:inline text-neutral-300">|</span>
          <span className="hidden sm:inline">AIR QUALITY: GOOD</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-neutral-900">{edition}</span>
          <span className="text-neutral-300">|</span>
          <span className="font-bold text-neutral-900">{price}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STATELY CORPORATE MASTHEAD                                             */}
      {/* ========================================================================= */}
      <div className="text-center py-2 sm:py-3">
        <h1
          className="font-khTitle text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-neutral-950 leading-none"
          style={{ fontFamily: '"Merriweather", "Playfair Display", Georgia, serif' }}
        >
          {newspaperName}
        </h1>

        {/* Corporate Slogan */}
        <p className="font-sans text-[10px] sm:text-[11px] font-bold tracking-widest text-neutral-500 uppercase mt-1.5">
          {tagline}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTION NAVIGATION & DATE STRIP                                        */}
      {/* ========================================================================= */}
      <div className="border-t-2 border-b border-neutral-900 my-2 py-1.5 flex flex-wrap items-center justify-between text-[10px] sm:text-xs font-sans font-bold uppercase tracking-wider text-neutral-900">
        <div className="flex items-center gap-3 sm:gap-4 text-xs">
          <span className="text-blue-900 font-black">NATIONAL</span>
          <span className="hidden sm:inline text-neutral-300">/</span>
          <span className="hidden sm:inline hover:text-neutral-600">BUSINESS</span>
          <span className="hidden md:inline hover:text-neutral-600">FINANCE</span>
          <span className="hidden md:inline hover:text-neutral-600">WORLD</span>
          <span className="hidden lg:inline hover:text-neutral-600">OPINION</span>
          <span className="hidden lg:inline hover:text-neutral-600">CULTURE</span>
        </div>
        <div className="font-semibold text-neutral-600">
          {date}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. CRISP HEADLINE & GENEROUSLY PADDED SUBHEADLINE                         */}
      {/* ========================================================================= */}
      <div className="pt-3 pb-4 mb-4 border-b border-neutral-200">
        <span className="inline-block px-2.5 py-0.5 mb-2.5 rounded-xs bg-blue-900 text-white font-sans text-[10px] font-extrabold uppercase tracking-wider">
          POLICY BRIEFING
        </span>

        {/* Crisp Corporate Serif Headline */}
        <h2
          className="font-khHeadline text-2xl sm:text-4xl md:text-5xl font-black text-neutral-950 tracking-tight leading-tight mb-3"
          style={{ fontFamily: '"Playfair Display", "Merriweather", Georgia, serif' }}
        >
          {headline}
        </h2>

        {/* Generously Padded Deck */}
        {subheadline && (
          <p className="font-sans text-sm sm:text-base md:text-lg font-medium text-neutral-700 leading-relaxed max-w-4xl">
            {subheadline}
          </p>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. DISTINCT BYLINE & AUTHOR HIERARCHY BAR                                 */}
      {/* ========================================================================= */}
      <div className="mb-5 pb-3 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-neutral-50 p-3 rounded-xs border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
            KH
          </div>
          <div>
            <div className="font-sans font-black text-xs text-neutral-950 uppercase tracking-wide">
              {author}
            </div>
            <div className="text-[11px] text-neutral-600 font-sans">
              Senior National Policy Correspondent • The Korea Herald
            </div>
          </div>
        </div>
        <div className="text-[11px] font-sans text-neutral-500 sm:text-right">
          <div>Published at 09:30 KST</div>
          <div className="text-neutral-400 text-[10px]">Updated 11:15 KST</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. MODERN AIRY BROADSHEET GRID WITH AMPLE PADDING                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-8 text-[13.5px] leading-[1.62] font-khBody">
        
        {/* MAIN COLUMN (8 Columns): Photo, Lead Paragraph, Narrative */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          
          {/* Hero Media Module */}
          {image && (
            <div className="w-full bg-neutral-100 border border-neutral-200 overflow-hidden shadow-xs">
              <div className="relative overflow-hidden max-h-[360px]">
                <img
                  src={image}
                  alt="The Korea Herald Illustration"
                  className="w-full h-auto max-h-[350px] object-cover"
                />
              </div>
              {photoCaption && (
                <div className="p-2.5 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-baseline justify-between text-[11px] text-neutral-600 font-sans">
                  <p className="leading-snug">
                    {photoCaption}
                  </p>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase whitespace-nowrap ml-2 mt-1 sm:mt-0">
                    Yonhap
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Lead Paragraph with Dateline */}
          {leadParagraph && (
            <p className="text-neutral-900 text-justify text-[14.5px] leading-relaxed font-medium">
              <span className="float-left text-4xl font-khTitle font-black mr-2 leading-none text-neutral-950 select-none">
                {leadParagraph.charAt(0)}
              </span>
              <strong className="font-sans font-bold text-neutral-950 uppercase tracking-wide">
                SEOUL —{' '}
              </strong>
              {leadParagraph.slice(1)}
            </p>
          )}

          {/* 2-Column Split for Subsequent Paragraphs with Comfortable Gutters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-neutral-800 text-justify">
            {remainingParagraphs.map((para, idx) => (
              <p key={idx} className="leading-relaxed">
                {para}
              </p>
            ))}
          </div>

        </div>

        {/* SIDEBAR COLUMN (4 Columns): Ample Spacing, Corporate Cards & Insights */}
        <div className="lg:col-span-4 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l lg:border-neutral-200 lg:pl-6">
          
          {/* Key Takeaways Module */}
          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs shadow-2xs">
            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-neutral-200">
              <span className="w-2 h-2 rounded-full bg-blue-900"></span>
              <h4 className="font-sans font-black text-xs uppercase tracking-wider text-neutral-900">
                KEY HIGHLIGHTS
              </h4>
            </div>
            <ul className="space-y-2 text-[12px] font-sans text-neutral-700 leading-snug list-disc list-inside">
              <li>Comprehensive roadmap backed by major industrial federations.</li>
              <li>Priority allocations for semiconductor R&D and manufacturing hubs.</li>
              <li>Inter-ministerial task force to oversee quarterly progress milestones.</li>
            </ul>
          </div>

          {/* Corporate Quote Box */}
          <div className="p-4 border-l-4 border-blue-900 bg-neutral-100 my-1">
            <p className="font-khHeadline italic text-xs sm:text-sm font-semibold text-neutral-900 leading-snug">
              "This strategic blueprint establishes an enduring foundation for Korea's technological leadership."
            </p>
            <span className="font-sans text-[10px] font-bold text-neutral-600 block mt-2 uppercase tracking-wide">
              — Ministry of Economy and Finance
            </span>
          </div>

          {/* Market Sentiment Card */}
          <div className="p-3.5 border border-neutral-200 text-xs font-sans text-neutral-700 bg-white">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-neutral-900 uppercase text-[11px]">KOSPI BENCHMARK</span>
              <span className="text-emerald-700 font-bold">+1.24% ▲</span>
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-600">
              Technology and semiconductor equities led trading volumes following the morning cabinet announcement.
            </p>
          </div>

          <div className="mt-auto pt-3 border-t border-neutral-200 text-center font-sans text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            For Real-Time Updates Visit KoreaHerald.com
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 7. BOTTOM CORPORATE REGISTER                                              */}
      {/* ========================================================================= */}
      <div className="mt-8 pt-3 border-t border-neutral-900 flex flex-wrap items-center justify-between text-[9px] font-sans font-bold uppercase tracking-wider text-neutral-500">
        <span>The Korea Herald • Herald Corp., Huam-ro, Yongsan-gu, Seoul</span>
        <span>Registration No. Seoul Ba-00104 • ISSN 1227-1608</span>
        <span className="text-neutral-900 font-extrabold">★ DAILY NATIONAL EDITION ★</span>
      </div>
    </div>
  );
}
