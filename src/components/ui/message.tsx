import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type MessageAlign = "start" | "end";

type MessageGroupProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function MessageGroup({ className, ...props }: MessageGroupProps) {
  return (
    <div
      data-slot="message-group"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  );
}

type MessageProps = HTMLAttributes<HTMLDivElement> & {
  align?: MessageAlign;
  children?: ReactNode;
};

export function Message({
  className,
  align = "start",
  ...props
}: MessageProps) {
  return (
    <div
      data-slot="message"
      data-align={align}
      className={cn(
        "group/message relative flex w-full min-w-0 items-start gap-2 text-sm leading-relaxed tracking-wide data-[align=end]:flex-row-reverse",
        className,
      )}
      {...props}
    />
  );
}

type MessageAvatarProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function MessageAvatar({
  className,
  children,
  ...props
}: MessageAvatarProps) {
  return (
    <div
      data-slot="message-avatar"
      className={cn(
        // BubbleContent: 1px border + py-2, then center on the first text line.
        "flex w-fit min-w-8 shrink-0 justify-center pt-[calc(1px+0.5rem)] text-sm leading-relaxed group-has-data-[slot=message-header]/message:pt-[calc(1rem+0.625rem+1px+0.5rem)]",
        className,
      )}
      {...props}
    >
      <div className="flex h-[1lh] items-center justify-center">{children}</div>
    </div>
  );
}

type MessageContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function MessageContent({ className, ...props }: MessageContentProps) {
  return (
    <div
      data-slot="message-content"
      className={cn(
        "flex w-full min-w-0 flex-col gap-2.5 break-words group-data-[align=end]/message:*:data-slot:self-end group-data-[align=end]/message:*:data-[slot=message-header]:self-start",
        className,
      )}
      {...props}
    />
  );
}

type MessageHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function MessageHeader({ className, ...props }: MessageHeaderProps) {
  return (
    <div
      data-slot="message-header"
      className={cn(
        "flex max-w-full min-w-0 items-center self-start text-xs font-medium tracking-wide text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

type MessageFooterProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function MessageFooter({ className, ...props }: MessageFooterProps) {
  return (
    <div
      data-slot="message-footer"
      className={cn(
        "flex max-w-full min-w-0 items-center text-xs font-medium tracking-wide text-muted-foreground group-data-[align=end]/message:justify-end",
        className,
      )}
      {...props}
    />
  );
}
