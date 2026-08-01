"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const links = ["Product", "Docs", "Pricing", "Changelog"] as const;

export function Navbar04() {
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
          <Button type="button" size="sm">
            Get started
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Menu"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "px-2 @[32rem]:px-3",
              )}
            >
              <span className="hidden @[32rem]:inline">Menu</span>
              <ChevronDownIcon className="size-3.5 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuGroup>
                {links.map((label) => (
                  <DropdownMenuItem key={label}>{label}</DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
