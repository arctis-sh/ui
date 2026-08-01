"use client";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Hero06Props = {
  className?: string;
};

const AVATARS = [
  { src: "/assets/brand/demos/avatars/avatar-1.png", alt: "User 1" },
  { src: "/assets/brand/demos/avatars/avatar-2.png", alt: "User 2" },
  { src: "/assets/brand/demos/avatars/avatar-3.png", alt: "User 3" },
  { src: "/assets/brand/demos/avatars/avatar-4.png", alt: "User 4" },
  { src: "/assets/brand/demos/avatars/avatar-5.png", alt: "User 5" },
] as const;

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.5L12 17.8 6.1 20.6l1.2-6.5L2.5 9.5l6.6-.9L12 2.5z" />
    </svg>
  );
}

export function Hero06({ className }: Hero06Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto flex h-full min-h-[28rem] w-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-balance text-2xl font-medium tracking-wide text-foreground @[32rem]:text-3xl">
          Ship interfaces that feel finished
        </h1>
        <p className="mt-3 max-w-sm text-pretty text-sm tracking-wide text-muted-foreground">
          Blocks you can drop in and restyle with your tokens.
        </p>
        <Button type="button" size="sm" className="mt-6">
          Get started
        </Button>

        <div className="mt-10 flex flex-col items-center gap-3 @[24rem]:flex-row @[24rem]:justify-center">
          <AvatarGroup overlap="sm">
            {AVATARS.map((avatar) => (
              <Avatar key={avatar.src} size="sm">
                <AvatarImage src={avatar.src} alt={avatar.alt} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
          <div className="flex flex-col items-center gap-1 @[24rem]:items-start">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 text-amber-400" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="size-3.5" />
                ))}
              </div>
              <span className="text-xs tracking-wide text-foreground">4.9</span>
            </div>
            <p className="text-xs tracking-wide text-muted-foreground">
              from 200+ reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
