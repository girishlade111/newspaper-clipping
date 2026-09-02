/**
 * i18n Dictionary and UI Localization Configuration
 * Supported languages: en (default), zh, pt-BR, ru, ja, tr, ko
 * UI/UX Tone: Calm editorial Scandinavian fintech aesthetic based on DESIGN.md
 */

export const languages = {
  en: {
    label: 'English',
    flag: '🇬🇧',
    dir: 'ltr',
    subpath: '',
    hreflang: 'en',
  },
  zh: {
    label: '中文',
    flag: '🇨🇳',
    dir: 'ltr',
    subpath: 'zh',
    hreflang: 'zh',
  },
  'pt-BR': {
    label: 'Português (Brasil)',
    flag: '🇧🇷',
    dir: 'ltr',
    subpath: 'pt-br',
    hreflang: 'pt-BR',
  },
  ru: {
    label: 'Русский',
    flag: '🇷🇺',
    dir: 'ltr',
    subpath: 'ru',
    hreflang: 'ru',
  },
  ja: {
    label: '日本語',
    flag: '🇯🇵',
    dir: 'ltr',
    subpath: 'ja',
    hreflang: 'ja',
  },
  tr: {
    label: 'Türkçe',
    flag: '🇹🇷',
    dir: 'ltr',
    subpath: 'tr',
    hreflang: 'tr',
  },
  ko: {
    label: '한국어',
    flag: '🇰🇷',
    dir: 'ltr',
    subpath: 'ko',
    hreflang: 'ko',
  },
} as const;

export type SupportedLanguage = keyof typeof languages;
export const defaultLang: SupportedLanguage = 'en';

export const ui = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.generator': 'Generator Studio',
    'nav.templates': 'Templates',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.createNow': 'Create Clipping',

    // Buttons & CTAs (strictly adhering to DESIGN.md 24px pill buttons)
    'btn.launch': 'Launch Studio Now',
    'btn.create': 'Generate Clipping',
    'btn.download': 'Download 4K Press PNG',
    'btn.explore': 'Explore Presets',

    // Brand Hero (Display typography Wise Sans weight 900)
    'hero.badge': '100% Free & Serverless Vintage Newspaper Studio',
    'hero.title': 'Create Authentic Vintage Newspaper Clippings in Seconds.',
    'hero.subtitle': 'Turn stories, announcements, and historical events into realistic aged newsprint. Customize Linotype headlines, vintage halftone photos, and realistic torn paper edges.',

    // Footer
    'footer.tagline': 'Authentic vintage newspaper clippings with zero friction and lifetime-free access.',
    'footer.rights': 'All rights reserved. No cookies, no server tracking, 100% client-side.',
  },
  ja: {
    // Navigation (Japanese translations for standard navigation terms)
    'nav.home': 'ホーム',
    'nav.generator': 'ジェネレータースタジオ',
    'nav.templates': 'テンプレート',
    'nav.blog': 'ブログ',
    'nav.about': '当サイトについて',
    'nav.createNow': '切り抜きを作成',

    // Buttons & CTAs
    'btn.launch': 'スタジオを起動',
    'btn.create': '新聞記事を生成',
    'btn.download': '高解像度PNGを保存',
    'btn.explore': 'プリセットを見る',

    // Brand Hero
    'hero.badge': '完全無料・サーバー不要のヴィンテージ新聞スタジオ',
    'hero.title': '本格的なヴィンテージ新聞の切り抜きを数秒で作成。',
    'hero.subtitle': 'あなたの物語や発表、記念日を本物のレトロ新聞スタイルに。見出し、網点写真、紙の破れ効果を自由にカスタマイズ可能。',

    // Footer
    'footer.tagline': '登録不要・完全ブラウザ処理の生涯無料ヴィンテージ新聞作成ツール。',
    'footer.rights': '全著作権所有。Cookie不使用、サーバー追跡なし。',
  },
} as const;

export type UIKey = keyof typeof ui['en'];

/**
 * Helper to safely retrieve translated strings with fallback to defaultLang
 */
export function getTranslation(lang: SupportedLanguage, key: UIKey): string {
  const dict = (ui as Record<string, Partial<Record<UIKey, string>>>)[lang];
  return dict?.[key] || ui[defaultLang][key] || key;
}
