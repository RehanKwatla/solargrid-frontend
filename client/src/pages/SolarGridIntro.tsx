import { useCallback, useRef } from "react";
import { useLocation } from "wouter";

export default function SolarGridIntro() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [, navigate] = useLocation();
  const connectDashboardEntry = useCallback(() => {
    const enterButton = iframeRef.current?.contentDocument?.getElementById("ctaBtn");
    if (!enterButton) return;

    // Keep Version 4 byte-for-byte intact; application routing is attached externally.
    enterButton.addEventListener("click", () => navigate("/overview"), { once: true });
  }, [navigate]);

  return (
    <iframe
      ref={iframeRef}
      src="/solargrid-intro.html"
      title="SolarGrid 3D Experience"
      onLoad={connectDashboardEntry}
      className="fixed inset-0 w-screen h-screen border-0 m-0 p-0 overflow-hidden z-50 bg-[#5A2E25]"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
        margin: 0,
        padding: 0,
        zIndex: 9999,
        display: "block"
      }}
    />
  );
}
