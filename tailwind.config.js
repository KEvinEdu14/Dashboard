/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0b0f14',
        accent: '#5eead4',
        accent2: '#60a5fa',
      }
    },
  },
  plugins: [],
}
