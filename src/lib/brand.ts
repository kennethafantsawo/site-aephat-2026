// Brand configuration for AEPHAT - Dynamic Design

export const BRAND = {
  name: "AEPHAT",
  fullName: "Association des Étudiants en Pharmacie du Togo",
  logo: "/brand/aez.png",
  
  colors: {
    primary: "#1A5632",
    primaryDark: "#0D3820",
    primaryLight: "#2D7A4A",
    primaryGlow: "rgba(26, 86, 50, 0.15)",
    
    secondary: "#D4A843",
    secondaryDark: "#B8922E",
    secondaryLight: "#E5C075",
    secondaryGlow: "rgba(212, 168, 67, 0.2)",
    
    accent: "#E8F0FE",
    accentForeground: "#1A5632",
    
    background: "#FFFFFF",
    foreground: "#0F172A",
    
    card: "rgba(255, 255, 255, 0.7)",
    cardForeground: "#0F172A",
    
    muted: "#F8FAFC",
    mutedForeground: "#64748B",
    
    border: "#E2E8F0",
    borderLight: "#F1F5F9",
    
    glass: "rgba(255, 255, 255, 0.75)",
    glassBorder: "rgba(255, 255, 255, 0.3)",
    
    success: "#059669",
    warning: "#D97706",
    error: "#DC2626",
  },

  gradients: {
    primary: "linear-gradient(135deg, #1A5632 0%, #0D3820 100%)",
    secondary: "linear-gradient(135deg, #D4A843 0%, #B8922E 100%)",
    hero: "linear-gradient(135deg, #0D3820 0%, #1A5632 50%, #D4A843 100%)",
    card: "linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)",
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
    default: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    hover: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
    glow: "0 0 30px var(--color-primary-glow)",
    card: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
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
