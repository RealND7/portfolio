/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#1F1F1F',
        'brand-darker': '#0E1A28',
        'brand-blue': '#3545D6',
        'brand-blue-light': '#5363EE',
        'brand-lime': '#C2F750',
      }
    },
  },
  plugins: [],
}