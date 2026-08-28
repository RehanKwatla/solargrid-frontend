import { energyHistory } from "@/data/mockData";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "@/contexts/ThemeContext";

const getConfiguration = (isDark: boolean) => ({
  solar: { 
    label: "Solar generation", 
    key: "solar", 
    color: isDark ? "#B7E64A" : "#4d7a1e", 
    companion: "forecast", 
    companionLabel: "Solar forecast", 
    companionColor: isDark ? "#95a38c" : "#88917f" 
  },
  demand: { 
    label: "Facility demand", 
    key: "demand", 
    color: isDark ? "#e4b259" : "#8a5a0e", 
    companion: "solar", 
    companionLabel: "Solar supply", 
    companionColor: isDark ? "#B7E64A" : "#4d7a1e" 
  },
  battery: { 
    label: "Battery power", 
    key: "battery", 
    color: isDark ? "#B7E64A" : "#4d7a1e", 
    companion: undefined, 
    companionLabel: "", 
    companionColor: "" 
  },
  grid: { 
    label: "Grid consumption", 
    key: "grid", 
    color: isDark ? "#3a4534" : "#aab3a2", 
    companion: undefined, 
    companionLabel: "", 
    companionColor: "" 
  },
});

export function EnergyChart({ type, height = 220 }: { type: "solar" | "demand" | "battery" | "grid"; height?: number }) { 
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const configuration = getConfiguration(isDark);
  const chart = configuration[type]; 
  const gridColor = isDark ? "#2a3226" : "#d4d9ca";
  const textColor = isDark ? "#95a38c" : "#5a6554";

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={energyHistory} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`${type}Fill`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={chart.color} stopOpacity={isDark ? 0.18 : 0.12} />
              <stop offset="100%" stopColor={chart.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={gridColor} strokeOpacity={0.5} strokeDasharray="4 4" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: textColor, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }} 
            tickMargin={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: textColor, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }} 
          />
          <Tooltip 
            cursor={{ stroke: chart.color, strokeWidth: 1, strokeDasharray: "4 4" }} 
            contentStyle={{ 
              background: isDark ? "#191e16" : "#ffffff", 
              border: `1px solid ${gridColor}`, 
              borderRadius: "8px", 
              boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.5)" : "0 4px 16px rgba(0,0,0,0.06)", 
              fontFamily: "'Space Grotesk', sans-serif", 
              fontSize: "12px",
              fontWeight: 500,
              padding: "8px 12px",
            }} 
            labelStyle={{ color: textColor, marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "0.04em", textTransform: "uppercase" }} 
            itemStyle={{ color: isDark ? "#e8eddf" : "#191e17", padding: "2px 0" }} 
          />
          <Legend 
            iconType="circle" 
            iconSize={8}
            wrapperStyle={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 500, color: textColor, paddingTop: 14 }} 
          />
          <Area 
            type="monotone" 
            dataKey={chart.key} 
            name={chart.label} 
            stroke={chart.color} 
            strokeWidth={2} 
            fill={`url(#${type}Fill)`} 
            activeDot={{ r: 4, fill: chart.color, stroke: isDark ? "#191e16" : "#ffffff", strokeWidth: 2 }} 
          />
          {chart.companion && (
            <Area 
              type="monotone" 
              dataKey={chart.companion} 
              name={chart.companionLabel} 
              stroke={chart.companionColor} 
              strokeDasharray="4 4" 
              strokeWidth={1.5} 
              fill="transparent" 
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  ); 
}
