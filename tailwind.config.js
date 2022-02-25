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
        background: '#EEEEEE',
        foreground: '#000',
        error: '#9f1f42'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
