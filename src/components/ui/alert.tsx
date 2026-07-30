import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type AlertVariant = "default" | "success" | "warning" | "destructive";

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
  children: ReactNode;
};

const variantClass: Record<AlertVariant, string> = {
  default: "border-border bg-card text-card-foreground",
  success:
    "border-success/25 bg-success/5 text-success",
  warning:
    "border-warning/25 bg-warning/5 text-warning",
  destructive:
    "border-destructive/25 bg-destructive/5 text-destructive",
};

export function Alert({
  variant = "default",
  className,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      data-variant={variant}
      className={cn(
        "relative grid w-full grid-cols-[0_1fr] items-start gap-y-1 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-3 [&>svg]:col-start-1 [&>svg]:row-span-2 [&>svg]:row-start-1 [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:translate-y-px [&>svg]:text-current",
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type AlertTitleProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function AlertTitle({ className, children, ...props }: AlertTitleProps) {
  return (
    <div
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type AlertDescriptionProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function AlertDescription({
  className,
  children,
  ...props
}: AlertDescriptionProps) {
  return (
    <div
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm text-current/70 [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type AlertActionProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function AlertAction({ className, children, ...props }: AlertActionProps) {
  return (
    <div
      className={cn(
        "absolute top-2.5 right-3 flex items-center gap-1",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
