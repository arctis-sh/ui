"use client";

import { cn } from "@/lib/utils";

type Testimonials01Props = {
  className?: string;
};

export function Testimonials01({ className }: Testimonials01Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-12 text-center @[32rem]:px-6 @[32rem]:py-16">
        <blockquote className="text-balance text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
          “We dropped in a hero and a navbar and shipped the marketing page the
          same afternoon. It already looked like us.”
        </blockquote>
        <div className="mt-8 flex flex-col items-center gap-3">
          <img
            src="/assets/brand/demos/avatars/avatar-1.png"
            alt=""
            className="size-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium tracking-wide text-foreground">
              Maya Chen
            </p>
            <p className="mt-0.5 text-xs tracking-wide text-muted-foreground">
              Head of Design, Northline
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
