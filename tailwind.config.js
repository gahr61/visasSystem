/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBlue: {
          50: '#e0e5f2',
          100: '#b3c0de',
          200: '#8098c8',
          300: '#4d70b2',
          400: '#2e5293',
          500: '#152e6e', // color base
          600: '#122865',
          700: '#0f2159',
          800: '#0c1a4b',
          900: '#081336',
        }
      }
    }
  },
  plugins: [],
}

