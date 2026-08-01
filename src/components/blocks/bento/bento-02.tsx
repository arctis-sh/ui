"use client";

import { cn } from "@/lib/utils";

type Bento02Props = {
  className?: string;
};

const CELLS = [
  {
    title: "Token ready",
    description: "Restyle every block with your colors, radii, and type.",
    image: "/assets/brand/demos/attachments/attachment-1.png",
    className:
      "@[32rem]:col-span-2 @[32rem]:row-span-2 @[48rem]:col-span-2 @[48rem]:row-span-2",
  },
  {
    title: "Copy and ship",
    description: "Install a block and drop it into a page.",
    image: "/assets/brand/demos/attachments/attachment-2.png",
    className: "@[32rem]:col-span-2 @[48rem]:col-span-2",
  },
  {
    title: "Compose",
    description: "Mix sections freely.",
    image: "/assets/brand/demos/attachments/attachment-3.png",
    className: "@[32rem]:col-span-1 @[48rem]:col-span-1",
  },
  {
    title: "Accessible",
    description: "Keyboard-first defaults.",
    image: "/assets/brand/demos/attachments/attachment-4.png",
    className: "@[32rem]:col-span-1 @[48rem]:col-span-1",
  },
  {
    title: "Rapid development",
    description: "Ship interfaces that feel finished.",
    image: "/assets/brand/demos/attachments/attachment-5.png",
    className: "@[32rem]:col-span-2 @[48rem]:col-span-2",
  },
  {
    title: "Theme sync",
    description: "Light and dark out of the box.",
    image: "/assets/brand/demos/attachments/attachment-2.png",
    className: "@[32rem]:col-span-2 @[48rem]:col-span-2",
  },
] as const;

export function Bento02({ className }: Bento02Props) {
  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-5xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <ul className="grid grid-cols-1 gap-3 @[32rem]:grid-cols-4 @[32rem]:auto-rows-[11rem]">
          {CELLS.map((cell) => (
            <li
              key={cell.title}
              className={cn(
                "group relative min-h-[12rem] overflow-hidden rounded-xl bg-muted @[32rem]:min-h-0",
                cell.className,
              )}
            >
              <img
                src={cell.image}
                alt=""
                className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="text-sm font-medium tracking-wide text-white">
                  {cell.title}
                </h3>
                <p className="mt-1 text-xs tracking-wide text-white/75">
                  {cell.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
