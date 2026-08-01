"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

type Onboarding02Props = {
  className?: string;
};

const STEPS = [
  { id: "profile", title: "Profile", detail: "Who’s setting this up" },
  { id: "workspace", title: "Workspace", detail: "Name your space" },
  { id: "role", title: "Role", detail: "How you’ll use Arctis" },
] as const;

const ROLES = [
  { value: "design", label: "Design", detail: "Marketing pages and kits" },
  { value: "eng", label: "Engineering", detail: "Ship components faster" },
  { value: "founder", label: "Founder", detail: "Launch and iterate" },
] as const;

function CheckIcon({ className }: { className?: string }) {
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
      <path d="M5 12.5 10 17.5 19 7" />
    </svg>
  );
}

export function Onboarding02({ className }: Onboarding02Props) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [role, setRole] = useState("design");

  const progress = ((step + 1) / STEPS.length) * 100;
  const current = STEPS[step]!;
  const isLast = step === STEPS.length - 1;
  const roleLabel = ROLES.find((option) => option.value === role)?.label;
  const displayName = name.trim() || "there";
  const displayWorkspace = workspace.trim() || "your workspace";

  return (
    <section className={cn("@container w-full bg-background", className)}>
      <div className="mx-auto w-full max-w-md px-4 py-10 @[32rem]:px-6 @[32rem]:py-14">
        {done ? (
          <div className="flex flex-col items-center text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-foreground [&_svg]:size-5">
              <CheckIcon />
            </span>
            <h2 className="mt-5 text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
              You’re all set, {displayName}
            </h2>
            <p className="mt-2 text-sm tracking-wide text-muted-foreground">
              {displayWorkspace} is ready
              {roleLabel ? ` for ${roleLabel.toLowerCase()}` : ""}. Jump in and
              start building.
            </p>
            <div className="mt-8 flex w-full flex-col gap-2 @[32rem]:flex-row @[32rem]:justify-center">
              <Button type="button" size="sm" className="w-full @[32rem]:w-auto">
                Go to dashboard
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="w-full @[32rem]:w-auto"
                onClick={() => {
                  setDone(false);
                  setStep(0);
                }}
              >
                Start over
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs tracking-wide text-muted-foreground">
                Step {step + 1} of {STEPS.length}
              </p>
              <p className="text-xs tracking-wide text-muted-foreground">
                {current.title}
              </p>
            </div>
            <Progress value={progress} className="mt-3" />

            <div className="mt-8">
              <h2 className="text-xl font-medium tracking-wide text-foreground @[32rem]:text-2xl">
                {current.title}
              </h2>
              <p className="mt-2 text-sm tracking-wide text-muted-foreground">
                {current.detail}
              </p>
            </div>

            <div className="mt-6 min-h-40">
              {step === 0 ? (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="onboarding-02-name">Your name</Label>
                  <Input
                    id="onboarding-02-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Maya Chen"
                    className="border-0 bg-muted"
                  />
                </div>
              ) : null}

              {step === 1 ? (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="onboarding-02-workspace">Workspace name</Label>
                  <Input
                    id="onboarding-02-workspace"
                    value={workspace}
                    onChange={(event) => setWorkspace(event.target.value)}
                    placeholder="Northline"
                    className="border-0 bg-muted"
                  />
                </div>
              ) : null}

              {step === 2 ? (
                <RadioGroup
                  value={role}
                  onValueChange={setRole}
                  className="flex flex-col gap-2"
                >
                  {ROLES.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-3 rounded-xl bg-muted px-3 py-3"
                    >
                      <RadioGroupItem
                        id={`onboarding-02-${option.value}`}
                        value={option.value}
                      />
                      <label
                        htmlFor={`onboarding-02-${option.value}`}
                        className="min-w-0 flex-1 cursor-pointer"
                      >
                        <span className="block text-sm font-medium tracking-wide text-foreground">
                          {option.label}
                        </span>
                        <span className="block text-xs tracking-wide text-muted-foreground">
                          {option.detail}
                        </span>
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              ) : null}
            </div>

            <div className="mt-8 flex items-center justify-between gap-2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={step === 0}
                onClick={() => setStep((value) => Math.max(0, value - 1))}
              >
                Back
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (isLast) {
                    setDone(true);
                    return;
                  }
                  setStep((value) => Math.min(STEPS.length - 1, value + 1));
                }}
              >
                {isLast ? "Finish setup" : "Continue"}
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
