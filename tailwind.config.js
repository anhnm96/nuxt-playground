/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['DM Mono'],
      },
      colors: {
        primary: {
          DEFAULT: '#00DC82',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  colorMode: {
    classSuffix: '',
  },
}
