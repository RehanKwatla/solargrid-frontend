import { Home, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";

/** Grid Atlas: 404 page consistent with the dark operational theme. */
export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0b1011]">
      <div className="mx-4 w-full max-w-lg">
        <div className="operational-panel p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[#fa856e]/10 rounded-full animate-pulse" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#fa856e]/25 bg-[#fa856e]/[.08]">
                <AlertTriangle size={32} className="text-[#fa856e]" />
              </div>
            </div>
          </div>

          <p className="section-label text-[#fa856e]">Route not found</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.07em] text-white">404</h1>
          <h2 className="mt-2 text-lg font-medium text-[#b8c4bf]">
            Page Not Found
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#7d8784]">
            The requested route does not exist in the SolarGrid operating layer.
            <br />
            It may have been moved or is not yet deployed.
          </p>

          <button
            type="button"
            onClick={() => setLocation("/overview")}
            className="action-button mt-8"
          >
            <Home size={15} />
            Return to Overview
          </button>
        </div>
      </div>
    </div>
  );
}
