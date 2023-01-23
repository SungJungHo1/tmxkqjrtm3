const forms = require('@tailwindcss/forms')
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './templates/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      slate: colors.slate,
      primary: '#8927ae',
      yellow: colors.yellow,
      red: colors.red,
      blue: colors.blue
    },
  },
  plugins: [forms],
}
