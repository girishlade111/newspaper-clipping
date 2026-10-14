# AUDIT & CONTEXT REPORT — "The Vintage Press" Newspaper Clipping Tool

**Repository:** `newspaper-clipping/` (Astro 5, package name `newspaper-clipping-generator` v1.0.0)
**Audit date:** 2026-10-13
**Build verification:** `npm ci` → `npm run build` completes successfully — **90 pages built in ~9.5 s, zero build errors/warnings.**
**Scope:** every file in `src/`, all root configs, `public/`, and the generated `dist/` output were read line-by-line. No source file was modified.

---

## 1. Project Overview & Tech Stack

### 1.1 App Purpose

"The Vintage Press" is a **100 % client-side vintage newspaper clipping generator** with a multilingual marketing/blog site attached. It has **two entirely separate and mutually inconsistent editors**:

| | **Studio** (`/studio`, `/[lang]/studio`) | **Generator** (`/generator`, `/[lang]/generator`) |
|---|---|---|
| Implementation | React 19 island + 8 DOM/CSS newspaper templates | Vanilla `<canvas>` + custom Canvas2D draw engine |
| Export | `html2canvas` → PNG/JPG/PDF/Print | `canvas.toDataURL` → PNG/clipboard/print |
| Presets | 9 hand-written React presets (`TEMPLATES`) | 5 `NewspaperPreset` objects (`PRESETS`) |
| Realism | CSS gradients, `filter: grayscale/contrast`, `mix-blend-multiply` grain | Procedural grain, aging gradient, creases, coffee stain, halftone dither |
| Deep links | `?template=` handled client-side | `?preset=` ignored (see Bug C-04) |
| Persistence | IndexedDB (Dexie) drafts | none |

The **landing page (`/`) and Navbar CTA point to `/studio`**. The **Footer links and blog CTAs point to `/generator`**. `/editor` 301-redirects to `/studio`.

It is *not* a "crop a scanned newspaper page" tool — it **synthesises** newspaper front pages from user-entered text + an optional uploaded photo.

### 1.2 Core Tech Stack

| Layer | Choice | Evidence |
|---|---|---|
| Framework | **Astro `^5.3.0`**, static output (no adapter) | `astro.config.mjs:102-103`, no `output` key ⇒ `static` |
| UI islands | **React `^19.2.8`** via `@astrojs/react ^4.4.2` | `package.json:16,24-25` |
| Styling | **Tailwind `^3.4.19`** via `@astrojs/tailwind ^6.0.2` + hand-written vanilla CSS (`design-tokens.css`, `typography.css`, `global.css`, `generator.css`) | `tailwind.config.mjs`, `src/styles/*` |
| State (Studio) | 14 × `useState` in a single component — **no store library, no Context, no reducer** | `StudioIsland.tsx:272-296` |
| State (Generator) | One mutable module-scope object `currentOptions` read straight from the DOM | `GeneratorApp.astro:359-362` |
| Persistence | **Dexie `^4.4.5`** → IndexedDB DB `NewspaperAppDB`, store `clippingHistory` (`'++id, template, headline, timestamp'`) | `exportAndStorage.ts:20-39` |
| Raster export | **html2canvas `^1.4.1`** (dynamic `import()`), **jsPDF `^4.2.1`** (dynamic) | `exportEngine.ts:152,367` |
| Canvas export | Native Canvas2D + `getImageData/putImageData` pixel loop | `generator-engine.ts:308-343` |
| Share | `navigator.clipboard.writeText` / `ClipboardItem` PNG | `StudioIsland.tsx:448`, `generator-engine.ts:540` |
| Confetti | `canvas-confetti ^1.9.4` (static import, generator page only) | `GeneratorApp.astro:349` |
| Content | Astro Content Collections (`type: 'content'`), 27 markdown posts across 6 languages | `src/content/config.ts`, `src/content/blog/{en,es,fr,de,hi,ja}` |
| i18n | Hand-rolled dictionary (`src/i18n/ui.ts`, 1656 lines) + `astro.config.mjs i18n` routing | 11 locales |
| Fonts | Google Fonts, 3 critical families render-blocking, 10 vintage families `media="print"` + `onload` swap | `Layout.astro:106-126`, mirrored in `Seo.astro:51-65` |
| SEO | Canonical + 11 hreflang alternates + `x-default` + JSON-LD (WebApplication/Article/FAQPage/BreadcrumbList) + XSL-styled sitemap | `Layout.astro:70-77`, `Seo.astro:100-132` |

### 1.3 Rendering Strategy

**100 % Static Site Generation (SSG), zero SSR, zero server endpoints.**

- `astro.config.mjs` has no `output: 'server'`, no adapter.
- Every `.astro` page uses explicit `getStaticPaths()` for `[lang]`/`[lang]/blog/[...slug]`.
- **Only one `client:*` directive exists in the entire project:**
  `src/pages/studio.astro:17` and `src/pages/[lang]/studio.astro:26` → `<StudioIsland client:only="react" … />`.
  Verified against built output: `dist/studio/index.html` contains `<astro-island client="only">` and **does not contain `newspaper-export-target` or `previewPanelContainer`** — i.e. the Studio ships as an empty shell and is 100 % client-rendered. This is correct for an editor (no hydration mismatch) but causes a blank first paint + layout shift (see UI/UX §6).
- All other interactivity (Navbar dropdown, mobile menu, blog category filter, the whole Generator) is **vanilla `<script>` inside `.astro` files**, statically bundled.
- `rss.xml.ts` + `[lang]/rss.xml.ts` are prerendered `GET` endpoints (Astro `λ` in build log).
- `/generator` (Canvas) is **fully static HTML + one bundled script** — no framework.

---

## 2. Directory Structure & File-by-File Breakdown

### 2.1 Tree

```
newspaper-clipping/
├── astro.config.mjs                 (213 L) integrations, i18n, redirects, sitemap-XSL alias plugin
├── package.json                     (35 L)
├── tailwind.config.mjs              (82 L)  colour tokens + 24 vintage font-family aliases
├── tsconfig.json                    (11 L)  astro/tsconfigs/strict, @/* → src/*
├── README.md                        (119 L) ⚠ stale (see Bug M-03)
├── DESIGN.md                        Wise-brand design system spec (contains literal "{colors.*}" placeholders)
├── public/
│   ├── favicon.svg
│   ├── images/hero-image.jpg        ← used by index.astro
│   ├── images/usecase-image.jpg     ← used by index.astro
│   ├── hero-image.jpg|.png          ← DUPLICATE, unreferenced (~3.8 MB)
│   ├── usecase-image.jpg|.png       ← DUPLICATE, unreferenced (~4.5 MB)
│   ├── image3.jpg|.png              ← unreferenced, unreferenced (~4.6 MB)
│   ├── robots.txt                   ⚠ points at the wrong domain (Bug S-02)
│   └── sitemap-style.xsl            (22 KB) human-readable sitemap renderer
└── src/
    ├── components/
    │   ├── Navbar.astro                          (281 L)
    │   ├── blog/BlogCard.astro                   (129 L)
    │   ├── common/Footer.astro                   (201 L)
    │   ├── common/Seo.astro                      (133 L)
    │   ├── common/Toast.astro                    ( 72 L)
    │   ├── editor/EditorIsland.tsx               (686 L) ★ DEAD — never imported
    │   ├── editor/PreviewPanel.tsx               (670 L) template switchboard
    │   ├── editor/RecentClippingsDrawer.tsx      (274 L) Dexie history drawer
    │   ├── generator/GeneratorApp.astro          (618 L) Canvas editor shell + all JS
    │   ├── studio/StudioIsland.tsx               (1014 L) main React editor
    │   └── templates/
    │       ├── index.ts                          (26 L) ★ DEAD barrel
    │       ├── NewYorkTimesTemplate.tsx          (268 L)
    │       ├── NYTTemplate.tsx                   (218 L) ★ DEAD
    │       ├── TimesOfIndiaTemplate.tsx          (259 L) ★ DEAD (only via dead barrel)
    │       ├── TOITemplate.tsx                   (263 L)
    │       ├── WashingtonPostTemplate.tsx        (231 L)
    │       ├── GulfNewsTemplate.tsx              (253 L)
    │       ├── JapanTimesTemplate.tsx            (270 L)
    │       ├── KoreaHeraldTemplate.tsx           (266 L)
    │       ├── GuardianTemplate.tsx              (272 L)
    │       └── LeMondeTemplate.tsx               (261 L)
    ├── content/
    │   ├── config.ts                   (22 L)  zod schema for `blog`
    │   └── blog/{en:6, es:4, fr:4, de:4, hi:4, ja:1}/*.md
    ├── i18n/
    │   ├── ui.ts                       (1656 L) languages map + 11 dictionaries
    │   └── utils.ts                    ( 45 L) useTranslations / getRelativeLocaleUrl
    ├── layouts/
    │   ├── Layout.astro                (249 L) Landing-page layout (rich SEO, own :root tokens)
    │   └── BaseLayout.astro            ( 52 L) Thin wrapper → Seo + Navbar + Footer + Toast
    ├── pages/
    │   ├── 404.astro  about.astro  index.astro  generator.astro  studio.astro  templates.astro
    │   ├── rss.xml.ts
    │   ├── blog/index.astro  blog/[...slug].astro
    │   └── [lang]/ index.astro about.astro generator.astro studio.astro templates.astro
    │                 rss.xml.ts  blog/index.astro  blog/[...slug].astro
    ├── scripts/
    │   ├── generator-engine.ts         (546 L) NewspaperEngine Canvas2D class
    │   └── presets.ts                  (159 L) 5 NewspaperPreset objects
    ├── styles/
    │   ├── design-tokens.css (85) typography.css (126) global.css (335) generator.css (269)
    └── utils/
        ├── exportAndStorage.ts         (239 L) Dexie + legacy downloadAs* helpers
        ├── exportEngine.ts             (449 L) html2canvas clone/render pipeline
        └── langDetect.ts               (160 L) client locale auto-redirect
```

### 2.2 Per-File Detail

#### `astro.config.mjs`
- **Responsibility:** integration wiring, i18n routing, `/editor`→`/studio` 301s, sitemap `lastmod` resolver, custom `sitemap-xml-alias` integration.
- **Key exports:** default `defineConfig({...})`.
- **Notable internals:** `getBlogDateMap()` (L15-40) memoised `fs.readdirSync` scan of `src/content/blog`; `resolveLastmod()` (L46-99) URL→file mtime mapping; inline integration `sitemap-xml-alias` (L135-176) with `astro:server:setup` middleware + `astro:build:done` post-processing.
- **Dependencies:** `node:fs`, `node:path`, `node:url`, `@astrojs/{react,tailwind,mdx,sitemap}`.
- **⚠ Uses bare `path.resolve('src/…')` / `path.resolve('dist')` → CWD-dependent (Bug M-02).**

#### `src/components/studio/StudioIsland.tsx` (main editor)
- **Responsibility:** everything about `/studio` — template dropdown, masthead/date/byline/headline/deck/body/caption inputs, drag-drop photo, live preview, URL sync, export toolbar, drafts.
- **Key exports:** `interface TemplatePreset` (L17-30), `const TEMPLATES: TemplatePreset[]` (L32-197, 9 presets), `default StudioIsland` (L1008-1014).
- **Internal:** `class StudioErrorBoundary` (L216-249); `function StudioIslandInner({lang, initialTemplate})` (L251); `GENERATOR_TO_STUDIO_TEMPLATE` alias table (L201-207).
- **State (L272-296):** `selectedTemplate, newspaperName, tagline, date, headline, subheadline, author, story, photoCaption, imageUrl, isDragging, isExporting, exportFormat, isCopied, isSaved, isDrawerOpen, draftCount` + refs `previewRef`, `fileInputRef`.
- **Effects:** (1) L299-340 read `?template|preset|headline|story|body|name|newspaperName|date|tagline`; (2) L343-358 `history.replaceState` write-back; (3) L464-466 draft count.
- **Handlers:** `handleTemplateChange` L361, `handleReset` L380, `processImageFile` L395, `handleDrop/DragOver/DragLeave` L406-422, `handleFileInputChange` L424, `handleRemovePhoto` L430, `handlePrint` L439, `handleShareLink` L446, `refreshDraftCount` L454, `handleRestoreSession` L469, `handleSaveDraft` L486.
- **Depends on:** `editor/PreviewPanel`, `editor/RecentClippingsDrawer`, `utils/exportAndStorage` (saveToDrafts, captureThumbnail, getRecentClippings, ClippingRecord), `utils/exportEngine` (exportAsPNG/JPG/PDF, printClipping).
- **Export target:** `<div id="newspaper-export-target" ref={previewRef}>` at L965.

