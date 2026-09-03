import React from 'react';

export interface LeMondeProps {
  headline?: string;
  story?: string;
  date?: string;
  image?: string | null;
  author?: string;
  subheadline?: string;
  newspaperName?: string;
  tagline?: string;
  photoCaption?: string;
  editionNumber?: string;
  price?: string;
  weather?: string;
  className?: string;
}

export default function LeMondeTemplate({
  headline = 'L’ACCORD HISTORIQUE SUR LA TRANSITION ÉNERGÉTIQUE ENTERINÉ À BRUXELLES',
  story = `Au terme de négociations marathon qui se sont prolongées jusqu’aux premières lueurs de l’aube, les représentants des vingt-sept États membres sont parvenus à un compromis déterminant sur le nouveau cadre régulateur européen.

Le document d’orientation, paraphé conjointement par les délégations ministérielles, fixe des objectifs contraignants de réduction des émissions industrielles et sanctuarise d’importants investissements transfrontaliers dans les réseaux d’interconnexion décarbonés.

« Nous franchissons une étape charnière pour la souveraineté industrielle et écologique de notre continent », a déclaré la présidente de la commission lors d’une conférence de presse solennelle au palais Berlaymont. Les premiers décrets d’application doivent être soumis au vote parlementaire avant la clôture de la session d’automne.

Les milieux économiques et syndicaux ont salué avec retenue une avancée qualifiée d’inédite, tout en insistant sur la nécessité d’un accompagnement financier équitable pour les filières manufacturières régionales.`,
  date = 'Mercredi 28 octobre 2026',
  image = null,
  author = 'Par Pierre Dupont',
  subheadline = 'Après soixante-douze heures de délibérations à huis clos, les dirigeants européens ont scellé un pacte stratégique fixant des objectifs industriels contraignants',
  newspaperName = 'Le Monde',
  tagline = 'Fondateur : Hubert Beuve-Méry • Directeur : Jérôme Fenoglio',
  photoCaption = 'La salle du conseil européen à l’issue de la session plénière solennelle hier matin à Bruxelles.',
  editionNumber = '82e ANNÉE — N° 24 512',
  price = '3,40 € — FRANCE MÉTROPOLITAINE',
  weather = 'PARIS 16°C • LYON 18°C • MARSEILLE 21°C • ÉCLAIRCIES',
  className = '',
}: LeMondeProps) {
  // Parse paragraphs
  const paragraphs = (story || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const leadParagraph = paragraphs[0] || '';
  const remainingParagraphs = paragraphs.slice(1);

  return (
    <div
      className={`w-full max-w-5xl mx-auto bg-[#fbf8f0] text-[#111111] p-5 sm:p-8 md:p-9 shadow-2xl border border-black/40 rounded-xs select-none font-leMondeBody transition-all duration-200 relative overflow-hidden ${className}`}
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 0, 0, 0.05) inset',
      }}
    >
      {/* Subtle Newsprint Paper Grain Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
        style={{
          backgroundImage:
            'radial-gradient(#111 0.75px, transparent 0.75px), radial-gradient(#111 0.75px, #fbf8f0 0.75px)',
          backgroundSize: '28px 28px',
          backgroundPosition: '0 0, 14px 14px',
        }}
      />

      {/* ========================================================================= */}
      {/* 1. TRADITIONAL TOP REGISTER (Weather & Metropole Details)                 */}
      {/* ========================================================================= */}
      <div className="relative z-10 border-b border-black/30 pb-1.5 mb-2 flex flex-wrap items-center justify-between text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-800">
        <span>{weather}</span>
        <span className="font-serif italic font-normal text-neutral-600">
          « Toutes les nouvelles avec impartialité et rigueur »
        </span>
        <span className="font-bold text-neutral-900">{price}</span>
      </div>

      {/* ========================================================================= */}
      {/* 2. LE MONDE ICONIC CALLIGRAPHIC MASTHEAD                                  */}
      {/* ========================================================================= */}
      <div className="relative z-10 text-center py-2 sm:py-3">
        <h1
          className="font-leMondeTitle text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-black leading-none py-1 drop-shadow-xs"
          style={{ fontFamily: '"UnifrakturMaguntia", "Old English Text MT", serif' }}
        >
          {newspaperName}
        </h1>

        {/* Traditional French Subtitle */}
        <p className="font-leMondeHeadline italic text-xs sm:text-sm text-neutral-700 mt-1">
          {tagline}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3. STRICT TRADITIONAL EUROPEAN DATE & NUMBERING BAR                       */}
      {/* ========================================================================= */}
      <div className="relative z-10 border-t-2 border-b border-black py-1 my-2 flex flex-wrap items-center justify-between text-[10px] sm:text-xs font-leMondeHeadline font-bold uppercase tracking-wider text-black">
        <span className="w-full sm:w-auto text-left">{editionNumber}</span>
        <span className="w-full sm:w-auto text-center font-black tracking-widest uppercase">
          {date}
        </span>
        <span className="w-full sm:w-auto text-right">ÉDITION QUOTIDIENNE</span>
      </div>

      {/* ========================================================================= */}
      {/* 4. ELEGANT FRENCH GARAMOND HEADLINE & CHAPEAU                             */}
      {/* ========================================================================= */}
      <div className="relative z-10 pt-2 pb-3 mb-4 border-b-2 border-black/85 text-center">
        {/* Rubrique / Section Kicker */}
        <div className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-widest text-neutral-800 mb-1.5">
          — EUROPE & AFFAIRES INTERNATIONALES —
        </div>

        {/* Dignified Garamond Headline */}
        <h2
          className="font-leMondeHeadline font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-black leading-[1.08] max-w-4xl mx-auto"
          style={{ fontFamily: '"EB Garamond", Garamond, Georgia, serif' }}
        >
          {headline}
        </h2>

        {/* Elegant Chapeau (Deck) */}
        {subheadline && (
          <div className="mt-2.5 pt-2 border-t border-black/20 max-w-3xl mx-auto">
            <p className="font-leMondeHeadline italic text-sm sm:text-base md:text-lg text-neutral-800 leading-snug px-2">
              « {subheadline} »
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. STRUCTURED 3-COLUMN EUROPEAN BROADSHEET GRID                           */}
      {/* ========================================================================= */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-[12px] leading-[1.48] text-justify font-leMondeBody">
        
        {/* COLUMN 1: Lead Article, Byline & Ornate Drop Cap */}
        <div className="border-b md:border-b-0 md:border-r border-black/25 pr-0 md:pr-4 flex flex-col gap-3">
          {/* Traditional French Byline */}
          <div className="pb-1.5 border-b border-black/20">
            <span className="font-leMondeHeadline font-bold uppercase text-[11px] tracking-wider text-black block">
              {author}
            </span>
            <span className="font-leMondeHeadline italic text-[10px] text-neutral-600 block">
              Envoyé spécial à Bruxelles
            </span>
          </div>

          {/* Lead Paragraph with Elegant French Ornate Drop Cap */}
          {leadParagraph && (
            <p className="text-black leading-relaxed">
              <span
                className="float-left text-5xl sm:text-6xl font-leMondeHeadline font-black mr-2 leading-none text-black select-none"
                style={{ fontFamily: '"EB Garamond", Garamond, serif' }}
              >
                {leadParagraph.charAt(0)}
              </span>
              <strong className="font-leMondeHeadline font-bold uppercase tracking-wide">
                BRUXELLES —{' '}
              </strong>
              {leadParagraph.slice(1)}
            </p>
          )}

          {remainingParagraphs[0] && (
            <p className="text-black leading-relaxed indent-3">
              {remainingParagraphs[0]}
            </p>
          )}

          <div className="p-2.5 bg-black/[0.03] border-l-2 border-black my-1 text-[11px] italic font-leMondeHeadline text-neutral-800 leading-snug">
            « Une avancée juridique et politique qui redéfinit l'équilibre des pouvoirs au sein de l'Union. »
          </div>
        </div>

        {/* COLUMN 2: Central Halftone Photo & Continuation */}
        <div className="border-b md:border-b-0 md:border-r border-black/25 pr-0 md:pr-4 flex flex-col gap-3">
          {/* Framed European Photo Illustration */}
          {image && (
            <div className="border border-black p-1 bg-white shadow-xs">
              <div className="relative overflow-hidden bg-black/10 max-h-[300px]">
                <img
                  src={image}
                  alt="Illustration Le Monde"
                  className="w-full h-auto max-h-[280px] object-cover filter grayscale contrast-125 brightness-95"
                />
              </div>
              {photoCaption && (
                <div className="pt-1.5 px-0.5 border-t border-black/15 mt-1">
                  <p className="font-leMondeHeadline italic text-[10.5px] text-neutral-800 leading-tight text-center">
                    {photoCaption}
                  </p>
                  <p className="font-sans text-[8px] font-bold uppercase tracking-wider text-neutral-500 text-right mt-0.5">
                    Photo AFP / Archives Le Monde
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Subheader */}
          <div className="border-t border-b border-black/25 py-1 text-center my-0.5">
            <h4 className="font-leMondeHeadline font-bold uppercase text-[11px] tracking-wider text-black">
              LES DÉTAILS DU COMPROMIS BUDGÉTAIRE
            </h4>
          </div>

          {remainingParagraphs.slice(1, 3).map((para, idx) => (
            <p key={idx} className="text-black leading-relaxed indent-3">
              {para}
            </p>
          ))}
        </div>

        {/* COLUMN 3: Analysis & Repercussions */}
        <div className="flex flex-col gap-3">
          <div className="border-b border-black/20 pb-1 text-center">
            <h4 className="font-leMondeHeadline font-bold uppercase text-[11px] tracking-wider text-black">
              RÉACTIONS ET PERSPECTIVES
            </h4>
          </div>

          {remainingParagraphs.slice(3).map((para, idx) => (
            <p key={idx} className="text-black leading-relaxed indent-3">
              {para}
            </p>
          ))}

          {/* Analysis Note Box */}
          <div className="border border-black/30 p-2.5 bg-black/[0.02] my-1">
            <h5 className="font-leMondeHeadline font-bold text-[10.5px] uppercase tracking-wider text-black mb-1 border-b border-black/20 pb-0.5">
              POINTS CLÉS DU PROTOCOLE
            </h5>
            <ul className="text-[10.5px] font-leMondeBody space-y-1 text-neutral-800 list-disc list-inside">
              <li>Adoption à la majorité qualifiée des ministres concernés</li>
              <li>Mise en œuvre échelonnée sur les trois prochains exercices</li>
              <li>Clause de revoyure programmée au printemps 2028</li>
            </ul>
          </div>

          <div className="mt-auto pt-2 border-t border-black/20 text-center">
            <span className="font-leMondeHeadline italic text-[9.5px] tracking-widest text-neutral-600">
              — Lire la suite en page 6, colonne 2 —
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 6. BOTTOM REGISTER STRIP                                                  */}
      {/* ========================================================================= */}
      <div className="relative z-10 mt-6 pt-1.5 border-t border-black/40 flex flex-wrap items-center justify-between text-[8px] font-sans font-bold uppercase tracking-wider text-neutral-600">
        <span>Société éditrice du Monde • 80, boulevard Auguste-Blanqui, 75707 Paris Cedex 13</span>
        <span>Commission paritaire des publications et agences de presse</span>
        <span>★ DERNIÈRE ÉDITION DU SOIR ★</span>
      </div>
    </div>
  );
}
