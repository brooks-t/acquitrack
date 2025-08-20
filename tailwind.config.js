/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';

export default {
  content: ['./src/**/*.{html,ts}', './src/**/*.html'],
  darkMode: 'class', // Use class-based dark mode instead of media queries
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [PrimeUI],
};
