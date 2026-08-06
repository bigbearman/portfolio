"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "./Icon";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") setTheme(current);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("kd:theme", JSON.stringify(next));
    } catch {
      // localStorage unavailable (private mode) — theme just won't persist
    }
  };

  return (
    <button
      className="icon-btn"
      onClick={toggle}
      aria-label="toggle theme"
      title={theme === "dark" ? "light mode" : "dark mode"}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}
