/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Wise-inspired design tokens from DESIGN.md
        primary: {
          DEFAULT: '#9fe870', // Wise Green canonical CTA
          active: '#cdffad',
          neutral: '#c5edab',
          pale: '#e2f6d5',
        },
        canvas: {
          DEFAULT: '#ffffff',
          soft: '#e8ebe6', // Sage-tinted page background
          dark: '#141613',
        },
        ink: {
          DEFAULT: '#0e0f0c', // Near-black with olive warmth
          deep: '#163300',
          body: '#454745',
          mute: '#868685',
        },
        positive: {
          DEFAULT: '#2ead4b',
          deep: '#054d28',
        },
        warning: {
          DEFAULT: '#ffd11a',
          deep: '#b86700',
          content: '#4a3b1c',
        },
        negative: {
          DEFAULT: '#d03238',
          deep: '#a72027',
          darkest: '#a7000d',
          bg: '#320707',
        },
        accent: {
          orange: '#ffc091',
          cyan: '#38c8ff',
        },
      },
      borderRadius: {
        xl: '24px', // Canonical 24px button and card radius
        pill: '9999px',
      },
      fontFamily: {
        display: ['Wise Sans', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        nytTitle: ['"UnifrakturMaguntia"', 'Chomsky', '"Old English Text MT"', 'serif'],
        nytHeadline: ['"Libre Baskerville"', '"Playfair Display"', 'Georgia', 'serif'],
        nytBody: ['"PT Serif"', 'Georgia', 'serif'],
        wapoTitle: ['"UnifrakturMaguntia"', 'Chomsky', '"Old English Text MT"', 'serif'],
        wapoHeadline: ['"Bodoni Moda"', '"Bodoni MT"', 'Didot', 'serif'],
        wapoBody: ['Georgia', '"PT Serif"', 'serif'],
      },
    },
  },
  plugins: [],
};
