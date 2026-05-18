"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

type ThemeContextProps = {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  toggle: () => void;
};
const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialized from the anti-FOUC script's class on <html>.
  const [theme, setTheme] = useState<string>("");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const stored = localStorage.getItem("theme");
    setTheme(stored ?? (isDark ? "dark" : "light"));
  }, []);

  useEffect(() => {
    if (theme !== "dark" && theme !== "light") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    [],
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
