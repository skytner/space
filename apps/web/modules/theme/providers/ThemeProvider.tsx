"use client";

import { useState, useCallback, useEffect } from "react";
import type { ThemeOption } from "../types/theme";
import { ThemeContext } from "../context/ThemeContext";
import { getTheme } from "../functions/getTheme";
import { isTheme } from "../functions/isTheme";
import { THEME_STORAGE_KEY } from "../constants/themeStorageKey";

function setRootAttribute(theme: ThemeOption) {
  const root = document.documentElement;
  if (theme === "device") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeOption>("device");

  useEffect(() => {
    setTheme(getTheme());
  }, []);

  const applyTheme = useCallback((value: ThemeOption) => {
    setRootAttribute(value);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, value);
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const onChange = useCallback(
    (v: ThemeOption) => {
      const newTheme = isTheme(v) ? v : "device";
      setTheme(newTheme);
      applyTheme(newTheme);
    },
    [applyTheme]
  );

  return (
    <ThemeContext.Provider value={{ theme, onChange }}>
      {children}
    </ThemeContext.Provider>
  );
}
