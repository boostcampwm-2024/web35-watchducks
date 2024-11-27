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
        lightgray: '#FCFCFC',
        lightblue: '#F3F8FC',
        lightblack: '#00142B',
        darkblue: '#001F42'
      },
      fontWeight: {
        light: '300',
        medium: '500',
        semibold: '600',
        bold: '700'
      },
      gap: {
        8: '8px',
        16: '16px'
      },
      padding: {
        32: '32px'
      },
      spacing: {
        8: '8px',
        10: '10px',
        12: '12px',
        15: '15px',
        16: '16px',
        20: '20px',
        24: '24px',
        30: '30px',
        40: '40px',
        50: '50px',
        130: '130px'
      },
      borderWidth: {
        1.5: '1.5px',
        2: '2px'
      },
      borderRadius: {
        1.5: '1.5px',
        10: '10px',
        31: '31px'
      },
      height: {
        40: '40px'
      },
      fontSize: {
        8: '8px',
        10: '10px',
        12: '12px',
        14: '14px',
        18: '18px',
        24: '24px',
        25: '25px',
        30: '30px',
        36: '36px',
        50: '50px'
      }
    }
  },
  plugins: []
};
