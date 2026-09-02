import { ui, defaultLang, languages, type SupportedLanguage, type UIKey } from './ui';

export function getLangFromUrl(url: URL): SupportedLanguage {
  const [, rawSub] = url.pathname.split('/');
  if (!rawSub) return defaultLang;

  // Find matching language by subpath or key
  for (const [key, config] of Object.entries(languages)) {
    if (config.subpath === rawSub || key === rawSub) {
      return key as SupportedLanguage;
    }
  }
  return defaultLang;
}

export function useTranslations(lang: SupportedLanguage) {
  return function t(key: UIKey): string {
    const langDict = (ui as Record<string, Partial<Record<UIKey, string>>>)[lang];
    const defaultDict = ui[defaultLang];
    return langDict?.[key] || defaultDict[key] || key;
  };
}

export function getRelativeLocaleUrl(lang: SupportedLanguage, path = ''): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  if (lang === defaultLang) {
    return `/${cleanPath}`;
  }
  const sub = languages[lang]?.subpath || lang;
  return `/${sub}/${cleanPath}`;
}

export function getAllLanguageRoutes() {
  return Object.entries(languages)
    .filter(([key]) => key !== defaultLang)
    .map(([key, config]) => ({
      params: { lang: config.subpath || key },
    }));
}
