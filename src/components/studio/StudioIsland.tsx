import React, { useState, useEffect, useRef } from 'react';
import PreviewPanel from '../editor/PreviewPanel';
import {
  downloadAsSVG,
  saveToDrafts,
  captureThumbnail,
} from '../../utils/exportAndStorage';
import {
  exportAsPNG,
  exportAsJPG,
  exportAsImage,
  exportAsPDF,
  printClipping,
} from '../../utils/exportEngine';

export interface TemplatePreset {
  id: string;
  name: string;
  newspaperName: string;
  tagline: string;
  date: string;
  headline: string;
  subheadline: string;
  author: string;
  story: string;
  photoCaption: string;
  badge: string;
  era: string;
}

export const TEMPLATES: TemplatePreset[] = [
  {
    id: 'times-of-india',
    name: 'The Times of India',
    newspaperName: 'THE TIMES OF INDIA',
    tagline: 'LET TRUTH PREVAIL • ESTABLISHED 1838 • NEW DELHI EDITION',
    date: 'Friday, August 15, 1947',
    headline: 'NATION AWAKES TO FREEDOM AS HISTORIC BELLS TOLL AT MIDNIGHT',
    subheadline: 'HISTORIC CONSTITUENT ASSEMBLY RATIFIES SOVEREIGN PROCLAMATION IN PARLIAMENT HALL',
    author: 'TIMES NEWS NETWORK',
    story: `Amidst tumultuous scenes of rejoicing and jubilation that surpassed anything witnessed in modern history, millions of citizens poured into illuminated public squares last night to celebrate the dawn of a new era.

Conch shells echoed across every district and national standards fluttered proudly atop civic institutions as solemn vows were delivered before the Constituent Assembly. Observers noted the deep stillness that fell over the gallery as primary covenants were affirmed into the public ledger.

"At the stroke of the midnight hour, our long-suppressed spirit finds utterance," proclaimed the inaugural address to thunderous applause. Leaders appealed for peace, collective fortitude, and tireless service to the commonwealth.

Spontaneous celebrations continued well into the morning hours, with confections distributed freely throughout neighborhood quarters and civic buildings adorned in tricolor illumination. Delegations from across the globe extended formal felicitations to the presiding council.`,
    photoCaption: 'Celebratory gathering at the illuminated public square during midnight proceedings.',
    badge: 'Classic 3-Col Broadsheet',
    era: '1947 Historic',
  },
  {
    id: 'washington-post',
    name: 'The Washington Post',
    newspaperName: 'The Washington Post',
    tagline: 'Democracy Dies in Darkness • Capital Late Edition',
    date: 'Tuesday, June 17, 1972',
    headline: 'HISTORIC REVELATIONS SHAKE THE NATION AS INQUIRY EXPANDS',
    subheadline: 'COMMITTEE ACCELERATES SPECIAL PROBE INTO CAPITOL ARCHIVES',
    author: 'SPECIAL INVESTIGATIVE DESK',
    story: `In an unprecedented series of events that unfolded late yesterday evening, federal investigators disclosed startling new testimony before a packed senate hearing room.

Key witnesses detailed confidential archives documenting behind-the-scenes negotiations spanning several months. Observers noted the solemn stillness that swept across the gallery as primary documents were formally introduced into the public record.

"We stand at a critical juncture in our democratic traditions," remarked committee chairmen during an impromptu press conference on Capitol Hill. Additional witnesses are subpoenaed to testify later this week as the special inquiry broadens its scope across multiple departments.`,
    photoCaption: 'Senate hearing chamber as confidential archives were submitted into evidence.',
    badge: 'Gothic Broadsheet',
    era: '1972 Investigative',
  },
  {
    id: 'new-york-times',
    name: 'The New York Times',
    newspaperName: 'The New York Times',
    tagline: "All The News That's Fit To Print • Late City Edition",
    date: 'Monday, July 21, 1969',
    headline: 'MEN WALK ON MOON: ASTRONAUTS LAND ON PLAIN; COLLECT ROCKS, PLANT FLAG',
    subheadline: 'A POWDERY SURFACE IS PENETRATED AS MILLIONS WATCH LIVE ON EARTH',
    author: 'JOHN NOBLE WILFORD',
    story: `Men have landed and walked on the moon. Two Americans, astronauts of Apollo 11, steered their lunar module safely to a landing on a flat dusty plain in the Sea of Tranquillity yesterday.

Several hours later, one of them set foot on the lunar soil, the first human being to walk on another world of the solar system.

"That's one small step for man, one giant leap for mankind," the historic transmission crackled across 240,000 miles of space to a breathless world below. The explorers deployed scientific instruments and gathered geological samples under brilliant solar illumination.`,
    photoCaption: 'Descent module photographed on the lunar plain during landing maneuvers.',
    badge: 'Historic 3-Col Broadsheet',
    era: '1969 Apollo Era',
  },
  {
    id: 'the-guardian',
    name: 'The Guardian',
    newspaperName: 'The Guardian',
    tagline: 'First With The News • Manchester & London Editions',
    date: 'Saturday, May 8, 1945',
    headline: 'VICTORY IN EUROPE DECLARED: CONTINENT REJOICES AT PEACE',
    subheadline: 'UNCONDITIONAL SURRENDER ANNOUNCED ACROSS ALL ALLIED CAPITALS',
    author: 'SPECIAL DIPLOMATIC CORRESPONDENT',
    story: `The German surrender was formally confirmed early today by the Allied High Command. After five and a half years of total conflict, hostilities across the European theater have ceased.

Huge crowds gathered in civic squares throughout London, Paris, and Washington as broadcast declarations sounded through street loudspeakers. Civic buildings were adorned with national banners and street illumination returned after years of blackout regulations.

"Today we may allow ourselves a brief period of rejoicing, but we must remember that much remains to be done," stated the official address. Allied commissions will now turn to immediate humanitarian relief and reconstruction.`,
    photoCaption: 'Throngs of cheering citizens gather outside civic squares to mark the armistice.',
    badge: 'British Broadsheet',
    era: '1945 Archival',
  },
  {
    id: 'le-monde',
    name: 'Le Monde',
    newspaperName: 'Le Monde',
    tagline: 'Journal Quotidien d’Information • Fondé en 1944',
    date: 'Mardi, 10 Novembre 1989',
    headline: 'LE MUR DE BERLIN EST TOMBÉ DANS LA JOIE POPULAIRE',
    subheadline: 'OUVERTURE HISTORIQUE DES FRONTIÈRES APRÈS DES DÉCENNIES DE DIVISION',
    author: 'ENVOYÉ SPÉCIAL À BERLIN',
    story: `Le mur de Berlin s'est ouvert dans la nuit de jeudi à vendredi dans un élan de fraternité et de soulagement sans précédent. Des dizaines de milliers de citoyens ont franchi les points de contrôle sans que les gardes n'interviennent.

Des scènes de liesse ont marqué toute la nuit aux portes de Brandebourg et le long de la Bernauer Strasse, où des jeunes gens ont commencé à démolir des pans entiers de béton armé au moyen de pics et de marteaux.

« C'est un jour historique pour l'ensemble du continent européen », ont souligné les dirigeants réunis pour une session extraordinaire. Des trains spéciaux continuent d'acheminer des milliers de passagers émerveillés.`,
    photoCaption: 'La foule en liesse traversant les points de passage historiques au lever du jour.',
    badge: 'French Broadsheet',
    era: '1989 European',
  },
  {
    id: 'gulf-news',
    name: 'Gulf News',
    newspaperName: 'GULF NEWS',
    tagline: 'The Voice of the Region • Daily Broadsheet Edition',
    date: 'Wednesday, December 2, 1971',
    headline: 'UNION OF ARAB EMIRATES PROCLAIMED AS HISTORIC TREATY RATIFIED',
    subheadline: 'FEDERAL CHARTER SIGNED AT DUBAI CEREMONY FOSTERING ERA OF UNITY',
    author: 'REGIONAL DIPLOMATIC DESK',
    story: `The United Arab Emirates was officially proclaimed yesterday as rulers signed the historic federal treaty uniting the emirates under a single sovereign banner.

The ceremony, held in Dubai amidst grand civic reception, confirmed the election of the Supreme Council and the ratification of the provisional constitution.

Leaders affirmed their shared commitment to regional economic development, state-of-the-art educational institutions, and lasting stability. The national flag was raised for the first time outside the Union House to twenty-one-gun salutes.`,
    photoCaption: 'Official delegates assembled for the signing of the historic Union Agreement.',
    badge: 'Regional Broadsheet',
    era: '1971 Modern',
  },
  {
    id: 'japan-times',
    name: 'The Japan Times',
    newspaperName: 'The Japan Times',
    tagline: 'All the News Without Fear or Favor • Tokyo Edition',
    date: 'Sunday, October 11, 1964',
    headline: 'TOKYO OLYMPIC GAMES OPEN IN SPECTACULAR NATIONAL PAGEANTRY',
    subheadline: 'SACRED TORCH LIT AT NATIONAL STADIUM BEFORE RECORD GLOBAL AUDIENCE',
    author: 'TOKYO WIRE BUREAU',
    story: `The XVIII Olympiad was officially inaugurated yesterday afternoon under radiant blue skies before seventy-five thousand spectators at Tokyo National Stadium.

Over five thousand athletes representing ninety-three nations marched proudly in review as jet fighters traced the five Olympic rings in colored vapor across the stadium zenith.

The final torchbearer climbed the stadium steps to ignite the sacred cauldron, symbolizing the rebirth of international harmony and modern athletic fellowship. Events in twenty sports get underway tomorrow.`,
    photoCaption: 'Solemn lighting of the cauldron under brilliant autumn skies in Tokyo.',
    badge: 'Pacific Broadsheet',
    era: '1964 Broadsheet',
  },
  {
    id: 'korea-herald',
    name: 'The Korea Herald',
    newspaperName: 'The Korea Herald',
    tagline: 'Independent English Daily • Seoul Dispatch',
    date: 'Thursday, September 18, 1988',
    headline: 'SEOUL OLYMPICS OPEN WITH RECORD 160 NATIONS IN ATTENDANCE',
    subheadline: 'GLOBAL ATHLETIC FESTIVAL LAUNCHED WITH COLORFUL CEREMONIES',
    author: 'HERALD STAFF REPORTER',
    story: `The 24th Summer Olympiad opened yesterday in Seoul with a majestic pageant celebrating world peace, harmony, and global sportsmanship.

A record field of over thirteen thousand athletes and officials gathered at the Olympic Stadium, creating a vivid tapestry of international unity.

The ceremony featured traditional drumming, aerial displays, and the lighting of the Olympic flame. Organizers declared the games a historic triumph of cross-cultural partnership.`,
    photoCaption: 'Athletes marching into the Olympic Stadium during the grand opening ceremony.',
    badge: 'Asian Broadsheet',
    era: '1988 Broadsheet',
  },
  {
    id: 'vintage-custom',
    name: 'Custom Vintage Broadsheet',
    newspaperName: 'THE VINTAGE CHRONICLE',
    tagline: 'The Journal of Record & General Information • Established 1892',
    date: 'Wednesday, September 2, 2026',
    headline: 'YOUR EYE-CATCHING VINTAGE HEADLINE GOES HERE',
    subheadline: 'TYPE OR PASTE YOUR CUSTOM ARTICLE DETAILS BELOW TO RENDER LIVE',
    author: 'SPECIAL DISPATCH BYLINE',
    story: `Write your custom story here. You can craft humorous parodies, school history projects, commemorative wedding notices, or vintage clipping articles.

All text automatically formats with authentic Linotype justified columns, bold drop caps, and classic newspaper rules.

Upload an image above to see real vintage halftone reproduction and instant clipping layout adaptation!`,
    photoCaption: 'Custom photograph captured for today\'s front page dispatch.',
    badge: 'Custom Broadsheet',
    era: 'Fully Customizable',
  },
];

