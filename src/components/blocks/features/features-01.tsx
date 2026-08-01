"use client";

import { cn } from "@/lib/utils";

type Features01Props = {
  className?: string;
};

const FEATURES = [
  {
    title: "Token ready",
    description: "Restyle blocks with your theme tokens.",
    image: "/assets/brand/demos/attachments/attachment-1.png",
  },
  {
    title: "Copy and ship",
    description: "Install a block and drop it into a page.",
    image: "/assets/brand/demos/attachments/attachment-2.png",
  },
  {
    title: "Built to compose",
    description: "Mix sections without fighting the layout.",
    image: "/assets/brand/demos/attachments/attachment-3.png",
  },
] as const;

export function Features01({ className }: Features01Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-4xl px-6 py-14">
        <ul className="grid w-full gap-4 @[40rem]:grid-cols-3">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="rounded-xl border border-border p-2"
            >
              <div className="aspect-[16/10] w-full overflow-hidden rounded-sm bg-muted">
                <img
                  src={feature.image}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
              <div className="px-1 pt-3 pb-1">
                <h3 className="text-sm font-medium tracking-wide text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm tracking-wide text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
