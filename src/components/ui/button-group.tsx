"use client";

import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type ButtonGroupOrientation = "horizontal" | "vertical";
type ButtonGroupSlot = "single" | "first" | "middle" | "last";
type SeparatorOrientation = "horizontal" | "vertical";

type ButtonGroupContextValue = {
  orientation: ButtonGroupOrientation;
  slot: ButtonGroupSlot;
  overlap: boolean;
};

const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

export function useButtonGroup() {
  return useContext(ButtonGroupContext);
}

function slotFor(index: number, total: number): ButtonGroupSlot {
  if (total <= 1) return "single";
  if (index === 0) return "first";
  if (index === total - 1) return "last";
  return "middle";
}

function isSeparatorElement(child: ReactNode) {
  return isValidElement(child) && child.type === ButtonGroupSeparator;
}

type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: ButtonGroupOrientation;
  children: ReactNode;
};

export function ButtonGroup({
  orientation = "horizontal",
  className,
  children,
  ...props
}: ButtonGroupProps) {
  const items = Children.toArray(children).filter(Boolean);
  const slottedCount = items.filter((child) => !isSeparatorElement(child))
    .length;
  let slottedIndex = 0;

  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        "inline-flex w-fit items-stretch",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        "has-[>[data-slot=button-group]]:gap-2",
        "[&_[data-slot=dropdown-menu]]:inline-flex [&_[data-slot=dropdown-menu]]:self-stretch",
        "[&>input]:min-w-0 [&>input]:flex-1",
        className,
      )}
      {...props}
    >
      {items.map((child, index) => {
        const isSeparator = isSeparatorElement(child);
        const overlap =
          !isSeparator && index > 0 && !isSeparatorElement(items[index - 1]);
        const slot = isSeparator
          ? "middle"
          : slotFor(slottedIndex++, slottedCount);

        return (
          <ButtonGroupContext.Provider
            key={index}
            value={{ orientation, slot, overlap }}
          >
            {child}
          </ButtonGroupContext.Provider>
        );
      })}
    </div>
  );
}

type ButtonGroupSeparatorProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: SeparatorOrientation;
};

export function ButtonGroupSeparator({
  orientation,
  className,
  ...props
}: ButtonGroupSeparatorProps) {
  const group = useButtonGroup();
  const resolved =
    orientation ??
    (group?.orientation === "vertical" ? "horizontal" : "vertical");

  return (
    <div
      role="separator"
      data-slot="button-group-separator"
      data-orientation={resolved}
      className={cn(
        "relative z-20 shrink-0 bg-background",
        resolved === "vertical" ? "w-px self-stretch" : "h-px w-full",
        className,
      )}
      {...props}
    />
  );
}
ButtonGroupSeparator.displayName = "ButtonGroupSeparator";

type ButtonGroupTextProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};

export function ButtonGroupText({
  asChild = false,
  className,
  children,
  ...props
}: ButtonGroupTextProps) {
  const group = useButtonGroup();
  const classes = cn(
    "inline-flex items-center gap-2 border border-border bg-muted px-3 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
    buttonGroupItemClass(group),
    className,
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      className: cn(classes, child.props.className),
      ...props,
    });
  }

  return (
    <div data-slot="button-group-text" className={classes} {...props}>
      {children}
    </div>
  );
}

/** Rounding for the visible control face. */
export function buttonGroupFaceClass(
  group: ButtonGroupContextValue | null,
) {
  if (!group) return undefined;

  const { orientation, slot } = group;

  if (orientation === "horizontal") {
    return cn(
      slot === "single" && "!rounded-md",
      slot === "first" && "!rounded-l-md !rounded-r-none",
      slot === "middle" && "!rounded-none",
      slot === "last" && "!rounded-r-md !rounded-l-none",
    );
  }

  return cn(
    slot === "single" && "!rounded-md",
    slot === "first" && "!rounded-t-md !rounded-b-none",
    slot === "middle" && "!rounded-none",
    slot === "last" && "!rounded-b-md !rounded-t-none",
  );
}

/** Kill the double line at the join (inputs, outline, etc.). */
export function buttonGroupJoinClass(
  group: ButtonGroupContextValue | null,
) {
  if (!group?.overlap) return undefined;

  return group.orientation === "horizontal"
    ? "!border-l-transparent"
    : "!border-t-transparent";
}

/** Restore the join edge on hover for outlined controls only. */
export function buttonGroupOutlineJoinClass(
  group: ButtonGroupContextValue | null,
) {
  if (!group?.overlap) return undefined;

  return group.orientation === "horizontal"
    ? "hover:!border-l-border"
    : "hover:!border-t-border";
}

/** Overlap + stack for the flex item (button root or dropdown shell). */
export function buttonGroupOverlapClass(
  group: ButtonGroupContextValue | null,
) {
  if (!group || group.slot === "single") return undefined;

  return cn(
    "relative hover:z-10",
    group.overlap &&
      (group.orientation === "horizontal" ? "-ml-px" : "-mt-px"),
  );
}

export function buttonGroupItemClass(
  group: ButtonGroupContextValue | null,
) {
  return cn(
    buttonGroupFaceClass(group),
    buttonGroupOverlapClass(group),
    buttonGroupJoinClass(group),
  );
}
