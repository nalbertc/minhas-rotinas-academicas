/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        backgroundLight: "#F2F2F2",
        backgroundDark: "#1C1C27",
        primary: "#7453F9",
        cardDark: "#2B2A3A",
        cardLigth: "#fff",
        headerLight: "#FEFEFE",
        headerDark: "#1D1E3C",
        tabsDark: "#2B2B38",
        tabsLigth: "#FAFBFC",
        drawerLigth: "#fff",
        drawerDark: "#2B2E4F",
      },
      fontFamily: {
        regular: "Poppins_400Regular",
        medium: "Poppins_500Medium",
        semibold: "Poppins_600SemiBold",
        poppins_bold: "Poppins_700Bold",
      },
    },
  },
  plugins: [],
};