#### `src/components/editor/PreviewPanel.tsx`
- **Responsibility:** prop-normalising template switchboard. Lowercases `template` and substring-matches 9 newspaper identities (L44-53), returns one of 8 imported React templates; otherwise falls through to an inline "default broadsheet" JSX block (L220-668).
- **Key exports:** `interface PreviewPanelProps` (L11-24), `default PreviewPanel`.
- **Critical structure:** if a named template matches, the function **returns at L170-180** — which makes the inline `isTOI` (L235-373), `isWaPo` (L378-478) and `isGlobalTimes` (L483-574) blocks **unreachable dead code** (~340 lines). Only the `!isTOI && !isWaPo && !isGlobalTimes` fallback (L579-666) can render.
- **Depends on:** 8 templates under `templates/`.

#### `src/components/editor/RecentClippingsDrawer.tsx`
- **Responsibility:** right-side modal listing IndexedDB drafts, restore / delete / clear-all with a two-step confirm.
- **Props:** `{ isOpen, onClose, onSelectClipping }`.
- **State:** `clippings[]`, `loading`, `confirmClear`; ref `confirmTimeoutRef` (4 s auto-cancel).
- **Depends on:** `utils/exportAndStorage` (`getRecentClippings`, `deleteClipping`, `clearAllClippings`).
- **No focus trap, no Escape handler, no body scroll lock** (see §6).

#### `src/components/editor/EditorIsland.tsx` ★ DEAD
- **Responsibility:** an *earlier* version of the Studio editor (5 templates incl. `global-times`/`daily-chronicle`, SVG export, `fontStyle`).
- **Verified dead:** no file imports it (grep across `src/**/*.{ts,tsx,astro}`). 686 lines.
- Kept alive only by the fact that `PreviewPanel` still supports its `global-times` template branch.

#### `src/utils/exportEngine.ts`
- **Responsibility:** the DOM→PNG/JPG/PDF/Print pipeline used by Studio.
- **Public API:** `exportAsPNG(element?: HTMLElement|boolean, is4K=false)`, `exportAsJPG(element?)`, `exportAsImage(element?, format?, is4K?)` ★dead★, `exportAsPDF(element?)`, `printClipping(element?)`.
- **Internals:** `getOnClone()` L23-68, `sanitizePristineClone()` L74-101, `createOffscreenContainer()` L103-118 (fixed `width:1000px`), `BASE_FILENAME='vintage-newspaper-clipping'` L16.
- **Global augmentation:** `declare global { interface Window { showToast } }` L10-14.
- **Depends on:** dynamic `import('html2canvas')`, dynamic `import('jspdf')`, the Toast component's `window.showToast`.

#### `src/utils/exportAndStorage.ts`
- **Responsibility:** Dexie/IndexedDB drafts + a *second, legacy* html2canvas download path used only by the dead EditorIsland.
- **Public API:** `ClippingRecord` (L7-18), `saveToDrafts`, `getRecentClippings`, `deleteClipping`, `clearAllClippings`, `captureThumbnail`, `downloadAsPNG`, `downloadAsJPG`, `downloadAsSVG`, `downloadAsPDF`.
- **`getDatabase()` L22-39** lazily `import('dexie')`, DB `NewspaperAppDB`, table `clippingHistory: '++id, template, headline, timestamp'`, memoised in `dbInstance`.
- **`ClippingRecord` has no `author` and no `subheadline` field** → both are silently dropped on save (Bug C-02).

#### `src/components/generator/GeneratorApp.astro`
- **Responsibility:** static markup for the Canvas editor (4 tabs: Content / Style / Photo / Presets) **plus all of its JavaScript** in a single `<script>` (L346-618).
- **Props:** `{ lang, initialPresetId='breaking-1920', isCompact=false }`.
- **Notable:** `resetBtn` (L27-33) has **no listener** (Bug F-01); `isCompact` / `.compact-mode` is never defined in `generator.css` (dead prop); `defaultPreset` is used only for the `value=` attributes while `currentOptions` is hard-seeded from `PRESETS[0]` (Bug C-04).
- **Listeners (L418-428):** every input gets **both** `input` and `change` → `updateFromUI()` → `triggerRender()` with **no debounce/throttle** (Bug P-01).

#### `src/scripts/generator-engine.ts`
- **Responsibility:** `class NewspaperEngine` — pure Canvas2D newspaper compositor.
- **`ENGINE_CONFIG` L7-14:** `baseWidth:800, baseHeight:1000, photoH:240`; `render()` uses `scale = 1.5` ⇒ a 1200×1500 backing bitmap.
- **Render order (L32-73):** `drawPaperBackground` → `drawTornEdgesOverlay` (if `tornEdges`) → `drawMasthead` → `drawHeadlines` → `drawPhoto` (if `userImage`) → `drawBodyText` → `drawCreaseLines` / `drawCoffeeStain`.
- **Filter pipeline L308-343:** per-pixel `getImageData` loop implementing `halftone` (threshold 128 → 2-level binarisation, *not* a real dot screen), `sepia`, `contrast` (factor 1.6), `grain` (`Math.random()` noise ±22).
- **Public API:** `render(options)`, `download(filename, format)`, `copyToClipboard()`; private `wrapText()` L503-524.
- **Depends on:** `scripts/presets` (`NewspaperPreset` type only).

#### `src/scripts/presets.ts`
- **Responsibility:** `interface NewspaperPreset` (24 fields) + `PRESETS` (5 objects: `breaking-1920`, `wanted-wild-west`, `moon-landing-1969`, `wedding-extra`, `tabloid-ufo`).
- Consumed by `templates.astro`, `[lang]/templates.astro`, `GeneratorApp.astro`.

#### `src/layouts/Layout.astro` vs `src/layouts/BaseLayout.astro`
Two parallel layout systems with **duplicated design tokens** (`--colors-*` in `Layout.astro:184-214` vs `--color-*` in `design-tokens.css:7-85`) and duplicated SEO logic (`Layout.astro` hand-rolls canonical/hreflang/OG/Twitter; `BaseLayout` delegates to `Seo.astro`). `Layout` also re-declares `.btn-primary`, `.hero-band`, `.card-content` (L216-248) that already exist in `global.css:127-208` — **the Layout copy wins by cascade order and is the one that applies on landing pages** (Bug M-01).

#### `src/utils/langDetect.ts`
- **Responsibility:** `matchSupportedLocale()`, `detectUserLanguage()`, `autoRedirectRoot()`; **auto-runs `autoRedirectRoot()` at module evaluation** (L158-160).
- Imported from `Layout.astro:129-131` → runs on **every landing-page view**.
- Reads `localStorage.getItem('user_locale') || 'preferred_locale'` (L101) but **nothing in the codebase ever writes those keys** (verified by grep) ⇒ the "remembered preference" branch is dead.

#### Other files
- `src/i18n/ui.ts` — `languages` map (11 locales, `label/flag/dir/subpath/hreflang`), `defaultUI` (**257 keys**), 10 override dictionaries, `ui` merged map, `UIKey`, `getTranslation`.
- `src/i18n/utils.ts` — `getLangFromUrl` (unused), `useTranslations`, `getRelativeLocaleUrl`, `getAllLanguageRoutes` (unused).
- `src/components/Navbar.astro` — sticky header, 11-language dropdown, mobile drawer; computes `#faq` / `#studio` anchors.
- `src/components/common/Toast.astro` — installs `window.showToast`.
- `src/components/common/Seo.astro` — full meta/JSON-LD head used by `BaseLayout`.
- `src/components/common/Footer.astro` — 4-column footer with 11 language pills + 5 preset anchors.
- `src/components/blog/BlogCard.astro` — `post: any` prop; slug cleanup regex `^(lang|en)/`.
- `src/content/config.ts` — zod schema; `language` enum order differs from `astro.config` but values match.
- `src/styles/*` — tokens, typography classes, global reset/utilities, generator-specific layout.
- `src/pages/blog/[...slug].astro` L18 & `[lang]/blog/[...slug].astro` L826 — `await post.render()` (deprecated Astro API but **still functional in this build**; verified `/blog/*` pages built).

---

## 3. Feature Inventory & Working Status

Legend: ✅ working · ⚠️ partial/glitchy · ❌ broken/unimplemented

### 3.1 Studio (`/studio`) — React + DOM templates

| # | Feature | Status | Notes |
|---|---|---|---|
| C1 | Headline input (live) | ✅ | `StudioIsland.tsx:741-748` |
| C2 | Subheadline / deck | ✅ | L756-763 |
| C3 | Publication masthead | ✅ | L670-677 |
| C4 | Motto / tagline | ✅ | L685-692 |
| C5 | Issue date (free text) | ✅ | L701-708 |
| C6 | Byline / author | ✅ | L715-722 |
| C7 | Body text, blank-line paragraphs | ✅ | L776-783; split `\n\n+` in each template |
| C8 | 3-column dense layout | ✅ | `NewYorkTimesTemplate` 6-col, `TOITemplate` 3-col, `WashingtonPostTemplate` 4-col |
| C9 | 2-column layout | ✅ | `Guardian` 7/5 split, `LeMonde` 3-col, `KoreaHerald` 8/4 |
| C10 | Drop caps | ✅ | Every template floats `leadParagraph.charAt(0)` |
| C11 | Pull quotes / sidebars | ✅ | Wapo L202-212, TOI L230-238, Guardian L226-236, Gulf L216-223, KH L228-235, LeMonde L172-174 |
| C12 | Location/dateline | ⚠️ | Hard-coded per template (`WASHINGTON —`, `NEW DELHI:`, `BRUXELLES —`, `TOKYO —`, `SEOUL —`, `DUBAI —`). **Not user-editable.** |
| C13 | Masthead headline overflow guard | ⚠️ | `whitespace-nowrap` on every `<h1>` (e.g. `NewYorkTimesTemplate.tsx:82`, `WashingtonPostTemplate.tsx:88`, `TOITemplate.tsx:99`, `LeMondeTemplate.tsx:83`, `JapanTimesTemplate.tsx:88`, `KoreaHeraldTemplate.tsx:77`, `GulfNewsTemplate.tsx:80`, `GuardianTemplate.tsx:80`). A long custom name forces horizontal overflow / clipping. |

### 3.2 Media & Image Handling

| # | Feature | Status | Notes |
|---|---|---|---|
| M1 | Drag & drop upload (Studio) | ✅ | `StudioIsland.tsx:406-422` |
| M2 | File-picker upload | ✅ | hidden `<input accept="image/*" id="studioPhotoFileInput">` L810-817 |
| M3 | Upload via FileReader → data URL | ✅ | L395-404 (no blob-URL leak — good) |
| M4 | Remove photo | ✅ | L430-436 |
| M5 | Crop / aspect-ratio control | ❌ | No cropper. Images are `object-cover` into fixed `max-h-[240…380px]` boxes — aspect ratio is **silently cropped**, not user-controlled. |
| M6 | Grayscale / contrast halftone-look filter | ⚠️ | CSS `filter grayscale contrast-125` only — a *look*, **not** a real halftone dot screen. `StudioIsland.tsx:825` (dropzone thumb) and each template's `<img class=…>`. |
| M7 | True halftone dither | ⚠️ | Only in the **Generator**: `generator-engine.ts:317-323` does `gray > 128 ? 240 : 25` — a 2-level threshold, not a dot matrix. |
| M8 | Sepia / grain / contrast filters | ⚠️ | Generator only (`generator-engine.ts:324-340`). **Not present in the Studio.** |
| M9 | Captioning | ✅ | `StudioIsland.tsx:862-869` → template `<figcaption>`/`<p>` |
| M10 | Upload size / dimension limits | ❌ | No client-side cap. A 12 MB PNG becomes a ~16 MB base64 string held in React state **and** pushed through html2canvas. |
| M11 | Upload error handling | ❌ | `processImageFile` silently `return`s on a non-image; no toast, no message (L396). |

