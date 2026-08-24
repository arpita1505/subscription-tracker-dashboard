import { Router } from "express";
import { fetchMetrics } from "../controllers/metricsController";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/", asyncHandler(fetchMetrics));

export default router;
