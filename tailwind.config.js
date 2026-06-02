/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: { xs:'400px', sm:'640px', md:'768px', lg:'1024px', xl:'1280px', '2xl':'1536px' },
    extend: {
      fontFamily: {
        sans:    ['Noto Sans Thai', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Noto Sans Thai', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['Noto Sans Thai', 'ui-monospace', 'monospace'],
      },
      colors: {
        /* ── Brand: cobalt ── */
        brand: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C3CEFF',
          300: '#9DAEFF',
          400: '#6F86F7',
          500: '#4860EA',   // primary cobalt
          600: '#3848C9',
          700: '#2E3AA3',
          800: '#283284',
          900: '#1F2660',
          950: '#141838',
        },
        /* ── Secondary: cyan-teal ── */
        cyan2: {
          400: '#3BBEDC',
          500: '#1FA1C4',
          600: '#15809E',
        },
        /* ── Surface / cool neutral ── */
        surface: {
          0:   '#FFFFFF',
          50:  '#F7F8FB',
          100: '#EFF1F7',
          200: '#E2E5EF',
          300: '#C7CCDC',
          600: '#6A7290',
          700: '#262B3D',
          800: '#1A1E2C',
          900: '#12151F',
        },
      },
    },
  },
  plugins: [],
}
