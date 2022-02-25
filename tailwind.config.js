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
<<<<<<< HEAD
        background: '#F8FAFC',
        foreground: '#000',
        line: '#404040'
=======
        background: '#EEEEEE',
        foreground: '#000',
        error: '#9f1f42'
>>>>>>> ae3d8d3167917d151f00ac77a8fcf3085bfb913e
      }
    },
  },
  variants: {
    extend: {
        display: ["group-hover"],
    },
},
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
