import { Router } from "express";
import {
  addSubscription,
  listSubscriptions,
  removeSubscription,
  toggleSubscription,
} from "../controllers/subscriptionController";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/", asyncHandler(listSubscriptions));
router.post("/", asyncHandler(addSubscription));
router.patch("/:id/toggle", asyncHandler(toggleSubscription));
router.delete("/:id", asyncHandler(removeSubscription));

export default router;
