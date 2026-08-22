import { energyHistory } from "@/data/mockData";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "@/contexts/ThemeContext";

const getConfiguration = (isDark: boolean) => ({
  solar: { 
    label: "Solar generation", 
    key: "solar", 
    color: isDark ? "#B7E64A" : "#8CC63F", 
    companion: "forecast", 
    companionLabel: "Solar forecast", 
    companionColor: isDark ? "#A5ADA0" : "#6F756B" 
  },
  demand: { 
    label: "Facility demand", 
    key: "demand", 
    color: isDark ? "#F5A623" : "#F5A623", 
    companion: "solar", 
    companionLabel: "Solar supply", 
    companionColor: isDark ? "#B7E64A" : "#8CC63F" 
  },
  battery: { 
    label: "Battery power", 
    key: "battery", 
    color: isDark ? "#B7E64A" : "#8CC63F", 
    companion: undefined, 
    companionLabel: "", 
    companionColor: "" 
  },
  grid: { 
    label: "Grid consumption", 
    key: "grid", 
    color: isDark ? "#30372E" : "#E3E7DE", 
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
  const gridColor = isDark ? "#30372E" : "#E3E7DE";
  const textColor = isDark ? "#A5ADA0" : "#6F756B";

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={energyHistory} margin={{ top: 12, right: 0, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id={`${type}Fill`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={chart.color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={chart.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={gridColor} strokeOpacity={0.5} strokeDasharray="4 4" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: textColor, fontSize: 12, fontFamily: "Inter, sans-serif" }} 
            tickMargin={12} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: textColor, fontSize: 12, fontFamily: "Inter, sans-serif" }} 
          />
          <Tooltip 
            cursor={{ stroke: chart.color, strokeWidth: 1, strokeDasharray: "4 4" }} 
            contentStyle={{ 
              background: isDark ? "#181C18" : "#FFFFFF", 
              border: `1px solid ${gridColor}`, 
              borderRadius: "12px", 
              boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.5)" : "0 4px 16px rgba(0,0,0,0.06)",
              fontFamily: "Inter, sans-serif", 
              fontSize: "13px",
              fontWeight: 500,
            }} 
            labelStyle={{ color: textColor, marginBottom: 8 }} 
            itemStyle={{ color: isDark ? "#F1F3EC" : "#1D241B" }} 
          />
          <Legend 
            iconType="circle" 
            wrapperStyle={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 500, color: textColor, paddingTop: 16 }} 
          />
          <Area 
            type="monotone" 
            dataKey={chart.key} 
            name={chart.label} 
            stroke={chart.color} 
            strokeWidth={2} 
            fill={`url(#${type}Fill)`} 
            activeDot={{ r: 5, fill: chart.color, stroke: isDark ? "#181C18" : "#FFFFFF", strokeWidth: 2 }} 
          />
          {chart.companion && (
            <Area 
              type="monotone" 
              dataKey={chart.companion} 
              name={chart.companionLabel} 
              stroke={chart.companionColor} 
              strokeDasharray="4 4" 
              strokeWidth={2} 
              fill="transparent" 
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  ); 
}
