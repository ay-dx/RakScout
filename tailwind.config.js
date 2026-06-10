/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E8',
      },
      backgroundImage: {
        'carbon': 'linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%, #1a1a1a), linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%, #1a1a1a)',
      },
      backgroundSize: {
        'carbon-size': '8px 8px',
      },
      backgroundPosition: {
        'carbon-pos': '0 0, 4px 4px',
      },
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
        noto: ['"Noto Sans JP"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}