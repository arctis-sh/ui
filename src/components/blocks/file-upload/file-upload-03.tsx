"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FileUpload03Props = {
  className?: string;
};

type Slot = {
  id: string;
  label: string;
  src: string | null;
};

const initialSlots: Slot[] = [
  { id: "cover", label: "Cover", src: null },
  { id: "shot-1", label: "Shot 1", src: null },
  { id: "shot-2", label: "Shot 2", src: null },
  { id: "shot-3", label: "Shot 3", src: null },
];

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="m21 15-3.5-3.5a2 2 0 0 0-2.8 0L6 20" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function FileUpload03({ className }: FileUpload03Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const activeSlotRef = useRef<string | null>(null);
  const slotsRef = useRef<Slot[]>(initialSlots);
  const [slots, setSlots] = useState<Slot[]>(initialSlots);
  slotsRef.current = slots;

  useEffect(() => {
    return () => {
      for (const slot of slotsRef.current) {
        if (slot.src) URL.revokeObjectURL(slot.src);
      }
    };
  }, []);

  function openPicker(slotId?: string) {
    activeSlotRef.current = slotId ?? null;
    inputRef.current?.click();
  }

  function assignImages(list: FileList) {
    const images = Array.from(list).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (!images.length) return;

    setSlots((current) => {
      const next = current.map((slot) => ({ ...slot }));
      const urls = images.map((file) => URL.createObjectURL(file));

      if (activeSlotRef.current) {
        const index = next.findIndex(
          (slot) => slot.id === activeSlotRef.current,
        );
        if (index >= 0) {
          if (next[index].src) URL.revokeObjectURL(next[index].src);
          next[index] = { ...next[index], src: urls[0] };
          for (const url of urls.slice(1)) URL.revokeObjectURL(url);
          return next;
        }
      }

      let urlIndex = 0;
      for (let i = 0; i < next.length && urlIndex < urls.length; i += 1) {
        if (!next[i].src) {
          next[i] = { ...next[i], src: urls[urlIndex] };
          urlIndex += 1;
        }
      }
      for (const url of urls.slice(urlIndex)) URL.revokeObjectURL(url);
      return next;
    });

    activeSlotRef.current = null;
  }

  function clearSlot(slotId: string) {
    setSlots((current) =>
      current.map((slot) => {
        if (slot.id !== slotId) return slot;
        if (slot.src) URL.revokeObjectURL(slot.src);
        return { ...slot, src: null };
      }),
    );
  }

  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-2xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
              Project gallery
            </h2>
            <p className="mt-2 text-sm tracking-wide text-muted-foreground">
              Add a cover and supporting shots. JPG or PNG, up to 5MB.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => openPicker()}
          >
            Upload images
          </Button>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => {
              if (event.target.files?.length) {
                assignImages(event.target.files);
                event.target.value = "";
              }
            }}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 @[40rem]:grid-cols-4">
          {slots.map((slot) =>
            slot.src ? (
              <div
                key={slot.id}
                className="relative aspect-square overflow-hidden rounded-xl bg-muted"
              >
                <img
                  src={slot.src}
                  alt={slot.label}
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  aria-label={`Remove ${slot.label}`}
                  onClick={() => clearSlot(slot.id)}
                  className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-background text-foreground [&_svg]:size-3.5"
                >
                  <CloseIcon />
                </button>
              </div>
            ) : (
              <button
                key={slot.id}
                type="button"
                onClick={() => openPicker(slot.id)}
                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground"
              >
                <span className="[&_svg]:size-5">
                  <PlusIcon />
                </span>
                <span className="text-xs tracking-wide">{slot.label}</span>
              </button>
            ),
          )}
        </div>

        <p className="mt-4 flex items-center gap-2 text-xs tracking-wide text-muted-foreground">
          <span className="[&_svg]:size-3.5">
            <ImageIcon />
          </span>
          Cover is shown first in the public gallery.
        </p>
      </div>
    </section>
  );
}
