/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#0079FF',
          light: '#0079FF',
          dark: '#0079FF'
        },
        gray: {
          DEFAULT: '#91A3B7',
          light: '#91A3B7',
          dark: '#91A3B7'
        },
        green: {
          DEFAULT: '#00DD4B',
          light: '#00DD4B',
          dark: '#00DD4B'
        },
        red: {
          DEFAULT: '#FF7676',
          light: '#FF7676',
          dark: '#FF7676'
        },
        black: {
          DEFAULT: '#001940',
          light: '#001940',
          dark: '#001940'
        }
      }
    }
  },
  plugins: []
};
