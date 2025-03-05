/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    type: 'dark',
    extend: {
      fontFamily: {
        sans: ['Josefin Sans', 'sans-serif'],
      },
      colors: {
        'pet-primary': '#2C3B6B',
        'pet-secondary': '#5B9AD7',
        'pet-primary-dark': '#4464CC',
        'pet-light': '#F2F2F2',
        'pet-accent': '#95CBFF',
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}