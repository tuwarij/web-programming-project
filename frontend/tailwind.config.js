/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#ff6b35',  // coral สด
          600: '#ea4f1a',
          700: '#c43d10',
        },
        accent: {
          50: '#fefce8',
          100: '#fef9c3',
          500: '#fbbf24',  // yellow สด
          600: '#f59e0b',
          700: '#d97706',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        sriracha: ['Sriracha', 'cursive'],
      },
    },
  },
  plugins: [],
};
