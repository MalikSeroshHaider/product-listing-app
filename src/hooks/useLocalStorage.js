import { useEffect, useState } from "react";

/**
 * Drop-in replacement for useState that persists to localStorage.
 * All parsing/writing is wrapped in try/catch so a corrupted or
 * blocked localStorage never crashes the app.
 */
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable (e.g. private browsing) — fail silently,
      // the app still works for the current session.
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