### 3.3 Styling & Realism Engine

| # | Feature | Status | Notes |
|---|---|---|---|
| S1 | Paper colour/aging (Studio) | ⚠️ | Flat Tailwind bg colours only (`bg-[#f4efe3]`, `bg-[#f7f4ec]`, `bg-[#fbf8f0]`, `bg-[#ffffff]`…). No aging slider. |
| S2 | Paper colour/aging (Generator) | ✅ | 4 paper styles + radial aging gradient + `agingLevel` slider, `generator-engine.ts:80-118` |
| S3 | Procedural paper grain | ✅ (Generator) / ⚠️ (Studio) | Generator: 6000×aging random 1–2 px dots (`generator-engine.ts:112-118`). Studio: CSS `radial-gradient` dot pattern at `opacity-20/25` (`NewYorkTimesTemplate.tsx:55-63` etc.). |
| S4 | Torn / ripped edges | ❌ | `drawTornEdgesOverlay()` (`generator-engine.ts:121-133`) draws **only a `ctx.strokeRect(10,10,w-20,h-20)`** — a rectangle border. There is no torn-paper geometry, mask, or clip-path anywhere in the repo. The "Torn Edges" checkbox is cosmetic mislabelling. |
| S5 | Fold creases | ✅ (Generator) | Two gradient bands, `generator-engine.ts:442-466` |
| S6 | Coffee stain | ✅ (Generator) | `generator-engine.ts:468-501` |
| S7 | Ink bleed / blur | ❌ | No `feGaussianBlur`, no SVG filter, no `ctx.filter`, no `drop-shadow` on ink anywhere. |
| S8 | Typography switching (font style) | ✅ (Generator) / ❌ (Studio) | Generator: 5 pill options → `mastheadFont` switch `generator-engine.ts:167-173`. Studio: font follows the chosen template only, no user override. |
| S9 | Column rules / borders | ✅ | CSS `border-l border-black/25` + `divide-*`; Generator draws separators at `generator-engine.ts:380-388` |
| S10 | Dark / light UI mode | ❌ | No theme switch, no `prefers-color-scheme` block, no `dark:` variant anywhere. |
| S11 | `mix-blend-multiply` grain overlay | ⚠️ | 4 templates. **Not honoured by html2canvas** (see Bug X-05). |

### 3.4 Canvas & Preview Controls

| # | Feature | Status | Notes |
|---|---|---|---|
| V1 | Live preview (Studio) | ✅ | React re-render, no canvas |
| V2 | Live canvas preview (Generator) | ✅ | 1200×1500 backing store, `max-width:100%` CSS |
| V3 | Zoom | ❌ | Neither editor has zoom. |
| V4 | Pan | ❌ | Neither editor has pan. |
| V5 | Aspect-ratio presets | ❌ | Generator is hard-locked to 800×1000 @1.5 (`ENGINE_CONFIG`); Studio is fluid width. |
| V6 | Responsive preview scaling | ⚠️ | Studio preview is `w-full` inside `overflow-x-auto` (`StudioIsland.tsx:963`), so on a 375 px phone the template **collapses to 1 column** — the mobile preview is a *different composition* from the exported one (Bug X-07). |
| V7 | Template gallery → deep link | ⚠️ | `/templates?…` cards link to `/studio?template=…`; works only because `StudioIsland` re-reads the URL client-side. The `template=` prop from `studio.astro:8` is always the build-time default. |
| V8 | Generator preset gallery | ⚠️ | Cards work, but the initial `?preset=` deep link is ignored (Bug C-04). |
| V9 | "Reset" button | ✅ (Studio) / ❌ (Generator) | Studio `handleReset` L380-392; Generator `#resetBtn` L27-33 has **zero** listeners. |

### 3.5 Export & Sharing Pipeline

| # | Feature | Status | Notes |
|---|---|---|---|
| E1 | PNG download | ⚠️ | `exportAsPNG(false)` → scale 2. Works, but see §5 X-series (broken justify normalisation, wrong `onclone` target). |
| E2 | JPG download | ⚠️ | `exportAsJPG()` → scale 2, q 0.95. Same caveats. |
| E3 | "4K" download | ⚠️ | `exportAsPNG(true)` → scale 4 on a 1000 px container = **4000 px wide**, not a 4 K-long-edge guarantee; height is unbounded (memory/crash risk). |
| E4 | WebP export | ❌ | Never implemented anywhere. |
| E5 | PDF export | ⚠️ Broken for tall clippings | `exportEngine.ts:369-382`: `finalWidth/finalHeight` are computed then **discarded**; `addImage(..., pdfWidth, pdfHeight)` overflows A4 and is silently cropped. A4-portrait hard-coded, no orientation branch. |
| E6 | SVG export | ⚠️ (dead code) | `exportAndStorage.downloadAsSVG` wraps a raster PNG in an `<svg><image>`, mismatched dimensions, and revokes the blob URL synchronously (`exportAndStorage.ts:209-211`) → download can abort. Only reachable from the dead EditorIsland. |
| E7 | Print stylesheet | ⚠️ | `printClipping()` writes `target.innerHTML` (dropping the white background + padding classes) into a popup with copied styles; **double print attempt** (onload + 1 s timeout) and `close()` after 500 ms. |
| E8 | Copy image to clipboard | ⚠️ (Generator) / ❌ (Studio) | `generator-engine.ts:534-545` — silently `return false` on Safari/Firefox/insecure context; the UI shows **no error**. Studio has no image-clipboard copy at all (only link copy). |
| E9 | Copy shareable link | ⚠️ | `StudioIsland.tsx:446-451` — unhandled promise rejection if the Clipboard API is unavailable. Also the Studio URL only carries `template/headline/name/date`, so **subheadline, tagline, byline, body, and photo are not shareable**. |
| E10 | Project save (IndexedDB) | ⚠️ | Dexie works, but **saving destroys the uploaded photo** (Bug C-01) and **drops byline + subheadline** (Bug C-02). |
| E11 | Project load / restore | ⚠️ | Restores a corrupted image (Bug C-01) and resets byline/deck to the *template* defaults, discarding the user's typing. |
| E12 | "Clear all" history | ✅ | Two-step confirm, 4 s window, `RecentClippingsDrawer.tsx:62-80` |
| E13 | Export filename variety | ❌ | `BASE_FILENAME` is a constant (`exportEngine.ts:16`) → every download is `vintage-newspaper-clipping.png`. |

### 3.6 Multi-language / Content / SEO

| # | Feature | Status | Notes |
|---|---|---|---|
| L1 | 11 locale routes | ✅ | 90 pages built |
| L2 | Language switcher (nav + footer) | ✅ | `Navbar.astro:111-136`, `Footer.astro:58-67` |
| L3 | hreflang + x-default | ✅ | 11 alternates on every page |
| L4 | Auto-redirect by browser language | ⚠️ | `langDetect.ts:131-155`; only on `/`; preference never persisted. |
| L5 | **Translation coverage** | ❌ | `defaultUI` = 257 keys. `zh`/`pt-BR`/`ru`/`tr`/`ko` override only **87 (33.9 %)**; `ja`/`de`/`es`/`fr`/`hi` only **145 (56.4 %)**. **Every `gen.*` key is missing in all 10 locales** ⇒ `/[lang]/generator` renders **100 % English**. Also missing: `home.hero.cta`, `home.faq.q1-6`, `features.title`, `feat.1.title`, `feat.4.desc`. |
| L6 | Blog | ⚠️ | 27 posts across 6 languages (en 6, de/es/fr/hi 4, **ja 1**); none for zh/pt-BR/ru/tr/ko. |
| L7 | Blog category filter | ✅ | `blog/index.astro:69-93` |
| L8 | Blog fallback (no posts in locale) | ❌ | `[lang]/blog/index.astro:12-17` falls back to English posts but `BlogCard.astro:17` still builds `/{lang}/blog/{slug}` → **404 on every card** for zh/pt-BR/ru/tr/ko (Bug S-01). |
| L9 | RSS (global + per-locale) | ✅ | `rss.xml.ts`, `[lang]/rss.xml.ts` |
| L10 | Sitemap + XSL renderer | ✅ | 90 URLs, `sitemap.xml` alias, `astro:build:done` rewrite |
| L11 | **OG / Twitter image** | ❌ | `Layout.astro:24`, `Seo.astro:19,39`, `BaseLayout.astro:26` all default to `/og-image.png`; **`public/og-image.png` does not exist** → every social share renders broken (Bug S-04). |
| L12 | **robots.txt domain** | ❌ | Points at `https://newspaper-clipping-generator.example.com/` while `astro.config.mjs:103` sets `https://newspaper-clipping.pages.dev` (Bug S-02). |
| L13 | JSON-LD (WebApplication/Article/FAQPage/Breadcrumb) | ✅ | |

---

## 4. End-to-End Architecture & Working Flow

### 4.1 Studio (`/studio`) — the primary product

```
① INITIALISATION (build time)
   studio.astro:8            Astro.url.searchParams.get('preset'|'template') || 'times-of-india'
                            ⚠ during `astro build` there is no query string ⇒ ALWAYS 'times-of-india'
   studio.astro:17           <StudioIsland client:only="react" initialTemplate={presetParam} lang="en" />
                            ⚠ NO server HTML — dist/studio/index.html contains <astro-island client="only">
                            ⚠ and zero occurrences of `newspaper-export-target`
   StudioIsland.tsx:258-269  resolvePresetFromProp(initialTemplate) → TEMPLATES[0] fallback
   StudioIsland.tsx:272-281  10 useState initialisers seeded from the resolved preset
   StudioIsland.tsx:294,466  refreshDraftCount() → Dexie getRecentClippings(50)

② CLIENT MOUNT
   effect L299-340  read ?template/?headline/?story/?name/?date/?tagline → setState()
   effect L343-358  history.replaceState(...) writes the (initially default) state back into the URL
                    ⚠ runs on the FIRST commit too → deep-linked params are briefly overwritten
   React renders <PreviewPanel> → template switchboard → one of 8 templates
   PreviewPanel.tsx:44-53  lowercase + substring match on template id
   <div id="newspaper-export-target" class="bg-white p-4 w-full h-full relative z-10">   (StudioIsland L965)

③ USER INPUT → PREVIEW (synchronous, no debounce)
   onChange  ─► setState  ─► React re-render of the whole template subtree
   Every keystroke in the 1 000-character body textarea re-renders
   the entire 6-column grid (hundreds of DOM nodes). No `useDeferredValue`,
   no debounce, no memoisation (Bug P-02).

④ RENDERING / REALISM (pure CSS, no canvas)
   • paper tone  : Tailwind arbitrary bg per template
   • grain       : absolute-inset radial-gradient + opacity-20/25 + mix-blend-multiply
   • photo       : <img src={dataURL} class="... filter grayscale contrast-125 brightness-95" />
   • drop cap    : <span class="float-left text-4xl ...">{lead.charAt(0)}</span>
   • columns     : CSS grid (md:grid-cols-2/3/4/6) + border-l column rules
   • No SVG filters, no clip-path, no canvas.

⑤ EXPORT PIPELINE  (src/utils/exportEngine.ts)
   user clicks PNG / JPG / PDF / 4K / Print
     ↓
   await document.fonts.ready                          (L126,148,182,224,317)
     ↓
   source = document.getElementById('newspaper-export-target')   (L133) ← hard-coded DOM id
     ↓
   clone = source.cloneNode(true)                      (L137)
     ↓
   sanitizePristineClone(clone)   ⚠ clone is DETACHED here → getComputedStyle returns ""  (L143)
     ↓
   container = createOffscreenContainer()  { position:absolute; top/left:-9999px; width:1000px }
     ↓  document.body.appendChild(container)        (L145)
     ↓  ⚠ DOM now has TWO elements with id="newspaper-export-target" (live one is first in document order)
     ↓
   await sleep(300) + sleep(500)      (PNG only, L149-150)  ← unconditional 800 ms stall
     ↓
   html2canvas = await import('html2canvas')
     ↓
   html2canvas(clone, { useCORS:true, allowTaint:true, scale:2|4, logging:true,
                        backgroundColor:'#ffffff', onclone: getOnClone() })
     │        ⚠ onclone does clonedDoc.getElementById('newspaper-export-target')
     │          → returns the LIVE preview node, not the offscreen clone (Bug X-02)
     ↓
   canvas.toDataURL('image/png' | 'image/jpeg', 0.95)
     ↓
   <a download>.click()  →  container.remove()   (finally block L172)
   PDF branch: jsPDF('p','mm','a4'); addImage(imgData,'JPEG',0,0,pdfWidth,pdfHeight)   ⚠ crops (Bug E-03)
   Print branch: window.open → write styles + target.innerHTML → onload print + close     ⚠ double print
   Errors: console.error + window.showToast(...)  ⚠ if showToast is undefined the catch throws (Bug X-08)
```

