# 📰 The Vintage Press — Newspaper Clipping Generator & Blog

A high-performance, multi-lingual web application and creative studio for generating photorealistic vintage newspaper clippings in high resolution (300 DPI / 4K).

Built with **Astro 5**, **Vanilla CSS** conforming to the **Wise Design System** (`#9fe870` Primary Green CTA pill, `#e8ebe6` Sage Soft Canvas, `#0e0f0c` Ink, and 24px border radii), and **HTML5 Canvas**.

---

## ✨ Features

- **🎨 Photorealistic Vintage Engine**:
  - Authentic Gothic, Broadsheet Serif, Tabloid Sans, and Typewriter masthead typography.
  - Multi-column linotype text composition with authentic vintage drop-caps.
  - 1920s Halftone dot-matrix photographic filters, sepia monochrome, and woodblock lithography.
  - Procedural paper weathering: yellowing patina, coffee ring stains, fold creases, and realistic torn edges.
- **🌐 Native Multi-Lingual Support (i18n)**:
  - English (`en` default), Spanish (`es`), French (`fr`), German (`de`), Hindi (`hi`), Japanese (`ja`).
  - Interactive language switcher dropdown in header and footer.
  - Localized routes (`/`, `/es/`, `/fr/`, `/de/`, `/hi/`, `/ja/`).
- **📝 Press Archive Blog**:
  - Astro Content Collections with markdown & MDX support.
  - Multi-lingual articles, categories, tag filtering, reading times, and author badges.
  - RSS 2.0 feed (`/rss.xml`) and dynamic sitemap (`/sitemap-index.xml`).
- **⚡ High-Resolution Export**:
  - 1-Click PNG & JPEG download in 300 DPI for printing, framing, and school projects.
  - Copy directly to clipboard (`navigator.clipboard.write([ClipboardItem])`).
  - Native print layout trigger.
- **🔒 100% Privacy Focused**:
  - All canvas and image rendering operates entirely in the user's browser. No images are uploaded to remote servers.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Architecture

```
newspaper-clipping/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── LanguagePicker.astro
│   │   │   ├── Seo.astro
│   │   │   └── Toast.astro
│   │   ├── generator/
│   │   │   └── GeneratorApp.astro
│   │   ├── home/
│   │   │   ├── HeroSection.astro
│   │   │   ├── FeatureGrid.astro
│   │   │   ├── TemplatesShowcase.astro
│   │   │   ├── HowItWorks.astro
│   │   │   ├── Testimonials.astro
│   │   │   └── FaqAccordion.astro
│   │   └── blog/
│   │       └── BlogCard.astro
│   ├── content/
│   │   ├── config.ts
│   │   └── blog/ (en, es, fr, de, hi, ja markdown articles)
│   ├── i18n/
│   │   ├── ui.ts (Dictionaries for 6 languages)
│   │   └── utils.ts
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── generator.astro
│   │   ├── templates.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   ├── [lang]/
│   │   │   ├── index.astro
│   │   │   ├── generator.astro
│   │   │   ├── templates.astro
│   │   │   └── blog/
│   │   ├── 404.astro
│   │   └── rss.xml.ts
│   ├── scripts/
│   │   ├── generator-engine.ts
│   │   └── presets.ts
│   └── styles/
│       ├── design-tokens.css
│       ├── typography.css
│       ├── global.css
│       └── generator.css
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## 📜 License

Free for personal, educational, and commercial use.
