import { Request, Response } from "express";
import { getMetrics } from "../services/metricsService";

export async function fetchMetrics(_req: Request, res: Response) {
  const metrics = await getMetrics();
  res.json(metrics);
}
