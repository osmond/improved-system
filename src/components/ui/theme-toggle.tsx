import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  function updateFavicon(mode: "light" | "dark") {
    const lightLink = document.getElementById("favicon-light") as HTMLLinkElement | null;
    const darkLink = document.getElementById("favicon-dark") as HTMLLinkElement | null;
    if (!lightLink || !darkLink) return;
    if (mode === "dark") {
      lightLink.media = "not all";
      darkLink.media = "all";
    } else {
      lightLink.media = "all";
      darkLink.media = "not all";
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    updateFavicon(initial);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
    updateFavicon(next);
  }

  return (
    <button
      className="px-3 py-1 rounded bg-background hover:bg-muted transition-colors"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </button>
  );
}
