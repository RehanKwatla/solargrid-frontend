/** Deterministic solar tracking simulation — replaceable with real hardware telemetry later. */

export type TrackingStatus = "ACTIVE" | "SAFE" | "IDLE";

export type TimePreset = "morning" | "noon" | "evening" | "night";

export type SolarSimulationState = {
  timeOfDay: number;
  sunAzimuth: number;
  sunAltitude: number;
  panelAzimuth: number;
  panelTilt: number;
  alignment: number;
  solarGenerationKw: number;
  trackingEnabled: boolean;
  trackingStatus: TrackingStatus;
  isPlaying: boolean;
};

export const SIMULATION = {
  sunriseHour: 6,
  sunsetHour: 18,
  maxGenerationKw: 55,
  sunDistance: 14,
  playSpeedHoursPerSecond: 0.5,
} as const;

const PRESET_HOURS: Record<TimePreset, number> = {
  morning: 7,
  noon: 12,
  evening: 17,
  night: 20,
};

const REST_PANEL = { azimuth: 180, tilt: 5 };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** Sun position from hour-of-day (6–18 daylight arc). */
export function computeSunPosition(hour: number) {
  const { sunriseHour, sunsetHour } = SIMULATION;
  const isDaylight = hour >= sunriseHour && hour < sunsetHour;

  if (!isDaylight) {
    const nightProgress =
      hour >= sunsetHour
        ? (hour - sunsetHour) / (24 - sunsetHour + sunriseHour)
        : (hour + (24 - sunsetHour)) / (24 - sunsetHour + sunriseHour);
    const nightAzimuth = 270 + nightProgress * 180;
    return {
      sunAzimuth: nightAzimuth % 360,
      sunAltitude: -12,
      isDaylight: false,
    };
  }

  const progress = (hour - sunriseHour) / (sunsetHour - sunriseHour);
  const sunAzimuth = 90 + progress * 180;
  const sunAltitude = Math.sin(progress * Math.PI) * 72;

  return { sunAzimuth, sunAltitude, isDaylight: true };
}

function sunDirection(azimuth: number, altitude: number) {
  const azRad = degToRad(azimuth);
  const altRad = degToRad(altitude);
  return {
    x: Math.cos(altRad) * Math.sin(azRad),
    y: Math.sin(altRad),
    z: Math.cos(altRad) * Math.cos(azRad),
  };
}

function panelNormal(azimuth: number, tilt: number) {
  const azRad = degToRad(azimuth);
  const tiltRad = degToRad(tilt);
  return {
    x: Math.cos(tiltRad) * Math.sin(azRad),
    y: Math.sin(tiltRad),
    z: Math.cos(tiltRad) * Math.cos(azRad),
  };
}

/** Alignment from sun vs panel normal (0–100%). */
export function computeAlignment(
  sunAzimuth: number,
  sunAltitude: number,
  panelAzimuth: number,
  panelTilt: number
) {
  const sun = sunDirection(sunAzimuth, Math.max(sunAltitude, 0));
  const panel = panelNormal(panelAzimuth, panelTilt);
  const dot = sun.x * panel.x + sun.y * panel.y + sun.z * panel.z;
  return clamp(Math.round(dot * 100), 0, 100);
}

/** Demo generation from altitude + alignment. */
export function computeGeneration(
  sunAltitude: number,
  alignment: number,
  isDaylight: boolean
) {
  if (!isDaylight || sunAltitude <= 0) return 0;
  const altitudeFactor = sunAltitude / 72;
  const alignmentFactor = alignment / 100;
  const kw = SIMULATION.maxGenerationKw * altitudeFactor * alignmentFactor;
  return Number(kw.toFixed(1));
}

/** Ideal tracker orientation toward the sun. */
function idealPanelOrientation(sunAzimuth: number, sunAltitude: number) {
  return {
    panelAzimuth: sunAzimuth,
    panelTilt: clamp(sunAltitude, 0, 85),
  };
}

export function deriveSimulationState(
  timeOfDay: number,
  trackingEnabled = true
): SolarSimulationState {
  const { sunAzimuth, sunAltitude, isDaylight } = computeSunPosition(timeOfDay);

  let panelAzimuth: number;
  let panelTilt: number;
  let trackingStatus: TrackingStatus;

  if (isDaylight && trackingEnabled) {
    const ideal = idealPanelOrientation(sunAzimuth, sunAltitude);
    panelAzimuth = ideal.panelAzimuth;
    panelTilt = ideal.panelTilt;
    trackingStatus = "ACTIVE";
  } else {
    panelAzimuth = REST_PANEL.azimuth;
    panelTilt = REST_PANEL.tilt;
    trackingStatus = isDaylight ? "IDLE" : "SAFE";
  }

  const alignment = isDaylight
    ? computeAlignment(sunAzimuth, sunAltitude, panelAzimuth, panelTilt)
    : 0;

  const solarGenerationKw = computeGeneration(sunAltitude, alignment, isDaylight);

  return {
    timeOfDay,
    sunAzimuth: Number(sunAzimuth.toFixed(0)),
    sunAltitude: Number(Math.max(sunAltitude, 0).toFixed(0)),
    panelAzimuth: Number(panelAzimuth.toFixed(0)),
    panelTilt: Number(panelTilt.toFixed(0)),
    alignment,
    solarGenerationKw,
    trackingEnabled,
    trackingStatus,
    isPlaying: false,
  };
}

export function getPresetHour(preset: TimePreset) {
  return PRESET_HOURS[preset];
}

export function formatSimulationTime(hour: number) {
  const h = Math.floor(hour) % 24;
  const m = Math.round((hour % 1) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Spherical sun position for Three.js (Y-up). */
export function sunPosition3D(azimuth: number, altitude: number, distance = SIMULATION.sunDistance) {
  const azRad = degToRad(azimuth);
  const altRad = degToRad(Math.max(altitude, -5));
  return {
    x: distance * Math.cos(altRad) * Math.sin(azRad),
    y: distance * Math.sin(altRad),
    z: distance * Math.cos(altRad) * Math.cos(azRad),
  };
}

/** Panel rotations for Three.js group (degrees → radians applied in component). */
export function panelRotations3D(panelAzimuth: number, panelTilt: number) {
  return {
    yaw: degToRad(panelAzimuth),
    pitch: degToRad(panelTilt),
  };
}

export function initialSimulationState(): SolarSimulationState {
  return { ...deriveSimulationState(PRESET_HOURS.morning), isPlaying: false };
}
