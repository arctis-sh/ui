"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Contact01Props = {
  className?: string;
};

export function Contact01({ className }: Contact01Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-md px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            Get in touch
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            Tell us what you’re building — we’ll get back within a day.
          </p>
        </div>
        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-01-name">Name</Label>
            <Input
              id="contact-01-name"
              name="name"
              placeholder="Maya Chen"
              className="border-0 bg-muted"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-01-email">Email</Label>
            <Input
              id="contact-01-email"
              name="email"
              type="email"
              placeholder="maya@northline.com"
              className="border-0 bg-muted"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-01-message">Message</Label>
            <Textarea
              id="contact-01-message"
              name="message"
              placeholder="How can we help?"
              className="min-h-28 max-h-48 resize-y border-0 bg-muted"
            />
          </div>
          <Button type="submit" size="sm" className="w-full">
            Send message
          </Button>
        </form>
      </div>
    </section>
  );
}
