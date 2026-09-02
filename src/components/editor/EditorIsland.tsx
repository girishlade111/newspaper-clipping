import React, { useState, useEffect, useRef } from 'react';

export interface TemplateOption {
  id: string;
  name: string;
  newspaperName: string;
  tagline: string;
  date: string;
  headline: string;
  story: string;
  fontStyle: 'gothic' | 'serif' | 'modern';
}

export const TEMPLATES: TemplateOption[] = [
  {
    id: 'washington-post',
    name: 'The Washington Post',
    newspaperName: 'The Washington Post',
    tagline: 'Democracy Dies in Darkness • Capital Edition',
    date: 'Tuesday, June 17, 1972',
    headline: 'HISTORIC REVELATIONS SHAKE THE NATION AS INQUIRY EXPANDS',
    story: `In an unprecedented series of events that unfolded late yesterday evening, federal investigators disclosed startling new testimony before a packed senate hearing room.

Key witnesses detailed confidential archives documenting behind-the-scenes negotiations spanning several months. Observers noted the solemn stillness that swept across the gallery as primary documents were formally introduced into the public record.

"We stand at a critical juncture in our democratic traditions," remarked committee chairmen during an impromptu press conference on Capitol Hill. Additional witnesses are subpoenaed to testify later this week as the special inquiry broadens its scope across multiple departments.`,
    fontStyle: 'gothic',
  },
  {
    id: 'times-of-india',
    name: 'The Times of India',
    newspaperName: 'The Times of India',
    tagline: 'Let Truth Prevail • Established 1838',
    date: 'Friday, August 15, 1947',
    headline: 'NATION AWAKES TO FREEDOM AS HISTORIC BELLS TOLL AT MIDNIGHT',
    story: `Amidst tumultuous scenes of rejoicing and jubilation that surpassed anything witnessed in modern history, millions of citizens poured into illuminated public squares last night to welcome the dawn of independence.

Conch shells echoed across every district and national flags fluttered proudly atop civic institutions as solemn vows were delivered before the Constituent Assembly. Leaders called for peace, fortitude, and tireless service to the collective future.

"At the stroke of the midnight hour, our long-suppressed spirit finds utterance," proclaimed the inaugural address. Spontaneous celebrations continued well into the morning hours, with sweets distributed freely throughout neighborhoods.`,
    fontStyle: 'serif',
  },
  {
    id: 'new-york-times',
    name: 'The New York Times',
    newspaperName: 'The New York Times',
    tagline: "All The News That's Fit To Print",
    date: 'Monday, July 21, 1969',
    headline: 'MEN WALK ON MOON: ASTRONAUTS LAND IN SEA OF TRANQUILITY',
    story: `American astronauts took man's first tentative steps upon the surface of the moon tonight, planting the nation's flag in the powdery lunar soil before a global television audience estimated in the hundreds of millions.

"That's one small step for man, one giant leap for mankind," radioed commander Neil Armstrong as his boot touched the lunar regolith. The lunar module Eagle rested securely on an ancient volcanic plain after a perilous final descent piloted manually.

Messages of congratulation poured into mission control from heads of state across every continent, celebrating the triumphant fulfillment of an eight-year national undertaking.`,
    fontStyle: 'gothic',
  },
  {
    id: 'daily-chronicle',
    name: 'The Daily Chronicle',
    newspaperName: 'The Daily Chronicle',
    tagline: 'The World’s Greatest Vintage Newspaper • Established 1892',
    date: 'Friday, October 24, 1929',
    headline: 'EXTRAORDINARY SCIENTIFIC DISCOVERY ANNOUNCED BY ACADEMY',
    story: `Scholars and delegates from prestigious universities across the globe stood in stunned silence this afternoon as the Royal Scientific Society unveiled a working demonstration that challenges fundamental principles of physics.

Initial telegraphic dispatches from the experimental station in Cambridge confirmed that calibrated optical resonators achieved measurable continuous oscillations. Industry leaders have already begun preliminary discussions regarding industrial electrification.

"We have peered into a new domain of mechanical wonder," stated the head of the physics department. Public galleries remained crowded until nightfall as spectators clamored for printed summaries.`,
    fontStyle: 'serif',
  },
  {
    id: 'custom',
    name: 'Custom Newspaper Title',
    newspaperName: 'The Custom Gazette',
    tagline: 'Independent Journal of Record & General Information',
    date: 'Wednesday, September 2, 2026',
    headline: 'YOUR EYE-CATCHING VINTAGE HEADLINE GOES HERE',
    story: `Write your custom story here. You can craft humorous parodies, school history projects, commemorative wedding notices, or harmless viral clipping jokes.

All text automatically formats with authentic Linotype justified columns, drop caps, and newspaper rules. Upload an image below to see real vintage halftone dot reproduction!`,
    fontStyle: 'serif',
  },
];

