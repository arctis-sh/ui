"use client";

import { useState } from "react";

function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 18V6l8 7 8-7v12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="11"
        cy="11"
        r="6.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M16.5 16.5 20 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NavSeparator() {
  return (
    <div className="h-4 w-px shrink-0 bg-foreground/20" aria-hidden="true" />
  );
}

function MenuTrigger({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="navbar-05-menu"
      aria-label={open ? "Close menu" : "Open menu"}
      className="inline-flex size-8 items-center justify-center rounded-md bg-surface text-foreground"
    >
      <span className="relative block size-3.5" aria-hidden="true">
        <span
          className={`absolute right-0 left-0 h-px bg-current transition-all duration-300 ease-out ${
            open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[3px]"
          }`}
        />
        <span
          className={`absolute right-0 left-0 h-px bg-current transition-all duration-300 ease-out ${
            open ? "top-1/2 -translate-y-1/2 -rotate-45" : "top-[10px]"
          }`}
        />
      </span>
    </button>
  );
}

const links = [
  { label: "Docs", href: "#" },
  { label: "Components", href: "#" },
  { label: "Blocks", href: "#" },
] as const;

export function Navbar05() {
  const [open, setOpen] = useState(false);

  return (
    <header className="@container w-full bg-background px-4 py-3">
      <nav className="relative flex items-center" aria-label="main">
        <a
          href="#"
          className="inline-flex shrink-0 items-center gap-2 text-foreground"
        >
          <Mark className="size-4" />
          <span className="text-sm tracking-wide">Acme</span>
        </a>

        <ul className="ml-6 hidden items-center gap-0.5 @[40rem]:flex">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="block rounded-md px-2.5 py-1.5 text-sm font-normal tracking-wide text-foreground hover:bg-surface-hover"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center justify-end gap-2">
          <button
            type="button"
            aria-label="Search"
            className="inline-flex h-8 items-center gap-2 rounded-md bg-surface px-2.5 text-sm font-normal tracking-wide text-foreground transition-colors duration-200 ease-out @[40rem]:w-44 @[40rem]:hover:bg-surface-hover"
          >
            <SearchIcon className="size-3.5 shrink-0" />
            <span className="hidden @[40rem]:inline">Search...</span>
          </button>

          <NavSeparator />

          <a
            href="#"
            className="inline-flex rounded-md bg-foreground px-3 py-1.5 text-sm font-normal tracking-wide text-background transition-opacity duration-200 ease-out hover:opacity-85"
          >
            Install
          </a>

          <div className="@[40rem]:hidden">
            <MenuTrigger open={open} onClick={() => setOpen((v) => !v)} />
          </div>
        </div>
      </nav>

      <div
        id="navbar-05-menu"
        className={`grid @[40rem]:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        } transition-[grid-template-rows] duration-300 ease-in-out`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1 pt-6 pb-2">
            <p className="pb-1 text-xs font-normal tracking-wide text-foreground/40">
              Menu
            </p>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="py-2 text-2xl font-medium tracking-wide text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
