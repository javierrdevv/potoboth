"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useSyncExternalStore } from "react";

const EVENT = "pothobox-theme";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

const isDark = () => document.documentElement.classList.contains("dark");

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  function toggle() {
    const next = !isDark();
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(EVENT, next ? "dark" : "light");
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      className="relative grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:text-ink active:scale-95 before:absolute before:-inset-2 before:content-['']"
    >
      {dark ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />}
    </button>
  );
}