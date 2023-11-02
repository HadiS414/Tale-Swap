/** @type {import('tailwindcss').Config} */

import defaultTheme from 'tailwindcss/defaultTheme';

export const content = [
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './app/**/*.{js,ts,jsx,tsx,mdx}',
];
export const theme = {
  extend: {
    colors: {
      "dark-orange": "#FC7900",
      "off-white": "#FDFDFD"
    },
    fontFamily: {
      "arial": ["Arial"],
      "montserrat": ["Montserrat", ...defaultTheme.fontFamily.sans],
      "verdana": ["Verdana"]
    }
  },
};
export const plugins = [];
