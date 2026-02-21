/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/popup/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Main Indigo
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        deepseek: {
          50: '#eff4ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#4d6bfe', // DeepSeek Blue
          600: '#3b5bdb',
          700: '#2d4ab8',
          800: '#253c96',
          900: '#1e3073',
          950: '#141d4a',
        },
        tracker: {
          bg: '#0f0f1a',
          card: '#1a1a2e',
          accent: '#16213e',
          highlight: '#6366f1',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        },
      },
    },
  },
  plugins: [],
};
