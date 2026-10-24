import { useEffect } from "react";
import { useLocation } from "wouter";

const routeTitles: Record<string, { title: string; description: string }> = {
  "/": {
    title: "SolarGrid — Powering Critical Care. Intelligently.",
    description: "An intelligent energy management platform that helps hospitals coordinate solar generation, battery storage, and grid power for a more resilient energy future.",
  },
  "/intro": {
    title: "SolarGrid — 3D Digital Twin Experience",
    description: "Interactive 3D dual-axis solar tracking simulation with real-time irradiance mechanics.",
  },
  "/overview": {
    title: "Overview | SolarGrid Smart Energy Platform",
    description: "Real-time solar generation, battery SOC, live bus diagram, and daily generation timeline.",
  },
  "/energy": {
    title: "Energy Analytics & Storage | SolarGrid",
    description: "Detailed production, facility demand profiles, battery states, and grid import telemetry.",
  },
  "/critical-loads": {
    title: "Critical Load Management (EMS) | SolarGrid",
    description: "Hospital-grade electrical circuit classification, dynamic EMS prioritization, and automated ICU protection.",
  },
  "/energy-sharing": {
    title: "Energy Sharing & Peer Trading | SolarGrid",
    description: "Peer-to-peer microgrid trading, surplus energy dispatch, and commercial credit settlement.",
  },
  "/intelligence": {
    title: "Decision Board & AI Forecasts | SolarGrid",
    description: "Algorithmic dispatch recommendations, irradiance forecasts, and predictive demand analytics.",
  },
  "/alerts": {
    title: "System Events & Attention Log | SolarGrid",
    description: "Operational event stream, anomaly detection alerts, and acknowledgement workflow.",
  },
  "/metering": {
    title: "Metering & Financial Settlement | SolarGrid",
    description: "Precision energy accounting, commercial microgrid ledger, and statutory tariff compliance.",
  },
  "/feature-1": {
    title: "Metering & Financial Settlement | SolarGrid",
    description: "Precision energy accounting, commercial microgrid ledger, and statutory tariff compliance.",
  },
  "/settings": {
    title: "System Settings & Facility Preferences | SolarGrid",
    description: "Configure EMS thresholds, facility profile, notification preferences, and emergency hotlines.",
  },
};

export function usePageTitle() {
  const [location] = useLocation();

  useEffect(() => {
    const meta = routeTitles[location] ?? {
      title: "SolarGrid — Smart Solar Grid Platform",
      description: "Operating layer for distributed solar performance and critical infrastructure.",
    };

    document.title = meta.title;

    // Update meta description dynamically for single-page navigations
    let descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute("content", meta.description);
    }
  }, [location]);
}
