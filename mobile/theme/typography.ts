import type { TextStyle } from "react-native";
import { colors } from "./colors";
export const fonts = {
  display: "Fredoka_600SemiBold",
  body: "Nunito_500Medium",
  semibold: "Nunito_600SemiBold",
  bold: "Nunito_700Bold",
  heavy: "Nunito_800ExtraBold",
} as const;
export const typography = {
  display: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 36,
    color: colors.ink,
  },
  pageHeading: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 34,
    color: colors.ink,
  },
  sectionHeading: {
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 26,
    color: colors.ink,
  },
  cardHeading: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 24,
    color: colors.ink,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.inkSoft,
  },
  smallBody: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: colors.inkSoft,
  },
  label: {
    fontFamily: fonts.heavy,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.inkSoft,
  },
  pill: {
    fontFamily: fonts.heavy,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
  },
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: 15,
    lineHeight: 20,
    color: colors.ink,
  },
  cardBody: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    lineHeight: 17,
    color: colors.inkSoft,
  },
  meta: {
    fontFamily: fonts.semibold,
    fontSize: 11.5,
    lineHeight: 15,
    color: colors.inkSoft,
  },
  caption: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 18,
    color: colors.inkSoft,
  },
  eyebrow: {
    fontFamily: fonts.heavy,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.inkSoft,
  },
  chip: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 18,
    color: colors.inkSoft,
  },
} satisfies Record<string, TextStyle>;
