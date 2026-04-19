/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          main: '#0B0F17',
          secondary: '#0F172A',
          card: '#111827',
          border: '#1F2937',
        },
        brand: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
        },
        status: {
          profit: '#22C55E',
          loss: '#EF4444',
          warning: '#F59E0B',
        },
        content: {
          primary: '#F9FAFB',
          secondary: '#9CA3AF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}