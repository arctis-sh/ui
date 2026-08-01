"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FileUpload01Props = {
  className?: string;
};

type SelectedFile = {
  id: string;
  file: File;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadIcon({ className }: { className?: string }) {
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
      <path d="M12 16V6" />
      <path d="m8 10 4-4 4 4" />
      <path d="M20 16.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.5" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
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
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
    </svg>
  );
}

export function FileUpload01({ className }: FileUpload01Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<SelectedFile[]>([]);

  function addFiles(list: FileList | File[]) {
    const next = Array.from(list).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      file,
    }));
    setFiles((current) => [...current, ...next]);
  }

  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="text-center">
          <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
            Upload files
          </h2>
          <p className="mt-2 text-sm tracking-wide text-muted-foreground">
            Drop files here or browse from your device.
          </p>
        </div>

        <label
          htmlFor={inputId}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            if (event.dataTransfer.files.length) {
              addFiles(event.dataTransfer.files);
            }
          }}
          className={cn(
            "mt-8 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border px-6 py-12 transition-colors",
            dragging && "border-foreground bg-muted",
          )}
        >
          <span className="flex size-10 items-center justify-center text-muted-foreground [&_svg]:size-5">
            <UploadIcon />
          </span>
          <div className="text-center">
            <p className="text-sm font-medium tracking-wide text-foreground">
              Drag and drop files
            </p>
            <p className="mt-1 text-sm tracking-wide text-muted-foreground">
              PNG, JPG, PDF up to 10MB
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={(event) => {
              event.preventDefault();
              inputRef.current?.click();
            }}
          >
            Browse files
          </Button>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            multiple
            className="sr-only"
            onChange={(event) => {
              if (event.target.files?.length) {
                addFiles(event.target.files);
                event.target.value = "";
              }
            }}
          />
        </label>

        {files.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-2">
            {files.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-xl bg-muted px-3 py-2.5"
              >
                <span className="flex size-8 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4">
                  <FileIcon />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium tracking-wide text-foreground">
                    {item.file.name}
                  </p>
                  <p className="text-xs tracking-wide text-muted-foreground tabular-nums">
                    {formatSize(item.file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  className="shrink-0 text-xs tracking-wide text-muted-foreground"
                  onClick={() =>
                    setFiles((current) =>
                      current.filter((file) => file.id !== item.id),
                    )
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
