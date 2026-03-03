/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brazil: {
          green: '#009C3B',
          'green-dark': '#007A2E',
          'green-light': '#00cc4e',
          blue: '#002776',
          'blue-dark': '#001d5c',
          'blue-light': '#3a6dd6',
        },
        'dark-bg': '#0a0a0a',
        'dark-surface': '#141414',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
