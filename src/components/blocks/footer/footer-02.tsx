"use client";

import { Logo } from "@/components/brand";
import { cn } from "@/lib/utils";

type Footer02Props = {
  className?: string;
};

const LINKS = ["Product", "Docs", "Pricing", "Blog", "Contact"] as const;

export function Footer02({ className }: Footer02Props) {
  return (
    <footer className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-10 text-center @[32rem]:px-6 @[32rem]:py-14">
        <Logo className="block h-4 w-auto text-foreground" />
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm tracking-wide text-muted-foreground"
            >
              {link}
            </a>
          ))}
        </nav>
        <p className="text-xs tracking-wide text-muted-foreground">
          © 2026 Arctis · Built for teams that ship UI
        </p>
      </div>
    </footer>
  );
}
