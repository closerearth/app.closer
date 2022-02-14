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
        background: 'white',
        foreground: '#000'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