### 4.2 Generator (`/generator`) — the Canvas editor

```
① INITIALISATION
   generator.astro:8    Astro.url.searchParams  ⚠ always empty at build ⇒ 'breaking-1920'
   GeneratorApp.astro:15  defaultPreset = PRESETS.find(p => p.id === initialPresetId) || PRESETS[0]
                         → used ONLY for input value="" attributes
   GeneratorApp.astro:359 currentOptions = { ...PRESETS[0], userImage:null }   ⚠ ignores defaultPreset
   GeneratorApp.astro:612-616 module script runs → initGenerator() once
   GeneratorApp.astro:617 document.addEventListener('astro:page-load', initGenerator)  ⚠ latent double-init

② INPUT → CANVAS
   input|change  →  updateFromUI()  (L393)  →  copy 17 DOM .value/.checked into currentOptions
                                      →  triggerRender()   (NO debounce)
   NewspaperEngine.render(options)  (generator-engine.ts:32)
     scale = 1.5 ; canvas.width/height = 1200×1500 ; ctx.scale(1.5)
     1 drawPaperBackground   base fill + radial aging + 6000·aging random grain dots (Math.random)
     2 drawTornEdgesOverlay  strokeRect ONLY
     3 drawMasthead          ctx.font switch (gothic/serif/headline/tabloid/typewriter) + fillText, NO wrapping
     4 drawHeadlines         wrapText(headline) → lines; divider; deck; byline; rule
     5 drawPhoto             cover-crop via sx/sy/sw/sh → temp canvas → getImageData per-pixel filter loop
     6 drawBodyText          wrapText per paragraph across numCols columns, drop cap for para[0]
     7 drawCreaseLines / drawCoffeeStain

③ EXPORT
   downloadPngBtn   → engine.download(`${slugified-headline}.png`,'png')  → toDataURL → a.click()
   copyClipboardBtn → engine.copyToClipboard()  → canvas.toBlob → navigator.clipboard.write(ClipboardItem)
   printBtn         → window.open → <img src=dataUrl onload="window.print();window.close()">
```

### 4.3 Persistence flow (Studio drafts)

```
Save Draft → document.getElementById('previewPanelContainer')      (StudioIsland L488)
          → captureThumbnail(el)  → renderElementCanvas(el, 0.4)     (exportAndStorage L115-122, L151)
              ⚠ backgroundColor:null  → transparent PNG → toDataURL('image/jpeg') → BLACK bars
              ⚠ windowWidth/windowHeight = element.scrollWidth/Height → media queries re-evaluated
          → saveToDrafts({..., base64Image: imageUrl, thumbnail})
              ⚠ L58: base64Image: data.thumbnail || data.base64Image   ← OVERWRITES the real photo
              ⚠ L51-61: author & subheadline are not in ClippingRecord → dropped
→ RecentClippingsDrawer lists records; click → handleRestoreSession
          ⚠ setImageUrl(record.base64Image)  = the 0.4-scale JPEG screenshot of the whole page
          ⚠ setAuthor/setSubheadline fall back to TEMPLATE defaults, not the saved values
```

---

## 5. Comprehensive Bug, Error & Issue Audit

### 🔴 CRITICAL

---

**C-01 — Saving a draft overwrites the user's uploaded photo with a low-res thumbnail**
- **Severity:** `[CRITICAL]`
- **File:** `src/utils/exportAndStorage.ts:44-67`, line **58**
- **Description:** `saveToDrafts()` writes `base64Image: data.thumbnail || data.base64Image || null`. Because `StudioIsland.handleSaveDraft` (`StudioIsland.tsx:493-503`) always passes a non-empty `thumbnail`, the real uploaded photo data URL is *always* discarded and replaced with a 0.4-scale JPEG screenshot of the entire newspaper page.
- **Root cause:**
  ```ts
  // exportAndStorage.ts:51-61
  const id = await db.clippingHistory.add({
    template: data.template,
    newspaperName: data.newspaperName,
    tagline: data.tagline,
    date: data.date,
    headline: data.headline,
    story: data.story,
    base64Image: data.thumbnail || data.base64Image || null,   // ← L58
    photoCaption: data.photoCaption,
    timestamp: Date.now(),
  });
  ```
- **Downstream damage:** `StudioIsland.tsx:481` `setImageUrl(record.base64Image || null)` restores a blurry screenshot of the *whole page* into the photo slot; the "Remove Photo"/caption UI behaves as if a photo was loaded; the clipping the user gets back looks nothing like the one they saved.
- **Fix:** add a separate `thumbnail` column and keep `base64Image` intact; bump the Dexie schema version accordingly.

---

**C-02 — Draft schema silently drops `author` and `subheadline`**
- **Severity:** `[CRITICAL]` (data loss on a core feature)
- **File:** `src/utils/exportAndStorage.ts:7-18` (interface), `src/utils/exportAndStorage.ts:30-32` (Dexie store), `src/components/studio/StudioIsland.tsx:493-503` (save), `:469-483` (restore)
- **Description:** `ClippingRecord` declares `template, newspaperName, tagline, date, headline, story, base64Image, photoCaption, timestamp` — **no `author`, no `subheadline`**. `handleSaveDraft` never passes them. On restore, `StudioIsland.tsx:477-478` substitutes `preset?.subheadline` / `preset?.author`.
- **Root cause:** the interface predates the byline/deck fields; the store was never migrated.
- **Impact:** every save→restore round-trip silently reverts the user's byline and subheadline to the newspaper-template boilerplate.

---

**C-03 — Canvas text overflows the page bottom and overlaps itself in the Generator**
- **Severity:** `[CRITICAL]`
- **File:** `src/scripts/generator-engine.ts:360-440`, specifically **425-435**
- **Description:** When the body text exceeds the available column height, the code advances `currentCol` and `break`s out of the **inner** `for (const line of lines)` loop. The **outer** `for (const para of paragraphs)` loop then continues with `colX/colY` unchanged (still past the bottom of the last column), so every remaining paragraph is drawn at the same out-of-bounds `y`, stacking on top of itself and painting outside the canvas.
  ```ts
  for (const line of lines) {
    if (colY + lineHeight > ENGINE_CONFIG.baseHeight - margin - 20) {
      currentCol++;
      if (currentCol >= numCols) break;      // ← only leaves the inner loop
      colX = margin + currentCol * (colW + colGap);
      colY = startY;
    }
    ctx.fillText(line, colX, colY);          // ← drawn past the page bottom
    colY += lineHeight;
  }
  colY += 10;
  ```
- **Additional defect:** the column separator rules (L380-388) are drawn full-height regardless of whether any text reaches them, so empty rules appear below finished columns.
- **Fix:** add an `overflowed` flag; stop the outer loop too; draw an ellipsis/"Continued on Page N" marker.

---

**C-04 — Generator ignores its `initialPresetId`; inputs and canvas are desynchronised**
- **Severity:** `[CRITICAL]`
- **Files:** `src/components/generator/GeneratorApp.astro:15`, `:359-362`, `:608`; `src/pages/generator.astro:8`; `src/pages/[lang]/generator.astro:17`
- **Description:** `defaultPreset` is computed from `initialPresetId` and used **only** to pre-fill the `value=` attributes of the inputs. The render state is hard-seeded from `PRESETS[0]`:
  ```astro
  <!-- GeneratorApp.astro:359-362 -->
  let currentOptions: NewspaperPreset & { userImage?: HTMLImageElement | null } = {
    ...PRESETS[0],                    // ← always the first preset
    userImage: null
  };
  ```
  The final `triggerRender()` at L608 paints `PRESETS[0]` while the form shows `defaultPreset`. Compounding this, `generator.astro:8` reads `Astro.url.searchParams.get('preset')`, which is **always `null` in a static build**, so the deep link can never work in production.
- **Impact:** inputs and canvas disagree until the user edits a field; the `?preset=` URL parameter is inert. Also note the Studio↔Generator ID mismatch handled by the ad-hoc alias table `GENERATOR_TO_STUDIO_TEMPLATE` (`StudioIsland.tsx:201-207`).
- **Fix:** seed `currentOptions` from `defaultPreset`, and read `?preset=` client-side (the Studio already does this correctly at `StudioIsland.tsx:299-340`).

---

**C-05 — PDF export silently crops tall clippings**
- **Severity:** `[CRITICAL]`
- **File:** `src/utils/exportEngine.ts:369-382`
- **Description:** The code correctly computes `finalWidth`/`finalHeight` to fit an A4 page, then **ignores them**:
  ```ts
  let finalWidth  = pdfWidth;
  let finalHeight = pdfHeight;
  if (pdfHeight > pageHeight) { finalHeight = pageHeight; finalWidth = (canvas.width * finalHeight) / canvas.height; }

  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);   // ← uses the UNFITTED values
  pdf.save(`${BASE_FILENAME}.pdf`);
  ```
  Any clipping taller than A4 (which is nearly all of them — the offscreen container is a fluid-width, unbounded-height DOM node rendered at `scale: 2`) is drawn past the page bottom and **cut off**. Orientation is hard-coded to `'p'` A4; no landscape branch, no pagination.
- **Fix:** `pdf.addImage(imgData,'JPEG', (pdfWidth-finalWidth)/2, (pageHeight-finalHeight)/2, finalWidth, finalHeight)` or emit one image per page.

---

### 🟠 HIGH

---

**H-01 — `sanitizePristineClone()` operates on a DETACHED node, so it sanitises nothing**
- **Severity:** `[HIGH]`
- **File:** `src/utils/exportEngine.ts:74-101`, called at `:143`, `:190`, `:243`, `:262`, `:282`, `:325`
- **Description:** The call order is `sanitizePristineClone(clone)` → `container.appendChild(clone)` → `document.body.appendChild(container)`. At sanitize time `clone` is not in any document tree, and `window.getComputedStyle(detachedNode)` returns an **empty `CSSStyleDeclaration`** in every major engine. Therefore:
  - `style.textAlign === 'justify'` → `''` → **false** → justification is never neutralised.
  - `style.textWrap` → `''` → the `balance`/`pretty` branches never fire.
  - `style.letterSpacing !== 'normal'` → `'' !== 'normal'` → **true**, so it stamps `letterSpacing: normal` on every node (harmless, and the only reason the function appears to do anything).
- **Impact:** exported PNG/JPG/PDF keep `text-align: justify`, which html2canvas computes with visibly broken word spacing ("justification gaps") — the exact failure the function was written to prevent. It also fails to strip `text-wrap: balance/pretty`.
- **Fix:** move `sanitizePristineClone(clone)` to **after** `document.body.appendChild(container)`.

---

**H-02 — `onclone` mutates the LIVE preview instead of the offscreen clone**
- **Severity:** `[HIGH]`
- **File:** `src/utils/exportEngine.ts:23-68` (esp. `:25`, `:34`, `:39`, `:58-64`), and the duplicated inline copy at `:333-364`
- **Description:** html2canvas clones the whole `document.documentElement` into its internal iframe. Because `createOffscreenContainer()` was appended to `document.body`, the cloned document contains **two** nodes with `id="newspaper-export-target"`. `getElementById` returns the first in document order — the **on-screen live preview**, which appears earlier in `<body>` than the container appended at the end.
  ```ts
  const el = clonedDoc.getElementById('newspaper-export-target');   // ← the LIVE node
  ...
  if (style.textAlign === 'justify')  (node).style.textAlign = 'left';   // ← writes inline styles into the live DOM
  if (style.letterSpacing !== 'normal' && style.letterSpacing !== '0px')
                                 (node).style.letterSpacing = 'normal';
  ```
