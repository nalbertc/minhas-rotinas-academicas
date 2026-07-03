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
        tabsDark: "#2B2B38",
        tabsLigth: "#FAFBFC",
        emAndamento: "#094BAC",
        emAndamentoCard: "#A9C0E2",
        emAndamentoCardDark: "#1E2A4A",
        atrasada: "#FF5757",
        atrasadaCard: "#F3A9A9",
        atrasadaCardDark: "#3A1E1E",
        concluida: "#34AF68",
        concluidaCard: "#bfebd2",
        concluidaCardDark: "#1E3A2A",
        pendente: "#E4B926",
        pendenteCard: "#FFF2C5",
        pendenteCardDark: "#3A371E",
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
