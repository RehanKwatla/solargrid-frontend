import { cn } from "@/lib/utils";
import { Loader2, AlertTriangle, Inbox, Clock, Wifi, WifiOff } from "lucide-react";

/* ────────────────────────────────────────────
 * Loading State
 * ──────────────────────────────────────────── */

export function DataLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2.5 py-6 px-4">
      <Loader2 size={16} className="animate-spin text-text-tertiary shrink-0" />
      <span className="font-mono text-[0.72rem] font-medium text-text-tertiary tracking-wide uppercase">
        {label}
      </span>
    </div>
  );
}

export function DataLoadingBlock({
  label = "Fetching from backend",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 px-6 rounded-lg border border-border bg-surface-soft/30",
        className
      )}
    >
      <Loader2 size={24} className="animate-spin text-text-tertiary" />
      <p className="font-mono text-[0.72rem] font-medium text-text-tertiary tracking-wide uppercase">
        {label}
      </p>
      <p className="text-[0.78rem] text-text-secondary text-center max-w-xs">
        Waiting for Supabase response
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────
 * Error State
 * ──────────────────────────────────────────── */

export function DataError({
  message = "Unable to load data",
  onRetry,
  className,
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 py-10 px-6 rounded-lg border border-[var(--danger-ring)]/30 bg-[var(--danger-bg)]/30",
        className
      )}
    >
      <AlertTriangle size={20} className="text-[var(--danger)]" />
      <p className="text-[0.84rem] font-semibold text-foreground text-center">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="technical-button !py-1.5 !px-3 text-[0.75rem]"
        >
          Retry
        </button>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
 * Empty State (value does not exist in Supabase)
 * ──────────────────────────────────────────── */

export function DataEmpty({
  label = "Not yet available",
  detail = "This value has not been recorded in the backend.",
  className,
}: {
  label?: string;
  detail?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2.5 py-8 px-6 rounded-lg border border-dashed border-border bg-surface-soft/20",
        className
      )}
    >
      <Inbox size={18} className="text-text-tertiary" />
      <p className="text-[0.81rem] font-medium text-text-secondary text-center">
        {label}
      </p>
      <p className="text-[0.72rem] text-text-tertiary text-center max-w-xs leading-relaxed">
        {detail}
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────
 * Not Available Value (inline)
 * ──────────────────────────────────────────── */

export function ValueNA({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-mono text-[0.78rem] text-text-tertiary italic",
        className
      )}
    >
      —
    </span>
  );
}

/* ────────────────────────────────────────────
 * Stale Data Indicator
 * ──────────────────────────────────────────── */

export function StaleIndicator({
  lastUpdated,
  staleThresholdMs = 120_000, // 2 minutes
  className,
}: {
  lastUpdated: Date | null;
  staleThresholdMs?: number;
  className?: string;
}) {
  if (!lastUpdated) return null;

  const isStale = Date.now() - lastUpdated.getTime() > staleThresholdMs;
  const ago = formatTimeAgo(lastUpdated);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[0.62rem] font-medium tracking-wide uppercase",
        isStale ? "text-[var(--warning)]" : "text-text-tertiary",
        className
      )}
    >
      {isStale ? (
        <WifiOff size={10} className="shrink-0" />
      ) : (
        <Wifi size={10} className="shrink-0" />
      )}
      {isStale ? `Stale · ${ago}` : `Live · ${ago}`}
    </span>
  );
}

/* ────────────────────────────────────────────
 * Last Updated Timestamp
 * ──────────────────────────────────────────── */

export function LastUpdated({
  timestamp,
  source = "live",
  className,
}: {
  timestamp: Date | null;
  source?: "live" | "mock" | "unavailable";
  className?: string;
}) {
  if (!timestamp) return null;

  const timeStr = timestamp.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[0.62rem] tracking-wide text-text-tertiary",
        className
      )}
    >
      <Clock size={10} className="shrink-0" />
      <span className="uppercase">
        {source === "live" ? "Backend" : "Mock"} · {timeStr}
      </span>
    </span>
  );
}

/* ────────────────────────────────────────────
 * Data Source Badge (live vs mock)
 * ──────────────────────────────────────────── */

export function DataSourceBadge({
  source,
  className,
}: {
  source: "live" | "mock" | "unavailable";
  className?: string;
}) {
  const config = {
    live: {
      label: "LIVE BACKEND",
      dotClass: "bg-[var(--healthy)]",
      textClass: "text-[var(--healthy)]",
      bgClass: "bg-[var(--healthy-bg)]",
    },
    mock: {
      label: "MOCK DATA",
      dotClass: "bg-text-tertiary",
      textClass: "text-text-tertiary",
      bgClass: "bg-surface-soft",
    },
    unavailable: {
      label: "OFFLINE",
      dotClass: "bg-[var(--danger)]",
      textClass: "text-[var(--danger)]",
      bgClass: "bg-[var(--danger-bg)]",
    },
  };

  const c = config[source];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[9px] font-medium tracking-[0.08em]",
        c.bgClass,
        c.textClass,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", c.dotClass)} />
      {c.label}
    </span>
  );
}

/* ────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────── */

function formatTimeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  return `${hr}h ago`;
}
