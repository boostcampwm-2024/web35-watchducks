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
        12: '12px',
        14: '14px',
        18: '18px',
        24: '24px',
        25: '25px',
        30: '30px',
        36: '36px',
        50: '50px'
      },
      animation: {
        'spin-slow': 'spin 1.5s linear infinite'
      }
    }
  },
  plugins: []
};
