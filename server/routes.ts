import { Router, Request, Response } from "express";
import { storage } from "./storage.js";
import type { PriorityLevel, RoomPriority } from "../client/src/data/types.js";

export const apiRouter = Router();

/* ────────────────────────────────────────────
 * 1. Health & Facility Identity
 * ──────────────────────────────────────────── */

apiRouter.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "SolarGrid & Hospital Energy Intelligence API",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "2.1.0",
  });
});

apiRouter.get("/facility", (_req: Request, res: Response) => {
  const facility = storage.getFacility();
  res.json(facility);
});

apiRouter.put("/facility", (req: Request, res: Response) => {
  const updated = storage.updateFacility(req.body);
  res.json(updated);
});

/* ────────────────────────────────────────────
 * 2. Live Telemetry & Real-Time SSE Stream
 * ──────────────────────────────────────────── */

apiRouter.get("/telemetry", (_req: Request, res: Response) => {
  const telemetry = storage.getTelemetry();
  res.json(telemetry);
});

apiRouter.post("/telemetry", (req: Request, res: Response) => {
  const updated = storage.updateTelemetry(req.body);
  res.json(updated);
});

// Server-Sent Events (SSE) for real-time telemetry streaming
apiRouter.get("/stream", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Send initial event
  const initial = storage.getTelemetry();
  res.write(`data: ${JSON.stringify(initial)}\n\n`);

  // Stream updates every 3 seconds
  const interval = setInterval(() => {
    const data = storage.getTelemetry();
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 3000);

  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
});

/* ────────────────────────────────────────────
 * 3. Energy History
 * ──────────────────────────────────────────── */

apiRouter.get("/energy-history", (req: Request, res: Response) => {
  const range = typeof req.query.range === "string" ? req.query.range : "24h";
  const history = storage.getEnergyHistory(range);
  res.json(history);
});

apiRouter.post("/energy-history", (req: Request, res: Response) => {
  const updated = storage.addEnergyHistoryPoint(req.body);
  res.status(201).json(updated);
});

/* ────────────────────────────────────────────
 * 4. Operating Mode
 * ──────────────────────────────────────────── */

apiRouter.get("/operating-mode", (_req: Request, res: Response) => {
  const mode = storage.getOperatingMode();
  res.json(mode);
});

apiRouter.post("/operating-mode", (req: Request, res: Response) => {
  const updated = storage.updateOperatingMode(req.body);
  res.json(updated);
});

apiRouter.put("/operating-mode", (req: Request, res: Response) => {
  const updated = storage.updateOperatingMode(req.body);
  res.json(updated);
});

/* ────────────────────────────────────────────
 * 5. Forecast & AI Optimization
 * ──────────────────────────────────────────── */

apiRouter.get("/forecast", (_req: Request, res: Response) => {
  const forecast = storage.getForecast();
  res.json(forecast);
});

apiRouter.post("/forecast", (req: Request, res: Response) => {
  const updated = storage.updateForecast(req.body);
  res.json(updated);
});

apiRouter.get("/optimization", (_req: Request, res: Response) => {
  const opt = storage.getOptimization();
  res.json(opt);
});

apiRouter.post("/optimization", (req: Request, res: Response) => {
  const updated = storage.updateOptimization(req.body);
  res.json(updated);
});

/* ────────────────────────────────────────────
 * 6. Priority Dispatch & Load Tiers
 * ──────────────────────────────────────────── */

apiRouter.get("/priority-dispatch", (_req: Request, res: Response) => {
  const tiers = storage.getLoadTiers();
  res.json(tiers);
});

apiRouter.get("/load-tiers", (_req: Request, res: Response) => {
  const tiers = storage.getLoadTiers();
  res.json(tiers);
});

apiRouter.put("/priority-dispatch/:id", (req: Request, res: Response) => {
  const updated = storage.updateLoadTier(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: "Load tier not found" });
  }
  res.json(updated);
});