- **Impact:** every PNG/JPG/PDF export **permanently mutates the user's on-screen preview** (justified → left-aligned, tracking stripped), while the actual rendered offscreen clone keeps the original properties. Also mixes windows: `view.getComputedStyle` (`:34`, `clonedDoc.defaultView`) and `window.getComputedStyle` (`:39`, `:58`) are used inconsistently on the same node.
- **Fix:** drop the `id` from the clone before rendering (`clone.removeAttribute('id')`), or use the `elementCloned` second argument that html2canvas passes to `onclone`.

---

**H-03 — Exported layout ≠ previewed layout on mobile (media-query re-evaluation)**
- **Severity:** `[HIGH]`
- **Files:** `src/utils/exportAndStorage.ts:151-162` (`windowWidth`/`windowHeight`), `src/utils/exportEngine.ts:103-118` (fixed `width:1000px`), `src/components/studio/StudioIsland.tsx:963` (`overflow-x-auto` preview)
- **Description:** `renderElementCanvas()` passes `windowWidth: element.scrollWidth, windowHeight: element.scrollHeight` to html2canvas, which resizes the render viewport and therefore **re-evaluates every media query**. On a 375 px phone the Studio preview renders at ~330 px wide → Tailwind `sm:`/`md:` do **not** apply (1-column layout); the export viewport is 1000 px → `sm:`/`md:` **do** apply (3-column dense grid, different font sizes, different image heights). The download therefore shows a *completely different newspaper* from the preview.
- **Related:** `NewYorkTimesTemplate.tsx:70` and `:90` hide the "ear pieces" below `sm`, `GuardianTemplate`/`LeMondeTemplate`/`GulfNewsTemplate`/`KoreaHeraldTemplate` restructure at `md:`/`lg:` — all of these flip between preview and export.
- **Fix:** render the clone inside an explicit fixed-width `iframe` with a fixed `width` attribute, or lock the export to a fixed 1200 px layout viewport via `html2canvas`'s `windowWidth`/`windowHeight` set to the *design* width regardless of device.

---

**H-04 — No debounce: a full 1200×1500 canvas repaint + per-pixel photo filter on every keystroke**
- **Severity:** `[HIGH]`
- **Files:** `src/components/generator/GeneratorApp.astro:418-428` (both `input` **and** `change` bound to `updateFromUI`), `:393-416`, `src/scripts/generator-engine.ts:32-73`, `:308-343`
- **Description:** `updateFromUI()` calls `triggerRender()` synchronously with no `debounce`/`requestAnimationFrame` throttling. Each call: resets `canvas.width/height` (forcing bitmap reallocation), draws ~6 000 random grain rects, and — when a photo is loaded — runs a **per-pixel `getImageData`/`putImageData` loop over 720×240 = 172 800 px** on the main thread. Typing in the body textarea or dragging the aging slider (`:216`) issues up to ~60 full renders/second. Note the `input`+`change` double-binding means a `<select>` change fires **two** renders.
- **Impact:** severe input lag / dropped frames; on low-end mobile the tab can freeze for seconds.
- **Fix:** debounce the text inputs (150–250 ms), rAF-throttle the range slider, and move the photo filter to an `OffscreenCanvas` in a worker.

---

**H-05 — Studio re-renders the whole template tree on every keystroke (no memoisation/deferral)**
- **Severity:** `[HIGH]`
- **File:** `src/components/studio/StudioIsland.tsx:776-783` (textarea) → `:966-977` (`<PreviewPanel … />`), `src/components/editor/PreviewPanel.tsx:26-42`
- **Description:** The 1 000+ character body textarea is bound to `useState`; each `onChange` re-renders the entire template (a 6-column grid with hundreds of `<p>` nodes plus Tailwind `md:grid-cols-6` recalculation). No `React.memo`, `useDeferredValue`, or `useTransition`.
- **Secondary effect:** `useEffect` at `StudioIsland.tsx:343-358` fires `history.history.replaceState` on every `headline`/`newspaperName`/`date` keystroke, which on some browsers throttles navigation and can drop characters while typing fast in the headline field.
- **Fix:** `useDeferredValue(story)`, `React.memo(PreviewPanel)` on prop equality, and debounce the URL write-back.

---

**H-06 — `[lang]/blog` fallback produces 404 links for 5 of 10 locales**
- **Severity:** `[HIGH]`
- **Files:** `src/pages/[lang]/blog/index.astro:12-17`, `src/components/blog/BlogCard.astro:16-17`
- **Description:** When a locale has no posts the index falls back to English entries, but `BlogCard` still builds a locale-prefixed URL:
  ```ts
  // BlogCard.astro:16-17
  const cleanSlug = post.slug.replace(new RegExp(`^(${post.data.language}|en)/`), '');
  const postUrl = getRelativeLocaleUrl(lang, `blog/${cleanSlug}`);   // → /zh/blog/<en-slug>
  ```
  Content dirs exist only for `en, es, fr, de, hi, ja`. `getStaticPaths` still generates `/zh/blog/`, `/pt-BR/blog/`, `/ru/blog/`, `/tr/blog/`, `/ko/blog/` → **all cards are dead links**.
- **Fix:** when falling back, set `lang='en'` for the card URLs, or generate alias routes for English content under each locale prefix.

---

**H-07 — `og:image` / `twitter:image` 404 on every page**
- **Severity:** `[HIGH]` (SEO/social)
- **Files:** `src/layouts/Layout.astro:24`, `src/layouts/BaseLayout.astro:26`, `src/components/common/Seo.astro:19`, `:39`; verified: `public/` contains **no `og-image.png`**.
- **Impact:** every social share of any of the 90 pages renders without a preview image. Verified in `dist/index.html` (2 `og-image` references, asset missing).

---

**H-08 — `robots.txt` points at the placeholder domain**
- **Severity:** `[HIGH]` (SEO)
- **File:** `public/robots.txt:4-5` → `https://newspaper-clipping-generator.example.com/sitemap-index.xml` and `/sitemap.xml`, while `astro.config.mjs:103` sets `site: 'https://newspaper-clipping.pages.dev'`.
- **Impact:** crawlers are pointed at a non-existent host.

---

**H-09 — 4 K export can exceed the browser canvas area limit (likely blank/crash on iOS Safari)**
- **Severity:** `[HIGH]`
- **File:** `src/utils/exportEngine.ts:155-157`, container width `:110`, `StudioIsland.tsx:941`
- **Description:** `scale: 4` × a 1000 px container ⇒ a 4000 px-wide canvas whose **height is the unbounded DOM height**. A long article easily yields 4000 × 8000 = 32 M px ≈ 128 MB of RGBA. iOS Safari historically caps canvas area around 16.7 M px; Chrome caps at 16384²/268 M px. There is no pre-flight dimension check, no `toBlob` fallback, and no error surfaced beyond a generic toast.
- **Fix:** measure `clone.scrollHeight` first; if `width*height*scale² > 16e6`, reduce `scale` and tell the user.

---

**H-10 — Unhandled promise rejections on clipboard APIs**
- **Severity:** `[HIGH]`
- **Files:** `src/components/studio/StudioIsland.tsx:446-451`, `src/scripts/generator-engine.ts:534-545`
  ```ts
  // StudioIsland.tsx:448 — no .catch(), no await
  navigator.clipboard.writeText(window.location.href);
  ```
  In a non-secure context, with permission denied, or when the Clipboard API is missing, this rejects with **no handler**. In Firefox/Safari, `new ClipboardItem({'image/png': blob})` at `generator-engine.ts:540` throws synchronously; the `catch` returns `false`, and the UI (`GeneratorApp.astro:580-585`) shows **nothing** on failure.
- **Fix:** `await navigator.clipboard.writeText(...).catch(showToast)`; add a failure branch to the copy button.

---

**H-11 — "Reset" button in the Generator is completely non-functional**
- **Severity:** `[HIGH]`
- **File:** `src/components/generator/GeneratorApp.astro:27-33` (`<button id="resetBtn">`) — verified by grep: `resetBtn` appears **only** in the markup; no `addEventListener` anywhere.
- **Impact:** the user-visible control does nothing.

---

### 🟡 MEDIUM

---

**M-01 — Two competing layout/SEO/token systems**
- `src/layouts/Layout.astro:184-248` redefines `--colors-*` and re-declares `.btn-primary`, `.hero-band`, `.card-content` that already exist in `src/styles/design-tokens.css:7-85` and `src/styles/global.css:127-208`. Whichever cascade order wins, only some pages get the correct brand values. `Layout.astro:56` also appends `" | The Vintage Press"` while every caller **already** passes a title ending in `" — The Vintage Press"` ⇒ double-suffixed `<title>` on landing pages.

**M-02 — `astro.config.mjs` resolves paths against `process.cwd()`**
- `astro.config.mjs:18` `path.resolve('src/content/blog')`, `:90` `path.resolve(candidate)`, `:143` `path.resolve('dist', fileName)`, and `getBlogDateMap()` is memoised at module scope. Any build invoked from a different working directory silently produces no `lastmod` values; the `astro:server:setup` middleware at `:143` reads from `dist` which does not exist in dev.

**M-03 — `README.md` is materially wrong**
- Claims 6 languages (there are 11); lists non-existent `components/common/Header.astro`, `LanguagePicker.astro`, and six `components/home/*` components; claims blog "reading times" (never implemented — no `readingTime`/`wordCount` anywhere); claims "torn edges" realism (see S-04); omits `EditorIsland`, `StudioIsland`, `PreviewPanel`, `exportEngine`, `exportAndStorage`, `langDetect`, `templates/*`.

**M-04 — Print pipeline: dropped wrapper, double print, aggressive close**
- `src/utils/exportEngine.ts:395-449`:
  - `:426` `printWindow.document.write(... ${target.innerHTML} ...)` — only the **inner** HTML is copied, so `bg-white p-4 w-full` from `#newspaper-export-target` is lost and the printed sheet loses its paper background and padding.
  - `:429-433` `printWindow.onload = () => { focus(); print(); setTimeout(close, 500) }` **and** `:434-444` a second unconditional `setTimeout(..., 1000)` that also calls `print()` ⇒ **two print dialogs**; closing the window 500 ms after `print()` aborts the job in several browsers.
  - `:400` `window.open('', '_blank', …)` without `noopener` ⇒ reverse-tabnabbing anti-pattern.
  - All `<link rel=stylesheet>`/`<style>` are inlined verbatim (`:405-409`) including the ~30 KB Tailwind bundle — works, but the Tailwind preflight reset is applied to the popup, so the clipping inherits `box-sizing:border-box` + zeroed margins inconsistently with the on-screen render.

**M-05 — `exportAsImage()` is dead and internally type-broken**
- `src/utils/exportEngine.ts:218-309` (92 lines) is never imported anywhere. Worse, `:225-229`:
  ```ts
  if (typeof element === 'string') { is4K = format as unknown as boolean; … }
  ```
  assigns the string `'png'`/`'jpeg'` to a `boolean`, so the `is4K` branch would always be taken. Delete it.

**M-06 — `window.showToast()` is called from `catch` blocks and can itself throw**
- `src/utils/exportEngine.ts:169, 208, 305, 385, 399, 402, 447` all call `window.showToast(...)` **from inside `catch (error: any)`**. `showToast` is installed by `Toast.astro:59` — present on every page today, but if the Toast island ever fails, or the module is used from a page without `<Toast />`, the error handler throws a `TypeError` that replaces the real error. The declared `Window.showToast` type (`exportEngine.ts:10-14`) makes TypeScript believe it always exists.
- **Fix:** `window.showToast?.(...)`.

**M-07 — 800 ms of unconditional `setTimeout` before every PNG export**
- `src/utils/exportEngine.ts:149-150` — `await sleep(300); await sleep(500);` runs on *every* PNG click regardless of whether fonts are ready. Combined with `:126`/`:148` `await document.fonts.ready`, the export takes ≥ 800 ms even for a 3-line clipping.

