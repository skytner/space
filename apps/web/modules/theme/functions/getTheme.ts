import { Shared } from "@/modules";
import { THEME_STORAGE_KEY } from "../constants/themeStorageKey";
import type { ThemeOption } from "../types/theme";
import { isTheme } from "./isTheme";

export function getTheme(): ThemeOption {
    if (Shared.isServer()) return 'device'
    const parsedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(parsedTheme)) return parsedTheme;
    return "device";
}