/* ────────────────────────────────────────────
 * 7. Metering (Feature 1)
 * ──────────────────────────────────────────── */

apiRouter.get("/metering", (_req: Request, res: Response) => {
  const metering = storage.getMetering();
  res.json(metering);
});

/* ────────────────────────────────────────────
 * 8. Alerts Management
 * ──────────────────────────────────────────── */

apiRouter.get("/alerts", (req: Request, res: Response) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const severity = typeof req.query.severity === "string" ? req.query.severity : undefined;
  const alerts = storage.getAlerts({ status, severity });
  res.json(alerts);
});

apiRouter.post("/alerts", (req: Request, res: Response) => {
  const alert = storage.createAlert(req.body);
  res.status(201).json(alert);
});

apiRouter.patch("/alerts/:id/acknowledge", (req: Request, res: Response) => {
  const acknowledged = storage.acknowledgeAlert(req.params.id);
  if (!acknowledged) {
    return res.status(404).json({ error: "Alert not found" });
  }
  res.json(acknowledged);
});

apiRouter.delete("/alerts/:id", (req: Request, res: Response) => {
  const success = storage.deleteAlert(req.params.id);
  if (!success) {
    return res.status(404).json({ error: "Alert not found" });
  }
  res.json({ success: true, message: "Alert deleted" });
});

/* ────────────────────────────────────────────
 * 9. Hospital Critical Loads & Clinical Audit Logs
 * ──────────────────────────────────────────── */

apiRouter.get("/hospital-loads", (_req: Request, res: Response) => {
  const loads = storage.getHospitalLoads();
  res.json(loads);
});

apiRouter.put("/hospital-loads/:id/priority", (req: Request, res: Response) => {
  const { priority, reason, operator } = req.body;
  if (!priority) {
    return res.status(400).json({ error: "Priority is required" });
  }

  const result = storage.updateHospitalLoadPriority(
    req.params.id,
    priority as PriorityLevel,
    reason || "Clinical protocol update",
    operator || "Authorized Operator"
  );
  res.json(result);
});

apiRouter.get("/load-audit-logs", (_req: Request, res: Response) => {
  const logs = storage.getLoadAuditLogs();
  res.json(logs);
});

apiRouter.post("/load-audit-logs", (req: Request, res: Response) => {
  const entry = storage.addLoadAuditLog(req.body);
  res.status(201).json(entry);
});

/* ────────────────────────────────────────────
 * 10. Emergency Mode Controls
 * ──────────────────────────────────────────── */

apiRouter.get("/emergency-mode", (_req: Request, res: Response) => {
  const state = storage.getEmergencyMode();
  res.json(state);
});

apiRouter.post("/emergency-mode", (req: Request, res: Response) => {
  const { is_active, operator, reason } = req.body;
  const result = storage.setEmergencyMode(
    Boolean(is_active),
    operator || "Clinical Operations Controller",
    reason || "Emergency mode engaged"
  );
  res.json(result);
});

/* ────────────────────────────────────────────
 * 11. Energy Sharing & P2P Trading
 * ──────────────────────────────────────────── */

apiRouter.get("/energy-sharing/summary", (_req: Request, res: Response) => {
  const summary = storage.getEnergySharingSummary();
  res.json(summary);
});

apiRouter.get("/energy-sharing/peers", (_req: Request, res: Response) => {
  const peers = storage.getEnergyPeers();
  res.json(peers);
});

apiRouter.get("/energy-sharing/transactions", (_req: Request, res: Response) => {
  const txs = storage.getEnergyTransactions();
  res.json(txs);
});