**M-08 — Lazy-loaded Google Fonts race the export**
- `src/layouts/Layout.astro:115-120` / `Seo.astro:60-65` load the 10 vintage families with `media="print"` + inline `onload` swap. `document.fonts.ready` (called at `exportEngine.ts:126`) resolves when the *currently pending* loads settle — it does **not** guarantee the `onload` handler has fired and flipped `media="all"`. If a user exports quickly, `UnifrakturMaguntia` / `Bodoni Moda` / `EB Garamond` fall back to generic serif in the PNG.
- **Fix:** `await Promise.all([...document.fonts].map(f => f.load()))` for the families actually used.

**M-09 — `html2canvas` options are internally contradictory and noisy**
- `src/utils/exportEngine.ts:156-157, 198, 249, 269, 293-294, 333`: `useCORS: true` **plus** `allowTaint: true`. With `allowTaint`, any cross-origin image taints the canvas and the subsequent `canvas.toDataURL()` (`:159, 199, 365`) throws `SecurityError`. Today only `data:` URLs are used so it doesn't fire, but the combination is a latent CORS/taint trap. `logging: true` also floods the console with one line per parsed node.

**M-10 — `mix-blend-multiply` paper grain is dropped by html2canvas**
- Used in `NewYorkTimesTemplate.tsx:56`, `WashingtonPostTemplate.tsx:65`, `LeMondeTemplate.tsx:58`, `TimesOfIndiaTemplate.tsx:58` (the last is dead). html2canvas has **no `mix-blend-mode` support**, so the exported PNG shows the raw 20–25 %-opacity radial-gradient dot pattern rather than the multiply-blended grain → the download looks visibly different (and noisier) from the screen. `GuardianTemplate`, `GulfNewsTemplate`, `KoreaHeraldTemplate`, `JapanTimesTemplate` have **no grain at all**, so templates are already visually inconsistent.

**M-11 — Non-deterministic output breaks preview↔export parity**
- `src/scripts/generator-engine.ts:113-118` (paper grain) and `:335` (`grain` filter) use `Math.random()`. The grain pattern therefore changes on **every** render — the preview the user composed is never byte-identical to the PNG they download.

**M-12 — Canvas masthead / earpiece / caption text has no wrapping or truncation**
- `src/scripts/generator-engine.ts:174` `ctx.fillText(options.newspaperName, w / 2, 104)` — no `wrapText`, no `measureText` guard. `"The Mayfair Gazette & Courier"` at 54 px overflows the 800 px canvas on both sides and is clipped.
- Same for `:180` (tagline), `:199-205` (issue/date/price drawn left/centre/right — long strings overlap), `:353` (photo caption, no wrap).
- Contrast: the **headline** *is* wrapped (`:223`) and the body *is* wrapped (`:408, 423`) — the inconsistency is the bug.

**M-13 — `template` matching in `PreviewPanel` uses unsafe substring tests**
- `src/components/editor/PreviewPanel.tsx:44-53`: `raw.includes('gn')` (Gulf News), `raw.includes('jt')` (Japan Times), `raw.includes('kh')` (Korea Herald), `raw.includes('nyt')`. Any future template id containing those two-letter sequences silently renders the wrong newspaper. `isGulfNews` is checked *before* `isJapanTimes`/`isKoreaHerald`, so any id containing `gn` wins.
- **Fix:** exact id lookup against an explicit allow-list.

**M-14 — Dead code volume (≈ 1 460 lines) creates two sources of truth**
- `src/components/editor/EditorIsland.tsx` — 686 lines, never imported.
- `src/components/templates/NYTTemplate.tsx` — 218 lines, never imported, not exported from the barrel.
- `src/components/templates/TimesOfIndiaTemplate.tsx` — 259 lines, reachable only through `templates/index.ts`, which is itself never imported.
- `src/components/templates/index.ts` — 26 lines, never imported.
- `src/components/editor/PreviewPanel.tsx:235-574` — ~340 lines of inline `isTOI`/`isWaPo`/`isGlobalTimes` JSX that can never render because the function returns at `:170-180`.
- `src/utils/exportEngine.ts:218-309` — `exportAsImage`, dead.
- `src/i18n/utils.ts:3-20, 39-45` — `getLangFromUrl`, `getAllLanguageRoutes`, dead.
- `src/components/templates/NYTTemplate.tsx:33-38` — `ensureFonts()` is an empty function that immediately `return`s.
- **Consequence:** two divergent preset systems (`TEMPLATES` in StudioIsland vs `PRESETS` in presets.ts) bridged by a hand-maintained alias map (`StudioIsland.tsx:201-207`).

**M-15 — `GeneratorApp.astro` `initGenerator()` can bind every listener twice**
- `:612-616` runs `initGenerator()` immediately **and** `:617` registers it on `astro:page-load`. There is no `<ViewTransitions />` anywhere in the project, so the event never fires today — but if client-side routing is ever enabled, every input would get two `input`+`change` listeners, the tabs would double-toggle, and each keystroke would trigger two full canvas renders. The same latent hazard exists in `Navbar.astro:279-280` and `blog/index.astro:91-92`.

**M-16 — Draft thumbnails are JPEG-encoded over a transparent canvas ⇒ black bars**
- `src/utils/exportAndStorage.ts:117-118` — `renderElementCanvas(..., 0.4)` sets `backgroundColor: null` (`:157`) then `canvas.toDataURL('image/jpeg', 0.65)`. Transparent pixels become **black** in JPEG. `PreviewPanel`'s `#previewPanelContainer` has no background of its own (`PreviewPanel.tsx:172-176`), and the templates use `max-w-5xl mx-auto`, so any container wider than the template leaves transparent side gutters.
- Combined with **C-01**, this corrupted thumbnail *replaces* the user's real photo in IndexedDB.

**M-17 — Studio URL deep-link round-trip is not idempotent**
- `src/components/studio/StudioIsland.tsx:343-358` has **no `isInitialized` guard** (unlike the older `EditorIsland.tsx:176-194`). On the first commit it writes the *default preset* values into the address bar, briefly clobbering the deep-linked `?template=&story=&tagline=`, then rewrites them on the next commit.
- Additionally, `StudioIsland.tsx:299-340` reads `storyParam` but then **discards it** whenever `tmplParam` matched (`:323-327` hard-set `subheadline`/`author`/`photoCaption` from the preset), so `/templates?template=x&story=Y` loses both the story *and* the template's own deck — because `templates.astro:61` sends `headline` + `story` + `name` + `tagline` + `date` but **no** `subheadline`/`author` params exist.

**M-18 — The Studio share link cannot carry most of the document**
- `StudioIsland.tsx:346-350` persists only `template`, `headline`, `name`, `date`. The body text, subheadline, tagline, byline, caption and photo are all dropped. (The dead `EditorIsland.tsx:180-190` at least persisted `story` and `tagline` — but at the cost of URL-length blowups of ~4 000 characters.)

**M-19 — Non-deterministic, unbounded, silently-failing IndexedDB**
- `exportAndStorage.ts:22-39`: any Dexie failure (private mode, storage quota, blocked IDB) makes `getDatabase()` return `null`, so `getRecentClippings()` returns `[]`, `saveToDrafts()` returns `Date.now()` as a fake id (`:48`, `:65`), and `RecentClippingsDrawer` shows a permanent "No Saved Clippings Yet" empty state. The user is **never told** that persistence is unavailable; `StudioIsland.tsx:507-509` only `console.error`s.
- Each record stores a full base64 photo **and** a base64 thumbnail with **no quota management, no retention policy, and no `db.version(2)` migration path**.

**M-20 — `GeneratorApp` print button can silently do nothing**
- `GeneratorApp.astro:588-604`: `window.open('', '_blank')` with **no popup-blocked branch** (unlike `exportEngine.ts:401-404` which does handle it), and `onload="window.print();window.close();"` closes the window immediately after `print()`, which aborts the job in Firefox and some Safari versions.

**M-21 — Export filename is a hard-coded constant**
- `exportEngine.ts:16` `BASE_FILENAME = 'vintage-newspaper-clipping'` ⇒ PNG, JPG, 4K PNG, and PDF all download as `vintage-newspaper-clipping.*` and the browser appends `(1)`, `(2)`, … The Generator *does* slugify the headline (`GeneratorApp.astro:561-564`) — the two editors disagree.

**M-22 — `html2canvas` `border-radius` is unreliable**
- All 8 templates set `rounded-xs` on the paper root (`NewYorkTimesTemplate.tsx:49`, `WashingtonPostTemplate.tsx:58`, `TOITemplate.tsx:65`, `GuardianTemplate.tsx:53`, `LeMondeTemplate.tsx:51`, `JapanTimesTemplate.tsx:69`, `KoreaHeraldTemplate.tsx:51`, `GulfNewsTemplate.tsx:51`) together with `overflow-hidden`. html2canvas commonly renders these as square corners in exports.

**M-23 — `NewYorkTimesTemplate` still does not receive `tagline`**
- `src/components/editor/PreviewPanel.tsx:85-97` — the `NewYorkTimesTemplate` call site omits `tagline={tagline}` (all other 7 templates pass it). The component has no `tagline` prop at all. Not a crash, but the Studio's "Motto / Sub-Masthead Tagline" input is **silently ignored** for the New York Times template.

**M-24 — `PreviewPanel` hard-codes a DOM id inside a React component**
- `PreviewPanel.tsx:174` and `:223` both render `id="previewPanelContainer"`. `StudioIsland.tsx:488` and `EditorIsland.tsx:256,300` then look it up globally via `document.getElementById`. Rendering `PreviewPanel` twice on any future page creates duplicate ids and cross-talk. The `previewRef` already attached at `StudioIsland.tsx:290/965` is the correct pattern and is only used for printing.

**M-25 — `GeneratorApp` has an unbound `weatherLeft`**
- `presets.ts:10` defines `weatherLeft`; `generator-engine.ts:144` draws it; but the UI (`:100-122`) only exposes `inputPrice` + `inputWeatherRight`. Users can never change the left earpiece.

**M-26 — `isCompact` prop and `.compact-mode` class are dead**
- `GeneratorApp.astro:13, 18` reads `isCompact` and emits `compact-mode`; the class is not defined anywhere in `generator.css`, and no caller passes the prop.

**M-27 — `@astrojs/tailwind` and `post.render()` are on deprecated APIs**
- `astro.config.mjs:106` uses `@astrojs/tailwind` (deprecated for Astro 5 in favour of `@tailwindcss/vite`); `blog/[...slug].astro:18` and `[lang]/blog/[...slug].astro:826` use `await post.render()` (deprecated; Astro 5 prefers `import { render } from 'astro:content'`). Both still build today (verified) but will break on the next major.

**M-28 — `exportAsPDF`'s bespoke `onclone` duplicates logic and ends in dead code**
- `exportEngine.ts:333-364`: 30 lines re-implemented inline, mixing `window.getComputedStyle` with nodes from `clonedDoc`, and terminating in an empty block:
  ```ts
  const pristineFallback = clonedDoc.getElementById('newspaper-export-target');
  if (pristineFallback) {
    // ensure transform none already handled
  }
  ```

**M-29 — ~12.5 MB of unreferenced duplicate images ship to production**
- `public/hero-image.jpg` + `public/hero-image.png` (identical byte size, 1 948 323 B), `public/usecase-image.jpg` + `.png` (2 272 420 B), `public/image3.jpg` + `.png` (2 305 253 B). Only `public/images/hero-image.jpg` and `public/images/usecase-image.jpg` are referenced (`index.astro:94, 256`). The `.png` copies are byte-identical duplicates of the `.jpg` copies.

---

### 🟢 LOW

