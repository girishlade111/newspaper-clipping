import React from 'react';
import NewYorkTimesTemplate from '../templates/NewYorkTimesTemplate.tsx';
import WashingtonPostTemplate from '../templates/WashingtonPostTemplate.tsx';
import TOITemplate from '../templates/TOITemplate.tsx';
import GulfNewsTemplate from '../templates/GulfNewsTemplate.tsx';
import JapanTimesTemplate from '../templates/JapanTimesTemplate.tsx';
import KoreaHeraldTemplate from '../templates/KoreaHeraldTemplate.tsx';
import GuardianTemplate from '../templates/GuardianTemplate.tsx';
import LeMondeTemplate from '../templates/LeMondeTemplate.tsx';

export interface PreviewPanelProps {
  /** Template identifier: 'new-york-times', 'washington-post', 'the-guardian', 'le-monde', 'times-of-india', 'gulf-news', 'japan-times', 'korea-herald', 'global-times', etc. */
  template?: 'new-york-times' | 'The New York Times' | 'the-guardian' | 'The Guardian' | 'le-monde' | 'Le Monde' | 'times-of-india' | 'The Times of India' | 'gulf-news' | 'Gulf News' | 'japan-times' | 'The Japan Times' | 'korea-herald' | 'The Korea Herald' | 'washington-post' | 'The Washington Post' | 'global-times' | 'Global Times' | string;
  date?: string;
  headline?: string;
  story?: string;
  imageUrl?: string | null;
  newspaperName?: string;
  tagline?: string;
  photoCaption?: string;
  author?: string;
  subheadline?: string;
  className?: string;
}

/**
 * Bug M-13: the old detection used raw substring tests (`raw.includes('gn')`,
 * `'jt'`, `'kh'`, …) which matched any id that happened to contain those letters
 * and silently fell through to the wrong template. Normalise the incoming id to
 * a kebab-case slug and look it up in an explicit alias table instead.
 */
const TEMPLATE_KIND_BY_ID: Record<string, string> = {
  'new-york-times': 'nyt',
  'the-new-york-times': 'nyt',
  nyt: 'nyt',
  'washington-post': 'wapo',
  'the-washington-post': 'wapo',
  wapo: 'wapo',
  'times-of-india': 'toi',
  'the-times-of-india': 'toi',
  toi: 'toi',
  'the-guardian': 'guardian',
  guardian: 'guardian',
  'le-monde': 'lemonde',
  lemonde: 'lemonde',
  'gulf-news': 'gulfnews',
  gn: 'gulfnews',
  'japan-times': 'japantimes',
  'the-japan-times': 'japantimes',
  jt: 'japantimes',
  'korea-herald': 'koreaherald',
  'the-korea-herald': 'koreaherald',
  kh: 'koreaherald',
  'global-times': 'globaltimes',
};

const normalizeTemplateId = (value: string): string =>
  (value || '').toLowerCase().trim().replace(/[\s_]+/g, '-');

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
  author,
  subheadline,
  className = '',
}: PreviewPanelProps) {
  // Normalize template name
  const raw = normalizeTemplateId(template);
  const kind = TEMPLATE_KIND_BY_ID[raw] || '';

  const isNYT = kind === 'nyt';
  const isWaPo = kind === 'wapo';
  const isGuardian = kind === 'guardian';
  const isLeMonde = kind === 'lemonde';
  const isTOI = kind === 'toi';
  const isGulfNews = kind === 'gulfnews';
  const isJapanTimes = kind === 'japantimes';
  const isKoreaHerald = kind === 'koreaherald';
  const isGlobalTimes = kind === 'globaltimes';

  let templateContent: React.ReactNode = null;

  if (isGuardian) {
    templateContent = (
      <GuardianTemplate
        headline={headline}
        story={story}
        date={date}
        image={imageUrl}
        author={author}
        subheadline={subheadline}
        newspaperName={newspaperName}
        tagline={tagline}
        photoCaption={photoCaption}
      />
    );
  } else if (isLeMonde) {
    templateContent = (
      <LeMondeTemplate
        headline={headline}
        story={story}
        date={date}
        image={imageUrl}
        author={author}
        subheadline={subheadline}
        newspaperName={newspaperName}
        tagline={tagline}
        photoCaption={photoCaption}
      />
    );
  } else if (isNYT) {
    templateContent = (
      <NewYorkTimesTemplate
        headline={headline}
        story={story}
        date={date}
        image={imageUrl}
        author={author}
        subheadline={subheadline}
        newspaperName={newspaperName}
        tagline={tagline}
        photoCaption={photoCaption}
      />
    );
  } else if (isWaPo) {
    templateContent = (
      <WashingtonPostTemplate
        headline={headline}
        story={story}
        date={date}
        image={imageUrl}
        author={author}
        subheadline={subheadline}
        newspaperName={newspaperName}
        tagline={tagline}
        photoCaption={photoCaption}
      />
    );
  } else if (isTOI) {
    templateContent = (
      <TOITemplate
        headline={headline}
        story={story}
        date={date}
        image={imageUrl}
        author={author}
        subheadline={subheadline}
        newspaperName={newspaperName}
        tagline={tagline}
        photoCaption={photoCaption}
      />
    );
  } else if (isGulfNews) {
    templateContent = (
      <GulfNewsTemplate
        headline={headline}
        story={story}
        date={date}
        image={imageUrl}
        author={author}
        subheadline={subheadline}
        newspaperName={newspaperName}
        tagline={tagline}
        photoCaption={photoCaption}
      />
    );
  } else if (isJapanTimes) {
    templateContent = (
      <JapanTimesTemplate
        headline={headline}
        story={story}
        date={date}
        image={imageUrl}
        author={author}
        subheadline={subheadline}
        newspaperName={newspaperName}
        tagline={tagline}
        photoCaption={photoCaption}
      />
    );
  } else if (isKoreaHerald) {
    templateContent = (
      <KoreaHeraldTemplate
        headline={headline}
        story={story}
        date={date}
        image={imageUrl}
        author={author}
        subheadline={subheadline}
        newspaperName={newspaperName}
        tagline={tagline}
        photoCaption={photoCaption}
      />
    );
  }

  if (templateContent) {
    return (
      <div
        className={`w-full relative transition-all duration-200 ${className}`}
        id="previewPanelContainer"
        data-selected-template={raw}
      >
        {templateContent}
      </div>
    );
  }

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
        {/* GLOBAL TIMES (Bold, Structured, Modern Broadsheet Layout)                */}
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
              <div className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none text-stone-950 font-serif" aria-hidden="true">
                {resolvedMasthead}
              </div>
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
