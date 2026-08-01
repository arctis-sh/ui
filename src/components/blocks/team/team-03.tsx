"use client";

import { cn } from "@/lib/utils";

type Team03Props = {
  className?: string;
};

const MEMBERS = [
  {
    name: "Maya Chen",
    role: "CEO & Co-founder",
    avatar: "/assets/brand/demos/avatars/avatar-1.png",
  },
  {
    name: "Jordan Hale",
    role: "Head of Design",
    avatar: "/assets/brand/demos/avatars/avatar-2.png",
  },
  {
    name: "Priya Nair",
    role: "Eng Manager",
    avatar: "/assets/brand/demos/avatars/avatar-3.png",
  },
] as const;

export function Team03({ className }: Team03Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            Leadership
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            The people setting direction for product, design, and engineering.
          </p>
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-4 @[40rem]:grid-cols-3">
          {MEMBERS.map((member) => (
            <li key={member.name} className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
              <img
                src={member.avatar}
                alt=""
                className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 translate-y-0 p-3 transition-transform duration-300 ease-out [@media(hover:hover)]:translate-y-full [@media(hover:hover)]:group-hover:translate-y-0">
                <div className="rounded-lg bg-background/70 px-3 py-2.5 backdrop-blur-md">
                  <p className="text-sm font-medium tracking-wide text-foreground">
                    {member.name}
                  </p>
                  <p className="mt-0.5 text-xs tracking-wide text-muted-foreground">
                    {member.role}
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