interface EditorIslandProps {
  lang?: string;
}

export default function EditorIsland({ lang = 'en' }: EditorIslandProps) {
  // 1. Core State
  const [selectedTemplate, setSelectedTemplate] = useState<string>('washington-post');
  const [newspaperName, setNewspaperName] = useState<string>('The Washington Post');
  const [tagline, setTagline] = useState<string>('Democracy Dies in Darkness • Capital Edition');
  const [date, setDate] = useState<string>('Tuesday, June 17, 1972');
  const [headline, setHeadline] = useState<string>('HISTORIC REVELATIONS SHAKE THE NATION AS INQUIRY EXPANDS');
  const [story, setStory] = useState<string>(TEMPLATES[0].story);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [photoCaption, setPhotoCaption] = useState<string>('Scene captured during extraordinary proceedings.');
  
  // Secondary Design Controls (Adhering to DESIGN.md)
  const [columns, setColumns] = useState<1 | 2 | 3>(2);
  const [paperStyle, setPaperStyle] = useState<'1920' | '1950' | 'burnt' | 'clean'>('1920');
  const [tornEdges, setTornEdges] = useState<boolean>(true);
  const [halftoneFilter, setHalftoneFilter] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // 3. URL State Management - Initial Mount: Populate from URLSearchParams
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const params = new URLSearchParams(window.location.search);
      const templateParam = params.get('template');
      const nameParam = params.get('name') || params.get('newspaperName');
      const dateParam = params.get('date');
      const headlineParam = params.get('headline');
      const storyParam = params.get('story') || params.get('body');
      const taglineParam = params.get('tagline');
      const columnsParam = params.get('columns');
      const paperParam = params.get('paper') as '1920' | '1950' | 'burnt' | 'clean';

      if (templateParam) {
        const found = TEMPLATES.find((t) => t.id === templateParam);
        if (found) {
          setSelectedTemplate(templateParam);
          setNewspaperName(nameParam ?? found.newspaperName);
          setTagline(taglineParam ?? found.tagline);
          setDate(dateParam ?? found.date);
          setHeadline(headlineParam ?? found.headline);
          setStory(storyParam ?? found.story);
          if (columnsParam) setColumns(Number(columnsParam) as 1 | 2 | 3);
          if (paperParam) setPaperStyle(paperParam);
          setIsInitialized(true);
          return;
        }
      }

      if (nameParam) setNewspaperName(nameParam);
      if (dateParam) setDate(dateParam);
      if (headlineParam) setHeadline(headlineParam);
      if (storyParam) setStory(storyParam);
      if (taglineParam) setTagline(taglineParam);
      if (columnsParam) setColumns(Number(columnsParam) as 1 | 2 | 3);
      if (paperParam) setPaperStyle(paperParam);
    } catch {
      // safe fallback
    }

    setIsInitialized(true);
  }, []);

  // 3. URL State Management - Synchronize state to URLSearchParams via replaceState
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;

    try {
      const params = new URLSearchParams();
      if (selectedTemplate) params.set('template', selectedTemplate);
      if (newspaperName) params.set('name', newspaperName);
      if (date) params.set('date', date);
      if (headline) params.set('headline', headline);
      if (story) params.set('story', story);
      if (tagline) params.set('tagline', tagline);
      if (columns !== 2) params.set('columns', columns.toString());
      if (paperStyle !== '1920') params.set('paper', paperStyle);

      const queryString = params.toString();
      const targetUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
      window.history.replaceState(null, '', targetUrl);
    } catch {
      // safe fallback
    }
  }, [isInitialized, selectedTemplate, newspaperName, date, headline, story, tagline, columns, paperStyle]);

  // Handle Template Switching
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextTemplateId = e.target.value;
    setSelectedTemplate(nextTemplateId);
    const template = TEMPLATES.find((t) => t.id === nextTemplateId);
    if (template && nextTemplateId !== 'custom') {
      setNewspaperName(template.newspaperName);
      setTagline(template.tagline);
      setDate(template.date);
      setHeadline(template.headline);
      setStory(template.story);
    }
  };

  // 2. Drag & Drop Image Handling using FileReader
  const processImageFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImageUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleShareLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    window.print();
  };

  // Paper styling class
  const getPaperBgClass = () => {
    switch (paperStyle) {
      case '1950':
        return 'bg-[#eee8d5] text-[#2b2723]';
      case 'burnt':
        return 'bg-[#e2d5b8] text-[#1b1712] shadow-inner';
      case 'clean':
        return 'bg-[#fcfaf4] text-[#111111]';
      case '1920':
      default:
        return 'bg-[#f5ebd7] text-[#1a1714]';
    }
  };

  return (
    <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header Bar strictly in DESIGN.md style */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-black/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-ink/70">
              Interactive Linotype Studio
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight">
            Newspaper Clipping Generator
          </h1>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleShareLink}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white hover:bg-canvas-soft text-ink font-semibold text-xs border border-black/15 shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>{copiedUrl ? 'Copied with URL State!' : 'Share Parameters'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white hover:bg-canvas-soft text-ink font-semibold text-xs border border-black/15 shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Clipping</span>
          </button>

          <a
            href="#livePreviewArea"
            className="lg:hidden inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary text-ink font-bold text-xs shadow-sm"
          >
            <span>Jump to Preview ↓</span>
          </a>
        </div>
      </div>

      {/* 1. Layout: 2-Column Split Screen on Desktop / Stacked on Mobile */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT COLUMN: Scrollable Form Controls */}
        <div className="w-full lg:w-[48%] xl:w-[45%] flex flex-col gap-6 lg:overflow-y-auto lg:max-h-[calc(100vh-130px)] lg:pr-2">
          {/* Card 1: Newspaper Identity & Template Selector */}
          <div className="card-content bg-white rounded-xl p-6 shadow-sm border border-black/10">
            <h2 className="font-display font-black text-lg text-ink mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-ink text-xs font-bold">1</span>
              <span>Newspaper Template & Masthead</span>
            </h2>

            {/* Template Dropdown */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wide">
                Select Classic Newspaper Template
              </label>
              <select
                value={selectedTemplate}
                onChange={handleTemplateChange}
                className="w-full h-11 px-3.5 bg-canvas rounded-md border-[1.5px] border-black/20 text-ink font-semibold text-sm focus:border-ink focus:ring-4 focus:ring-primary/40 outline-none transition-all cursor-pointer"
              >
                {TEMPLATES.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Newspaper Title */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wide">
                Newspaper Masthead Name
              </label>
              <input
                type="text"
                value={newspaperName}
                onChange={(e) => setNewspaperName(e.target.value)}
                placeholder="e.g. The Daily Bugle"
                className="w-full h-11 px-3.5 bg-canvas rounded-md border-[1.5px] border-black/20 text-ink text-sm font-semibold focus:border-ink focus:ring-4 focus:ring-primary/40 outline-none transition-all"
              />
            </div>

            {/* Motto / Tagline */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wide">
                Motto / Sub-Masthead Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. The Voice of the Republic"
                className="w-full h-11 px-3.5 bg-canvas rounded-md border-[1.5px] border-black/20 text-ink text-sm focus:border-ink focus:ring-4 focus:ring-primary/40 outline-none transition-all"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wide">
                Issue Date (Free Text or Era Date)
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Friday, October 24, 1929"
                className="w-full h-11 px-3.5 bg-canvas rounded-md border-[1.5px] border-black/20 text-ink text-sm focus:border-ink focus:ring-4 focus:ring-primary/40 outline-none transition-all"
              />
            </div>
          </div>

          {/* Card 2: Headline & Story Textarea */}
          <div className="card-content bg-white rounded-xl p-6 shadow-sm border border-black/10">
            <h2 className="font-display font-black text-lg text-ink mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-ink text-xs font-bold">2</span>
              <span>Headlines & Linotype Story</span>
            </h2>

            {/* Headline */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wide">
                Main Banner Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. ALIENS SIGHTED OVER EMPIRE STATE"
                className="w-full h-11 px-3.5 bg-canvas rounded-md border-[1.5px] border-black/20 text-ink text-sm font-bold tracking-tight focus:border-ink focus:ring-4 focus:ring-primary/40 outline-none transition-all"
              />
            </div>

            {/* Story Textarea */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wide">
                Article Body Text (Markdown or Multi-paragraph)
              </label>
              <textarea
                rows={6}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Type or paste your vintage newspaper article text here..."
                className="w-full p-3.5 bg-canvas rounded-md border-[1.5px] border-black/20 text-ink text-sm leading-relaxed focus:border-ink focus:ring-4 focus:ring-primary/40 outline-none transition-all font-serif"
              />
              <p className="text-[11px] text-mute mt-1">
                Paragraphs separated by line breaks will format with classic Linotype indentation.
              </p>
            </div>

            {/* Column Selector */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wide">
                Column Division
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setColumns(col as 1 | 2 | 3)}
                    className={`h-10 rounded-md font-semibold text-xs border transition-colors ${
                      columns === col
                        ? 'bg-primary border-ink text-ink shadow-sm'
                        : 'bg-canvas-soft border-black/10 text-ink hover:bg-[#dbe0d8]'
                    }`}
                  >
                    {col} {col === 1 ? 'Column' : 'Columns'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Drag-and-Drop Image Upload Field (FileReader) */}
          <div className="card-content bg-white rounded-xl p-6 shadow-sm border border-black/10">
            <h2 className="font-display font-black text-lg text-ink mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-ink text-xs font-bold">3</span>
              <span>Halftone Photo & Photo Caption</span>
            </h2>

            {/* Drag and Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-primary bg-primary/10 scale-[1.01]'
                  : imageUrl
                  ? 'border-positive/50 bg-positive/5'
                  : 'border-black/20 bg-canvas-soft hover:border-black/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {imageUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative max-w-[200px] max-h-[140px] rounded-lg overflow-hidden shadow-md border border-black/20">
                    <img
                      src={imageUrl}
                      alt="Uploaded preview"
                      className={`w-full h-full object-cover ${halftoneFilter ? 'filter grayscale contrast-150' : ''}`}
                    />
                  </div>
                  <p className="text-xs font-bold text-positive-deep flex items-center gap-1">
                    <span>✓ Image Loaded Locally</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageUrl(null);
                      }}
                      className="px-3 py-1 rounded-pill bg-negative-deep text-white text-xs font-bold hover:bg-negative-darkest"
                    >
                      Remove Photo
                    </button>
                    <span className="text-xs text-mute">or click to change</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center text-ink text-lg mb-1">
                    📷
                  </div>
                  <p className="font-semibold text-sm text-ink">
                    Drag & Drop any photo here, or <span className="text-positive-deep underline">Browse</span>
                  </p>
                  <p className="text-xs text-mute">
                    Processed 100% in browser via FileReader. No server upload.
                  </p>
                </div>
              )}
            </div>

            {/* Photo Caption & Filter Controls */}
            {imageUrl && (
              <div className="mt-4 flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1 uppercase tracking-wide">
                    Photo Caption Text
                  </label>
                  <input
                    type="text"
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder="e.g. Eyewitness photograph taken yesterday afternoon."
                    className="w-full h-10 px-3 bg-canvas rounded-md border border-black/20 text-xs focus:border-ink outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-black/10">
                  <label className="text-xs font-bold text-ink cursor-pointer flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={halftoneFilter}
                      onChange={(e) => setHalftoneFilter(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                    />
                    <span>Simulate 1920s Halftone Screen Dots & Grain</span>
                  </label>
                  <span className="text-[11px] font-bold text-mute uppercase tracking-wider">
                    {halftoneFilter ? 'Halftone: ON' : 'Color: ON'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Card 4: Paper Aging & Finishing */}
          <div className="card-content bg-white rounded-xl p-6 shadow-sm border border-black/10">
            <h2 className="font-display font-black text-lg text-ink mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-ink text-xs font-bold">4</span>
              <span>Vintage Paper Texture & Effects</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[
                { id: '1920', label: '1920s Yellow' },
                { id: '1950', label: '1950s Newsprint' },
                { id: 'burnt', label: 'Burnt Edges' },
                { id: 'clean', label: 'Parchment Clean' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPaperStyle(item.id as '1920' | '1950' | 'burnt' | 'clean')}
                  className={`h-10 rounded-md text-xs font-bold border transition-colors ${
                    paperStyle === item.id
                      ? 'bg-primary border-ink text-ink shadow-sm'
                      : 'bg-canvas-soft border-black/10 text-ink hover:bg-[#dbe0d8]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-black/10">
              <label className="text-xs font-bold text-ink cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={tornEdges}
                  onChange={(e) => setTornEdges(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                <span>Simulate Rough Ragged Torn Paper Edges</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Live Preview adhering to 2-column split desktop */}
        <div
          id="livePreviewArea"
          className="w-full lg:w-[52%] xl:w-[55%] lg:sticky lg:top-20 self-start"
        >
          <div className="card-content bg-white rounded-xl p-4 sm:p-6 shadow-xl border border-black/10">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-black/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-positive animate-pulse"></span>
                <span className="font-display font-black text-sm uppercase tracking-wider text-ink">
                  Live Newsprint Preview
                </span>
              </div>
              <span className="text-[11px] font-bold text-mute uppercase tracking-wider">
                Syncs with URL params
              </span>
            </div>

            {/* The Authentic Newspaper Sheet */}
            <div
              ref={previewRef}
              className={`relative overflow-hidden transition-all duration-300 p-6 sm:p-8 font-serif shadow-md ${getPaperBgClass()} ${
                tornEdges ? 'rounded-lg border-[3px] border-dashed border-black/25' : 'rounded-none border border-black/30'
              }`}
              style={{
                backgroundImage:
                  paperStyle === 'burnt'
                    ? 'radial-gradient(circle, rgba(245,235,215,1) 60%, rgba(185,150,110,0.85) 100%)'
                    : 'none',
              }}
            >
              {/* Earpieces / Header Top Rule */}
              <div className="border-t-[1.5px] border-b-[1.5px] border-black/80 py-1 mb-2 flex items-center justify-between text-[10px] sm:text-[11px] font-sans font-bold tracking-wider uppercase">
                <span>Weather: Fair & Warm</span>
                <span className="hidden sm:inline font-black tracking-widest">• SPECIAL LATE DISPATCH •</span>
                <span>Price: Two Cents</span>
              </div>

              {/* Masthead Banner */}
              <div className="text-center py-2 sm:py-3">
                <h2
                  className="font-black tracking-tight text-3xl sm:text-5xl lg:text-6xl uppercase leading-none font-serif select-none"
                  style={{ letterSpacing: '-0.02em', textShadow: '0.5px 0.5px 0px rgba(0,0,0,0.2)' }}
                >
                  {newspaperName || 'THE DAILY CHRONICLE'}
                </h2>
                {tagline && (
                  <p className="text-[11px] sm:text-xs italic tracking-wide mt-1.5 opacity-85 font-sans font-medium">
                    {tagline}
                  </p>
                )}
              </div>

              {/* Date & Volume Bar Enclosed in Double Thick Lines */}
              <div className="border-t-[3px] border-b-[1.5px] border-black my-2 py-1 flex items-center justify-between text-[10px] sm:text-xs font-sans font-bold uppercase tracking-wider">
                <span>Vol. XLVIII No. 12,840</span>
                <span className="font-extrabold">{date || 'Tuesday, October 24, 1929'}</span>
                <span>Final City Edition</span>
              </div>

              {/* Main Headline */}
              <div className="text-center my-3 sm:my-4 border-b-[2px] border-black pb-3">
                <h3
                  className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl leading-[1.1] uppercase tracking-tight"
                  style={{ textShadow: '0.5px 0.5px 0px rgba(0,0,0,0.15)' }}
                >
                  {headline || 'YOUR VINTAGE HEADLINE APPEARS HERE'}
                </h3>
              </div>

              {/* Article Content Area */}
              <div
                className={`grid gap-5 text-xs sm:text-sm leading-relaxed text-justify`}
                style={{
                  gridTemplateColumns:
                    columns === 1 ? '1fr' : columns === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
                }}
              >
                {/* Column 1 with Optional Halftone Photo */}
                <div className="flex flex-col gap-2.5">
                  {imageUrl && (
                    <div className="border border-black p-1.5 bg-black/5 mb-2 shadow-inner">
                      <div className="overflow-hidden bg-black/10">
                        <img
                          src={imageUrl}
                          alt="Clipping illustration"
                          className={`w-full h-auto object-cover ${
                            halftoneFilter ? 'filter grayscale contrast-200 brightness-95' : ''
                          }`}
                        />
                      </div>
                      {photoCaption && (
                        <p className="text-[9px] sm:text-[10px] italic font-sans mt-1.5 text-center leading-tight opacity-90">
                          {photoCaption}
                        </p>
                      )}
                    </div>
                  )}

                  {story ? (
                    story.split('\n\n').slice(0, Math.ceil(story.split('\n\n').length / columns)).map((para, i) => (
                      <p key={i} className="mb-2">
                        {i === 0 ? (
                          <>
                            <span className="float-left text-3xl sm:text-4xl font-black font-serif mr-2 leading-none">
                              {para.charAt(0)}
                            </span>
                            {para.slice(1)}
                          </>
                        ) : (
                          para
                        )}
                      </p>
                    ))
                  ) : (
                    <p className="italic opacity-60">Article copy will stream directly here...</p>
                  )}
                </div>

                {/* Column 2 (if columns >= 2) */}
                {columns >= 2 && (
                  <div className="border-l border-black/25 pl-4 flex flex-col gap-2.5">
                    {story ? (
                      story
                        .split('\n\n')
                        .slice(
                          Math.ceil(story.split('\n\n').length / columns),
                          columns === 2
                            ? undefined
                            : Math.ceil((story.split('\n\n').length / columns) * 2)
                        )
                        .map((para, i) => (
                          <p key={i} className="mb-2">
                            {para}
                          </p>
                        ))
                    ) : null}
                  </div>
                )}

                {/* Column 3 (if columns === 3) */}
                {columns === 3 && (
                  <div className="border-l border-black/25 pl-4 flex flex-col gap-2.5">
                    {story ? (
                      story
                        .split('\n\n')
                        .slice(Math.ceil((story.split('\n\n').length / 3) * 2))
                        .map((para, i) => (
                          <p key={i} className="mb-2">
                            {para}
                          </p>
                        ))
                    ) : null}
                  </div>
                )}
              </div>

              {/* Bottom Authentic Newspaper Footer Rule */}
              <div className="mt-6 pt-2 border-t border-black/40 flex items-center justify-between text-[9px] font-sans text-black/60 uppercase">
                <span>The Vintage Press • Client-Side Archival Export</span>
                <span>Page One • Continued on Page Four</span>
              </div>
            </div>

            {/* Quick Helper Note */}
            <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs text-mute">
              <span>Changes reflect in URL parameters in real time.</span>
              <span className="font-semibold text-positive-deep">300 DPI Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
