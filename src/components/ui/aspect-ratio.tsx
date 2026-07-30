import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type AspectRatioProps = HTMLAttributes<HTMLDivElement> & {
  ratio?: number;
  children?: ReactNode;
};

export function AspectRatio({
  ratio = 1,
  className,
  children,
  style,
  ...props
}: AspectRatioProps) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio: ratio, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
