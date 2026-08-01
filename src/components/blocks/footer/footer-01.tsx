"use client";

import { Logo } from "@/components/brand";
import { cn } from "@/lib/utils";

type Footer01Props = {
  className?: string;
};

const COLUMNS = [
  {
    title: "Product",
    links: ["Blocks", "Components", "Changelog", "Pricing"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Contact"],
  },
  {
    title: "Resources",
    links: ["Docs", "Guides", "Support", "Status"],
  },
] as const;

export function Footer01({ className }: Footer01Props) {
  return (
    <footer className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-5xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="flex flex-col gap-10 @[40rem]:flex-row @[40rem]:justify-between">
          <div className="max-w-xs">
            <Logo className="block h-4 w-auto text-foreground" />
            <p className="mt-4 text-sm tracking-wide text-muted-foreground">
              UI blocks and components for shipping polished product surfaces.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 @[32rem]:grid-cols-3 @[40rem]:gap-12">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-medium tracking-wide text-foreground">
                  {column.title}
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm tracking-wide text-muted-foreground"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 @[32rem]:flex-row @[32rem]:items-center @[32rem]:justify-between">
          <p className="text-xs tracking-wide text-muted-foreground">
            © 2026 Arctis. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="text-xs tracking-wide text-muted-foreground">
              Privacy
            </a>
            <a href="#" className="text-xs tracking-wide text-muted-foreground">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
