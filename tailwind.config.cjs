/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: [
        "ui-rounded",
        "'Hiragino Maru Gothic ProN'",
        "Quicksand",
        "Comfortaa",

        "Manjari",
        "Arial Rounded MT Bold",
        "Calibri",
        "source-sans-pro",
        "sans-serif",
      ],
    },
    extend: {
      borderWidth: {
        1: "1px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
