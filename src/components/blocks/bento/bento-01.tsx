"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Bento01Props = {
  className?: string;
};

const AVATARS = [
  "/assets/brand/demos/avatars/avatar-1.png",
  "/assets/brand/demos/avatars/avatar-2.png",
  "/assets/brand/demos/avatars/avatar-3.png",
  "/assets/brand/demos/avatars/avatar-4.png",
  "/assets/brand/demos/avatars/avatar-5.png",
] as const;

function Mark({ className }: { className?: string }) {
  return (
    <img
      src="/assets/brand/logo/ui.svg"
      alt=""
      className={cn("brightness-0 dark:invert", className)}
    />
  );
}

export function Bento01({ className }: Bento01Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-5xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="grid grid-cols-1 gap-3 @[32rem]:grid-cols-2 @[48rem]:grid-cols-4 @[48rem]:grid-rows-[minmax(11rem,1fr)_minmax(9rem,1fr)_minmax(10rem,1fr)]">
          {/* Tall image — full width on mobile, half on tablet, tall on desktop */}
          <div className="relative min-h-[14rem] overflow-hidden rounded-xl bg-muted @[32rem]:col-span-2 @[32rem]:min-h-[16rem] @[48rem]:col-span-1 @[48rem]:row-span-2">
            <img
              src="/assets/brand/demos/attachments/attachment-1.png"
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"
            />
            <p className="absolute inset-x-0 bottom-0 p-4 text-sm font-medium tracking-wide text-white">
              Ship interfaces that feel finished
            </p>
          </div>

          {/* Big middle: pitch + CTA */}
          <div className="flex min-h-[16rem] flex-col justify-between rounded-xl bg-muted p-5 @[32rem]:col-span-2 @[48rem]:row-span-2">
            <Mark className="size-8" />
            <div className="mt-8 flex flex-1 flex-col justify-end gap-6">
              <p className="max-w-sm text-sm font-medium tracking-wide text-foreground">
                Build your interface with ready made blocks and modern design.
              </p>
              <div>
                <p className="text-3xl font-medium tracking-wide text-foreground">
                  Free
                </p>
                <p className="mt-1 text-sm tracking-wide text-muted-foreground">
                  Open source component library
                </p>
                <Button type="button" size="sm" className="mt-4">
                  Get started
                </Button>
              </div>
            </div>
          </div>

          {/* Stat */}
          <div className="flex min-h-[10rem] flex-col justify-between rounded-xl bg-muted p-5 @[32rem]:min-h-[11rem]">
            <p className="text-4xl font-medium tracking-wide text-foreground">
              95%
            </p>
            <p className="text-sm tracking-wide text-muted-foreground">
              Teams ship faster with reusable blocks.
            </p>
          </div>

          {/* Mark tile */}
          <div className="flex min-h-[10rem] items-center justify-center rounded-xl bg-muted p-5 @[32rem]:min-h-[11rem] @[48rem]:min-h-[9rem] @[48rem]:col-start-4 @[48rem]:row-start-2">
            <Mark className="size-12" />
          </div>

          {/* Social proof */}
          <div className="flex min-h-[10rem] flex-col justify-between rounded-xl bg-muted p-5 @[32rem]:col-span-1">
            <div>
              <p className="text-3xl font-medium tracking-wide text-foreground">
                300+
              </p>
              <p className="mt-1 text-sm tracking-wide text-muted-foreground">
                Blocks and patterns
              </p>
            </div>
            <AvatarGroup overlap="sm" className="mt-4">
              {AVATARS.map((src) => (
                <Avatar key={src} size="sm">
                  <AvatarImage src={src} alt="" />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
          </div>

          {/* Wide mark — full row on tablet */}
          <div className="flex min-h-[10rem] items-center justify-center rounded-xl bg-muted p-5 @[32rem]:col-span-1 @[48rem]:col-span-2">
            <Mark className="size-14" />
          </div>

          {/* Image + copy — full width on mobile/tablet */}
          <div className="relative min-h-[12rem] overflow-hidden rounded-xl bg-muted @[32rem]:col-span-2 @[48rem]:col-span-1 @[48rem]:min-h-[10rem]">
            <img
              src="/assets/brand/demos/attachments/attachment-3.png"
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-sm font-medium tracking-wide text-white">
                Rapid development
              </p>
              <p className="mt-1 text-xs tracking-wide text-white/75">
                Drop in blocks and keep shipping.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
