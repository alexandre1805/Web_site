const daisyui = require("daisyui");

const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#390077",
          secondary: "#00B4CF",
          accent: "#FFAB21",
          neutral: "6366F1",
          "base-100": "#374151",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
};

module.exports = config;
