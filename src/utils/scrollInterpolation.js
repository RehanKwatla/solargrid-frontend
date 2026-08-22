// src/utils/scrollInterpolation.js
/**
 * Map scroll progress (0‑1) to Spline variable values using keyframes.
 * The keyframes are defined based on the implementation plan.
 */

const keyframes = [
  { // 0% Sunrise
    progress: 0,
    sunAzimuth: -90,
    sunAltitude: 5,
    panelAzimuth: -90,
    panelTilt: 15,
    energyGeneration: 0,
    trackingStatus: 0,
  },
  { // 20% Morning
    progress: 0.20,
    sunAzimuth: -30,
    sunAltitude: 25,
    panelAzimuth: -30,
    panelTilt: 30,
    energyGeneration: 0.2,
    trackingStatus: 0.5,
  },
  { // 45% Midday start
    progress: 0.45,
    sunAzimuth: 0,
    sunAltitude: 45,
    panelAzimuth: 0,
    panelTilt: 45,
    energyGeneration: 0.6,
    trackingStatus: 1,
  },
  { // 60% Energy generation peak
    progress: 0.60,
    sunAzimuth: 0,
    sunAltitude: 45,
    panelAzimuth: 0,
    panelTilt: 45,
    energyGeneration: 0.8,
    trackingStatus: 1,
  },
  { // 75% Afternoon
    progress: 0.75,
    sunAzimuth: 30,
    sunAltitude: 35,
    panelAzimuth: 30,
    panelTilt: 40,
    energyGeneration: 0.5,
    trackingStatus: 0.8,
  },
  { // 90% Sunset
    progress: 0.90,
    sunAzimuth: 70,
    sunAltitude: 15,
    panelAzimuth: 70,
    panelTilt: 25,
    energyGeneration: 0.2,
    trackingStatus: 0.5,
  },
  { // 100% Transition
    progress: 1,
    sunAzimuth: 90,
    sunAltitude: 5,
    panelAzimuth: 90,
    panelTilt: 15,
    energyGeneration: 0,
    trackingStatus: 0,
  },
];

/** Linear interpolation helper */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Interpolate between two surrounding keyframes.
 * @param {number} progress - value between 0 and 1
 * @returns {object} variable map
 */
export function mapScrollToVariables(progress) {
  // Clamp progress
  const p = Math.min(Math.max(progress, 0), 1);

  // Find surrounding keyframes
  let start = keyframes[0];
  let end = keyframes[keyframes.length - 1];
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (p >= keyframes[i].progress && p <= keyframes[i + 1].progress) {
      start = keyframes[i];
      end = keyframes[i + 1];
      break;
    }
  }

  const localT = (p - start.progress) / (end.progress - start.progress || 1);
  return {
    sunAzimuth: lerp(start.sunAzimuth, end.sunAzimuth, localT),
    sunAltitude: lerp(start.sunAltitude, end.sunAltitude, localT),
    panelAzimuth: lerp(start.panelAzimuth, end.panelAzimuth, localT),
    panelTilt: lerp(start.panelTilt, end.panelTilt, localT),
    energyGeneration: lerp(start.energyGeneration, end.energyGeneration, localT),
    trackingStatus: lerp(start.trackingStatus, end.trackingStatus, localT),
  };
}
