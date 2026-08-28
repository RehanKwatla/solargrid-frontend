import { useEffect, useState } from "react";
import { Strands } from "@/components/common/Strands";
import { useTheme } from "@/contexts/ThemeContext";

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reducedMotion;
}

export function DashboardEnergyField() {
  const { theme } = useTheme();
  const reducedMotion = useReducedMotion();
  const lightTheme = theme === "light";

  return (
    <div className="dashboard-energy-field" aria-hidden="true">
      <Strands
        className="dashboard-energy-field__strands"
        colors={lightTheme ? ["#6F7F5F", "#55634A", "#7A8B65"] : ["#6F7F5F", "#8FA36B", "#A8C96A"]}
        count={3}
        speed={reducedMotion ? 0 : 0.045}
        amplitude={0.65}
        waviness={0.8}
        thickness={0.18}
        glow={lightTheme ? 0.35 : 0.5}
        taper={2.8}
        spread={1.2}
        intensity={lightTheme ? 0.22 : 0.28}
        saturation={lightTheme ? 0.55 : 0.65}
        opacity={lightTheme ? 0.22 : 0.22}
        scale={1.7}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}
