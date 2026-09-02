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
  // Navigation
  'nav.home': 'Home',
  'nav.generator': 'Generator Studio',
  'nav.templates': 'Templates',
  'nav.blog': 'Blog',
  'nav.about': 'About',
  'nav.create': 'Create Clipping',
  'nav.createNow': 'Create Clipping',
  'nav.language': 'Language',

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
  'hero.imageAlt': 'Vintage Newspaper Clipping Studio Preview',

  // How It Works (3-step process)
  'how.badge': 'Simple 3-Step Process',
  'how.title': 'How It Works',
  'how.subtitle': 'From idea to authentic aged Linotype newsprint in under 60 seconds.',
  'how.step1.num': '01',
  'how.step1.title': 'Write Your Headline & Story',
  'how.step1.desc': 'Enter your newspaper title, front-page headline, date, volume number, and multi-column linotype body text.',
  'how.step2.num': '02',
  'how.step2.title': 'Choose Paper Aging & Filters',
  'how.step2.desc': 'Select 1920s aged newsprint, rough torn edges, fold creases, coffee stains, and real halftone dot photo filters.',
  'how.step3.num': '03',
  'how.step3.title': 'Export High-Resolution 4K PNG',
  'how.step3.desc': 'Instantly download a 300 DPI print-ready clipping or print directly. 100% private, zero server calls.',

  // Use Cases Section
  'usecases.badge': 'Versatile Applications',
  'usecases.title': 'Authentic Vintage Press for Every Occasion',
  'usecases.subtitle': 'Whether for classroom history lessons, viral humor, or memorable milestone celebrations.',
  'usecases.school.tag': 'Education & History',
  'usecases.school.title': 'School & History Projects',
  'usecases.school.desc': 'Bring history lessons to life! Students and educators create Depression-era front pages, WWII announcements, and historical timeline reports with era-accurate typography.',
  'usecases.memes.tag': 'Pop Culture & Social',
  'usecases.memes.title': 'Memes & Viral Parodies',
  'usecases.memes.desc': 'Turn trending pop-culture drama, inside jokes, and gaming victories into hilarious front-page vintage tabloid sensations ready to share on Instagram, Reddit, and TikTok.',
  'usecases.pranks.tag': 'Novelty & Celebration',
  'usecases.pranks.title': 'Novelty Gifts & Harmless Pranks',
  'usecases.pranks.desc': 'Surprise friends and family with custom milestone newspapers: 50th birthday exclusives, "Couple Married 40 Years", retirement accolades, or playful office headlines.',
  'usecases.imageAlt': 'Vintage Newspaper clipping use cases and examples',

  // FAQ Section
  'faq.badge': 'Got Questions?',
  'faq.title': 'Frequently Asked Questions',
  'faq.subtitle': 'Everything you need to know about our free client-side clipping studio.',
  'faq.q1': 'Is the Newspaper Clipping Generator truly 100% free?',
  'faq.a1': 'Yes, completely and permanently free. There are no subscriptions, paywalls, watermarks, or usage limits. You can generate and download as many clippings as you want.',
  'faq.q2': 'Do you store or upload my photos and stories?',
  'faq.a2': 'No. All rendering, halftone processing, and text manipulation happen entirely in your browser using client-side HTML5 Canvas. No data ever leaves your device.',
  'faq.q3': 'What quality and resolution is the exported clipping?',
  'faq.a3': 'Clippings export in crystal-clear 4K resolution (300 DPI PNG), making them suitable for poster printing, classroom displays, digital presentations, and social media.',
  'faq.q4': 'Can I use the clippings for commercial projects or publications?',
  'faq.a4': 'Yes. Any text and images you create are yours to use without restriction for personal, educational, or commercial purposes.',
  'faq.q5': 'How does the authentic vintage aging and halftone filter work?',
  'faq.a5': 'Our engine uses custom mathematical convolution shaders to convert modern color photographs into vintage black-and-white Linotype halftone screen dots with authentic paper fiber bleed.',
  'faq.q6': 'Which languages are supported?',
  'faq.a6': 'We currently support 7 languages: English, Chinese (中文), Brazilian Portuguese (Português), Russian (Русский), Japanese (日本語), Turkish (Türkçe), and Korean (한국어).',

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
  'footer.blog': 'Blog',
  'footer.privacy': 'Privacy Policy',
  'footer.terms': 'Terms of Service',
  'footer.allRights': 'All rights reserved.',

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
  // Navigation
  'nav.home': 'ホーム',
  'nav.generator': 'ジェネレータースタジオ',
  'nav.templates': 'テンプレート',
  'nav.blog': 'ブログ',
  'nav.about': '当サイトについて',
  'nav.create': '切り抜きを作成',
  'nav.createNow': '切り抜きを作成',
  'nav.language': '言語',

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
  'hero.imageAlt': 'ヴィンテージ新聞切り抜きスタジオのプレビュー',

  // How It Works
  'how.badge': '簡単3ステップ',
  'how.title': '作成手順',
  'how.subtitle': 'アイデアから本格的なヴィンテージ新聞まで、わずか60秒。',
  'how.step1.num': '01',
  'how.step1.title': '見出しと記事本文を入力',
  'how.step1.desc': '新聞名、トップニュースの大見出し、日付、号数、そして段組み記事本文を自由に入力します。',
  'how.step2.num': '02',
  'how.step2.title': '紙の年代感とフィルターを選択',
  'how.step2.desc': '1920年代調の黄ばんだ新聞紙、破れた縁、折り目、コーヒーのシミ、本物の新聞網点写真を選択。',
  'how.step3.num': '03',
  'how.step3.title': '高精細4K PNGを即時保存',
  'how.step3.desc': '300 DPIの高画質画像を即座にダウンロードまたは印刷。サーバー通信なしの完全プライベート。',

  // Use Cases
  'usecases.badge': '多彩な活用シーン',
  'usecases.title': 'あらゆる場面で活躍するヴィンテージ新聞',
  'usecases.subtitle': '歴史の学習課題からSNSのパロディ、特別な記念日まで。',
  'usecases.school.tag': '教育・歴史学習',
  'usecases.school.title': '学校の課題・歴史レポート',
  'usecases.school.desc': '歴史の出来事を臨場感たっぷりに再現！生徒や教員が大恐慌時代や世界大戦時の号外、歴史新聞レポートを簡単に作成できます。',
  'usecases.memes.tag': 'ミーム・SNS',
  'usecases.memes.title': 'ミーム・話題のパロディ記事',
  'usecases.memes.desc': '最新のトレンドや身内の笑い話、ゲームの戦績をヴィンテージ新聞の号外風にして、X（Twitter）やInstagramでシェア！',
  'usecases.pranks.tag': '記念日・サプライズ',
  'usecases.pranks.title': '記念日のギフト・楽しいサプライズ',
  'usecases.pranks.desc': '誕生日（「〇〇さん50歳に！」）や結婚記念日、送別会の思い出として、世界に一つだけのオリジナル新聞を贈ろう。',
  'usecases.imageAlt': '新聞切り抜きの活用例とサンプル',

  // FAQ
  'faq.badge': 'よくあるご質問',
  'faq.title': 'よくあるご質問 (FAQ)',
  'faq.subtitle': 'ヴィンテージ新聞ジェネレーターについてのご質問にお答えします。',
  'faq.q1': '本当に完全無料で利用できますか？',
  'faq.a1': 'はい、永久に完全無料です。サブスクリプション、課金、ウォーターマーク（透かし）、生成枚数の制限は一切ありません。',
  'faq.q2': 'アップロードした写真や文章はサーバーに保存されますか？',
  'faq.a2': '一切保存されません。すべての画像処理とテキスト描画はブラウザ内（HTML5 Canvas）で完結し、外部サーバーには一切送信されません。',
  'faq.q3': '保存される画像の解像度はどのくらいですか？',
  'faq.a3': '高精細な4K解像度（300 DPI PNG）で出力されます。ポスター印刷やプレゼン、SNS投稿にも鮮明にお使いいただけます。',
  'faq.q4': '学校の課題や商用利用に使用できますか？',
  'faq.a4': 'はい。作成した画像の権利はすべてあなたに帰属します。個人的な利用、学校教育、商用利用を問わず自由にご利用いただけます。',
  'faq.q5': '網点写真や紙の質感はどのように作られていますか？',
  'faq.a5': '独自のシェーダー処理により、往年の活版印刷（ライノタイプ）の網点パターンや紙の繊維、自然な破れ目を忠実に再現しています。',
  'faq.q6': '対応している言語は？',
  'faq.a6': '日本語、英語、中国語、ポルトガル語（ブラジル）、ロシア語、トルコ語、韓国語の計7言語に対応しています。',

  // Footer
  'footer.tagline': '登録不要・完全ブラウザ処理の生涯無料ヴィンテージ新聞作成ツール。',
  'footer.rights': '全著作権所有。Cookie不使用、サーバー追跡なし。',
  'footer.links': 'クイックリンク',
  'footer.legal': '個人利用・商用利用ともに無料。',
  'footer.madeWith': '北欧エディトリアルの緻密さで構築。',
  'footer.blog': 'ブログ',
  'footer.privacy': 'プライバシーポリシー',
  'footer.terms': '利用規約',
  'footer.allRights': '全著作権所有。',
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