interface StudioIslandProps {
  lang?: string;
  initialTemplate?: string;
}

// Error Boundary to catch and DISPLAY the actual crash error
class StudioErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[StudioIsland Error Boundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: 'monospace', background: '#fee', border: '3px solid red', margin: 20, borderRadius: 8 }}>
          <h2 style={{ color: 'red', marginBottom: 16 }}>⚠️ Studio Crashed During Hydration</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: 14, color: '#333' }}>
            {this.state.error?.message}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: 11, color: '#888', marginTop: 12 }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function StudioIslandInner({
  lang = 'en',
  initialTemplate = 'times-of-india',
}: StudioIslandProps) {
  // Resolve initial preset purely from props (NO window access during render)
  // This prevents React hydration mismatches between SSR and client.
  const resolvePresetFromProp = (propId: string): TemplatePreset => {
    const matched = TEMPLATES.find(
      (t) =>
        t.id === propId ||
        t.name.toLowerCase() === propId.toLowerCase() ||
        t.id.replace(/-/g, '') === propId.toLowerCase().replace(/-/g, '')
    );
    return matched || TEMPLATES[0];
  };

  const initialPreset = resolvePresetFromProp(initialTemplate);

  // 1. Core State Management (100% Client-Side)
  const [selectedTemplate, setSelectedTemplate] = useState<string>(initialPreset.id);
  const [newspaperName, setNewspaperName] = useState<string>(initialPreset.newspaperName);
  const [tagline, setTagline] = useState<string>(initialPreset.tagline);
  const [date, setDate] = useState<string>(initialPreset.date);
  const [headline, setHeadline] = useState<string>(initialPreset.headline);
  const [subheadline, setSubheadline] = useState<string>(initialPreset.subheadline);
  const [author, setAuthor] = useState<string>(initialPreset.author);
  const [story, setStory] = useState<string>(initialPreset.story);
  const [photoCaption, setPhotoCaption] = useState<string>(initialPreset.photoCaption);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // UI States
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<string>('');

  // Ref attached directly to the outermost wrapper <div> of the newspaper template.
  // This is the exact node captured by the export engine (PNG/JPG/4K/PDF/Print).
  const previewRef = useRef<HTMLDivElement>(null);
  // Keep clippingRef as alias for backward-compat (same node)
  const clippingRef = previewRef;
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial state from URL params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const tmplParam = params.get('template') || params.get('preset');
      const headlineParam = params.get('headline');
      const storyParam = params.get('story') || params.get('body');
      const nameParam = params.get('name') || params.get('newspaperName');
      const dateParam = params.get('date');
      const taglineParam = params.get('tagline');

      if (tmplParam) {
        const found = TEMPLATES.find(
          (t) =>
            t.id === tmplParam ||
            t.name.toLowerCase() === tmplParam.toLowerCase() ||
            t.id.replace(/-/g, '') === tmplParam.toLowerCase().replace(/-/g, '')
        );
        if (found) {
          setSelectedTemplate(found.id);
          setNewspaperName(nameParam ?? found.newspaperName);
          setTagline(taglineParam ?? found.tagline);
          setDate(dateParam ?? found.date);
          setHeadline(headlineParam ?? found.headline);
          setSubheadline(found.subheadline);
          setAuthor(found.author);
          setStory(storyParam ?? found.story);
          setPhotoCaption(found.photoCaption);
          return;
        }
      }

      if (headlineParam) setHeadline(headlineParam);
      if (storyParam) setStory(storyParam);
      if (nameParam) setNewspaperName(nameParam);
      if (dateParam) setDate(dateParam);
      if (taglineParam) setTagline(taglineParam);
    } catch (e) {
      console.warn('Could not parse URL query parameters', e);
    }
  }, []);

  // Update URL search parameters without page reload
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams();
      if (selectedTemplate) params.set('template', selectedTemplate);
      if (headline) params.set('headline', headline);
      if (newspaperName) params.set('name', newspaperName);
      if (date) params.set('date', date);

      const qs = params.toString();
      const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    } catch {
      // Safe fallback
    }
  }, [selectedTemplate, headline, newspaperName, date]);

  // Handle "Select Newspaper Style" Dropdown Change
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextId = e.target.value;
    setSelectedTemplate(nextId);

    const preset = TEMPLATES.find((t) => t.id === nextId);
    if (preset) {
      setNewspaperName(preset.newspaperName);
      setTagline(preset.tagline);
      setDate(preset.date);
      setHeadline(preset.headline);
      setSubheadline(preset.subheadline);
      setAuthor(preset.author);
      setStory(preset.story);
      setPhotoCaption(preset.photoCaption);
      // Notice: imageUrl is preserved if the user uploaded one!
    }
  };

  // Reset current template to original preset values
  const handleReset = () => {
    const preset = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];
    setNewspaperName(preset.newspaperName);
    setTagline(preset.tagline);
    setDate(preset.date);
    setHeadline(preset.headline);
    setSubheadline(preset.subheadline);
    setAuthor(preset.author);
    setStory(preset.story);
    setPhotoCaption(preset.photoCaption);
    setImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Image Upload via FileReader
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

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Export Handlers — robust, uses previewRef and prevents spam-click freezing
  const handleExport = async (kind: 'png' | 'jpg' | 'svg' | 'pdf' | '4k') => {
    if (!previewRef.current) return;
    const targetEl = previewRef.current;
    setIsExporting(true);
    setExportFormat(kind.toUpperCase());
    try {
      switch (kind) {
        case 'png':
          await exportAsPNG(targetEl, false);
          break;
        case 'jpg':
          await exportAsJPG(targetEl);
          break;
        case '4k':
          // 4K export renders at 4x scale — may take a moment on large clippings
          await exportAsPNG(targetEl, true);
          break;
        case 'pdf':
          await exportAsPDF(targetEl);
          break;
        case 'svg':
          await downloadAsSVG(targetEl, `${selectedTemplate}-clipping-${Date.now()}.svg`);
          break;
      }
    } catch (err) {
      console.error(`Export failed for ${kind}:`, err);
    } finally {
      setIsExporting(false);
      setExportFormat('');
    }
  };

  // Print Handler — opens a print window containing only the clipping
  const handlePrint = () => {
    if (!previewRef.current) return;
    const targetEl = previewRef.current;
    printClipping(targetEl);
  };

  // Copy Shareable URL
  const handleShareLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Save to Local Drafts
  const handleSaveDraft = async () => {
    try {
      const targetEl = document.getElementById('previewPanelContainer');
      let thumbnail: string | null = null;
      if (targetEl) {
        thumbnail = await captureThumbnail(targetEl);
      }
      await saveToDrafts({
        template: selectedTemplate,
        newspaperName,
        tagline,
        date,
        headline,
        story,
        base64Image: imageUrl,
        thumbnail,
        photoCaption,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (e) {
      console.error('Draft save failed:', e);
    }
  };

  const activePreset =
    TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];

  return (
    <div className="w-full max-w-[1560px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6" id="studioRootContainer">
      {/* Studio Top Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-black/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary-pale text-ink-deep border border-black/5">
              Interactive Linotype Studio
            </span>
            <span className="text-xs font-semibold text-mute hidden md:inline">
              • Real-time Client-Side Synchronization
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight">
            Newspaper Clipping Studio
          </h1>
          <p className="font-body text-body text-xs sm:text-sm mt-0.5">
            Select a newspaper style, customize your headline & story, and preview broadsheet typography in real-time.
          </p>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-white hover:bg-canvas-soft text-ink font-semibold text-xs border border-black/15 shadow-2xs transition-colors cursor-pointer"
            title="Reset form to template defaults"
          >
            <svg className="w-3.5 h-3.5 text-mute" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
            <span>Reset</span>
          </button>

          {/* Save to Drafts */}
          <button
            type="button"
            onClick={handleSaveDraft}
            className={`inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer ${
              isSaved
                ? 'bg-positive-deep text-white'
                : 'bg-white hover:bg-canvas-soft text-ink border border-black/15'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>{isSaved ? 'Saved to Drafts!' : 'Save Draft'}</span>
          </button>

          {/* Share Link */}
          <button
            type="button"
            onClick={handleShareLink}
            className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-white hover:bg-canvas-soft text-ink font-semibold text-xs border border-black/15 shadow-2xs transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-mute" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>{isCopied ? 'Copied Link!' : 'Share'}</span>
          </button>

          {/* Mobile Quick Jump */}
          <a
            href="#livePreviewArea"
            className="lg:hidden inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-primary text-ink font-bold text-xs shadow-xs"
          >
            <span>Jump to Preview ↓</span>
          </a>
        </div>
      </div>

      {/* Main 2-Column Split Layout on Desktop / Stacked on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Interactive Editor Form & Controls                           */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col space-y-6">
          
          {/* Card 1: Template Selection (Dropdown) */}
          <div className="bg-white rounded-xl border border-black/10 shadow-xs p-5 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="templateSelector"
                className="block text-xs font-bold uppercase tracking-wider text-ink"
              >
                Select Newspaper Style
              </label>
              <span className="text-[11px] font-semibold text-mute">
                {activePreset.era}
              </span>
            </div>

            {/* The Select Newspaper Style Dropdown */}
            <select
              id="templateSelector"
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="w-full h-11 px-3.5 rounded-xl bg-canvas text-ink border-[1.5px] border-black/25 focus:border-ink focus:ring-2 focus:ring-primary/50 outline-none text-sm font-bold transition-all cursor-pointer shadow-2xs"
            >
              {TEMPLATES.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.name} ({tmpl.era})
                </option>
              ))}
            </select>

            {/* Quick Visual Badges */}
            <div className="mt-3 flex items-center gap-2 flex-wrap text-[11px] text-body">
              <span className="font-semibold text-mute">Active Layout:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-canvas-soft border border-black/10 font-bold text-ink text-[11px]">
                {activePreset.badge}
              </span>
              <span className="text-mute">•</span>
              <span className="italic text-mute">All typography updates in real-time</span>
            </div>
          </div>

          {/* Card 2: Masthead & Front Page Header Details */}
          <div className="bg-white rounded-xl border border-black/10 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <h2 className="font-display font-black text-sm uppercase tracking-wider text-ink flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-primary flex items-center justify-center text-ink text-[11px] font-black">1</span>
                <span>Masthead & Headers</span>
              </h2>
            </div>

            {/* Newspaper Title */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wide" htmlFor="inputNewspaperName">
                Newspaper Masthead Title
              </label>
              <input
                type="text"
                id="inputNewspaperName"
                value={newspaperName}
                onChange={(e) => setNewspaperName(e.target.value)}
                placeholder="e.g. THE TIMES OF INDIA"
                className="w-full h-11 px-3.5 rounded-lg bg-canvas text-ink border border-black/20 focus:border-ink focus:ring-1 focus:ring-ink outline-none text-sm font-bold uppercase transition-colors shadow-2xs"
              />
            </div>

            {/* Motto / Tagline */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wide" htmlFor="inputTagline">
                Motto / Sub-Masthead Tagline
              </label>
              <input
                type="text"
                id="inputTagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. LET TRUTH PREVAIL • ESTABLISHED 1838"
                className="w-full h-11 px-3.5 rounded-lg bg-canvas text-ink border border-black/20 focus:border-ink focus:ring-1 focus:ring-ink outline-none text-sm font-medium transition-colors shadow-2xs"
              />
            </div>

            {/* Date & Byline (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wide" htmlFor="inputDate">
                  Issue Date
                </label>
                <input
                  type="text"
                  id="inputDate"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. Friday, August 15, 1947"
                  className="w-full h-11 px-3.5 rounded-lg bg-canvas text-ink border border-black/20 focus:border-ink focus:ring-1 focus:ring-ink outline-none text-sm font-medium transition-colors shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wide" htmlFor="inputAuthor">
                  Byline / Author
                </label>
                <input
                  type="text"
                  id="inputAuthor"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. TIMES NEWS NETWORK"
                  className="w-full h-11 px-3.5 rounded-lg bg-canvas text-ink border border-black/20 focus:border-ink focus:ring-1 focus:ring-ink outline-none text-sm font-medium transition-colors shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Headline & Article Story */}
          <div className="bg-white rounded-xl border border-black/10 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <h2 className="font-display font-black text-sm uppercase tracking-wider text-ink flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-primary flex items-center justify-center text-ink text-[11px] font-black">2</span>
                <span>Headline & Article Story</span>
              </h2>
            </div>

            {/* Main Headline */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wide" htmlFor="inputHeadline">
                Main Banner Headline
              </label>
              <input
                type="text"
                id="inputHeadline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. NATION AWAKES TO FREEDOM AS HISTORIC BELLS TOLL AT MIDNIGHT"
                className="w-full h-11 px-3.5 rounded-lg bg-canvas text-ink border border-black/20 focus:border-ink focus:ring-1 focus:ring-ink outline-none text-sm font-extrabold uppercase transition-colors shadow-2xs"
              />
            </div>

            {/* Subheadline */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wide" htmlFor="inputSubheadline">
                Subheadline (Secondary Deck)
              </label>
              <input
                type="text"
                id="inputSubheadline"
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                placeholder="e.g. HISTORIC CONSTITUENT ASSEMBLY RATIFIES SOVEREIGN PROCLAMATION"
                className="w-full h-11 px-3.5 rounded-lg bg-canvas text-ink border border-black/20 focus:border-ink focus:ring-1 focus:ring-ink outline-none text-xs font-semibold uppercase transition-colors shadow-2xs"
              />
            </div>

            {/* Story Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-ink uppercase tracking-wide" htmlFor="inputStory">
                  Article Body Text
                </label>
                <span className="text-[11px] text-mute font-medium">
                  Separate paragraphs with blank lines
                </span>
              </div>
              <textarea
                id="inputStory"
                rows={8}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Type or paste your newspaper article text here..."
                className="w-full p-3.5 rounded-lg bg-canvas text-ink border border-black/20 focus:border-ink focus:ring-1 focus:ring-ink outline-none text-sm leading-relaxed font-serif transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Card 4: Photo Upload (Drag & Drop + FileReader) */}
          <div className="bg-white rounded-xl border border-black/10 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <h2 className="font-display font-black text-sm uppercase tracking-wider text-ink flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-primary flex items-center justify-center text-ink text-[11px] font-black">3</span>
                <span>Photo Upload & Halftone Filter</span>
              </h2>
            </div>

            {/* Dropzone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-primary bg-primary/10 scale-[1.01]'
                  : imageUrl
                  ? 'border-positive/50 bg-positive/5'
                  : 'border-black/20 bg-canvas-soft/50 hover:border-black/40 hover:bg-canvas-soft'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                id="studioPhotoFileInput"
              />

              {imageUrl ? (
                <div className="flex flex-col items-center gap-2.5">
                  <div className="relative max-w-[200px] max-h-[130px] rounded-lg overflow-hidden shadow-sm border border-black/20">
                    <img
                      src={imageUrl}
                      alt="Uploaded front-page clipping photo"
                      className="w-full h-full object-cover filter grayscale contrast-125"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-positive-deep flex items-center gap-1">
                      <span>✓ Loaded via FileReader</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-2.5 py-1 rounded-md bg-negative text-white text-[11px] font-bold hover:bg-negative-darkest transition-colors cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 py-2">
                  <div className="w-9 h-9 rounded-xl bg-primary/25 flex items-center justify-center text-ink text-base mb-1">
                    📷
                  </div>
                  <p className="font-bold text-xs sm:text-sm text-ink">
                    Drag & drop newspaper image here, or <span className="text-positive-deep underline">browse</span>
                  </p>
                  <p className="text-[11px] text-mute">
                    Processed 100% locally via client-side FileReader.
                  </p>
                </div>
              )}
            </div>

            {/* Photo Caption */}
            {imageUrl && (
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wide" htmlFor="inputPhotoCaption">
                  Photo Caption
                </label>
                <input
                  type="text"
                  id="inputPhotoCaption"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="e.g. Eyewitness photograph captured during midnight proceedings."
                  className="w-full h-10 px-3 rounded-lg bg-canvas text-ink border border-black/20 focus:border-ink focus:ring-1 focus:ring-ink outline-none text-xs font-medium transition-colors shadow-2xs"
                />
              </div>
            )}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Sticky Live Preview Section with Dynamic Wrapper            */}
        {/* ========================================================================= */}
        <div
          id="livePreviewArea"
          className="lg:col-span-7 xl:col-span-7 lg:sticky lg:top-20 self-start"
        >
          <div className="bg-white rounded-xl border border-black/10 shadow-lg p-4 sm:p-6 overflow-hidden flex flex-col">
            
            {/* Toolbar Above Live Preview */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-black/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-positive animate-pulse"></span>
                <span className="font-display font-black text-sm uppercase tracking-wider text-ink">
                  Live Broadsheet Preview
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-pale text-ink-deep font-bold text-[10px] uppercase border border-black/5">
                  {activePreset.name}
                </span>
              </div>

              {/* Export Actions Toolbar */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => { console.log("Button clicked!"); handleExport('png'); }}
                  className="px-3 py-1.5 rounded-xl bg-canvas-soft hover:bg-[#dbe0d8] text-ink font-bold text-xs border border-black/10 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Download high-resolution PNG"
                >
                  <span>{isExporting && exportFormat === 'PNG' ? 'Exporting...' : 'PNG'}</span>
                </button>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => { console.log("Button clicked!"); handleExport('jpg'); }}
                  className="px-3 py-1.5 rounded-xl bg-canvas-soft hover:bg-[#dbe0d8] text-ink font-bold text-xs border border-black/10 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Download JPEG format"
                >
                  <span>{isExporting && exportFormat === 'JPG' ? 'Exporting...' : 'JPG'}</span>
                </button>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => { console.log("Button clicked!"); handleExport('pdf'); }}
                  className="px-3 py-1.5 rounded-xl bg-canvas-soft hover:bg-[#dbe0d8] text-ink font-bold text-xs border border-black/10 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Export Archival PDF"
                >
                  <span>{isExporting && exportFormat === 'PDF' ? 'Exporting...' : 'PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl bg-canvas-soft hover:bg-[#dbe0d8] text-ink font-bold text-xs border border-black/10 transition-colors cursor-pointer"
                  title="Print clipping"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                </button>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => { console.log("Button clicked!"); handleExport('4k'); }}
                  className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-active text-ink font-black text-xs transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer ml-1"
                >
                  <svg className="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>{isExporting && exportFormat === '4K' ? 'Exporting...' : 'Download 4K'}</span>
                </button>
              </div>
            </div>

            {/* Exporting Loading Notification */}
            {isExporting && (
              <div className="mb-3 p-2.5 rounded-xl bg-primary-pale border border-primary/40 flex items-center justify-center gap-2 text-xs font-bold text-ink-deep animate-pulse">
                <div className="w-3.5 h-3.5 border-2 border-ink border-t-transparent rounded-full animate-spin"></div>
                <span>Rendering High-Resolution {exportFormat} Export...</span>
              </div>
            )}

            {/* The Live Newspaper Clipping Preview Panel */}
            <div className="w-full bg-[#edebe4] rounded-xl p-2 sm:p-4 border border-black/10 overflow-x-auto shadow-inner flex items-center justify-center min-h-[420px]">
              {/* Foolproof export target: hardcoded ID with solid white background — uses document.getElementById instead of useRef to survive Astro hydration */}
              <div id="newspaper-export-target" ref={previewRef} className="bg-white p-4 w-full h-full relative z-10">
                <PreviewPanel
                  template={selectedTemplate}
                  headline={headline}
                  subheadline={subheadline}
                  story={story}
                  imageUrl={imageUrl}
                  newspaperName={newspaperName}
                  tagline={tagline}
                  date={date}
                  author={author}
                  photoCaption={photoCaption}
                />
              </div>
            </div>

            {/* Preview Bottom Info Strip */}
            <div className="mt-3 pt-3 border-t border-black/10 flex flex-wrap items-center justify-between text-[11px] text-mute">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-positive"></span>
                <span>Dynamic Broadsheet Layout Active: <strong>{activePreset.name}</strong></span>
              </span>
              <span className="font-semibold text-ink">
                100% Client-Side React Island
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// Wrap in Error Boundary so crashes show the error message instead of white screen
export default function StudioIsland(props: StudioIslandProps) {
  return (
    <StudioErrorBoundary>
      <StudioIslandInner {...props} />
    </StudioErrorBoundary>
  );
}
