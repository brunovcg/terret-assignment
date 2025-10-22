export const colorsVariants = {
  primary: "var(--primary-color)",
  hover: "var(--hover-color)",
  secondary: "var(--secondary-color)",
  error: "var(--error-color)",
} as const;

export type ColorsVariant = keyof typeof colorsVariants;
