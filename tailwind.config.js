/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2E7D32",
        secondary: "#81C784",
        tertiary: "#4CAF50",
        background: "#F5F5F5",
        text: "#333333"
      },
    },
  },
  plugins: [],
}

