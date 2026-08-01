"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Contact02Props = {
  className?: string;
};

const DETAILS = [
  {
    label: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
  },
  {
    label: "Support",
    value: "support@example.com",
    href: "mailto:support@example.com",
  },
] as const;

export function Contact02({ className }: Contact02Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div
        data-slot="block-split"
        className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 @[40rem]:flex-row @[40rem]:items-start @[40rem]:gap-10 @[40rem]:px-6 @[40rem]:py-14"
      >
        <div className="w-full shrink-0 @[40rem]:w-[40%]">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            Let’s talk
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            Email us directly or send a note with the form.
          </p>
          <ul className="mt-8 flex flex-col gap-5">
            {DETAILS.map((detail) => (
              <li key={detail.label} className="flex flex-col gap-1">
                <p className="text-xs tracking-wide text-muted-foreground">
                  {detail.label}
                </p>
                <a
                  href={detail.href}
                  className={buttonVariants({
                    variant: "link",
                    size: "sm",
                    className: "justify-start",
                  })}
                >
                  <span
                    data-slot="button-link-label"
                    className="relative inline after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:ease-out group-hover/button-link:after:scale-x-100"
                  >
                    {detail.value}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form
          className="flex min-w-0 w-full flex-col gap-4 @[40rem]:w-[60%]"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="grid grid-cols-1 gap-4 @[32rem]:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-02-first-name">First name</Label>
              <Input
                id="contact-02-first-name"
                name="firstName"
                placeholder="Jordan"
                className="border-0 bg-muted"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-02-last-name">Last name</Label>
              <Input
                id="contact-02-last-name"
                name="lastName"
                placeholder="Hale"
                className="border-0 bg-muted"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-02-email">Email</Label>
            <Input
              id="contact-02-email"
              name="email"
              type="email"
              placeholder="jordan@relay.com"
              className="border-0 bg-muted"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-02-company">Company</Label>
            <Input
              id="contact-02-company"
              name="company"
              placeholder="Relay"
              className="border-0 bg-muted"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-02-message">Message</Label>
            <Textarea
              id="contact-02-message"
              name="message"
              placeholder="What do you need?"
              className="min-h-28 max-h-48 resize-y border-0 bg-muted"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="w-full @[32rem]:w-auto @[32rem]:self-start"
          >
            Send message
          </Button>
        </form>
      </div>
    </section>
  );
}
