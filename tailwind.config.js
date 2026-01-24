/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'neutral-980': '#0b0b0c',
      }
    },
    theme: {
      extend: {
        animation: {
          "ken-burns": "ken-burns 8s ease-out forwards",
          "progress": "progress linear forwards",
        },
        keyframes: {
          "ken-burns": {
            "0%": { transform: "scale(1) translate(0, 0)" },
            "100%": { transform: "scale(1.1) translate(-1%, -1%)" },
          },
          "progress": {
            "0%": { width: "0%" },
            "100%": { width: "100%" },
          },
        },
      },
    },
  },
  plugins: [],
}
