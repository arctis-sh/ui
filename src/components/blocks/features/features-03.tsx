"use client";

import { cn } from "@/lib/utils";

type Features03Props = {
  className?: string;
};

const FEATURES = [
  {
    title: "Token ready",
    description: "Restyle every block with your colors, radii, and type.",
    image: "/assets/brand/demos/attachments/attachment-1.png",
  },
  {
    title: "Copy and ship",
    description: "Install a block, drop it in a page, and keep moving.",
    image: "/assets/brand/demos/attachments/attachment-2.png",
  },
  {
    title: "Built to compose",
    description: "Mix heroes, nav, and sections without fighting the layout.",
    image: "/assets/brand/demos/attachments/attachment-3.png",
  },
] as const;

export function Features03({ className }: Features03Props) {
  return (
    <section className={cn("w-full bg-background", className)}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-6 py-14 lg:gap-16">
        {FEATURES.map((feature, index) => {
          const flip = index % 2 === 1;

          return (
            <div
              key={feature.title}
              data-slot="block-split"
              className={cn(
                "flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10",
                flip && "lg:flex-row-reverse",
              )}
            >
              <div className="min-h-[14rem] flex-1 overflow-hidden rounded-md bg-muted lg:min-h-[18rem]">
                <img
                  src={feature.image}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <h3 className="text-base font-medium tracking-wide text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 max-w-sm text-sm tracking-wide text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
