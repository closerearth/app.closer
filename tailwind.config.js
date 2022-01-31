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
        primary: '#d626df',
        'primary-hover': '#c30fcc',
        background: '#ececec'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
