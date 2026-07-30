"use client";

import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "default" | "lg";

type AvatarContextValue = {
  size: AvatarSize;
  imageStatus: "loading" | "loaded" | "error";
  setImageStatus: (status: "loading" | "loaded" | "error") => void;
};

const AvatarContext = createContext<AvatarContextValue | null>(null);

function useAvatar() {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error("Avatar parts must be used within <Avatar>");
  }
  return context;
}

const sizeRoot: Record<AvatarSize, string> = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  default: "size-10 text-sm",
  lg: "size-12 text-sm",
};

const badgeOffset: Record<AvatarSize, string> = {
  xs: "size-1.5 bottom-0 right-0",
  sm: "size-2 bottom-0 right-0",
  default: "size-2.5 bottom-0 right-0",
  lg: "size-3 bottom-0 right-0",
};

type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  size?: AvatarSize;
  children: ReactNode;
};

export function Avatar({
  size = "default",
  className,
  children,
  ...props
}: AvatarProps) {
  const [imageStatus, setImageStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );

  return (
    <AvatarContext.Provider value={{ size, imageStatus, setImageStatus }}>
      <span
        data-slot="avatar"
        data-size={size}
        className={cn(
          "relative inline-flex shrink-0 rounded-full bg-muted text-foreground ring-2 ring-background select-none",
          sizeRoot[size],
          className,
        )}
        {...props}
      >
        {children}
      </span>
    </AvatarContext.Provider>
  );
}

type AvatarImageProps = ImgHTMLAttributes<HTMLImageElement>;

export function AvatarImage({
  className,
  alt = "",
  src,
  onLoad,
  onError,
  ...props
}: AvatarImageProps) {
  const { imageStatus, setImageStatus } = useAvatar();
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImageStatus("loading");
    const img = imgRef.current;
    if (img?.complete) {
      if (img.naturalWidth > 0) setImageStatus("loaded");
      else setImageStatus("error");
    }
  }, [src, setImageStatus]);

  return (
    <img
      {...props}
      ref={imgRef}
      alt={alt}
      src={src}
      data-state={imageStatus}
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        imageStatus === "loaded" ? "opacity-100" : "absolute opacity-0",
        className,
      )}
      onLoad={(event) => {
        setImageStatus("loaded");
        onLoad?.(event);
      }}
      onError={(event) => {
        setImageStatus("error");
        onError?.(event);
      }}
    />
  );
}

type AvatarFallbackProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

export function AvatarFallback({
  className,
  children,
  ...props
}: AvatarFallbackProps) {
  const { imageStatus } = useAvatar();

  if (imageStatus === "loaded") return null;

  return (
    <span
      className={cn(
        "flex size-full items-center justify-center overflow-hidden rounded-full bg-muted font-medium tracking-wide text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

type AvatarBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export function AvatarBadge({
  className,
  children,
  ...props
}: AvatarBadgeProps) {
  const { size } = useAvatar();

  return (
    <span
      className={cn(
        "absolute z-[1] flex items-center justify-center rounded-full bg-success text-success-foreground ring-2 ring-background [&>svg]:size-2.5",
        badgeOffset[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

type AvatarOverlap = "sm" | "default" | "lg";

const overlapClass: Record<AvatarOverlap, string> = {
  sm: "-space-x-1",
  default: "-space-x-2",
  lg: "-space-x-3",
};

type AvatarGroupProps = HTMLAttributes<HTMLDivElement> & {
  overlap?: AvatarOverlap;
  children: ReactNode;
};

export function AvatarGroup({
  overlap = "default",
  className,
  children,
  ...props
}: AvatarGroupProps) {
  const items = Children.toArray(children);

  return (
    <div
      className={cn("flex items-center", overlapClass[overlap], className)}
      {...props}
    >
      {items.map((child, index) => {
        if (!isValidElement(child)) return child;

        const element = child as ReactElement<{
          className?: string;
          style?: CSSProperties;
        }>;

        return cloneElement(element, {
          className: cn("relative", element.props.className),
          style: {
            ...element.props.style,
            zIndex: index + 1,
          },
        });
      })}
    </div>
  );
}

type AvatarGroupCountProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

export function AvatarGroupCount({
  className,
  children,
  ...props
}: AvatarGroupCountProps) {
  return (
    <span
      className={cn(
        "relative inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium tracking-wide text-foreground ring-2 ring-background",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
