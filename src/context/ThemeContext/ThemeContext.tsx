import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeContextProps = {
  theme: string
  setTheme: React.Dispatch<React.SetStateAction<string>>
}
const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

const useTheme = () => {
  return useContext(ThemeContext);
};

type ThemeProps = {
  children: React.ReactNode;
};

function ThemeProvider({ children }: ThemeProps) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "");

  /** One time check in load */
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      setTheme("dark");
    } else if (
      localStorage.getItem("theme") === null &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  /** Constant update of state */
  useEffect(() => {
    if (theme === "light") {
      localStorage.setItem("theme", "light");
    } else if (theme === "dark") {
      localStorage.setItem("theme", "dark");
    }
  }, [theme]);

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export default ThemeProvider;
export { useTheme };
