
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,svelte,js,ts,jsx,tsx}",
    "../../packages/**/*.{html,svelte,js,ts,jsx,tsx}",
  ],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [{
      light: {
        ...require("daisyui/src/theming/themes")["[data-theme=corporate]"],
      },
      dark: {
        ...require("daisyui/src/theming/themes")["[data-theme=business]"],
        "primary": "#FEBD35",
      }
    }]
  }
}

