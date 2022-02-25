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
        background: '#F8FAFC',
        foreground: '#000',
        line: '#404040'
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
