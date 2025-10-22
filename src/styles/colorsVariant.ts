export const colorsVariants = {
  primary: "var(--primary-color)",
  "primary-light": "var(--primary-light-color)",
  secondary: "var(--secondary-color)",
} as const;

export type ColorsVariant = keyof typeof colorsVariants;
