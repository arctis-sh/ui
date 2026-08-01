"use client";

import { cn } from "@/lib/utils";

type Logos03Props = {
  className?: string;
};

const LOGOS = [
  { src: "/assets/icons/logos/slack.svg", alt: "Slack" },
  { src: "/assets/icons/logos/notion.svg", alt: "Notion" },
  { src: "/assets/icons/logos/linear.svg", alt: "Linear" },
  { src: "/assets/icons/logos/github.svg", alt: "GitHub" },
  { src: "/assets/icons/logos/figma.svg", alt: "Figma" },
  { src: "/assets/icons/logos/stripe.svg", alt: "Stripe" },
  { src: "/assets/icons/logos/intercom.svg", alt: "Intercom" },
  { src: "/assets/icons/logos/airtable.svg", alt: "Airtable" },
  { src: "/assets/icons/logos/hubspot.svg", alt: "HubSpot" },
  { src: "/assets/icons/logos/asana.svg", alt: "Asana" },
  { src: "/assets/icons/logos/dropbox.svg", alt: "Dropbox" },
  { src: "/assets/icons/logos/snowflake.svg", alt: "Snowflake" },
] as const;

export function Logos03({ className }: Logos03Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-10 @[32rem]:px-6 @[32rem]:py-12">
        <p className="text-xs tracking-wide text-muted-foreground">
          Trusted by companies everywhere
        </p>
        <ul className="grid w-full grid-cols-3 gap-x-6 gap-y-8 @[28rem]:grid-cols-4 @[40rem]:grid-cols-6">
          {LOGOS.map((logo) => (
            <li key={logo.src} className="flex items-center justify-center">
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-5 w-auto object-contain opacity-70 brightness-0 @[32rem]:h-6 dark:invert"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
