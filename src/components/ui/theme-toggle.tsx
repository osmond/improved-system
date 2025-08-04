import React, { useEffect, useState } from "react";
import { Sun, Moon, Contrast } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | "contrast">("light");

  function updateFavicon(mode: "light" | "dark" | "contrast") {
    const lightLink = document.getElementById("favicon-light") as HTMLLinkElement | null;
    const darkLink = document.getElementById("favicon-dark") as HTMLLinkElement | null;
    if (!lightLink || !darkLink) return;
    const effective = mode === "light" ? "light" : "dark";
    if (effective === "dark") {
      lightLink.media = "not all";
      darkLink.media = "all";
    } else {
      lightLink.media = "all";
      darkLink.media = "not all";
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | "contrast"
      | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const prefersContrast = window.matchMedia("(prefers-contrast: more)").matches;
    const initial =
      stored || (prefersContrast ? "contrast" : prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    document.documentElement.classList.toggle("contrast", initial === "contrast");
    updateFavicon(initial);
  }, []);

  function toggleTheme() {
    const next =
      theme === "light" ? "dark" : theme === "dark" ? "contrast" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.classList.toggle("contrast", next === "contrast");
    localStorage.setItem("theme", next);
    updateFavicon(next);
  }

  const nextTheme =
    theme === "light" ? "dark" : theme === "dark" ? "contrast" : "light";

  return (
    <button
      className="px-3 py-1 rounded bg-background hover:bg-muted transition-colors"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4" />
      ) : theme === "dark" ? (
        <Contrast className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </button>
  );
}
