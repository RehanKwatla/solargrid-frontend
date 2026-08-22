import { useState } from "react";
/** Grid Atlas: keeps a date range selection stable across dashboard modules. */
export function useEnergyRange() { const [range, setRange] = useState<"Today" | "7 days" | "30 days">("Today"); return { range, setRange }; }
