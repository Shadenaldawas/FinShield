/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#0f1720',
        panel2: '#141d29',
        accent: '#22c55e',
      },
    },
  },
  plugins: [],
}
