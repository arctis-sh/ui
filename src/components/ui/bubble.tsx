import {
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type BubbleVariant =
  | "default"
  | "secondary"
  | "muted"
  | "tinted"
  | "outline"
  | "ghost"
  | "destructive";

type BubbleAlign = "start" | "end";

const bubbleVariantClass: Record<BubbleVariant, string> = {
  default:
    "*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-primary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:opacity-85",
  secondary:
    "*:data-[slot=bubble-content]:bg-secondary *:data-[slot=bubble-content]:text-secondary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:opacity-85",
  muted:
    "*:data-[slot=bubble-content]:bg-muted *:data-[slot=bubble-content]:text-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-accent",
  tinted:
    "*:data-[slot=bubble-content]:bg-primary/10 *:data-[slot=bubble-content]:text-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/15",
  outline:
    "*:data-[slot=bubble-content]:border-border *:data-[slot=bubble-content]:bg-background *:data-[slot=bubble-content]:text-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted",
  ghost:
    "*:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 *:data-[slot=bubble-content]:text-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted",
  destructive:
    "*:data-[slot=bubble-content]:bg-destructive/10 *:data-[slot=bubble-content]:text-destructive [&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/15",
};

type BubbleGroupProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function BubbleGroup({ className, ...props }: BubbleGroupProps) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  );
}

type BubbleProps = HTMLAttributes<HTMLDivElement> & {
  variant?: BubbleVariant;
  align?: BubbleAlign;
  children?: ReactNode;
};

export function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: BubbleProps) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(
        "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full has-[[data-slot=bubble-reactions]]:mb-4 has-[[data-slot=bubble-reactions][data-side=top]]:mt-4 has-[[data-slot=bubble-reactions][data-side=top]]:mb-0",
        bubbleVariantClass[variant],
        className,
      )}
      {...props}
    />
  );
}

type BubbleContentProps = HTMLAttributes<HTMLDivElement> & {
  render?: ReactElement;
  children?: ReactNode;
};

export function BubbleContent({
  className,
  render,
  children,
  ...props
}: BubbleContentProps) {
  const classes = cn(
    "w-fit max-w-full min-w-0 overflow-hidden rounded-md border border-transparent px-3 py-2 text-sm leading-relaxed tracking-wide break-words transition-colors duration-200 ease-out group-data-[align=end]/bubble:self-end [button]:text-left",
    className,
  );

  if (isValidElement(render)) {
    const element = render as ReactElement<{
      className?: string;
      children?: ReactNode;
    }>;

    return cloneElement(element, {
      ...element.props,
      ...props,
      "data-slot": "bubble-content",
      className: cn(classes, element.props.className),
      children: children ?? element.props.children,
    } as never);
  }

  return (
    <div data-slot="bubble-content" className={classes} {...props}>
      {children}
    </div>
  );
}

type BubbleReactionsProps = HTMLAttributes<HTMLDivElement> & {
  side?: "top" | "bottom";
  align?: BubbleAlign;
  children?: ReactNode;
};

export function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: BubbleReactionsProps) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(
        "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-xs tracking-wide ring-2 ring-background has-[button]:p-0",
        side === "top" && "top-0 -translate-y-3/4",
        side === "bottom" && "bottom-0 translate-y-3/4",
        align === "start" && "left-3",
        align === "end" && "right-3",
        className,
      )}
      {...props}
    />
  );
}

export type { BubbleVariant, BubbleAlign };
