"use client";

import { List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { href: "#cara-kerja", label: "Cara kerja" },
  { href: "#layout", label: "Layout" },
  { href: "#privasi", label: "Privasi" },
  { href: "#faq", label: "FAQ" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-6 lg:h-[68px] lg:px-10"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-ink"
          onClick={() => setOpen(false)}
        >
          <span
            aria-hidden
            className="grid size-7 place-items-center rounded-[8px] bg-accent"
          >
            <span className="size-2.5 rounded-full bg-accent-ink" />
          </span>
          <span className="text-[17px] font-semibold tracking-tight">
            Pothobox
          </span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-[14px] text-muted transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2.5">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="relative grid size-9 place-items-center rounded-full border border-line text-ink active:scale-95 before:absolute before:-inset-2 before:content-[''] lg:hidden"
          >
            {open ? (
              <X size={16} weight="bold" />
            ) : (
              <List size={16} weight="bold" />
            )}
          </button>
        </div>
      </nav>

      <div
        className={`absolute inset-x-0 top-full overflow-hidden border-b border-line bg-bg transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          open ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"
        }`}
      >
        <ul className="min-h-0 overflow-hidden px-4">
          {LINKS.map((l) => (
            <li key={l.href} className="border-b border-line last:border-0">
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3.5 text-[15px] text-ink"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}