"use client";

import { cn } from "@/lib/utils";

type Logos01Props = {
  className?: string;
};

const LOGOS = [
  { src: "/assets/icons/logos/slack.svg", alt: "Slack" },
  { src: "/assets/icons/logos/notion.svg", alt: "Notion" },
  { src: "/assets/icons/logos/linear.svg", alt: "Linear" },
  { src: "/assets/icons/logos/github.svg", alt: "GitHub" },
  { src: "/assets/icons/logos/figma.svg", alt: "Figma" },
  { src: "/assets/icons/logos/stripe.svg", alt: "Stripe" },
] as const;

export function Logos01({ className }: Logos01Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-4 py-10 @[32rem]:gap-6 @[32rem]:px-6 @[32rem]:py-12">
        <p className="text-xs tracking-wide text-muted-foreground">
          Trusted by teams everywhere
        </p>
        <ul className="flex flex-nowrap items-center justify-center gap-x-4 @[32rem]:gap-x-8">
          {LOGOS.map((logo) => (
            <li key={logo.src} className="flex items-center">
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-4 w-auto object-contain opacity-70 brightness-0 @[32rem]:h-6 dark:invert"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
