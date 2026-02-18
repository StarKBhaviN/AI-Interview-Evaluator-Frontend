export const theme = {
  colors: {
    primary: "#4F46E5",
    primaryHover: "#4338CA",
    primaryLight: "#E0E7FF",

    accent: "#06B6D4",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",

    background: "#F8FAFC",
    surface: "#FFFFFF",
    border: "#E2E8F0",

    text: {
      main: "#0F172A",
      secondary: "#64748B",
      muted: "#94A3B8",
    },
  },

  radius: {
    sm: "6px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    full: "999px",
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },

  typography: {
    display: "text-3xl font-bold tracking-tight",
    h1: "text-2xl font-semibold tracking-tight",
    h2: "text-xl font-semibold",
    body: "text-base",
    small: "text-sm",
    caption: "text-xs font-medium text-textSecondary",
  },

  shadow: {
    card: "shadow-sm",
    popup: "shadow-lg",
    floating: "shadow-xl",
  },
} as const;

export type Theme = typeof theme;
