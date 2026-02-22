export type ThemeOption = "light" | "dark" | "device";

export type ThemeContextValue = {
  theme: ThemeOption;
  onChange: (value: ThemeOption) => void;
};
