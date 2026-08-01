"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type Features02Props = {
  className?: string;
};

const FEATURES = [
  {
    value: "1",
    title: "Token ready",
    description: "Restyle every block with your colors, radii, and type.",
    image: "/assets/brand/demos/attachments/attachment-1.png",
  },
  {
    value: "2",
    title: "Copy and ship",
    description: "Install a block, drop it in a page, and keep moving.",
    image: "/assets/brand/demos/attachments/attachment-2.png",
  },
  {
    value: "3",
    title: "Built to compose",
    description: "Mix heroes, nav, and sections without fighting the layout.",
    image: "/assets/brand/demos/attachments/attachment-3.png",
  },
] as const;

export function Features02({ className }: Features02Props) {
  const [open, setOpen] = useState("1");
  const index = Math.max(
    0,
    FEATURES.findIndex((feature) => feature.value === open),
  );

  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div
        data-slot="block-split"
        className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-14 lg:flex-row lg:items-stretch lg:gap-10"
      >
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <Accordion
            type="single"
            collapsible={false}
            value={open}
            onValueChange={(value) => {
              if (typeof value === "string" && value) setOpen(value);
            }}
          >
            {FEATURES.map((feature) => (
              <AccordionItem key={feature.value} value={feature.value}>
                <AccordionTrigger indicator="plus">
                  {feature.title}
                </AccordionTrigger>
                <AccordionContent>{feature.description}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="relative min-h-[16rem] flex-1 overflow-hidden rounded-md bg-muted lg:min-h-[20rem]">
          <div
            className="absolute inset-x-0 top-0 w-full will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              height: `${FEATURES.length * 100}%`,
              transform: `translate3d(0, -${(index * 100) / FEATURES.length}%, 0)`,
            }}
          >
            {FEATURES.map((feature) => (
              <div
                key={feature.value}
                className="w-full"
                style={{ height: `${100 / FEATURES.length}%` }}
              >
                <img
                  src={feature.image}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
