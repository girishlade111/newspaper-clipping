import React from 'react';

export interface TimesOfIndiaProps {
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

export default function TimesOfIndiaTemplate({
  headline = 'NATION AWAKES TO FREEDOM AS HISTORIC BELLS TOLL AT MIDNIGHT',
  story = `Amidst tumultuous scenes of rejoicing and jubilation that surpassed anything witnessed in modern history, millions of citizens poured into illuminated public squares last night to celebrate the dawn of a new era.

Conch shells echoed across every district and national standards fluttered proudly atop civic institutions as solemn vows were delivered before the Constituent Assembly. Observers noted the deep stillness that fell over the gallery as primary covenants were affirmed into the public ledger.

"At the stroke of the midnight hour, our long-suppressed spirit finds utterance," proclaimed the inaugural address to thunderous applause. Leaders appealed for peace, collective fortitude, and tireless service to the commonwealth.

Spontaneous celebrations continued well into the morning hours, with confections distributed freely throughout neighborhood quarters and civic buildings adorned in tricolor illumination. Delegations from across the globe extended formal felicitations to the presiding council.`,
  date = 'Friday, August 15, 1947',
  image = null,
  author = 'TIMES NEWS NETWORK',
  subheadline = 'HISTORIC CONSTITUENT ASSEMBLY RATIFIES SOVEREIGN PROCLAMATION IN PARLIAMENT HALL',
  newspaperName = 'THE TIMES OF INDIA',
  tagline = 'ESTABLISHED 1838 • LARGEST CIRCULATION IN THE WORLD',
  photoCaption = 'Celebratory gathering at the illuminated public square during midnight proceedings.',
  edition = 'NEW DELHI LATE CITY EDITION',
  price = 'TWO ANNAS',
  weather = 'WEATHER: CLEAR AND PLEASANT • MAX 32°C, MIN 24°C',
  className = '',
}: TimesOfIndiaProps) {
  // Parse paragraphs
  const paragraphs = (story || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const leadParagraph = paragraphs[0] || '';
  const remainingParagraphs = paragraphs.slice(1);

  return (
    <div
      className={`w-full max-w-5xl mx-auto bg-[#f8f5ed] text-[#121212] p-4 sm:p-7 md:p-9 shadow-2xl border border-black/40 rounded-xs select-none font-toiBody transition-all duration-200 relative overflow-hidden ${className}`}
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 0, 0, 0.05) inset',
      }}
    >
      {/* Subtle Newsprint Paper Grain Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
        style={{
          backgroundImage:
            'radial-gradient(#1a1a1a 0.75px, transparent 0.75px), radial-gradient(#1a1a1a 0.75px, #f8f5ed 0.75px)',
          backgroundSize: '28px 28px',
          backgroundPosition: '0 0, 14px 14px',
        }}
      />

      {/* ========================================================================= */}
      {/* 1. TOP UI STRIP (Weather, Edition, Price) - Sans-serif                    */}
      {/* ========================================================================= */}
      <div className="relative z-10 border-b border-black/30 pb-1.5 mb-2 flex flex-wrap items-center justify-between text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-800">
        <span className="w-full sm:w-auto text-left">{weather}</span>
        <span className="w-full sm:w-auto text-center font-black tracking-widest">{edition}</span>
        <span className="w-full sm:w-auto text-right">{price}</span>
      </div>

