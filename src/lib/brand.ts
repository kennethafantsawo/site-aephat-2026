// Brand AEPHAT — couleurs du logo : vert pharmacie + noir + blanc/gris

export const BRAND = {
  name: "AEPHAT",
  fullName: "Association des Étudiants en Pharmacie du Togo",
  logo: "/brand/aez.png",

  colors: {
    primary: "#1FA34A",
    primaryDark: "#0C6B2D",
    primaryLight: "#5AC878",
    primaryGlow: "rgba(31, 163, 74, 0.16)",

    secondary: "#101418",
    secondaryDark: "#000000",
    secondaryLight: "#2A333B",
    secondaryGlow: "rgba(16, 20, 24, 0.18)",

    accent: "#E9F7EE",
    accentForeground: "#0C6B2D",

    background: "#FFFFFF",
    foreground: "#101418",

    card: "#FFFFFF",
    cardForeground: "#101418",

    muted: "#F2F5F3",
    mutedForeground: "#5A6570",

    border: "#E2E8E6",
    borderLight: "#EFF3F1",

    glass: "rgba(255, 255, 255, 0.86)",
    glassBorder: "rgba(16, 20, 24, 0.08)",

    success: "#1FA34A",
    warning: "#B7791F",
    error: "#D64545",
  },

  gradients: {
    primary: "linear-gradient(135deg, #1FA34A 0%, #0C6B2D 100%)",
    secondary: "linear-gradient(135deg, #232c33 0%, #101418 100%)",
    hero: "linear-gradient(160deg, #071a10 0%, #0A2E18 55%, #0C6B2D 100%)",
    card: "linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(242,245,243,1) 100%)",
  },

  fonts: {
    sans: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
    headings: {
      h1: "font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight",
      h2: "font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight",
      h3: "font-bold text-xl sm:text-2xl",
      h4: "font-semibold text-lg",
    },
  },

  spacing: {
    section: "py-16 lg:py-20",
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    gap: "gap-6",
  },

  shadows: {
    default: "0 4px 6px -1px rgba(10, 46, 24, 0.10), 0 2px 4px -1px rgba(10, 46, 24, 0.06)",
    hover: "0 25px 50px -12px rgba(10, 46, 24, 0.20)",
    glow: "0 0 30px rgba(31, 163, 74, 0.16)",
    card: "0 10px 15px -3px rgba(10, 46, 24, 0.06), 0 4px 6px -2px rgba(10, 46, 24, 0.04)",
  },

  transitions: {
    smooth: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },

  social: {
    facebook: "https://facebook.com/aephat",
    instagram: "https://instagram.com/aephat",
    linkedin: "https://linkedin.com/company/aephat",
    whatsapp: "https://wa.me/22890123456",
    email: "contact@aephat.tg",
  },

  stats: {
    members: "200+",
    events: "15+",
    projects: "10+",
    years: "5+",
  },
} as const;

export type BrandConfig = typeof BRAND;
