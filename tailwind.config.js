/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEEDFE', 100: '#CECBF6', 200: '#AFA9EC',
          400: '#7F77DD', 600: '#534AB7', 800: '#3C3489', 900: '#26215C',
        },
        surface: { 1: '#ffffff', 2: '#f8f8f6', 3: '#f1f0ec' },
        ink: { 1: '#1a1a18', 2: '#6b6b66', 3: '#9c9a92' },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
