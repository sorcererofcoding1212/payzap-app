"use client";

import { useEffect, useState } from "react";

const THEMES = {
  light: "forest",
  dark: "silk",
} as const;

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<string>(THEMES.light);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") ?? THEMES.light;
    setTheme(storedTheme);
    document.documentElement.setAttribute("data-theme", storedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === THEMES.dark;

  return (
    <label className="swap swap-rotate fixed z-50 bottom-5 right-4 rounded-full p-1 border-2 lg:border-3 border-base-content">
      <input
        type="checkbox"
        checked={isDark}
        onChange={() => setTheme(isDark ? THEMES.light : THEMES.dark)}
      />
      <svg
        className="swap-off size-6 lg:size-8 fill-base-content"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 0.24 0.24"
      >
        <path d="m0.056 0.17 -0.007 0.007a0.01 0.01 0 0 0 0 0.014 0.01 0.01 0 0 0 0.014 0l0.007 -0.007A0.01 0.01 0 0 0 0.056 0.17M0.05 0.12a0.01 0.01 0 0 0 -0.01 -0.01H0.03a0.01 0.01 0 0 0 0 0.02h0.01a0.01 0.01 0 0 0 0.01 -0.01m0.07 -0.07a0.01 0.01 0 0 0 0.01 -0.01V0.03a0.01 0.01 0 0 0 -0.02 0v0.01a0.01 0.01 0 0 0 0.01 0.01M0.056 0.07a0.01 0.01 0 0 0 0.007 0.003 0.01 0.01 0 0 0 0.007 -0.003 0.01 0.01 0 0 0 0 -0.014l-0.007 -0.007a0.01 0.01 0 0 0 -0.014 0.014Zm0.12 0.003a0.01 0.01 0 0 0 0.007 -0.003l0.007 -0.007a0.01 0.01 0 1 0 -0.014 -0.014l-0.006 0.007a0.01 0.01 0 0 0 0 0.014 0.01 0.01 0 0 0 0.007 0.003ZM0.21 0.11h-0.01a0.01 0.01 0 0 0 0 0.02h0.01a0.01 0.01 0 0 0 0 -0.02m-0.09 0.08a0.01 0.01 0 0 0 -0.01 0.01v0.01a0.01 0.01 0 0 0 0.02 0v-0.01a0.01 0.01 0 0 0 -0.01 -0.01m0.064 -0.02A0.01 0.01 0 0 0 0.17 0.184l0.007 0.007a0.01 0.01 0 0 0 0.014 0 0.01 0.01 0 0 0 0 -0.014ZM0.12 0.065a0.055 0.055 0 1 0 0.055 0.055A0.055 0.055 0 0 0 0.12 0.065m0 0.09a0.035 0.035 0 1 1 0.035 -0.035 0.035 0.035 0 0 1 -0.035 0.035" />
      </svg>
      <svg
        className="swap-on size-6 lg:size-8 fill-base-content"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M21.64 13a9 9 0 01-11.64-11.64 9 9 0 1011.64 11.64z" />
      </svg>
    </label>
  );
};