| ID | File / line | Issue |
|---|---|---|
| **L-01** | `exportEngine.ts:124-130` | `exportAsPNG(element?: HTMLElement \| boolean, is4K = false)` overload hack; `if (typeof element === 'boolean')` runtime branch instead of a proper overload signature. |
| **L-02** | `exportAndStorage.ts:209-211` | `URL.createObjectURL(blob)` → `triggerDownload()` → `URL.revokeObjectURL(url)` **synchronously**. Several browsers abort the download. Needs `setTimeout(revoke, 1000)`. (Dead code path, but a trap.) |
| **L-03** | `generator-engine.ts:526-532` | `link.click()` without `document.body.appendChild(link)` — fails on older Safari/WebKit. |
| **L-04** | `generator-engine.ts:27` | `getContext('2d', { willReadFrequently: true })` on the **main** canvas forces a CPU-backed surface, slowing compositing; `getImageData` is only used on the *temp* canvas (`:308`). |
| **L-05** | `Layout.astro:94-98`, `Seo.astro:93-97` | `<meta property="twitter:*">` should be `name=`, not `property=`. |
| **L-06** | `Layout.astro:56` | `title.includes('The Vintage Press') ? title : \`${title} | …\`` — callers already append `" — The Vintage Press"`, producing `X — The Vintage Press \| The Vintage Press`. |
| **L-07** | `generator-engine.ts:369-381` | `let finalWidth/finalHeight` assigned then unused → dead locals (part of **C-05**). |
| **L-08** | `RecentClippingsDrawer.tsx:258` | `item.story.length` — throws for any legacy record written before `story` was required. |
| **L-09** | `RecentClippingsDrawer.tsx:42-51` | `if (!id) return;` — would skip a record with `id === 0`. |
| **L-10** | `generator-engine.ts:401-417` | Drop cap: the first two wrapped lines are indented `colX + 38` while the glyph is 44 px tall — they can collide; the offset is hard-coded rather than derived from the measured glyph width. |
| **L-11** | `generator-engine.ts:312-316` | The `halftone` filter writes `g = max(15, val-10)`, `b = max(10, val-20)` — a colour tint, not a monochrome dot screen; the label over-promises. |
| **L-12** | `generator.css:217-223` | `#newspaperCanvas` has a `transition: transform 0.2s ease` with nothing ever transforming it. |
| **L-13** | `index.astro:107`, `Footer.astro` etc. | Tailwind classes `shadow-2xs` (`StudioIsland.tsx:543`) exist only in Tailwind ≥ 3.4; on older lockfiles they silently emit nothing. |
| **L-14** | `langDetect.ts:101` | Reads `localStorage.user_locale` / `preferred_locale`; **nothing ever writes them** (verified) ⇒ the remembered-preference branch is dead. |
| **L-15** | `langDetect.ts:151` | `const targetUrl = \`/${subPath}/${window.location.search}${window.location.hash}\`` — the stray `/` before the query string produces `//?template=x`. |
| **L-16** | `PreviewPanel.tsx:175` | `data-selected-template={raw}` is written but never read by any consumer. |
| **L-17** | `PreviewPanel.tsx:23, 41` | `className` prop is declared and interpolated but neither caller passes it. |
| **L-18** | `EditorIsland.tsx:23, 39-94` | `TemplateOption.fontStyle` is declared and populated for 5 templates but never consumed. |
| **L-19** | `templates/NYTTemplate.tsx:33-38` | `ensureFonts()` body is an unconditional `return` — a no-op function. |
| **L-20** | `JapanTimesTemplate.tsx:20-32` | `ensureFonts()` is called during **render** (L56), i.e. it mutates `document.head` as a side effect of React rendering — an SSR/hydration-hostile pattern (harmless only because it is `client:only`). |
| **L-21** | `index.astro:79-85`, `[lang]/index.astro:391-397` | Hard-coded social proof "100,000+ clippings" / "4.9 / 5.0 rating" presented as fact with no basis. |
| **L-22** | `pages/[lang]/blog/[...slug].astro:806-822` | `getStaticPaths` does not filter `post.data.draft` for `lang` (it does — `!data.draft` at L807) — however it *does* skip `en`, so English posts are unreachable under any locale prefix (intended) while `BlogCard`'s `^(lang\|en)/` regex (L16) still anticipates them. |
| **L-23** | `astro.config.mjs:200-212` | The `/editor` → `/studio` "301" redirects are emitted as **static meta-refresh HTML stubs** in `output: 'static'` (confirmed: `dist/editor/index.html` is generated), so no HTTP 301 status is ever returned. |
| **L-24** | `astro.config.mjs:111-126` | `@astrojs/sitemap`'s `i18n.locales` is given a `{code: 'xx-YY'}` string map; the integration expects `{ code: { path, lang } }`. The config is likely silently ignored, so hreflang alternates in the XML come only from the XSL post-processing, not the integration. |
| **L-25** | `content/config.ts:15` | The `language` zod enum is ordered `en, zh, pt-BR, ru, ja, tr, ko, es, fr, de, hi` while `astro.config.mjs:180-192` orders it `…, ko, de, es, fr, hi`. Cosmetic drift; easy to desync. |
| **L-26** | `src/i18n/ui.ts` | `ui` is typed `Record<SupportedLanguage, Record<string,string>>` but `defaultUI` is a literal object ⇒ key typos in `useTranslations(key: UIKey)` are caught, but a **missing** key silently returns the key itself (`i18n/utils.ts:26`). |

---

## 6. UI/UX & Accessibility Gaps

### 6.1 Layout shift & first paint
1. **`client:only="react"` renders nothing on the server** (`StudioIsland.tsx` → `dist/studio/index.html` has an empty `<astro-island>`). Users see a blank white area between the Navbar and the footer while ~200 KB of React + templates hydrate. `studio.astro:16` sets `min-h-[calc(100vh-80px)]` on `<main>`, which prevents scroll-jank but not the visual emptiness. **No skeleton, no spinner, no `<noscript>` fallback.**
2. **Dead `#studio` anchor.** `Navbar.astro:42-44` computes `studioUrl = '#studio'` on the home page, but no element with `id="studio"` exists anywhere in the project (verified by grep; the home page has `id="how-it-works"`, `id="use-cases"`, `id="faq"` only). The Navbar "Create Clipping" CTA and the mobile-drawer CTA therefore do **nothing** on `/` and `/[lang]/` — they just append `#studio` to the URL. Verified: `dist/index.html` contains 2 `href="#studio"`, 0 `id="studio"`.
3. **Export toolbar layout thrash.** `StudioIsland.tsx:899-951` — the PNG/JPG/PDF buttons all render `isExporting ? 'Exporting...' : 'PNG'`, so **all three labels change simultaneously** and the user can't tell which format is running (only the spinner banner at L955-959 shows `exportFormat`). The 4 K button has the correct per-button conditional.
4. `min-h-[420px]` preview box (`StudioIsland.tsx:963`) plus `overflow-x-auto` means the paper visibly resizes on every window resize and on mobile it reflows between 1 and 3 columns with no zoom control.

### 6.2 Mobile controls
5. **The preview is *not* a faithful mobile representation.** On a phone the template collapses to a single narrow column; the export is always rendered at 1000 px. Users author against a layout they will never receive (**H-03**).
6. The dropzone (`StudioIsland.tsx:797-854`) is a `<div onClick>` with **no `role="button"`, no `tabIndex`, no `onKeyDown`** ⇒ **not keyboard-operable**. Same defect in `EditorIsland.tsx:519-531`.
7. `GeneratorApp` uses a 4-column split (`generator.css:3-14`) collapsing at 1080 px, but `GeneratorApp.astro:3` hard-codes the control column at **460 px** with no fluid fallback before the breakpoint.
8. No `inputmode`/`enterkeyhint` on the Studio text fields; no character counter on the 1000-char body textarea.

### 6.3 Feedback, errors, toasts
9. **Silent failures everywhere.** `StudioIsland.tsx:507-509` (`console.error` only), `:337-339` (`console.warn` only), `processImageFile` `:396` (silent `return` on a non-image), `processImageFile` has no size cap and no decode-error handler. The user gets **zero** feedback when a draft fails to save or an image is rejected.
10. `RecentClippingsDrawer.tsx:29-31, 48-50, 77-79` — all Dexie errors are `console.error`'d and the drawer shows a normal-looking empty state.
11. **No toast on successful Studio export.** `exportEngine.ts` only toasts on *failure*; the Generator toasts on download (`:572-574`) but not on copy failure.
12. **No "export in progress" lockout on Print.** `handlePrint` (`StudioIsland.tsx:439-443`) never sets `isExporting`, so the print button stays enabled and can be spammed.
13. `GeneratorApp.astro:580-585` — `copyToClipboard()` returning `false` produces **no** user feedback at all.
14. `generator-engine.ts:27` `throw new Error('Could not get 2D canvas context')` in the constructor (`GeneratorApp.astro:355`) is **not** wrapped in try/catch ⇒ a single uncaught throw kills the whole Generator with a blank page (no React error boundary exists here).

### 6.4 Accessibility
15. **`RecentClippingsDrawer`**: `role="dialog" aria-modal="true"` (`:99`) but **no focus trap, no initial focus, no `Escape` handler, no focus restore, and no body scroll lock**. Keyboard users can tab into the inert page behind the overlay.
16. **No `aria-live` region** for the export progress banner (`StudioIsland.tsx:955-960`) — screen readers are not told an export started/finished.
17. **Icon-only buttons lack accessible names**: the Print button (`StudioIsland.tsx:926-937`) has no text and no `aria-label` (only `title`); the same for the drawer's delete button (`RecentClippingsDrawer.tsx:216-225`, `title` only) and the navbar hamburger (`Navbar.astro:157`, has `aria-label` — OK).
18. **The nav dropdown is not keyboard-navigable**: `Navbar.astro:211-223` toggles on `click` only; there is no ArrowDown/ArrowUp/Home/End handling and the menu items are plain `<a role="menuitem">` inside a `div role="menu"` (not a `menu` widget).
19. **Contrast:** `text-mute` (`#868685`) on `bg-canvas-soft` (`#e8ebe6`) — used for `StudioIsland.tsx:525, 626, 772, 849, 982` — computes to roughly **2.9 : 1**, well below WCAG AA 4.5 : 1 for body text. `RecentClippingsDrawer.tsx:117` uses `text-ink-mute` which **is not a defined Tailwind colour** in `tailwind.config.mjs` (only `ink.mute`) ⇒ **the class emits nothing** and the text inherits the body colour.
20. **Drop caps are `aria-hidden` in some templates but not others** — `TOITemplate.tsx:175` and `TimesOfIndiaTemplate.tsx:156` mark the glyph `aria-hidden`; `NewYorkTimesTemplate.tsx:207`, `WashingtonPostTemplate.tsx:172`, `GuardianTemplate.tsx:190`, `LeMondeTemplate.tsx:154`, `JapanTimesTemplate.tsx:158`, `KoreaHeraldTemplate.tsx:188`, `GulfNewsTemplate.tsx:176` do **not**, so screen readers announce the first letter separately ("I" then "n an unprecedented series…").
21. `PreviewPanel.tsx:590` renders the default-template masthead inside a `<div aria-hidden="true">` — the newspaper name is invisible to AT.
22. Form labels are correctly associated in the Studio (`htmlFor`/`id` pairs throughout `StudioIsland.tsx:620-869`) but **every** label in `GeneratorApp.astro` uses `for=` correctly *except* the pill selectors (`#fontPillSelector`, `#paperStyleSelector`, `#photoFilterSelector`) and the `#resetBtn`, which have no accessible group role and are invisible to a screen-reader user as a group.

### 6.5 Missing conveniences
23. **No keyboard shortcuts** anywhere (⌘/Ctrl+S to save, ⌘/Ctrl+P handled natively, Esc to close the drawer).
24. **Reset exists only in the Studio** (`handleReset`, `StudioIsland.tsx:380-392`) — the Generator's Reset button is dead (**H-11**).
25. No "unsaved changes" indicator; `history.replaceState` silently overwrites the shared URL.
26. No confirmation before the browser-unload when work is unsaved.
27. No aspect-ratio / column-count control in the Studio (the Generator has column count at `GeneratorApp.astro:161-166`).
28. `StudioIsland.tsx:949` the 4 K button's label logic is `isExporting && exportFormat === '4K'` — correct, but the PNG/JPG/PDF buttons (`:906, 915, 924`) all use the bare `isExporting ?` check (**3.1**).

---

## 7. Prioritized Action Plan for Fixes

