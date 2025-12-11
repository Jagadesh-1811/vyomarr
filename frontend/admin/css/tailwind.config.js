/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./html/**/*.html",  // If you have HTML files in html folder
    "./**/*.{html,js,jsx}",  // Catch all HTML and JS files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}