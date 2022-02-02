module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Metropolis', 'Helvetica', 'Sans-Serif']
      },
      colors: {
        primary: '#000000',
        'primary-hover': '#000001',
        background: '#ececec'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
