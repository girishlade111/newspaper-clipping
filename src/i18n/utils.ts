import { ui, defaultLang, languages, type SupportedLanguage, type UIKey } from './ui';

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