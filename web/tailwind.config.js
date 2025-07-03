/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0052CC', // Atlassian blue
          dark: '#0747A6',
          light: '#2684FF',
        },
        secondary: {
          DEFAULT: '#36B37E', // Atlassian green
          dark: '#006644',
          light: '#79F2C0',
        },
        accent: {
          DEFAULT: '#FF5630', // Atlassian red
          dark: '#BF2600',
          light: '#FF8F73',
        },
        info: {
          DEFAULT: '#00B8D9', // Atlassian teal
          light: '#E6FCFF',
        },
        warning: {
          DEFAULT: '#FFAB00',
          light: '#FFFAE6',
        },
        neutral: {
          DEFAULT: '#172B4D',
          light: '#F4F5F7',
        },
      },
    },
  },
  plugins: [],
};
