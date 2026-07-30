import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto overflow-y-hidden rounded-md bg-surface"
    >
      <table
        data-slot="table"
        className={cn("w-full text-left text-sm tracking-wide", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b [&_tr]:border-border", className)}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "[&_tr]:transition-colors [&_tr]:duration-200 [&_tr]:ease-out",
        "[&_tr]:hover:bg-surface-hover",
        "[&_tr]:has-[[aria-expanded=true]]:bg-surface-hover",
        "[&_tr]:data-[state=selected]:bg-surface-hover",
        "[&_tr:last-child]:border-0",
        className,
      )}
      {...props}
    />
  );
}

export function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-border [&_td]:font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn("border-b border-border", className)}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "px-3 py-2 text-left align-middle font-normal tracking-wide whitespace-nowrap text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-3 py-2 align-middle tracking-wide whitespace-nowrap",
        className,
      )}
      {...props}
    />
  );
}

export function TableCaption({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="table-caption"
      className={cn("mt-3 text-center text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
