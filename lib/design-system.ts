export const colorTokens = {
  surface: "hsl(var(--surface))",
  surfaceSoft: "hsl(var(--surface-soft))",
  stroke: "hsl(var(--stroke))",
  ink: "hsl(var(--ink))",
  inkSoft: "hsl(var(--ink-soft))",
  marketplace: "hsl(var(--marketplace))",
  rides: "hsl(var(--rides))",
  study: "hsl(var(--study))",
  trust: "hsl(var(--trust))",
  accent: "hsl(var(--accent))",
  goose: "hsl(var(--goose))"
} as const;

export const spacingScale = {
  compact: "0.5rem",
  base: "1rem",
  section: "2rem",
  page: "2.5rem"
} as const;

export const typographyScale = {
  display: "text-3xl font-display font-semibold tracking-tight",
  sectionTitle: "text-lg font-display font-semibold",
  body: "text-sm text-ink-soft leading-relaxed",
  label: "text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft"
} as const;

export const cardStyles = {
  base: "rounded-2xl border border-stroke bg-white shadow-card",
  elevated: "rounded-2xl border border-stroke bg-white shadow-lift"
} as const;

export const buttonStyles = {
  primary: "bg-ink text-white",
  secondary: "border border-stroke bg-white text-ink",
  marketplace: "bg-marketplace text-white",
  rides: "bg-rides text-ink",
  study: "bg-study text-white"
} as const;

export const tabStyles = {
  base: "rounded-full border px-3 py-1.5 text-sm font-medium transition",
  active: "border-ink/20 bg-ink text-white",
  idle: "border-stroke bg-white text-ink-soft hover:bg-surface-soft hover:text-ink"
} as const;
