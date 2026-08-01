"use client";

import { cn } from "@/lib/utils";

type Gallery02Props = {
  className?: string;
};

const IMAGES = [
  {
    src: "/assets/brand/demos/attachments/attachment-1.png",
    caption: "Launch hero",
  },
  {
    src: "/assets/brand/demos/attachments/attachment-2.png",
    caption: "Token surfaces",
  },
  {
    src: "/assets/brand/demos/attachments/attachment-3.png",
    caption: "Detail shots",
  },
  {
    src: "/assets/brand/demos/attachments/attachment-4.png",
    caption: "Product UI",
  },
  {
    src: "/assets/brand/demos/attachments/attachment-5.png",
    caption: "Brand moments",
  },
  {
    src: "/assets/brand/demos/attachments/attachment-2.png",
    caption: "Dark mode",
  },
] as const;

export function Gallery02({ className }: Gallery02Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            Selected frames
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            Filled image cards with a short caption under each shot.
          </p>
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-3 @[32rem]:grid-cols-2 @[40rem]:grid-cols-3">
          {IMAGES.map((image) => (
            <li
              key={image.caption}
              className="overflow-hidden rounded-xl bg-muted p-2"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-lg bg-background">
                <img
                  src={image.src}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
              <p className="px-1 pt-2.5 pb-1 text-xs tracking-wide text-muted-foreground">
                {image.caption}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
