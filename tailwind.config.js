module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        'primary-hover': '#ffffff',
        secondary: '#1b3bc3',
        background: '#F8FAFC',
        foreground: '#000',
        error: '#9f1f42',
        line: '#a3a3a3'
      }
    },
  },
  variants: {
    extend: {
      display: ['group-hover'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
