import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

const THEME_KEY = "product-hub-theme";

/**
 * Manages light/dark theme, persists the choice, and applies it
 * to the document root so CSS variables in index.css pick it up.
 */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage(THEME_KEY, "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return { theme, isDarkMode: theme === "dark", toggleTheme };
}

export default useTheme;
