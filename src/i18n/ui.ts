/**
 * i18n Dictionary and UI Localization Configuration
 * Supported languages: en (default), zh, pt-BR (slug: pt-br), ru, ja, tr, ko
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
  'pt-br': {
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

export type SupportedLanguage = keyof typeof languages | 'pt-BR';
export const defaultLang: SupportedLanguage = 'en';

export const defaultUI = {
  // Navigation (Standard navigation terms strictly following DESIGN.md)
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
  'hero.ctaPrimary': 'Create Clipping',
  'hero.ctaSecondary': 'Browse Templates',
  'hero.statsClippings': 'Clippings Generated',
  'hero.statsRating': 'Client Rating',

  // Feature Highlights (Sage & white contrast bands)
  'features.title': 'Fintech Precision Meets Vintage Linotype Typography',
  'features.subtitle': 'Every single clipping is rendered directly in your browser canvas at up to 4K resolution with zero server latency and total privacy.',
  'feat.1.title': '100% Client-Side Engine',
  'feat.1.desc': 'Your headlines, stories, and uploaded photos never leave your device. Zero server calls, zero tracking.',
  'feat.2.title': 'Authentic Halftone & Paper Grain',
  'feat.2.desc': 'True-to-era Linotype newspaper typography with simulated newsprint degradation, yellowing, and creases.',
  'feat.3.title': 'Instant 4K PNG Export',
  'feat.3.desc': 'Generate crisp ultra-high-definition exports ready for print, social media banners, or framing.',
  'feat.4.title': 'Lifetime Free & Unlimited',
  'feat.4.desc': 'No subscriptions, no watermarks, no paywalls, and no signup forms required. Forever free.',

  // Footer (Dark ink band)
  'footer.tagline': 'Authentic vintage newspaper clippings with zero friction and lifetime-free access.',
  'footer.rights': 'All rights reserved. No cookies, no server tracking, 100% client-side.',
  'footer.links': 'Quick Links',
  'footer.legal': 'Free for personal and commercial usage.',
  'footer.madeWith': 'Crafted with Scandinavian editorial precision.',

  // Blog
  'blog.title': 'Vintage Printing Chronicles',
  'blog.subtitle': 'Explorations in typography, newspaper history, and vintage design techniques.',
  'blog.allPosts': 'All Articles',
  'blog.backToBlog': 'Back to Articles',
  'blog.publishedOn': 'Published on',

  // Generator UI
  'gen.reset': 'Reset',
  'gen.tabs.content': 'Content',
  'gen.tabs.style': 'Style & Paper',
  'gen.tabs.photo': 'Photo Filter',
  'gen.tabs.presets': 'Presets',
  'gen.newspaperName': 'Newspaper Title',
  'gen.newspaperNamePlaceholder': 'e.g. THE DAILY CHRONICLE',
  'gen.tagline': 'Motto / Tagline',
  'gen.taglinePlaceholder': "e.g. The World's Greatest Vintage Newspaper",
  'gen.date': 'Issue Date',
  'gen.issue': 'Issue / Vol',
  'gen.issuePlaceholder': 'e.g. Vol. XLII No. 18',
  'gen.price': 'Price',
  'gen.pricePlaceholder': 'e.g. THREE CENTS',
  'gen.weatherRight': 'Header Right Text',
  'gen.weatherRightPlaceholder': 'e.g. FAIR AND WARM',
  'gen.headline': 'Main Headline',
  'gen.headlinePlaceholder': 'e.g. EXTRAORDINARY DISCOVERY ANNOUNCED',
  'gen.subheadline': 'Subheadline',
  'gen.subheadlinePlaceholder': 'e.g. Citizens gather to celebrate monumental achievement',
  'gen.author': 'Byline / Author',
  'gen.authorPlaceholder': 'e.g. By Special Correspondent',
  'gen.columns': 'Columns',
  'gen.columns.1': '1 Column',
  'gen.columns.2': '2 Columns',
  'gen.columns.3': '3 Columns',
  'gen.body': 'Article Body',
  'gen.dropCap': 'Drop Cap First Letter',
  'gen.fontStyle': 'Typography Style',
  'gen.paperStyle': 'Paper Age Style',
  'gen.paper1920': '1920s Newsprint',
  'gen.paper1950': '1950s Aged',
  'gen.paperBurnt': 'Burnt Edges',
  'gen.paperClean': 'Clean Modern',
  'gen.agingLevel': 'Paper Aging Intensity',
  'gen.tornEdges': 'Rough Torn Edges',
  'gen.creaseLines': 'Fold & Crease Marks',
  'gen.coffeeStain': 'Vintage Coffee Stain',
  'gen.photoUpload': 'Upload Photo',
  'gen.photoDrop': 'Drag & drop image or click to browse',
  'gen.photoFilter': 'Halftone Photo Filter',
  'gen.filterHalftone': 'Vintage Halftone Dots',
  'gen.filterSepia': 'Aged Sepia',
  'gen.filterContrast': 'High Contrast B&W',
  'gen.filterGrain': 'Film Grain',
  'gen.filterNone': 'Original (No Filter)',
  'gen.photoCaption': 'Photo Caption',
  'gen.photoCaptionPlaceholder': 'e.g. Scene photographed yesterday afternoon',
  'gen.copyClipboard': 'Copy to Clipboard',
  'gen.print': 'Print Clipping',
  'gen.downloadPng': 'Download 4K PNG',
};

export const japaneseUI: Partial<Record<keyof typeof defaultUI, string>> = {
  // Navigation (Standard navigation terms translated to Japanese)
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
  'hero.ctaPrimary': '今すぐ作成する',
  'hero.ctaSecondary': 'テンプレートを見る',
  'hero.statsClippings': '生成された記事数',
  'hero.statsRating': 'ユーザー評価',

  // Features
  'features.title': 'フィンテックの洗練美とヴィンテージ活版印刷の融合',
  'features.subtitle': 'すべての切り抜きはブラウザ内で最大4Kの高解像度で直接レンダリング。サーバー遅延ゼロ、完全なプライバシーを保護。',
  'feat.1.title': '完全ブラウザ完結エンジン',
  'feat.1.desc': '入力したテキストや写真は外部サーバーに送信されません。追跡ゼロの完全な安心。',
  'feat.2.title': 'リアルな網点と紙の質感',
  'feat.2.desc': '往年のライノタイプ活版印刷の風合い、経年劣化による日焼けや折り目を忠実に再現。',
  'feat.3.title': '高精細4K PNG即時出力',
  'feat.3.desc': '印刷やSNS、ポスター額装にも耐えうる超高解像度のPNG画像を瞬時にダウンロード可能。',
  'feat.4.title': '生涯完全無料・制限なし',
  'feat.4.desc': 'サブスクリプション、透かし（ウォーターマーク）、会員登録は一切不要。いつでも無料。',

  // Footer
  'footer.tagline': '登録不要・完全ブラウザ処理の生涯無料ヴィンテージ新聞作成ツール。',
  'footer.rights': '全著作権所有。Cookie不使用、サーバー追跡なし。',
  'footer.links': 'クイックリンク',
  'footer.legal': '個人利用・商用利用ともに無料。',
  'footer.madeWith': '北欧エディトリアルの緻密さで構築。',

  // Blog
  'blog.title': 'ヴィンテージ活版年代記',
  'blog.subtitle': 'タイポグラフィ、新聞の歴史、レトロ印刷技法についての探求。',
  'blog.allPosts': 'すべての記事',
  'blog.backToBlog': '記事一覧に戻る',
  'blog.publishedOn': '公開日:',

  // Generator UI
  'gen.reset': 'リセット',
  'gen.tabs.content': 'テキスト内容',
  'gen.tabs.style': 'スタイルと用紙',
  'gen.tabs.photo': '写真フィルター',
  'gen.tabs.presets': 'プリセット',
  'gen.newspaperName': '新聞名',
  'gen.newspaperNamePlaceholder': '例: THE DAILY CHRONICLE',
  'gen.tagline': '標語 / タグライン',
  'gen.taglinePlaceholder': "例: The World's Greatest Vintage Newspaper",
  'gen.date': '発行日',
  'gen.issue': '号数 / 巻数',
  'gen.issuePlaceholder': '例: Vol. XLII No. 18',
  'gen.price': '価格',
  'gen.pricePlaceholder': '例: THREE CENTS',
  'gen.weatherRight': 'ヘッダー右側テキスト',
  'gen.weatherRightPlaceholder': '例: FAIR AND WARM',
  'gen.headline': '大見出し',
  'gen.headlinePlaceholder': '例: 歴史的快挙が発表される',
  'gen.subheadline': '副見出し',
  'gen.subheadlinePlaceholder': '例: 市民が広場に集まり世紀の瞬間を祝う',
  'gen.author': '署名 / 記者名',
  'gen.authorPlaceholder': '例: 特派員 報告',
  'gen.columns': '段組み',
  'gen.columns.1': '1段組み',
  'gen.columns.2': '2段組み',
  'gen.columns.3': '3段組み',
  'gen.body': '本文記事',
  'gen.dropCap': 'ドロップキャップ（先頭大文字）',
  'gen.fontStyle': 'フォント様式',
  'gen.paperStyle': '用紙の年代スタイル',
  'gen.paper1920': '1920年代 新聞用紙',
  'gen.paper1950': '1950年代 レトロ紙',
  'gen.paperBurnt': '焦げた縁',
  'gen.paperClean': 'クリーン（現代調）',
  'gen.agingLevel': '経年劣化の度合い',
  'gen.tornEdges': '破れた紙の縁',
  'gen.creaseLines': '折り目とシワ',
  'gen.coffeeStain': 'ヴィンテージコーヒーのシミ',
  'gen.photoUpload': '写真をアップロード',
  'gen.photoDrop': '画像をドラッグ＆ドロップまたはクリック',
  'gen.photoFilter': '網点写真フィルター',
  'gen.filterHalftone': 'レトロハーフトーン網点',
  'gen.filterSepia': 'セピア調',
  'gen.filterContrast': '高コントラスト白黒',
  'gen.filterGrain': 'フィルム粒子',
  'gen.filterNone': 'オリジナル（加工なし）',
  'gen.photoCaption': '写真のキャプション',
  'gen.photoCaptionPlaceholder': '例: 昨日の式典の様子',
  'gen.copyClipboard': 'クリップボードにコピー',
  'gen.print': '印刷する',
  'gen.downloadPng': '4K高画質PNG保存',
};

export const ui: Record<string, Record<string, string>> = {
  en: defaultUI,
  zh: defaultUI,
  'pt-br': defaultUI,
  'pt-BR': defaultUI,
  ru: defaultUI,
  ja: { ...defaultUI, ...japaneseUI },
  tr: defaultUI,
  ko: defaultUI,
};

export type UIKey = keyof typeof defaultUI;

/**
 * Helper to safely retrieve translated strings with fallback to defaultLang
 */
export function getTranslation(lang: SupportedLanguage, key: UIKey): string {
  const dict = ui[lang];
  return dict?.[key] || ui[defaultLang][key] || (key as string);
}
