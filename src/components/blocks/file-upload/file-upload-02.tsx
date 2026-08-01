"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress, ProgressValue } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type FileUpload02Props = {
  className?: string;
};

type QueueFile = {
  id: string;
  name: string;
  size: number;
  progress: number;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

export function FileUpload02({ className }: FileUpload02Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<QueueFile[]>([]);

  function addFiles(list: FileList | File[]) {
    const next = Array.from(list).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      name: file.name,
      size: file.size,
      progress: 8 + Math.round(Math.random() * 12),
    }));
    setFiles((current) => [...current, ...next]);
  }

  const hasPending = files.some((file) => file.progress < 100);

  useEffect(() => {
    if (!hasPending) return;

    const timer = window.setInterval(() => {
      setFiles((current) =>
        current.map((file) => {
          if (file.progress >= 100) return file;
          const step = 4 + Math.round(Math.random() * 10);
          return {
            ...file,
            progress: Math.min(100, file.progress + step),
          };
        }),
      );
    }, 280);

    return () => window.clearInterval(timer);
  }, [hasPending]);

  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-xl px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
              Attachments
            </h2>
            <p className="mt-2 text-sm tracking-wide text-muted-foreground">
              Upload docs and media. Progress updates as files process.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            Add files
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
            "mt-6 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border px-4 py-4 transition-colors",
            dragging && "border-foreground bg-muted",
          )}
        >
          <span className="flex size-9 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4">
            <UploadIcon />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium tracking-wide text-foreground">
              Drop files to upload
            </p>
            <p className="text-sm tracking-wide text-muted-foreground">
              Or click Add files — max 25MB each
            </p>
          </div>
        </label>

        {files.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-3">
            {files.map((file) => (
              <li key={file.id} className="rounded-xl bg-muted px-4 py-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4">
                    <FileIcon />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="truncate text-sm font-medium tracking-wide text-foreground">
                        {file.name}
                      </p>
                      <div className="flex shrink-0 items-center gap-2">
                        <p className="text-xs tracking-wide text-muted-foreground tabular-nums">
                          {formatSize(file.size)}
                        </p>
                        <button
                          type="button"
                          className="text-xs tracking-wide text-muted-foreground"
                          onClick={() =>
                            setFiles((current) =>
                              current.filter((item) => item.id !== file.id),
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    {file.progress >= 100 ? (
                      <p className="mt-2 text-xs tracking-wide text-muted-foreground">
                        Uploaded
                      </p>
                    ) : (
                      <Progress value={file.progress} className="mt-2">
                        <ProgressValue className="text-xs" />
                      </Progress>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
