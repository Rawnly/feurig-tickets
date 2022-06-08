const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
const config = {
  content: ['./app/**/*.{ts,tsx,jsx,mdx,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'mono': ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        codGray: {
          '50': '#f7f7f7',
          '100': '#e3e3e3',
          '200': '#c8c8c8',
          '300': '#a4a4a4',
          '400': '#818181',
          '500': '#666666',
          '600': '#515151',
          '700': '#434343',
          '800': '#383838',
          '900': '#121212',
        },
        silver: {
          '50': '#f8f8f8',
          '100': '#f0f0f0',
          '200': '#e4e4e4',
          '300': '#c8c8c8',
          '400': '#b4b4b4',
          '500': '#9a9a9a',
          '600': '#818181',
          '700': '#6a6a6a',
          '800': '#5a5a5a',
          '900': '#4e4e4e',
        },
      }
    },
  },
  plugins: [require('@tailwindcss/forms')]
}


module.exports = config
