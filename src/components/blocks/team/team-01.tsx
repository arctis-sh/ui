"use client";

import { cn } from "@/lib/utils";

type Team01Props = {
  className?: string;
};

const MEMBERS = [
  {
    name: "Maya Chen",
    role: "CEO",
    avatar: "/assets/brand/demos/avatars/avatar-1.png",
  },
  {
    name: "Jordan Hale",
    role: "Design",
    avatar: "/assets/brand/demos/avatars/avatar-2.png",
  },
  {
    name: "Priya Nair",
    role: "Engineering",
    avatar: "/assets/brand/demos/avatars/avatar-3.png",
  },
  {
    name: "Chris Ortega",
    role: "Product",
    avatar: "/assets/brand/demos/avatars/avatar-4.png",
  },
  {
    name: "Sam Okonkwo",
    role: "Marketing",
    avatar: "/assets/brand/demos/avatars/avatar-5.png",
  },
  {
    name: "Elena Voss",
    role: "Support",
    avatar: "/assets/brand/demos/avatars/avatar-6.png",
  },
] as const;

export function Team01({ className }: Team01Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            Meet the team
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            The people shipping blocks, tokens, and docs every week.
          </p>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 @[32rem]:grid-cols-3 @[40rem]:grid-cols-6">
          {MEMBERS.map((member) => (
            <li key={member.name} className="flex flex-col items-center text-center">
              <img
                src={member.avatar}
                alt=""
                className="size-16 rounded-full object-cover @[32rem]:size-[4.5rem]"
              />
              <p className="mt-3 text-sm font-medium tracking-wide text-foreground">
                {member.name}
              </p>
              <p className="mt-0.5 text-xs tracking-wide text-muted-foreground">
                {member.role}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
