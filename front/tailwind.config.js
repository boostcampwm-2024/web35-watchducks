/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontSize: {
        xs: ['12px', { lineHeight: '18px' }]
      }
    }
  },
  plugins: []
};
