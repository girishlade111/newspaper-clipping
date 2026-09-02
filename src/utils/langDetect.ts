/**
 * Client-Side Language Detection and Sub-Path Auto-Redirection
 *
 * Supported locales: en, zh, pt-BR, ru, ja, tr, ko
 * Default locale: en (served at root /)
 * Other locales: served at /<locale>/ (e.g., /pt-br/, /ja/, /zh/)
 */

export const SUPPORTED_LOCALES = ['en', 'zh', 'pt-BR', 'ru', 'ja', 'tr', 'ko'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en';

export const LOCALE_SUBPATHS: Record<SupportedLocale, string> = {
  en: '',
  zh: 'zh',
  'pt-BR': 'pt-br',
  ru: 'ru',
  ja: 'ja',
  tr: 'tr',
  ko: 'ko',
};

/**
 * Normalizes a raw BCP 47 language tag to one of the 7 supported locales.
 */
export function matchSupportedLocale(rawTag: string): SupportedLocale | null {
  if (!rawTag) return null;
  const tag = rawTag.toLowerCase().trim();

  // Brazilian Portuguese match (pt-BR, pt) -> pt-BR (subpath: /pt-br/)
  if (tag === 'pt-br' || tag.startsWith('pt')) {
    return 'pt-BR';
  }

  // Chinese matches (zh, zh-CN, zh-TW, zh-HK) -> zh
  if (tag.startsWith('zh')) {
    return 'zh';
  }

  // Japanese (ja, ja-JP) -> ja
  if (tag.startsWith('ja')) {
    return 'ja';
  }

  // Russian (ru, ru-RU) -> ru
  if (tag.startsWith('ru')) {
    return 'ru';
  }

  // Turkish (tr, tr-TR) -> tr
  if (tag.startsWith('tr')) {
    return 'tr';
  }

  // Korean (ko, ko-KR) -> ko
  if (tag.startsWith('ko')) {
    return 'ko';
  }

  // English (en, en-US, en-GB) -> en
  if (tag.startsWith('en')) {
    return 'en';
  }

  return null;
}

/**
 * Detects the user's preferred locale from localStorage or navigator.languages / navigator.language.
 */
export function detectUserLanguage(): SupportedLocale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  // 1. Honor explicitly saved user preference if available
  try {
    const saved = localStorage.getItem('user_locale') || localStorage.getItem('preferred_locale');
    if (saved && SUPPORTED_LOCALES.includes(saved as SupportedLocale)) {
      return saved as SupportedLocale;
    }
  } catch {
    // localStorage might be unavailable in restricted sandbox or private mode
  }

  // 2. Inspect browser navigator preferences
  const candidateLanguages: string[] = [];
  if (navigator.languages && navigator.languages.length > 0) {
    candidateLanguages.push(...navigator.languages);
  }
  if (navigator.language) {
    candidateLanguages.push(navigator.language);
  }

  for (const raw of candidateLanguages) {
    const matched = matchSupportedLocale(raw);
    if (matched) {
      return matched;
    }
  }

  return DEFAULT_LOCALE;
}

/**
 * Checks if the current page is the root domain and redirects if a non-default locale is detected.
 */
export function autoRedirectRoot(): void {
  if (typeof window === 'undefined' || typeof location === 'undefined') return;

  const currentPath = window.location.pathname;
  // Only redirect visitors landing on the root domain path
  const isRootPath = currentPath === '/' || currentPath === '' || currentPath === '/index.html';

  if (!isRootPath) {
    return;
  }

  const detectedLocale = detectUserLanguage();

  // English is served at the root (/), so no redirection is required
  if (detectedLocale === DEFAULT_LOCALE) {
    return;
  }

  const subPath = LOCALE_SUBPATHS[detectedLocale];
  if (subPath) {
    const targetUrl = `/${subPath}/${window.location.search}${window.location.hash}`;
    // Use location.replace to avoid cluttering the browser history stack
    window.location.replace(targetUrl);
  }
}

// Auto-run immediately when script loads in the browser
if (typeof window !== 'undefined') {
  autoRedirectRoot();
}
