"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

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

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const links = ["Product", "Docs", "Pricing"] as const;

export function Navbar01() {
  const [open, setOpen] = useState(false);

  return (
    <header className="@container w-full bg-background">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-3">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-foreground"
        >
          <Mark className="size-4" />
          <span className="text-sm tracking-wide">Acme</span>
        </a>

        <div className="flex items-center gap-1">
          <nav className="hidden items-center gap-1 @[32rem]:flex">
            {links.map((label) => (
              <Button key={label} type="button" variant="ghost" size="sm">
                {label}
              </Button>
            ))}
          </nav>
          <Button
            type="button"
            size="sm"
            className="hidden @[32rem]:inline-flex"
          >
            Get started
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="@[32rem]:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="flex flex-col gap-1 px-4 pb-3 @[32rem]:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((label) => (
              <Button
                key={label}
                type="button"
                variant="ghost"
                size="sm"
                className="justify-start"
              >
                {label}
              </Button>
            ))}
          </nav>
          <Button type="button" size="sm" className="mt-1 w-full">
            Get started
          </Button>
        </div>
      ) : null}
    </header>
  );
}
