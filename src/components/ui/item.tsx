import {
  cloneElement,
  isValidElement,
  type ComponentProps,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type ItemVariant = "default" | "outline" | "muted";
type ItemSize = "default" | "sm" | "xs";
type ItemMediaVariant = "default" | "icon" | "image";

const itemVariantClass: Record<ItemVariant, string> = {
  default: "border-transparent bg-transparent",
  outline: "border-border bg-transparent",
  muted: "border-transparent bg-muted/50",
};

const itemSizeClass: Record<ItemSize, string> = {
  default: "gap-4 p-4",
  sm: "gap-2.5 px-4 py-3",
  xs: "gap-2 px-2.5 py-2",
};

function itemVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: ItemVariant;
  size?: ItemSize;
  className?: string;
} = {}) {
  return cn(
    "group/item flex w-full flex-wrap items-center rounded-md border text-sm tracking-wide transition-colors duration-100 [&:is(a)]:transition-colors [&:is(a)]:hover:bg-muted",
    itemVariantClass[variant],
    itemSizeClass[size],
    className,
  );
}

const itemMediaVariantClass: Record<ItemMediaVariant, string> = {
  default: "bg-transparent",
  icon: "size-8 rounded-sm border border-border bg-muted [&_svg:not([class*='size-'])]:size-4",
  image:
    "size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover",
};

type ItemProps = HTMLAttributes<HTMLElement> & {
  variant?: ItemVariant;
  size?: ItemSize;
  render?: ReactElement;
  children?: ReactNode;
};

function Item({
  className,
  variant = "default",
  size = "default",
  render,
  children,
  ...props
}: ItemProps) {
  const classes = itemVariants({ variant, size, className });

  if (isValidElement(render)) {
    const element = render as ReactElement<{
      className?: string;
      children?: ReactNode;
    }>;

    return cloneElement(element, {
      ...element.props,
      ...props,
      "data-slot": "item",
      "data-variant": variant,
      "data-size": size,
      className: cn(classes, element.props.className),
      children: children ?? element.props.children,
    } as never);
  }

  return (
    <div
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={classes}
      {...props}
    >
      {children}
    </div>
  );
}

function ItemGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn(
        "group/item-group flex w-full flex-col",
        className,
      )}
      {...props}
    />
  );
}

function ItemSeparator({
  className,
  ...props
}: ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("my-0", className)}
      {...props}
    />
  );
}

function ItemMedia({
  className,
  variant = "default",
  ...props
}: ComponentProps<"div"> & { variant?: ItemMediaVariant }) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(
        "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
        itemMediaVariantClass[variant],
        className,
      )}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none",
        className,
      )}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "line-clamp-1 flex w-fit items-center gap-2 text-sm leading-snug font-medium",
        className,
      )}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "line-clamp-2 text-left text-sm leading-normal font-normal tracking-wide text-muted-foreground group-data-[size=xs]/item:text-xs [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

function ItemHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex w-full items-center justify-between gap-2",
        className,
      )}
      {...props}
    />
  );
}

function ItemFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex w-full items-center justify-between gap-2",
        className,
      )}
      {...props}
    />
  );
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
  itemVariants,
};
export type { ItemVariant, ItemSize, ItemMediaVariant };
