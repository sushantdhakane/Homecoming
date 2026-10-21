/** Token names come from design/tokens.json (roles, not hex). Values live as CSS variables in app/globals.css. */
module.exports = { content: ["./app/**/*.tsx", "./components/**/*.tsx"], theme: { extend: {
  colors: { paper: "var(--bg)", surface: "var(--surface)", alt: "var(--surface-alt)", line: "var(--border)", field: "var(--border-input)",
    ink: "var(--text)", muted: "var(--text-muted)", accent: "var(--accent)", onaccent: "var(--on-accent)", inkbg: "var(--ink-bg)",
    onink: "var(--on-ink)", onmuted: "var(--on-ink-muted)", sun: "var(--highlight)", danger: "var(--danger)" },
  fontFamily: { sans: ["Figtree", "system-ui", "sans-serif"], serif: ["Fraunces", "Georgia", "serif"] },
  borderRadius: { md: "14px", lg: "24px" }, maxWidth: { page: "1120px" },
  boxShadow: { card: "0 1px 0 var(--border), 0 18px 40px -26px rgba(30,36,51,.45)" } } }, plugins: [] };
