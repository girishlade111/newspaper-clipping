import { getCollection } from 'astro:content';
import { languages, type SupportedLanguage } from '../../i18n/ui';
import { useTranslations, getRelativeLocaleUrl } from '../../i18n/utils';

export function getStaticPaths() {
  return Object.keys(languages)
    .filter(lang => lang !== 'en')
    .map(lang => ({
      params: { lang }
    }));
}