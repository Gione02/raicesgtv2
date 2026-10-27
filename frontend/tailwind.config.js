/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ==================================================================
        // PALETA "TINTES NATURALES" — psicología del color aplicada a ventas
        // Regla 60-30-10: 60 % fondo cálido, 30 % añil (confianza),
        // 10 % terracota (acciones). Ver README, sección "Colores".
        // ==================================================================

        // Terracota cochinilla: botones y acciones principales (atención, energía)
        primary: "#B4452D",
        "primary-container": "#923521", // hover de botones
        "on-primary": "#ffffff",
        "on-primary-container": "#ffffff",
        "primary-fixed": "#F6D9CF",
        "primary-fixed-dim": "#E8A99A",
        "on-primary-fixed": "#3B120A",
        "on-primary-fixed-variant": "#7A2C1B",
        "inverse-primary": "#E8A33D", // maíz dorado: acentos sobre fondos oscuros
        "surface-tint": "#B4452D",

        // Añil: confianza y seriedad (cabecera, pie, enlaces secundarios)
        secondary: "#1F3A5F",
        "secondary-container": "#2C4F7E",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#ffffff",
        "secondary-fixed": "#DFE6F0",
        "secondary-fixed-dim": "#B7C6DB",
        "on-secondary-fixed": "#0D1B2E",
        "on-secondary-fixed-variant": "#1F3A5F",
        "deep-indigo": "#1B2440", // fondo de cabecera y pie

        // Jade: autenticidad, hecho a mano, naturaleza (categorías)
        tertiary: "#2F6B4F",
        "tertiary-container": "#3D8463",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#ffffff",
        "tertiary-fixed": "#DCEFE3",
        "tertiary-fixed-dim": "#A9D3BA",
        "on-tertiary-fixed": "#0F2A1E",
        "on-tertiary-fixed-variant": "#245540",

        // Algodón crudo: fondos cálidos que resaltan las fotos (60 %)
        background: "#FBF7F1",
        surface: "#FBF7F1",
        "surface-bright": "#FFFDF9",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#F5EEE4",
        "surface-container": "#EFE6D8",
        "surface-container-high": "#E9DECD",
        "surface-container-highest": "#E2D5C1",
        "surface-dim": "#D9CBB5",
        "surface-variant": "#EFE6D8",
        "cool-slate": "#FAF5EE",
        "mesh-blue": "#FBEBD8", // fondo de etiquetas (crema durazno)
        "inverse-surface": "#2A211B",
        "inverse-on-surface": "#F6EEE3",

        // Texto en tonos café cálidos (más amables que el negro puro)
        "on-background": "#2A211B",
        "on-surface": "#2A211B",
        "on-surface-variant": "#5C4F45",
        outline: "#8A7B6E",
        "outline-variant": "#D6C8B8",
        "border-cool": "#E8DDCF",

        // Errores: rojo carmín, distinto de la terracota de los botones
        error: "#C62828",
        "on-error": "#ffffff",
        "error-container": "#FDE2E1",
        "on-error-container": "#8C1D18",

        // WhatsApp: verde reconocible, más oscuro para que el texto blanco se lea
        whatsapp: "#17834A",

        "cobalt-blur": "rgba(110, 60, 30, 0.08)",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        "margin-mobile": "16px",
        "margin-desktop": "48px",
        unit: "4px",
        gutter: "24px",
        "container-max": "1200px",
        "section-padding-lg": "96px",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        "body-md": ["Inter"],
        "heading-h2-mobile": ["Inter"],
        "display-h1-mobile": ["Inter"],
        "nav-link": ["Inter"],
        "ui-label": ["Inter"],
        "display-h1": ["Inter"],
        price: ["Inter"],
        "heading-h2": ["Inter"],
        "body-lg": ["Inter"],
        eyebrow: ["Inter"],
      },
      fontSize: {
        "ui-label": ["14px", { lineHeight: "20px", fontWeight: "800" }],
        "heading-h2": ["52px", { lineHeight: "60px", letterSpacing: "-0.045em", fontWeight: "700" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "display-h1": ["90px", { lineHeight: "96px", letterSpacing: "-0.065em", fontWeight: "800" }],
        price: ["20px", { lineHeight: "24px", fontWeight: "950" }],
        "nav-link": ["15px", { lineHeight: "24px", fontWeight: "700" }],
        "heading-h2-mobile": ["32px", { lineHeight: "38px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        eyebrow: ["13px", { lineHeight: "16px", fontWeight: "900" }],
        "display-h1-mobile": ["48px", { lineHeight: "52px", letterSpacing: "-0.04em", fontWeight: "800" }],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")],
};