apiRouter.post("/energy-sharing/transactions", (req: Request, res: Response) => {
  const { type, amount_kwh, rate_inr, total_amount_inr, peer_entity, notes, status } = req.body;
  if (!type || amount_kwh === undefined) {
    return res.status(400).json({ error: "Transaction type and amount_kwh are required" });
  }

  const result = storage.createEnergyTransaction({
    facility_id: "SG-ACC-01",
    type,
    amount_kwh: Number(amount_kwh),
    rate_inr: Number(rate_inr ?? 8.5),
    total_amount_inr: Number(total_amount_inr ?? amount_kwh * (rate_inr ?? 8.5)),
    status: status || "Settled",
    peer_entity: peer_entity || "Campus Microgrid Peer",
    notes: notes || "P2P Clean Energy Exchange",
  });

  res.status(201).json(result);
});

apiRouter.post("/energy-sharing/sell", (req: Request, res: Response) => {
  const { amount_kwh, peer_entity, rate_inr } = req.body;
  const amount = Number(amount_kwh || 10);
  const rate = Number(rate_inr || 8.5);

  const result = storage.createEnergyTransaction({
    facility_id: "SG-ACC-01",
    type: "Sold",
    amount_kwh: amount,
    rate_inr: rate,
    total_amount_inr: Number((amount * rate).toFixed(2)),
    status: "Settled",
    peer_entity: peer_entity || "Apollo Oncology Center",
    notes: "Surplus solar dispatched via quick-sell",
  });

  res.status(201).json(result);
});

apiRouter.post("/energy-sharing/request", (req: Request, res: Response) => {
  const { amount_kwh, peer_entity, reason } = req.body;
  const amount = Number(amount_kwh || 15);

  const result = storage.createEnergyTransaction({
    facility_id: "SG-ACC-01",
    type: "Received",
    amount_kwh: amount,
    rate_inr: 0,
    total_amount_inr: 0,
    status: "Completed",
    peer_entity: peer_entity || "Ruby Hall Clinic Microgrid",
    notes: reason || "Emergency life-support solidarity transfer",
  });

  res.status(201).json(result);
});

/* ────────────────────────────────────────────
 * 12. Hospital Campuses, Departments, Rooms & Scenarios
 * ──────────────────────────────────────────── */

apiRouter.get("/hospital/campuses", (_req: Request, res: Response) => {
  const campuses = storage.getCampuses();
  res.json(campuses);
});

apiRouter.get("/hospital/departments", (_req: Request, res: Response) => {
  const departments = storage.getDepartments();
  res.json(departments);
});

apiRouter.get("/hospital/rooms", (req: Request, res: Response) => {
  const departmentId = typeof req.query.department === "string" ? req.query.department : undefined;
  const priority = typeof req.query.priority === "string" ? (req.query.priority as RoomPriority) : undefined;
  const rooms = storage.getRooms({ departmentId, priority });
  res.json(rooms);
});

apiRouter.get("/hospital/rooms/:id", (req: Request, res: Response) => {
  const room = storage.getRoomById(req.params.id);
  if (!room) {
    return res.status(404).json({ error: "Hospital room not found" });
  }
  res.json(room);
});

apiRouter.patch("/hospital/rooms/:id/priority", (req: Request, res: Response) => {
  const { priority, justification, operator } = req.body;
  if (!priority) {
    return res.status(400).json({ error: "Room priority (P0, P1, P2, P3) is required" });
  }

  const result = storage.updateRoomPriority(
    req.params.id,
    priority as RoomPriority,
    justification || "Clinical review priority adjustment",
    operator || "Clinical Operations Controller"
  );

  if (!result) {
    return res.status(404).json({ error: "Room not found" });
  }

  res.json(result);
});

apiRouter.get("/hospital/scenarios", (_req: Request, res: Response) => {
  const scenarios = storage.getScenarios();
  res.json(scenarios);
});

apiRouter.post("/hospital/scenarios/:id/apply", (req: Request, res: Response) => {
  const result = storage.applyScenario(req.params.id);
  if (!result) {
    return res.status(404).json({ error: "Simulation scenario not found" });
  }
  res.json(result);
});

