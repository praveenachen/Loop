// Direct translations of app/globals.css; alpha variants match web utilities.
export const colors = {
  surface: "hsl(42, 42%, 98%)",
  surfaceSoft: "hsl(45, 30%, 94%)",
  stroke: "hsl(30, 18%, 84%)",
  ink: "hsl(20, 18%, 16%)",
  inkSoft: "hsl(20, 10%, 42%)",
  warning: "hsl(32, 92%, 56%)",
  warningSoft: "hsla(32, 92%, 56%, 0.15)",
  white: "#ffffff",
  brand: "hsl(160, 62%, 34%)",
  accent: "hsl(208, 86%, 54%)",
  marketplace: "hsl(151, 63%, 40%)",
  rides: "hsl(47, 92%, 66%)",
  study: "hsl(335, 75%, 58%)",
  trust: "hsl(162, 66%, 31%)",
  goose: "hsl(47, 46%, 82%)",
  marketplaceSoft: "hsla(151, 63%, 40%, 0.15)",
  ridesSoft: "hsla(47, 92%, 66%, 0.35)",
  studySoft: "hsla(335, 75%, 58%, 0.15)",
  accentSoft: "hsla(208, 86%, 54%, 0.15)",
  trustSoft: "hsla(162, 66%, 31%, 0.15)",
  marketplaceBorder: "hsla(151, 63%, 40%, 0.2)",
  ridesBorder: "hsla(47, 92%, 66%, 0.4)",
  studyBorder: "hsla(335, 75%, 58%, 0.2)",
} as const;
export type Tone = "neutral" | "marketplace" | "rides" | "study";
export const toneColors = {
  neutral: { fill: "hsla(208, 86%, 54%, 0.1)", border: colors.stroke },
  marketplace: {
    fill: colors.marketplaceSoft,
    border: colors.marketplaceBorder,
  },
  rides: { fill: colors.ridesSoft, border: colors.ridesBorder },
  study: { fill: colors.studySoft, border: colors.studyBorder },
};

export const subtleToneColors = {
  neutral: colors.white,
  marketplace: "hsla(151, 63%, 40%, 0.05)",
  rides: "hsla(47, 92%, 66%, 0.1)",
  study: "hsla(335, 75%, 58%, 0.05)",
};
