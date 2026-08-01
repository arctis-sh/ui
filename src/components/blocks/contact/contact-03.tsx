"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Contact03Props = {
  className?: string;
};

const CHANNELS = [
  {
    title: "Sales",
    description: "Pricing, demos, and enterprise plans.",
    href: "mailto:sales@example.com",
    action: "sales@example.com",
  },
  {
    title: "Support",
    description: "Help with install, tokens, and blocks.",
    href: "mailto:support@example.com",
    action: "support@example.com",
  },
  {
    title: "Press",
    description: "Brand assets and interview requests.",
    href: "mailto:press@example.com",
    action: "press@example.com",
  },
] as const;

export function Contact03({ className }: Contact03Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            How can we help?
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            Pick a channel, or leave your email and we’ll follow up.
          </p>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-3 @[40rem]:grid-cols-3">
          {CHANNELS.map((channel) => (
            <li
              key={channel.title}
              className="flex flex-col rounded-xl bg-muted p-5"
            >
              <p className="text-sm font-medium tracking-wide text-foreground">
                {channel.title}
              </p>
              <p className="mt-1.5 flex-1 text-xs tracking-wide text-muted-foreground">
                {channel.description}
              </p>
              <a
                href={channel.href}
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "mt-4 justify-start",
                })}
              >
                <span
                  data-slot="button-link-label"
                  className="relative inline after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:ease-out group-hover/button-link:after:scale-x-100"
                >
                  {channel.action}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <form
          className="mx-auto mt-6 flex w-full max-w-lg flex-col gap-2 @[32rem]:flex-row @[32rem]:items-center"
          onSubmit={(event) => event.preventDefault()}
        >
          <Input
            name="email"
            type="email"
            placeholder="you@company.com"
            aria-label="Email"
            className="h-9 min-h-9 max-h-9 flex-1 border-0 bg-muted py-0"
          />
          <Button
            type="submit"
            className="h-9 min-h-9 max-h-9 w-full shrink-0 whitespace-nowrap @[32rem]:w-auto"
          >
            Request a callback
          </Button>
        </form>
      </div>
    </section>
  );
}
