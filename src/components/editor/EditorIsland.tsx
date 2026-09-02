import React, { useState, useEffect, useRef } from 'react';
import PreviewPanel from './PreviewPanel';
import RecentClippingsDrawer from './RecentClippingsDrawer';
import {
  saveToDrafts,
  captureThumbnail,
  downloadAsPNG,
  downloadAsJPG,
  downloadAsSVG,
  downloadAsPDF,
  getRecentClippings,
  type ClippingRecord,
} from '../../utils/exportAndStorage';

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
    newspaperName: 'THE TIMES OF INDIA',
    tagline: 'LET TRUTH PREVAIL • ESTABLISHED 1838 • NEW DELHI EDITION',
    date: 'Friday, August 15, 1947',
    headline: 'NATION AWAKES TO FREEDOM AS HISTORIC BELLS TOLL AT MIDNIGHT',
    story: `Amidst tumultuous scenes of rejoicing and jubilation that surpassed anything witnessed in modern history, millions of citizens poured into illuminated public squares last night to welcome the dawn of independence.

Conch shells echoed across every district and national flags fluttered proudly atop civic institutions as solemn vows were delivered before the Constituent Assembly. Leaders called for peace, fortitude, and tireless service to the collective future.

"At the stroke of the midnight hour, our long-suppressed spirit finds utterance," proclaimed the inaugural address. Spontaneous celebrations continued well into the morning hours, with sweets distributed freely throughout neighborhoods.`,
    fontStyle: 'serif',
  },
  {
    id: 'global-times',
    name: 'Global Times',
    newspaperName: 'GLOBAL TIMES',
    tagline: 'DISCOVERING DIVERSE PERSPECTIVES • BEIJING DISPATCH',
    date: 'Wednesday, September 2, 2026',
    headline: 'GROUNDBREAKING MULTILATERAL ACCORD RATIFIED IN SUMMIT BREAKTHROUGH',
    story: `Delegates concluded an exhaustive seventy-two-hour high-level summit in Beijing yesterday, formally ratifying a comprehensive economic and industrial cooperation framework.

The consensus blueprint outlines substantial mutual investments in renewable green infrastructure, digital trade arteries, and streamlined cross-border transit logistics. International analysts characterized the outcome as a pivotal stabilizer for global supply resilience.

"Constructive engagement and reciprocal pragmatism laid the bedrock for today's breakthrough," noted the chief coordinator during the closing plenary. Working groups will convene quarterly to monitor milestone benchmarks.`,
    fontStyle: 'modern',
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

  // UI & Interaction States
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [draftCount, setDraftCount] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update draft count on load
  const refreshDraftCount = async () => {
    try {
      const items = await getRecentClippings(50);
      setDraftCount(items.length);
    } catch {
      // safe fallback
    }
  };

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

      if (templateParam) {
        const found = TEMPLATES.find((t) => t.id === templateParam);
        if (found) {
          setSelectedTemplate(templateParam);
          setNewspaperName(nameParam ?? found.newspaperName);
          setTagline(taglineParam ?? found.tagline);
          setDate(dateParam ?? found.date);
          setHeadline(headlineParam ?? found.headline);
          setStory(storyParam ?? found.story);
          setIsInitialized(true);
          refreshDraftCount();
          return;
        }
      }

      if (nameParam) setNewspaperName(nameParam);
      if (dateParam) setDate(dateParam);
      if (headlineParam) setHeadline(headlineParam);
      if (storyParam) setStory(storyParam);
      if (taglineParam) setTagline(taglineParam);
    } catch {
      // safe fallback
    }

    setIsInitialized(true);
    refreshDraftCount();
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

      const queryString = params.toString();
      const targetUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
      window.history.replaceState(null, '', targetUrl);
    } catch {
      // safe fallback
    }
  }, [isInitialized, selectedTemplate, newspaperName, date, headline, story, tagline]);

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

  // 3. Save to Drafts Function using Dexie.js
  const handleSaveToDrafts = async () => {
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

      setSavedSuccess(true);
      refreshDraftCount();
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save to drafts:', err);
    }
  };

  // Restore session from Dexie.js
  const handleRestoreSession = (record: ClippingRecord) => {
    setSelectedTemplate(record.template);
    setNewspaperName(record.newspaperName);
    setTagline(record.tagline || '');
    setDate(record.date);
    setHeadline(record.headline);
    setStory(record.story);
    if (record.base64Image) {
      setImageUrl(record.base64Image);
    }
    if (record.photoCaption) {
      setPhotoCaption(record.photoCaption);
    }
  };

  // 1. Export Engine Handlers targeting PreviewPanel <div>
  const handleExport = async (format: 'png' | 'jpg' | 'svg' | 'pdf') => {
    const targetEl = document.getElementById('previewPanelContainer');
    if (!targetEl) return;

    setIsExporting(true);
    setExportFormat(format.toUpperCase());

    const filename = `${selectedTemplate}-clipping-${Date.now()}.${format}`;

    try {
      switch (format) {
        case 'png':
          await downloadAsPNG(targetEl, filename);
          break;
        case 'jpg':
          await downloadAsJPG(targetEl, filename);
          break;
        case 'svg':
          await downloadAsSVG(targetEl, filename);
          break;
        case 'pdf':
          await downloadAsPDF(targetEl, filename);
          break;
      }
    } catch (err) {
      console.error(`Export failed for format ${format}:`, err);
    } finally {
      setIsExporting(false);
      setExportFormat('');
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
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* My Recent Clippings Drawer Button */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex items-center gap-2 h-10 px-3.5 rounded-xl bg-white hover:bg-canvas-soft text-ink font-semibold text-xs border border-black/15 shadow-sm transition-colors relative"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>My Recent Clippings</span>
            {draftCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-primary text-ink text-[10px] font-black">
                {draftCount}
              </span>
            )}
          </button>

          {/* Save to Drafts (Dexie.js) */}
          <button
            type="button"
            onClick={handleSaveToDrafts}
            className={`inline-flex items-center gap-1.5 h-10 px-4 rounded-xl font-bold text-xs shadow-sm transition-all ${
              savedSuccess
                ? 'bg-positive-deep text-white'
                : 'bg-primary hover:bg-primary-active text-ink'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>{savedSuccess ? 'Saved to Drafts!' : 'Save to Drafts'}</span>
          </button>

          {/* Share Parameters Link */}
          <button
            type="button"
            onClick={handleShareLink}
            className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-white hover:bg-canvas-soft text-ink font-semibold text-xs border border-black/15 shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>{copiedUrl ? 'Copied URL!' : 'Share'}</span>
          </button>

          <a
            href="#livePreviewArea"
            className="lg:hidden inline-flex items-center gap-2 h-10 px-3.5 rounded-xl bg-primary text-ink font-bold text-xs shadow-sm"
          >
            <span>Jump to Preview ↓</span>
          </a>
        </div>
      </div>

      {/* 1. Layout: 2-Column Split Screen on Desktop / Stacked on Mobile */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT COLUMN: Scrollable Form Controls */}
        <div className="w-full lg:w-[46%] xl:w-[42%] flex flex-col gap-6 lg:overflow-y-auto lg:max-h-[calc(100vh-130px)] lg:pr-2">
          {/* Card 1: Newspaper Identity & Template Selector */}
          <div className="card-content bg-white rounded-xl p-6 shadow-sm border border-black/10">
            <h2 className="font-display font-black text-lg text-ink mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-ink text-xs font-bold">1</span>
              <span>Newspaper Template & Masthead</span>
            </h2>

            {/* Template Dropdown */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wide">
                Select Global Newspaper Template
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
                placeholder="e.g. The Washington Post"
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
                placeholder="e.g. Democracy Dies in Darkness"
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
                placeholder="e.g. Friday, August 15, 1947"
                className="w-full h-11 px-3.5 bg-canvas rounded-md border-[1.5px] border-black/20 text-ink text-sm focus:border-ink focus:ring-4 focus:ring-primary/40 outline-none transition-all"
              />
            </div>
          </div>

          {/* Card 2: Headline & Story Textarea */}
          <div className="card-content bg-white rounded-xl p-6 shadow-sm border border-black/10">
            <h2 className="font-display font-black text-lg text-ink mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-ink text-xs font-bold">2</span>
              <span>Headline & Article Story</span>
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
                placeholder="e.g. ALIENS SIGHTED OVER CAPITAL"
                className="w-full h-11 px-3.5 bg-canvas rounded-md border-[1.5px] border-black/20 text-ink text-sm font-bold tracking-tight focus:border-ink focus:ring-4 focus:ring-primary/40 outline-none transition-all"
              />
            </div>

            {/* Story Textarea */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1.5 uppercase tracking-wide">
                Article Body Text (Paragraphs separated by line breaks)
              </label>
              <textarea
                rows={7}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Type or paste your newspaper article text here..."
                className="w-full p-3.5 bg-canvas rounded-md border-[1.5px] border-black/20 text-ink text-sm leading-relaxed focus:border-ink focus:ring-4 focus:ring-primary/40 outline-none transition-all font-serif"
              />
            </div>
          </div>

          {/* Card 3: Drag-and-Drop Image Upload Field (FileReader) */}
          <div className="card-content bg-white rounded-xl p-6 shadow-sm border border-black/10">
            <h2 className="font-display font-black text-lg text-ink mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-ink text-xs font-bold">3</span>
              <span>Photo Upload (Drag & Drop)</span>
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
                  <div className="relative max-w-[220px] max-h-[140px] rounded-lg overflow-hidden shadow-md border border-black/20">
                    <img
                      src={imageUrl}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover filter grayscale contrast-125"
                    />
                  </div>
                  <p className="text-xs font-bold text-positive-deep flex items-center gap-1">
                    <span>✓ Image Loaded via FileReader</span>
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageUrl(null);
                    }}
                    className="px-3 py-1 rounded-pill bg-negative-deep text-white text-xs font-bold hover:bg-negative-darkest transition-colors"
                  >
                    Remove Photo
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center text-ink text-lg mb-1">
                    📷
                  </div>
                  <p className="font-semibold text-sm text-ink">
                    Drag & Drop image here, or <span className="text-positive-deep underline">Browse</span>
                  </p>
                  <p className="text-xs text-mute">
                    Local FileReader processing. Image adapts across newspaper columns.
                  </p>
                </div>
              )}
            </div>

            {imageUrl && (
              <div className="mt-4">
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
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Live Preview + Export Bar */}
        <div
          id="livePreviewArea"
          className="w-full lg:w-[54%] xl:w-[58%] lg:sticky lg:top-20 self-start"
        >
          <div className="card-content bg-white rounded-xl p-4 sm:p-6 shadow-xl border border-black/10">
            {/* Live Preview Header & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-black/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-positive animate-pulse"></span>
                <span className="font-display font-black text-sm uppercase tracking-wider text-ink">
                  Sticky Live Preview
                </span>
                <span className="px-2 py-0.5 rounded-pill bg-canvas-soft text-[10px] font-bold text-ink uppercase">
                  {selectedTemplate}
                </span>
              </div>

              {/* 1. Export Engine Toolbar: PNG, JPG, SVG, PDF */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => handleExport('png')}
                  className="px-3 py-1.5 rounded-lg bg-canvas-soft hover:bg-black/10 text-ink font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <span>PNG</span>
                </button>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => handleExport('jpg')}
                  className="px-3 py-1.5 rounded-lg bg-canvas-soft hover:bg-black/10 text-ink font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <span>JPG</span>
                </button>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => handleExport('svg')}
                  className="px-3 py-1.5 rounded-lg bg-canvas-soft hover:bg-black/10 text-ink font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <span>SVG</span>
                </button>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => handleExport('pdf')}
                  className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-active text-ink font-black text-xs transition-all shadow-sm disabled:opacity-50 flex items-center gap-1"
                >
                  <span>PDF</span>
                </button>
              </div>
            </div>

            {/* Exporting Loading Overlay */}
            {isExporting && (
              <div className="mb-3 p-2.5 rounded-lg bg-primary-pale border border-primary/40 flex items-center justify-center gap-2 text-xs font-bold text-ink-deep animate-pulse">
                <div className="w-3.5 h-3.5 border-2 border-ink border-t-transparent rounded-full animate-spin"></div>
                <span>Rendering High-Resolution {exportFormat} Export...</span>
              </div>
            )}

            {/* The Actual Rendered Newspaper Clipping */}
            <PreviewPanel
              template={selectedTemplate}
              date={date}
              headline={headline}
              story={story}
              imageUrl={imageUrl}
              newspaperName={newspaperName}
              tagline={tagline}
              photoCaption={photoCaption}
            />

            <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs text-mute">
              <span>All exports rendered 100% client-side via html2canvas & jsPDF</span>
              <span className="font-bold text-ink">300 DPI Archival Output</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. My Recent Clippings Drawer */}
      <RecentClippingsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectClipping={handleRestoreSession}
      />
    </div>
  );
}
