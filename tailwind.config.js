/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "2.5rem",
        lg: "4rem",
        xl: "5.5rem",
      },
    },
    extend: {
      // screens: {
      //   "hover-hover": { raw: "(hover: hover)" },
      // },
      screens: {
        betterhover: { raw: "(hover: hover)" },
      },
    },
  },
  plugins: [],
};
