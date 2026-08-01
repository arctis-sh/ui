"use client";

import { cn } from "@/lib/utils";

type Testimonials02Props = {
  className?: string;
};

const TESTIMONIALS = [
  {
    quote: "Token-ready blocks — we stopped rebuilding the same sections every launch.",
    name: "Jordan Hale",
    role: "Founder, Relay",
    avatar: "/assets/brand/demos/avatars/avatar-2.png",
  },
  {
    quote: "CLI, drop-in, ship. Boring install story in the best way.",
    name: "Priya Nair",
    role: "Eng Manager, Cove",
    avatar: "/assets/brand/demos/avatars/avatar-3.png",
  },
  {
    quote: "Light and dark just worked. Time went to product, not palette fights.",
    name: "Chris Ortega",
    role: "Product, Stackwell",
    avatar: "/assets/brand/demos/avatars/avatar-4.png",
  },
] as const;

export function Testimonials02({ className }: Testimonials02Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 @[32rem]:px-6 @[32rem]:py-12">
        <ul className="grid grid-cols-1 gap-3 @[40rem]:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <li
              key={item.name}
              className="flex flex-col rounded-xl bg-muted p-4"
            >
              <blockquote className="flex-1 text-xs tracking-wide text-foreground">
                “{item.quote}”
              </blockquote>
              <div className="mt-4 flex items-center gap-2.5">
                <img
                  src={item.avatar}
                  alt=""
                  className="size-7 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium tracking-wide text-foreground">
                    {item.name}
                  </p>
                  <p className="truncate text-[11px] tracking-wide text-muted-foreground">
                    {item.role}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
