"use client";

import { cn } from "@/lib/utils";

type Team02Props = {
  className?: string;
};

const MEMBERS = [
  {
    name: "Maya Chen",
    role: "CEO & Co-founder",
    bio: "Previously design systems at Northline. Obsessed with defaults that feel finished.",
    avatar: "/assets/brand/demos/avatars/avatar-1.png",
  },
  {
    name: "Jordan Hale",
    role: "Head of Design",
    bio: "Owns the visual language — type, space, and how every block sits on a page.",
    avatar: "/assets/brand/demos/avatars/avatar-2.png",
  },
  {
    name: "Priya Nair",
    role: "Eng Manager",
    bio: "Keeps the registry sharp and the install path boring in the best way.",
    avatar: "/assets/brand/demos/avatars/avatar-3.png",
  },
  {
    name: "Chris Ortega",
    role: "Product",
    bio: "Turns customer asks into blocks teams can drop in without a redesign tax.",
    avatar: "/assets/brand/demos/avatars/avatar-4.png",
  },
] as const;

export function Team02({ className }: Team02Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            Built by practitioners
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            Small team, high taste — design and engineering in the same room.
          </p>
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-3 @[40rem]:grid-cols-2">
          {MEMBERS.map((member) => (
            <li
              key={member.name}
              className="flex gap-4 rounded-xl bg-muted p-4"
            >
              <img
                src={member.avatar}
                alt=""
                className="size-14 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium tracking-wide text-foreground">
                  {member.name}
                </p>
                <p className="mt-0.5 text-xs tracking-wide text-muted-foreground">
                  {member.role}
                </p>
                <p className="mt-2 text-xs tracking-wide text-muted-foreground">
                  {member.bio}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
