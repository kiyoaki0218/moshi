/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif JP"', 'serif'],
        mono: ['"Consolas"', '"Courier New"', 'monospace'],
        sans: ['"Inter"', '"Hiragino Kaku Gothic ProN"', '"Hiragino Sans"', '"Meiryo"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
