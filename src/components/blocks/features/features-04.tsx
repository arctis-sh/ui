"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type Features04Props = {
  className?: string;
};

const ROWS = [
  { feature: "Realtime sync", ours: true, others: false },
  { feature: "Shared workspaces", ours: true, others: true },
  { feature: "Keyboard-first UI", ours: true, others: false },
  { feature: "Guest access", ours: true, others: false },
  { feature: "Audit history", ours: true, others: false },
] as const;

const OTHER_LOGOS = [
  "/assets/icons/logos/slack.svg",
  "/assets/icons/logos/notion.svg",
  "/assets/icons/logos/figma.svg",
] as const;

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M5 12.5 10 17.5 19 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M6 12h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CellMark({ on }: { on: boolean }) {
  return on ? (
    <CheckIcon className="size-4 text-foreground" />
  ) : (
    <DashIcon className="size-4 text-muted-foreground" />
  );
}

function LogoAvatar({ src }: { src: string }) {
  return (
    <Avatar size="xs">
      <AvatarImage
        src={src}
        alt=""
        className="object-contain p-1 brightness-0 dark:invert"
      />
      <AvatarFallback> </AvatarFallback>
    </Avatar>
  );
}

export function Features04({ className }: Features04Props) {
  return (
    <section className={cn("w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-3xl px-6 py-14">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[46%]">Feature</TableHead>
              <TableHead className="w-[27%]">
                <span className="inline-flex items-center gap-2 text-foreground">
                  <LogoAvatar src="/assets/icons/logos/linear.svg" />
                  Linear
                </span>
              </TableHead>
              <TableHead className="w-[27%]">
                <AvatarGroup overlap="sm">
                  {OTHER_LOGOS.map((src) => (
                    <LogoAvatar key={src} src={src} />
                  ))}
                  <AvatarGroupCount className="size-6 text-[10px]">
                    +4
                  </AvatarGroupCount>
                </AvatarGroup>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROWS.map((row) => (
              <TableRow key={row.feature}>
                <TableCell className="text-foreground">{row.feature}</TableCell>
                <TableCell>
                  <CellMark on={row.ours} />
                </TableCell>
                <TableCell>
                  <CellMark on={row.others} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
