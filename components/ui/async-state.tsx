"use client";

import { CircleAlert, CircleCheck, Inbox, LoaderCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LoadingState({ label = "Loading", rows = 3 }: { label?: string; rows?: number }) {
  return (
    <div className="space-y-3" role="status" aria-live="polite">
      <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        {label}
      </p>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="h-28 animate-pulse rounded-xl border border-stroke bg-surface-soft" aria-hidden="true" />
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry, retrying = false }: { message: string; onRetry: () => void; retrying?: boolean }) {
  return (
    <div className="rounded-xl border border-study/30 bg-study/5 p-4" role="alert">
      <p className="inline-flex items-center gap-2 font-semibold text-ink">
        <CircleAlert className="h-5 w-5 text-study" />
        Something went wrong
      </p>
      <p className="mt-1 text-sm text-ink-soft">{message}</p>
      <Button className="mt-3" size="sm" variant="secondary" disabled={retrying} onClick={onRetry}>
        <RefreshCw className={cn("mr-2 h-4 w-4", retrying && "animate-spin")} />
        {retrying ? "Retrying..." : "Try Again"}
      </Button>
    </div>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="py-8 text-center">
      <Inbox className="mx-auto h-8 w-8 text-ink-soft" />
      <p className="mt-3 font-display text-xl font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink-soft">{message}</p>
    </div>
  );
}

export function FeedbackBanner({ message, tone = "success" }: { message: string; tone?: "success" | "error" }) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold",
        tone === "success" ? "border-success/25 bg-success/10 text-trust" : "border-study/30 bg-study/5 text-study"
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      {tone === "success" ? <CircleCheck className="h-4 w-4" /> : <CircleAlert className="h-4 w-4" />}
      {message}
    </p>
  );
}
