type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type BadgeVariant = "success" | "warning" | "danger" | "neutral";

export const ui = {
  /* ---------------- PAGE ---------------- */
  page: () =>
    "min-h-screen bg-background text-textMain antialiased",

  container: () =>
    "max-w-6xl mx-auto px-6 py-8",

  sectionTitle: () =>
    "text-xl font-semibold text-textMain",

  /* ---------------- CARD ---------------- */
  card: () =>
    "bg-surface border border-border rounded-lg p-6 shadow-sm",

  /* ---------------- BUTTON ---------------- */
  button: (variant: ButtonVariant = "primary") =>
    [
      "px-4 py-2 rounded-md font-medium transition-all duration-200 select-none",
      "disabled:opacity-50 disabled:pointer-events-none",

      {
        primary:
          "bg-primary text-white hover:bg-primaryHover active:scale-95",

        secondary:
          "bg-white border border-border text-textMain hover:bg-gray-50",

        danger:
          "bg-danger text-white hover:opacity-90",

        ghost:
          "text-textSecondary hover:bg-gray-100",
      }[variant],
    ].join(" "),

  /* ---------------- INPUT ---------------- */
  input: () =>
    [
      "w-full rounded-md border border-border bg-white px-3 py-2 text-sm",
      "placeholder:text-gray-400",
      "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
      "disabled:bg-gray-100 disabled:cursor-not-allowed",
    ].join(" "),

  label: () =>
    "text-sm font-medium text-textSecondary mb-1 block",

  textarea: () =>
    [
      "w-full rounded-md border border-border bg-white px-3 py-2 text-sm",
      "focus:outline-none focus:ring-2 focus:ring-primary",
    ].join(" "),

  /* ---------------- BADGE ---------------- */
  badge: (variant: BadgeVariant = "neutral") =>
    [
      "px-2 py-1 text-xs font-medium rounded-full",

      {
        success: "bg-green-100 text-green-700",
        warning: "bg-yellow-100 text-yellow-700",
        danger: "bg-red-100 text-red-700",
        neutral: "bg-gray-100 text-gray-600",
      }[variant],
    ].join(" "),

  /* ---------------- MODAL ---------------- */
  modalOverlay: () =>
    "fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50",

  modal: () =>
    "bg-white rounded-xl shadow-xl p-6 w-full max-w-md",

  /* ---------------- LOADER ---------------- */
  spinner: () =>
    "animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-primary",
};