> Execute strictly in order. Each phase is independently shippable; Phase 1 contains the data-loss and export-fidelity bugs.

### Phase 1 — Critical Bugs & Export Fixes

1. **[C-01]** `src/utils/exportAndStorage.ts:44-67` — add a `thumbnail` field to `ClippingRecord` and the Dexie store (`db.version(2).stores({ clippingHistory: '++id, template, headline, timestamp, thumbnail })`), and change line 58 to `base64Image: data.base64Image || null, thumbnail: data.thumbnail || null`. Update `RecentClippingsDrawer.tsx:230-241` to prefer `item.thumbnail`, and `StudioIsland.tsx:481` to read `record.base64Image`.
2. **[C-02]** Extend `ClippingRecord` with `author?: string` and `subheadline?: string`; write them in `saveToDrafts`; read them in `StudioIsland.handleRestoreSession` (`:469-483`) **before** falling back to `preset?.…`.
3. **[C-03]** `src/scripts/generator-engine.ts:425-439` — introduce `let overflowed = false;`; when a column is exhausted set it, `break` the inner loop **and** guard the outer loop with `if (overflowed) break;`. Draw a "Continued on Page N" rule in the last column instead of silent truncation.
4. **[C-04]** `src/components/generator/GeneratorApp.astro:359-362` — seed `currentOptions` from `defaultPreset` instead of `PRESETS[0]`; and add a client-side `?preset=` reader in `initGenerator` (mirror `StudioIsland.tsx:299-340`) so the deep link works in a static build.
5. **[C-05]** `src/utils/exportEngine.ts:369-382` — use the fitted `finalWidth`/`finalHeight` and centre the image; add an orientation branch (`canvas.width > canvas.height ? 'l' : 'p'`); optionally emit one page per 297 mm slice.
6. **[H-01]** `src/utils/exportEngine.ts` — move `sanitizePristineClone(clone)` to **after** `document.body.appendChild(container)` in all six call sites (`:143, 190, 243, 262, 282, 325`).
7. **[H-02]** `src/utils/exportEngine.ts:137` — `clone.removeAttribute('id')` right after `cloneNode(true)` so `onclone`'s `getElementById` can only ever match the offscreen node. Delete the bespoke PDF `onclone` (`:333-364`) and reuse `getOnClone()`.
8. **[H-09]** Pre-flight the 4 K path: measure `clone.scrollHeight`, cap `width*height*scale² ≤ 16e6`, downscale `scale` if needed, and surface the reduction via `window.showToast?.()`.
9. **[H-10]** `StudioIsland.tsx:448` → `navigator.clipboard.writeText(...).catch(() => window.showToast?.('Copy failed'))`; `GeneratorApp.astro:580-585` → add an `else` branch that toasts "Clipboard not supported in this browser".
10. **[H-11]** `GeneratorApp.astro` — bind `#resetBtn` to a `resetToPreset()` that restores `PRESETS[0]` into both `currentOptions` and every input/checkbox/slider, then `triggerRender()`.
11. **[M-16]** `exportAndStorage.ts:157` — change `backgroundColor: null` to `backgroundColor: '#ffffff'` in `renderElementCanvas` so JPEG thumbnails stop producing black gutters.
12. **[M-06]** Replace all `window.showToast(` in `exportEngine.ts` with optional chaining so a missing Toast can never mask the original error.

### Phase 2 — Hydration, State & Performance

13. **[H-04]** `GeneratorApp.astro:418-428` — debounce text inputs (~180 ms) and `requestAnimationFrame`-throttle the aging slider; bind `input` **or** `change` (not both) for `<select>`/checkbox; move `drawPhoto`'s per-pixel loop into an `OffscreenCanvas` worker.
14. **[H-05]** `StudioIsland.tsx` — wrap `<PreviewPanel>` in `React.memo`, feed the body via `useDeferredValue(story)`, and debounce the `history.replaceState` effect (`StudioIsland.tsx:343-358`) by 400 ms.
15. **[H-03]** `exportEngine.ts:103-118` — render into an explicit fixed-width `iframe` (1200 px) instead of relying on `windowWidth`; remove `windowWidth`/`windowHeight` from `renderElementCanvas` (`exportAndStorage.ts:159-160`) or set them to the fixed design width.
16. **[M-17]** Add the `isInitialized` guard to `StudioIsland.tsx:343-358` and stop clobbering `storyParam` at `:323-327` — accept `subheadline`/`author` URL params, and have `templates.astro:61` emit them.
17. **[M-18]** Extend the Studio share URL to include `tagline`, `subheadline`, `author` and a (length-capped) `story`, or drop "Share" in favour of a proper "Export project JSON".
18. **[M-19]** `exportAndStorage.ts:22-39` — surface Dexie unavailability: have `getDatabase()` set a module flag that `StudioIsland.handleSaveDraft` reports via `showToast`; add a `db.version(2)` migration and a 20-record retention cap.
19. **[M-11]** `generator-engine.ts:113-118, 335` — replace `Math.random()` with a seeded PRNG keyed to the option set, so preview and export are identical.
20. **[M-12]** `generator-engine.ts:174-205, 353` — route the masthead, tagline, earpiece strip and photo caption through `wrapText()` (or add `fitTextToWidth()` that shrinks the font until `measureText` fits) instead of raw `fillText`.
21. **[M-14]** Delete dead code: `editor/EditorIsland.tsx` (686 L), `templates/NYTTemplate.tsx` (218 L), `templates/TimesOfIndiaTemplate.tsx` (259 L), `templates/index.ts` (26 L), `exportEngine.exportAsImage` (92 L), `i18n/utils.ts::getLangFromUrl`/`getAllLanguageRoutes`, `PreviewPanel.tsx:235-574` (~340 L). Collapse `TEMPLATES` + `PRESETS` into one `src/data/presets.ts`.
22. **[M-25]** Add an `inputWeatherLeft` control to `GeneratorApp.astro:100-122` and bind it in `updateFromUI` (`:393-416`).
23. **[M-15]** Guard `initGenerator`/`setupNavbar`/`setupCategoryFilters` with a `dataset.bound` flag so they can never double-bind.
24. **[H-06]** `[lang]/blog/index.astro:12-17` — when falling back to English content, pass `lang="en"` to `BlogCard` (or generate English-content alias routes for every locale).
25. **[H-07]/[H-08]** Add `public/og-image.png` (1200×630) and update `public/robots.txt` to `https://newspaper-clipping.pages.dev/…`.
26. **[M-02]** `astro.config.mjs` — replace bare `path.resolve('src/…')`/`path.resolve('dist')` with `fileURLToPath(new URL('./src/…', import.meta.url))`; drop the `astro:server:setup` middleware or guard it on `command === 'build'`.

### Phase 3 — UI/UX, Realism & Polish

27. **[3.6 #2]** Add `id="studio"` to the Studio hero section **or** point the Navbar home CTA at `getRelativeLocaleUrl(lang, 'studio')`.
28. **[6.1]** Add a skeleton + `<noscript>` fallback inside `studio.astro` so `client:only` doesn't blank the page; add `aria-live="polite"` to the export banner and per-button `isExporting && exportFormat === 'X'` labels (`StudioIsland.tsx:899-951`).
29. **[3.3 S4]** Implement real torn edges: a deterministic jagged `clip-path`/`mask` on the Studio paper root, or a genuine ragged `Path2D` in `drawTornEdgesOverlay` (`generator-engine.ts:121-133`). Until then rename the toggle.
30. **[3.3 S7]** Add an SVG `feTurbulence`+`feDisplacementMap` ink-bleed filter to the template roots so headlines have press-ink texture.
31. **[M-10]** Replace `mix-blend-multiply` grain with an inline `feTurbulence` SVG data-URI (survives html2canvas), and add the grain layer to the 4 templates that lack it (Guardian, Gulf News, Korea Herald, Japan Times).
32. **[M-22]** Remove `rounded-xs` from the 8 template roots (or pre-render a rounded PNG mask) — html2canvas drops border-radius.
33. **[M-21]** Derive the export filename from the headline (`slugify(headline)`), matching `GeneratorApp.astro:561-564`.
34. **[M-04]** Rewrite `printClipping`: copy `target.outerHTML` (not `innerHTML`), remove the duplicate 1 s print timeout, don't `close()` until `afterprint`, add `noopener`, and add `@page { size: A4 auto; margin: 8mm }`.
35. **[M-20]** Add a popup-blocked branch to `GeneratorApp.astro:588-604` and close the window on `afterprint` rather than inline.
36. **[6.4]** `RecentClippingsDrawer` — add `onKeyDown` Escape handling, a focus trap, focus restore, and `document.body.style.overflow='hidden'`; give the Print button (`:926-937`) and the delete button (`:216-225`) `aria-label`s.
37. **[6.4 #19]** Replace `text-ink-mute` (undefined) with `text-ink-mute` → `text-mute` (`RecentClippingsDrawer.tsx:117, 137, 211, 248, 257, 267`) and darken `--color-mute` or its usages to reach 4.5 : 1.
38. **[6.4 #20]** Add `aria-hidden="true"` to every drop-cap `<span>` and remove `aria-hidden` from `PreviewPanel.tsx:590`.
39. **[6.4 #22]** Wrap the Generator pill selectors in `role="radiogroup"` with `role="radio" aria-checked` and a keyboard handler.
40. **[3.5 #5]** Add WebP export (`canvas.toDataURL('image/webp', 0.92)`) and a resolution selector (1× / 2× / 4× / print 300 DPI) in the Studio export toolbar.
41. **[3.5 E8]** Add "Copy image to clipboard" to the Studio toolbar (the Generator already has it), reusing the offscreen-clone canvas so the copied bitmap matches the download.
42. **[3.4]** Add zoom/pan controls (a `transform: scale()` on `#newspaper-export-target` with a corresponding scale multiplier in `html2canvas`, or CSS `zoom`) and an aspect-ratio preset picker.
43. **[3.2 M4/M7/M8]** Expose the photo filter set (halftone / sepia / contrast / grain / none) and an aging slider in the Studio so both editors share a feature baseline.
44. **[3.1 C12]** Make the dateline/location an editable field threaded into all 8 templates instead of the 7 hard-coded city strings.
45. **[M-01]** Collapse `Layout.astro` and `BaseLayout.astro` onto one layout; delete the duplicated `:root` block (`Layout.astro:184-214`) and the re-declared `.btn-primary`/`.card-content`/`.hero-band` (`:216-248`) so `design-tokens.css` + `global.css` are the single source of truth.
46. **[L-06]** Normalise `<title>` composition — strip the `\|` suffix in `Layout.astro:56` and rely on callers.
47. **[3.6 #5]** Complete i18n: add the missing `gen.*` block (~60 keys) and the missing `home.*`/`features.*`/`feat.*` keys to all 10 dictionaries (target ≥ 95 % coverage; currently 33.9 % / 56.4 %).
48. **[L-03]** Translate or author `zh`, `pt-BR`, `ru`, `tr`, `ko` blog content (5 locales currently render dead-link English cards), or hide the blog nav for those locales.
49. **[6.5]** Add keyboard shortcuts (⌘/Ctrl+S save draft, Esc close drawer), a "Reset" in the Generator, an unsaved-changes `beforeunload` guard, and a character/word counter on the body textarea.
50. **[M-03]** Rewrite `README.md` against the real tree (11 languages, `StudioIsland`/`PreviewPanel`/`exportEngine`/`exportAndStorage`, and an honest feature list), and fix the "6 languages" / "reading time" / "torn edges" claims.
51. **[M-29]** Delete `public/{hero-image,usecase-image,image3}.{jpg,png}` (~12.5 MB) and keep only `public/images/*`.
52. **[M-27]** Migrate `@astrojs/tailwind` → `@tailwindcss/vite` and `post.render()` → `import { render } from 'astro:content'` while the major version is still 5.x.
53. **[L-19]/[L-20]** Delete the no-op `ensureFonts()` in `NYTTemplate.tsx` and move `JapanTimesTemplate.ensureFonts()` out of the render body into a `useEffect`.
54. **[L-25]** Align the `language` enum ordering in `content/config.ts:15` with `astro.config.mjs:180-192` (or better: derive both from the `languages` map in `i18n/ui.ts`).