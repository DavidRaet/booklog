/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0f172a', // Midnight Blue
                    light: '#1e293b',
                },
                secondary: {
                    DEFAULT: '#f8fafc', // White/Off-white
                    dark: '#e2e8f0',
                },
                accent: {
                    DEFAULT: '#1e40af', // Royal Blue
                    hover: '#1e3a8a',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
