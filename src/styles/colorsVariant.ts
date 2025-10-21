export const colorsVariants = {
  primary: "var(--primary-color)",
  secondary: "var(--secondary-color)",
} as const;

export type ColorsVariant = keyof typeof colorsVariants;
