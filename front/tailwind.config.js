/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'deep-space': '#000b49',
                'space-orange': '#fc4c00',
                'cosmic-white': '#f8f9f9',
                'mist-gray': '#bfc3c6',
            },
            fontFamily: {
                heading: ['Montserrat', 'sans-serif'],
                body: ['Lato', 'sans-serif'],
                tech: ['Roboto Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}
