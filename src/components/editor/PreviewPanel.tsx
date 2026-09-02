import React from 'react';

export interface PreviewPanelProps {
  /** Template identifier: 'The Times of India', 'The Washington Post', 'Global Times' (or lowercase slug) */
  template?: 'times-of-india' | 'The Times of India' | 'washington-post' | 'The Washington Post' | 'global-times' | 'Global Times' | string;
  date?: string;
  headline?: string;
  story?: string;
  imageUrl?: string | null;
  newspaperName?: string;
  tagline?: string;
  photoCaption?: string;
  className?: string;
}

export default function PreviewPanel({
  template = 'washington-post',
  date = 'Friday, October 24, 1929',
  headline = 'EXTRAORDINARY DISCOVERY ANNOUNCED TO NATION',
  story = `In an unprecedented series of events that unfolded late yesterday evening, federal investigators disclosed startling new testimony before a packed assembly.

Key witnesses detailed confidential archives documenting behind-the-scenes negotiations spanning several months. Observers noted the solemn stillness that swept across the gallery as primary documents were formally introduced into the public record.

"We stand at a critical juncture in our democratic traditions," remarked committee chairmen during an impromptu press conference. Additional witnesses are subpoenaed to testify later this week as the special inquiry broadens its scope.`,
  imageUrl = null,
  newspaperName,
  tagline,
  photoCaption = 'Eyewitness illustration captured during historic proceedings yesterday afternoon.',
  className = '',
}: PreviewPanelProps) {
  // Normalize template name
  const raw = (template || '').toLowerCase().trim();
  const isTOI = raw.includes('times of india') || raw.includes('times-of-india');
  const isWaPo = raw.includes('washington post') || raw.includes('washington-post');
  const isGlobalTimes = raw.includes('global times') || raw.includes('global-times');

  // Derive default newspaper masthead name if not customized
  const resolvedMasthead =
    newspaperName ||
    (isTOI
      ? 'THE TIMES OF INDIA'
      : isWaPo
      ? 'The Washington Post'
      : isGlobalTimes
      ? 'GLOBAL TIMES'
      : 'THE DAILY CHRONICLE');

  // Derive default tagline
  const resolvedTagline =
    tagline !== undefined
      ? tagline
      : isTOI
      ? 'ESTABLISHED 1838 • LARGEST CIRCULATION IN THE WORLD • NEW DELHI EDITION'
      : isWaPo
      ? 'Democracy Dies in Darkness • Capital Late Edition'
      : isGlobalTimes
      ? 'DISCOVERING DIVERSE PERSPECTIVES • BEIJING'
      : 'The Voice of the People • Established 1892';

  // Split story into readable paragraphs
  const paragraphs = (story || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Master paper background & border style based on template
  const paperContainerClasses = isTOI
    ? 'bg-[#f4ecd8] text-[#1c1813] border-stone-800/40 shadow-stone-900/20'
    : isWaPo
    ? 'bg-[#f6ebd7] text-[#14120e] border-neutral-900/50 shadow-neutral-950/25'
    : isGlobalTimes
    ? 'bg-[#fbf9f2] text-[#0f0f0f] border-zinc-900/60 shadow-zinc-950/20'
    : 'bg-[#f5ebd7] text-[#1a1714] border-stone-800/40 shadow-stone-900/20';

  return (
    <div
      className={`w-full relative transition-all duration-200 ${className}`}
      id="previewPanelContainer"
    >
      {/* 1. Master Container representing the Physical Newspaper Clipping */}
      <div
        className={`w-full max-w-4xl mx-auto p-5 sm:p-8 lg:p-10 shadow-2xl border-[3px] border-dashed rounded-sm transition-all duration-300 relative overflow-hidden select-none ${paperContainerClasses}`}
        style={{
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.35), 0 0 15px rgba(0, 0, 0, 0.08) inset',
        }}
      >
        {/* ========================================================================= */}
        {/* TEMPLATE 1: THE TIMES OF INDIA (Dense 3-Column Layout, Classic Serif)     */}
        {/* ========================================================================= */}
        {isTOI && (
          <div className="font-serif">
            {/* Top Ear-Pieces & Registration Bar */}
            <div className="border-t border-b border-stone-900/70 py-1 mb-2 flex items-center justify-between text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-stone-900">
              <span className="w-1/3 text-left">Weather: Foggy & Cool</span>
              <span className="w-1/3 text-center tracking-widest font-black">VOL. CLXXXVIII NO. 294</span>
              <span className="w-1/3 text-right">PRICE: TWO RUPEES</span>
            </div>

            {/* Central Ornate Crest & Masthead */}
            <div className="text-center py-2 relative">
              <div className="flex items-center justify-center gap-3 mb-1">
                <span className="h-[1px] w-12 sm:w-20 bg-stone-900/60"></span>
                <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-stone-800">
                  ★ LET TRUTH PREVAIL ★
                </span>
                <span className="h-[1px] w-12 sm:w-20 bg-stone-900/60"></span>
              </div>

              <h1
                className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none text-stone-950 font-serif"
                style={{
                  fontFamily: '"Times New Roman", Times, "Merriweather", serif',
                  letterSpacing: '0.01em',
                }}
              >
                {resolvedMasthead}
              </h1>

              <p className="text-[9px] sm:text-[10px] uppercase font-sans font-bold tracking-widest text-stone-800/80 mt-1">
                {resolvedTagline}
              </p>
            </div>

            {/* Dense Double Border Rule with City and Date */}
            <div className="border-t-[3px] border-b-[1px] border-stone-950 my-2 py-1 flex items-center justify-between text-[10px] sm:text-xs font-sans font-bold uppercase">
              <span>DELHI • BOMBAY • CALCUTTA • MADRAS</span>
              <span className="font-black text-stone-950">{date}</span>
              <span>SPECIAL MORNING EDITION</span>
            </div>

            {/* Main Headline */}
            <div className="text-center my-3 border-b-2 border-stone-950/80 pb-2.5">
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-tight text-stone-950 font-serif"
                style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}
              >
                {headline}
              </h2>
            </div>

            {/* Dynamic Layout: 3-Column Dense Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[12px] leading-[1.42] text-justify">
              {/* If Image exists: span across 2 columns, story in column 3, text continues below */}
              {imageUrl ? (
                <>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <div className="border border-stone-900 p-1 bg-stone-900/5 shadow-inner">
                      <div className="relative overflow-hidden bg-stone-950/10 max-h-[300px]">
                        <img
                          src={imageUrl}
                          alt="Newspaper Clipping Scene"
                          className="w-full h-full max-h-[280px] object-cover filter grayscale contrast-150 brightness-95"
                        />
                      </div>
                      {photoCaption && (
                        <p className="text-[10px] font-sans italic text-center mt-1 text-stone-800">
                          [PHOTO DISPATCH]: {photoCaption}
                        </p>
                      )}
                    </div>

                    {/* First paragraph with Drop Cap below image */}
                    {paragraphs[0] && (
                      <p className="text-stone-900">
                        <span className="float-left text-3xl font-black mr-2 leading-none font-serif text-stone-950">
                          {paragraphs[0].charAt(0)}
                        </span>
                        {paragraphs[0].slice(1)}
                      </p>
                    )}
                  </div>

                  {/* Column 3: Continuing Story */}
                  <div className="border-l border-stone-900/30 pl-3 flex flex-col gap-2">
                    {paragraphs.slice(1).map((p, idx) => (
                      <p key={idx} className="text-stone-900">
                        {p}
                      </p>
                    ))}
                  </div>
                </>
              ) : (
                /* No Image: Dense 3 Columns flowing naturally */
                <>
                  <div className="flex flex-col gap-2">
                    {paragraphs[0] && (
                      <p className="text-stone-900">
                        <span className="float-left text-3xl font-black mr-2 leading-none font-serif text-stone-950">
                          {paragraphs[0].charAt(0)}
                        </span>
                        {paragraphs[0].slice(1)}
                      </p>
                    )}
                    {paragraphs.slice(1, Math.ceil(paragraphs.length / 3)).map((p, idx) => (
                      <p key={idx} className="text-stone-900">
                        {p}
                      </p>
                    ))}
                  </div>

                  <div className="border-l border-stone-900/30 pl-3 flex flex-col gap-2">
                    {paragraphs
                      .slice(Math.ceil(paragraphs.length / 3), Math.ceil((paragraphs.length / 3) * 2))
                      .map((p, idx) => (
                        <p key={idx} className="text-stone-900">
                          {p}
                        </p>
                      ))}
                  </div>

                  <div className="border-l border-stone-900/30 pl-3 flex flex-col gap-2">
                    {paragraphs.slice(Math.ceil((paragraphs.length / 3) * 2)).map((p, idx) => (
                      <p key={idx} className="text-stone-900">
                        {p}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Bottom Footer Rule */}
            <div className="border-t border-stone-900/40 mt-5 pt-1.5 flex items-center justify-between text-[9px] font-sans font-bold uppercase text-stone-700">
              <span>TIMES OF INDIA ARCHIVAL PRESS</span>
              <span>CONTINUED ON PAGE 3, COL. 2</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TEMPLATE 2: THE WASHINGTON POST (Standard Elegant Typography, Huge Head)   */}
        {/* ========================================================================= */}
        {isWaPo && (
          <div className="font-serif">
            {/* Top Date & Price Line */}
            <div className="flex items-center justify-between text-[10px] sm:text-xs font-sans font-semibold uppercase tracking-wider text-neutral-800 border-b border-neutral-900/30 pb-1 mb-1.5">
              <span>WASHINGTON, D.C.</span>
              <span className="font-black tracking-widest">{date}</span>
              <span>PRICE: 35 CENTS</span>
            </div>

            {/* Gothic / Blackletter Iconic Masthead */}
            <div className="text-center py-2">
              <h1
                className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-neutral-950"
                style={{
                  fontFamily: '"UnifrakturMaguntia", "Playfair Display", serif',
                  letterSpacing: '-0.02em',
                }}
              >
                {resolvedMasthead}
              </h1>
              {resolvedTagline && (
                <p className="text-xs sm:text-sm italic font-serif text-neutral-800 mt-1 font-medium">
                  {resolvedTagline}
                </p>
              )}
            </div>

            {/* Thick Double Header Divider */}
            <div className="border-t-[3px] border-b-[1px] border-neutral-950 my-2 py-0.5 flex items-center justify-between text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-widest">
              <span>WEATHER: 68° FAIR AND SUNNY</span>
              <span>★ 145TH YEAR • NO. 210 ★</span>
              <span>CAPITAL FINAL EDITION</span>
            </div>

            {/* Grand Headline */}
            <div className="text-center my-4 border-b-2 border-neutral-950 pb-3">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight text-neutral-950 font-serif"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                {headline}
              </h2>
            </div>

            {/* Dynamic Layout: If image uploaded, span across full or lead column */}
            <div className="flex flex-col gap-4">
              {imageUrl && (
                <div className="w-full border-t border-b border-neutral-900/60 py-2 my-1">
                  <div className="relative overflow-hidden max-h-[360px] bg-neutral-950/10 border border-neutral-950">
                    <img
                      src={imageUrl}
                      alt="News Article Graphic"
                      className="w-full h-full max-h-[340px] object-cover filter grayscale contrast-125 brightness-95"
                    />
                  </div>
                  {photoCaption && (
                    <p className="text-[11px] font-sans italic text-neutral-800 mt-1.5 pl-1 leading-snug">
                      <strong className="font-bold font-sans not-italic uppercase text-[10px] mr-1">
                        PHOTO BY SPECIAL CORRESPONDENT —
                      </strong>
                      {photoCaption}
                    </p>
                  )}
                </div>
              )}

              {/* 2-Column Balanced Story Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[13px] sm:text-[14px] leading-relaxed text-justify">
                <div className="flex flex-col gap-2.5">
                  {paragraphs[0] && (
                    <p className="text-neutral-900">
                      <span className="float-left text-4xl sm:text-5xl font-black mr-2 leading-none font-serif text-neutral-950">
                        {paragraphs[0].charAt(0)}
                      </span>
                      {paragraphs[0].slice(1)}
                    </p>
                  )}
                  {paragraphs.slice(1, Math.ceil(paragraphs.length / 2)).map((p, idx) => (
                    <p key={idx} className="text-neutral-900">
                      {p}
                    </p>
                  ))}
                </div>

                <div className="border-t md:border-t-0 md:border-l border-neutral-900/30 md:pl-6 flex flex-col gap-2.5">
                  {paragraphs.slice(Math.ceil(paragraphs.length / 2)).map((p, idx) => (
                    <p key={idx} className="text-neutral-900">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Footer Rule */}
            <div className="border-t border-neutral-950/40 mt-6 pt-2 flex items-center justify-between text-[10px] font-sans font-bold uppercase text-neutral-700">
              <span>The Washington Post Press Archive</span>
              <span>Section A • Page 1</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TEMPLATE 3: GLOBAL TIMES (Bold, Structured, Modern Broadsheet Layout)     */}
        {/* ========================================================================= */}
        {isGlobalTimes && (
          <div className="font-sans">
            {/* Top Red Accented Banner Bar */}
            <div className="bg-red-800 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest flex items-center justify-between">
              <span>★ IN-DEPTH GLOBAL REPORT ★</span>
              <span>SPECIAL WORLD WIRE DISPATCH</span>
              <span>WWW.GLOBALTIMES.CN</span>
            </div>

            {/* Bold Structured Masthead */}
            <div className="text-center py-3 border-b-2 border-zinc-950">
              <h1
                className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-zinc-950 leading-none"
                style={{ fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif' }}
              >
                {resolvedMasthead}
              </h1>
              <div className="flex items-center justify-center gap-2 mt-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-800">
                <span>BEIJING</span>
                <span>•</span>
                <span>{date}</span>
                <span>•</span>
                <span>{resolvedTagline}</span>
              </div>
            </div>

            {/* Category Breadcrumb Banner */}
            <div className="bg-zinc-950 text-white px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider my-2 flex items-center justify-between">
              <span>TOP STORY / FRONT PAGE EXCLUSIVE</span>
              <span>ISSUE NO. 54,921</span>
            </div>

            {/* Big Structured Headline */}
            <div className="my-3 border-b border-zinc-900/30 pb-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-zinc-950 uppercase leading-tight font-sans">
                {headline}
              </h2>
            </div>

            {/* Dynamic Layout: If image exists, spans full width with structured box */}
            <div className="flex flex-col gap-4">
              {imageUrl && (
                <div className="w-full bg-zinc-100 p-2 border-2 border-zinc-950 shadow-sm">
                  <div className="relative overflow-hidden max-h-[340px] bg-zinc-900/10">
                    <img
                      src={imageUrl}
                      alt="News Coverage"
                      className="w-full h-full max-h-[320px] object-cover filter contrast-125"
                    />
                  </div>
                  {photoCaption && (
                    <div className="bg-zinc-950 text-zinc-100 px-3 py-1.5 text-[11px] font-medium mt-1.5 flex items-center justify-between">
                      <span>{photoCaption}</span>
                      <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">
                        GLOBAL TIMES PHOTO
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* 2-Column Structured Columns with Dateline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[13px] leading-relaxed text-justify font-serif text-zinc-900">
                <div className="flex flex-col gap-2.5">
                  {paragraphs[0] && (
                    <p>
                      <strong className="font-sans font-black text-zinc-950 mr-1 not-italic">
                        BEIJING —
                      </strong>
                      {paragraphs[0]}
                    </p>
                  )}
                  {paragraphs.slice(1, Math.ceil(paragraphs.length / 2)).map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                <div className="border-t md:border-t-0 md:border-l border-zinc-900/20 md:pl-5 flex flex-col gap-2.5">
                  {paragraphs.slice(Math.ceil(paragraphs.length / 2)).map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Structured Bottom Rule */}
            <div className="border-t-2 border-zinc-950 mt-5 pt-2 flex items-center justify-between text-[10px] font-bold uppercase text-zinc-700 font-sans">
              <span>GLOBAL TIMES PUBLISHING CO.</span>
              <span>ALL RIGHTS RESERVED • PRESS RUN 2,400,000</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DEFAULT / FALLBACK BROADSHEET STYLE (e.g. The Daily Chronicle)             */}
        {/* ========================================================================= */}
        {!isTOI && !isWaPo && !isGlobalTimes && (
          <div className="font-serif">
            {/* Top Ear-Pieces & Registration Bar */}
            <div className="border-t-[1.5px] border-b-[1.5px] border-stone-900 py-1 mb-2 flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-wider text-stone-900">
              <span>Weather: Fair & Warm</span>
              <span className="font-black tracking-widest">• SPECIAL LATE DISPATCH •</span>
              <span>Price: Two Cents</span>
            </div>

            {/* Central Masthead */}
            <div className="text-center py-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none text-stone-950 font-serif">
                {resolvedMasthead}
              </h1>
              {resolvedTagline && (
                <p className="text-[11px] sm:text-xs italic font-sans text-stone-800 mt-1">
                  {resolvedTagline}
                </p>
              )}
            </div>

            {/* Date & Volume Bar */}
            <div className="border-t-[3px] border-b-[1.5px] border-stone-950 my-2 py-1 flex items-center justify-between text-[10px] sm:text-xs font-sans font-bold uppercase">
              <span>Vol. XLVIII No. 12,840</span>
              <span className="font-black text-stone-950">{date}</span>
              <span>Final City Edition</span>
            </div>

            {/* Main Headline */}
            <div className="text-center my-3 border-b-2 border-stone-950 pb-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-tight text-stone-950 font-serif">
                {headline}
              </h2>
            </div>

            {/* Dynamic Content Columns */}
            <div className="flex flex-col gap-4">
              {imageUrl && (
                <div className="w-full border border-stone-900 p-1 bg-stone-900/5 my-1">
                  <div className="relative overflow-hidden max-h-[320px] bg-stone-950/10">
                    <img
                      src={imageUrl}
                      alt="Article preview"
                      className="w-full h-full max-h-[300px] object-cover filter grayscale contrast-150"
                    />
                  </div>
                  {photoCaption && (
                    <p className="text-[10px] font-sans italic text-center mt-1 text-stone-800">
                      {photoCaption}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[12px] sm:text-[13px] leading-relaxed text-justify">
                <div className="flex flex-col gap-2">
                  {paragraphs[0] && (
                    <p className="text-stone-900">
                      <span className="float-left text-3xl font-black mr-2 leading-none font-serif text-stone-950">
                        {paragraphs[0].charAt(0)}
                      </span>
                      {paragraphs[0].slice(1)}
                    </p>
                  )}
                  {paragraphs.slice(1, Math.ceil(paragraphs.length / 2)).map((p, idx) => (
                    <p key={idx} className="text-stone-900">
                      {p}
                    </p>
                  ))}
                </div>

                <div className="border-t md:border-t-0 md:border-l border-stone-900/30 md:pl-5 flex flex-col gap-2">
                  {paragraphs.slice(Math.ceil(paragraphs.length / 2)).map((p, idx) => (
                    <p key={idx} className="text-stone-900">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Footer Rule */}
            <div className="border-t border-stone-900/40 mt-5 pt-1.5 flex items-center justify-between text-[9px] font-sans font-bold uppercase text-stone-700">
              <span>The Vintage Press • Client-Side Archival Export</span>
              <span>Page One • Continued on Page Four</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
