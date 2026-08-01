"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Onboarding01Props = {
  className?: string;
};

const HIGHLIGHTS = [
  "Invite your team in one click",
  "Start from ready-made blocks",
  "Ship a first page today",
] as const;

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12.5 10 17.5 19 7" />
    </svg>
  );
}

export function Onboarding01({ className }: Onboarding01Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-10 text-center @[32rem]:px-6 @[32rem]:py-14">
        <p className="text-xs tracking-wide text-muted-foreground">
          Welcome to Arctis
        </p>
        <h2 className="mt-2 text-2xl font-medium tracking-wide text-foreground @[32rem]:text-3xl">
          Let’s get your workspace ready
        </h2>
        <p className="mt-3 text-sm tracking-wide text-muted-foreground">
          A short setup so your team can start shipping pages without the blank
          canvas.
        </p>

        <ul className="mt-8 flex w-full flex-col gap-3 text-left">
          {HIGHLIGHTS.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3 text-sm tracking-wide text-foreground"
            >
              <span className="flex size-5 shrink-0 items-center justify-center text-foreground [&_svg]:size-3.5">
                <CheckIcon />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex w-full flex-col gap-2 @[32rem]:flex-row @[32rem]:justify-center">
          <Button type="button" size="sm" className="w-full @[32rem]:w-auto">
            Get started
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="w-full @[32rem]:w-auto"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </section>
  );
}
