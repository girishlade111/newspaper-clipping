import { ui, defaultLang, languages, type SupportedLanguage, type UIKey } from './ui';

export function getLangFromUrl(url: URL): SupportedLanguage {
  const [, lang] = url.pathname.split('/');
  if (lang && lang in ui) {
    return lang as SupportedLanguage;
  }
  return defaultLang;
}

export function useTranslations(lang: SupportedLanguage) {
  return function t(key: UIKey): string {
    const dict = ui[lang] as Record<string, string> || ui[defaultLang];
    return dict[key] || (ui[defaultLang] as Record<string, string>)[key] || key;
  };
}

export function getRelativeLocaleUrl(lang: SupportedLanguage, path = ''): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  if (lang === defaultLang) {
    return `/${cleanPath}`;
  }
  return `/${lang}/${cleanPath}`;
}

export function getAllLanguageRoutes() {
  return Object.keys(languages).map((lang) => ({
    params: { lang },
  }));
}
