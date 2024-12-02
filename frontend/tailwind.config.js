/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blue: '#0079FF',
        gray: '#91A3B7',
        green: '#00DD4B',
        red: '#FF7676',
        black: '#001940',
        lightblue: '#F3F8FC',
        darkblue: '#001F42'
      },
      fontWeight: {
        light: '300',
        medium: '500',
        semibold: '600',
        bold: '700'
      }
    }
  },
  plugins: []
};
