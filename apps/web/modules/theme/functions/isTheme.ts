import type { ThemeOption } from "../types/theme";

export function isTheme(lsValue: string | null): lsValue is ThemeOption {
    return lsValue === "light" || lsValue === "dark" || lsValue === "device";
}
