"use client";

import { cn } from "@/lib/utils";

type Gallery01Props = {
  className?: string;
};

const IMAGES = [
  "/assets/brand/demos/attachments/attachment-1.png",
  "/assets/brand/demos/attachments/attachment-2.png",
  "/assets/brand/demos/attachments/attachment-3.png",
  "/assets/brand/demos/attachments/attachment-4.png",
  "/assets/brand/demos/attachments/attachment-5.png",
  "/assets/brand/demos/attachments/attachment-1.png",
] as const;

export function Gallery01({ className }: Gallery01Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            Gallery
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            A simple grid of images — swap in your own shots.
          </p>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-2 @[40rem]:grid-cols-3 @[40rem]:gap-3">
          {IMAGES.map((src, index) => (
            <li
              key={`${src}-${index}`}
              className="aspect-square overflow-hidden rounded-xl bg-muted"
            >
              <img src={src} alt="" className="size-full object-cover" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
