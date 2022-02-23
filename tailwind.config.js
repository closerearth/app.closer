module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        'primary-hover': '#ffffff',
        background: 'rgb(248 250 252)',
        foreground: '#000',
        line: '#404040'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
