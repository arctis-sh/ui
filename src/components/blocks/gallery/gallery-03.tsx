"use client";

import { cn } from "@/lib/utils";

type Gallery03Props = {
  className?: string;
};

const IMAGES = [
  "/assets/brand/demos/attachments/attachment-1.png",
  "/assets/brand/demos/attachments/attachment-2.png",
  "/assets/brand/demos/attachments/attachment-3.png",
  "/assets/brand/demos/attachments/attachment-4.png",
  "/assets/brand/demos/attachments/attachment-5.png",
] as const;

export function Gallery03({ className }: Gallery03Props) {
  const track = [...IMAGES, ...IMAGES];

  return (
    <section className={cn("w-full overflow-hidden bg-background", className)}>
      <style>{`
        @keyframes gallery-03-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground sm:text-2xl">
            In motion
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            A slow horizontal strip of frames — pause by hovering the track.
          </p>
        </div>
      </div>
      <div
        className="w-full overflow-hidden pb-10 sm:pb-14"
        aria-hidden="true"
      >
        <div
          className="flex w-max gap-3 pr-3 hover:[animation-play-state:paused]"
          style={{ animation: "gallery-03-scroll 36s linear infinite" }}
        >
          {track.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="aspect-[4/3] w-[16rem] shrink-0 overflow-hidden rounded-xl bg-muted sm:w-[18rem]"
            >
              <img src={src} alt="" className="size-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
