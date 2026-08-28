import { Home, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";

/** Grid Atlas: 404 page consistent with the dark operational theme. */
export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="mx-4 w-full max-w-lg">
        <div className="operational-panel p-8 text-center">
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--danger)]/10 rounded-full animate-pulse" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-[var(--danger-ring)]/30 bg-[var(--danger-bg)]">
                <AlertTriangle size={28} className="text-[var(--danger)]" />
              </div>
            </div>
          </div>

          <p className="instrument-label text-[var(--danger)]">Route not found</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tighter text-foreground">404</h1>
          <h2 className="mt-1.5 text-lg font-semibold text-text-secondary">
            Page Not Found
          </h2>
          <p className="mt-3 text-[0.84rem] leading-relaxed text-text-secondary">
            The requested route does not exist in the SolarGrid operating layer.
            <br />
            It may have been moved or is not yet deployed.
          </p>

          <button
            type="button"
            onClick={() => setLocation("/overview")}
            className="action-button mt-6"
          >
            <Home size={15} />
            Return to Overview
          </button>
        </div>
      </div>
    </div>
  );
}
