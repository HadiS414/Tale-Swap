/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "dark-orange": "#FC7900",
        "off-white": "#FDFDFD"
      },
      fontFamily: {
        "arial": ["Arial"],
        "montserrat": ["Montserrat"],
        "verdana": ["Verdana"]
      }
    },
  },
  plugins: [],
}