      {/* ========================================================================= */}
      {/* 2. THE TIMES OF INDIA ICONIC MASTHEAD & CREST                             */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full text-center py-2 sm:py-3">
        {/* Historic Motto Badge */}
        <div className="flex items-center justify-center gap-3 mb-1">
          <span className="h-px w-12 sm:w-20 bg-black/40"></span>
          <span className="font-sans text-[10px] sm:text-[11px] font-black tracking-widest uppercase text-neutral-800">
            ★ LET TRUTH PREVAIL ★
          </span>
          <span className="h-px w-12 sm:w-20 bg-black/40"></span>
        </div>

        {/* Master Times of India Title */}
        <h1
          className="font-toiTitle whitespace-nowrap text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black leading-none drop-shadow-xs py-1"
          style={{ fontFamily: '"Playfair Display", "Times New Roman", Merriweather, serif' }}
        >
          {newspaperName}
        </h1>

        {/* Established Tagline */}
        <p className="font-sans text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-neutral-700 mt-1">
          {tagline}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3. STRUCTURAL DIVIDER BAR (Cities & Date)                                 */}
      {/* ========================================================================= */}
      <div className="relative z-10 border-t-2 border-b border-black py-1 my-2 flex flex-wrap items-center justify-between text-[10px] sm:text-xs font-sans font-bold uppercase text-black">
        <span>DELHI • BOMBAY • CALCUTTA • MADRAS</span>
        <span className="font-toiTitle whitespace-nowrap font-black tracking-widest text-center">{date}</span>
        <span>FINAL CITY EDITION</span>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN HEADLINE & BOLD CAPITALIZED SUBHEADLINE                           */}
      {/* ========================================================================= */}
      <div className="relative z-10 pt-2 pb-3 mb-3 border-b-2 border-black/85 text-center">
        {/* Bold, Legible Serif Headline */}
        <h2
          className="font-toiHeadline font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-black leading-tight max-w-4xl mx-auto"
          style={{ fontFamily: '"Playfair Display", Merriweather, Georgia, serif' }}
        >
          {headline}
        </h2>

        {/* Bold, Capitalized Sub-headline */}
        {subheadline && (
          <div className="mt-2.5 pt-2 border-t border-black/20 max-w-3xl mx-auto">
            <h3 className="font-sans font-extrabold uppercase text-xs sm:text-sm tracking-wider text-black/90 leading-snug px-2">
              {subheadline}
            </h3>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. CLASSIC 3-COLUMN LAYOUT WITH STRUCTURAL DIVIDERS                       */}
      {/* ========================================================================= */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-[12px] leading-[1.45] text-justify font-toiBody">
        
        {/* COLUMN 1: Lead Story & Byline */}
        <div className="border-b md:border-b-0 md:border-r border-black/25 pr-0 md:pr-4 flex flex-col gap-3">
          {/* Distinct TOI Byline */}
          <div className="pb-1.5 border-b border-black/20">
            <span className="font-sans font-black text-[11px] uppercase tracking-wider text-black block">
              BY {author}
            </span>
            <span className="font-sans text-[9px] uppercase tracking-wide text-neutral-600 block">
              Special Correspondent
            </span>
          </div>

          {/* Lead Paragraph with Bold Drop Cap and Dateline */}
          {leadParagraph && (
            <p className="text-black leading-relaxed">
              <span className="float-left text-4xl sm:text-5xl font-black mr-2 leading-none font-serif text-black select-none">
                {leadParagraph.charAt(0)}
              </span>
              <strong className="font-sans font-black tracking-wider text-black uppercase">
                NEW DELHI:{' '}
              </strong>
              {leadParagraph.slice(1)}
            </p>
          )}

          {remainingParagraphs[0] && (
            <p className="text-black leading-relaxed indent-3">
              {remainingParagraphs[0]}
            </p>
          )}

          <div className="p-2.5 bg-black/[0.03] border-l-2 border-black my-1 text-[11px] font-sans font-medium text-neutral-800 leading-snug">
            "A historic milestone that honors the sacrifice and resolve of an entire people."
          </div>
        </div>

        {/* COLUMN 2: Photo Dispatch & Continuation */}
        <div className="border-b md:border-b-0 md:border-r border-black/25 pr-0 md:pr-4 flex flex-col gap-3">
          {/* Framed Photo Dispatch */}
          {image && (
            <div className="border border-black p-1 bg-white shadow-xs">
              <div className="relative overflow-hidden bg-black/10 max-h-[300px]">
                <img
                  src={image}
                  alt="Times of India Illustration"
                  className="w-full h-auto max-h-[280px] object-cover filter grayscale contrast-125 brightness-95"
                />
              </div>
              {photoCaption && (
                <div className="pt-1.5 px-0.5 border-t border-black/15 mt-1">
                  <p className="font-sans text-[10px] italic text-neutral-800 leading-tight text-center">
                    [PHOTO DISPATCH]: {photoCaption}
                  </p>
                  <p className="font-sans text-[8px] font-bold uppercase tracking-wider text-neutral-500 text-right mt-0.5">
                    TOI Photo Archive
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Bold Capitalized Mid-Column Section Header */}
          <div className="border-t border-b border-black/25 py-1 text-center my-0.5">
            <h4 className="font-sans font-black uppercase text-[11px] tracking-wider text-black">
              PARLIAMENT CONVENES FOR MIDNIGHT SESSION
            </h4>
          </div>

          {remainingParagraphs.slice(1, 3).map((para, idx) => (
            <p key={idx} className="text-black leading-relaxed indent-3">
              {para}
            </p>
          ))}
        </div>

        {/* COLUMN 3: Continuing Story & Official Dispatches */}
        <div className="flex flex-col gap-3">
          <div className="border-b border-black/20 pb-1 text-center">
            <h4 className="font-sans font-black uppercase text-[11px] tracking-wider text-black">
              INTERNATIONAL ACCLAIM
            </h4>
          </div>

          {remainingParagraphs.slice(3).map((para, idx) => (
            <p key={idx} className="text-black leading-relaxed indent-3">
              {para}
            </p>
          ))}

          {/* Key Facts Summary Box */}
          <div className="border border-black/30 p-2.5 bg-black/[0.02] my-1">
            <h5 className="font-sans font-black text-[10px] uppercase tracking-wider text-black mb-1 border-b border-black/20 pb-0.5">
              SUMMARY OF PROCEEDINGS
            </h5>
            <ul className="text-[10px] font-sans space-y-1 text-neutral-800 list-disc list-inside">
              <li>Solemn assembly ratified by unanimous voice vote</li>
              <li>Civic services to function throughout the weekend</li>
              <li>Public illumination planned in all state capitals</li>
            </ul>
          </div>

          <div className="mt-auto pt-2 border-t border-black/20 text-center">
            <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-neutral-600">
              CONTINUED ON PAGE 4, COLUMN 1
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 6. BOTTOM FOOTER REGISTER                                                 */}
      {/* ========================================================================= */}
      <div className="relative z-10 mt-6 pt-1.5 border-t border-black/40 flex flex-wrap items-center justify-between text-[8px] font-sans font-bold uppercase tracking-wider text-neutral-600">
        <span>The Times of India Press • Bennett, Coleman & Co. Ltd.</span>
        <span>Registered with Registrar of Newspapers for India</span>
        <span>★ DAK EDITION ★</span>
      </div>
    </div>
  );
}
