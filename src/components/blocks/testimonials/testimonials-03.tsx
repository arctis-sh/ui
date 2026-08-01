"use client";

import { cn } from "@/lib/utils";

type Testimonials03Props = {
  className?: string;
};

const TESTIMONIALS = [
  {
    quote: "Shipped our launch site in a day.",
    name: "Maya Chen",
    role: "Northline",
    avatar: "/assets/brand/demos/avatars/avatar-1.png",
  },
  {
    quote: "Finally blocks that match our tokens.",
    name: "Jordan Hale",
    role: "Relay",
    avatar: "/assets/brand/demos/avatars/avatar-2.png",
  },
  {
    quote: "CLI install, drop in, done.",
    name: "Priya Nair",
    role: "Cove",
    avatar: "/assets/brand/demos/avatars/avatar-3.png",
  },
  {
    quote: "Dark mode without the cleanup pass.",
    name: "Chris Ortega",
    role: "Stackwell",
    avatar: "/assets/brand/demos/avatars/avatar-4.png",
  },
  {
    quote: "Looks custom without the custom bill.",
    name: "Sam Okonkwo",
    role: "Fieldkit",
    avatar: "/assets/brand/demos/avatars/avatar-5.png",
  },
] as const;

function QuoteCard({
  quote,
  name,
  role,
  avatar,
}: (typeof TESTIMONIALS)[number]) {
  return (
    <figure className="flex w-[18rem] shrink-0 flex-col justify-between rounded-xl border border-border bg-background p-5">
      <blockquote className="text-sm tracking-wide text-foreground">
        “{quote}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <img
          src={avatar}
          alt=""
          className="size-8 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium tracking-wide text-foreground">
            {name}
          </p>
          <p className="truncate text-xs tracking-wide text-muted-foreground">
            {role}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

export function Testimonials03({ className }: Testimonials03Props) {
  const track = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className={cn("w-full overflow-hidden bg-background", className)}>
      <style>{`
        @keyframes testimonials-03-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>
      <div className="flex w-full flex-col gap-5 py-10">
        <p className="px-6 text-left text-xs tracking-wide text-muted-foreground">
          What teams say after they ship
        </p>
        <div className="w-full overflow-hidden" aria-hidden="true">
          <div
            className="flex w-max gap-3 pr-3"
            style={{ animation: "testimonials-03-scroll 40s linear infinite" }}
          >
            {track.map((item, i) => (
              <QuoteCard key={`${item.name}-${i}`} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
