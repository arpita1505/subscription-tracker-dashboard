import { Request, Response } from "express";
import {
  createSubscription,
  deleteSubscription,
  getAllSubscriptions,
  toggleSubscriptionActive,
} from "../services/subscriptionService";
import { validateSubscriptionInput } from "../services/subscriptionValidation";

export async function listSubscriptions(_req: Request, res: Response) {
  const subscriptions = await getAllSubscriptions();
  res.json(subscriptions);
}

export async function addSubscription(req: Request, res: Response) {
  const validation = validateSubscriptionInput(req.body);
  if (!validation.valid || !validation.data) {
    return res.status(400).json({ message: validation.errors.join(" ") });
  }

  const created = await createSubscription(validation.data);
  res.status(201).json(created);
}

export async function toggleSubscription(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "id must be a valid integer." });
  }

  const updated = await toggleSubscriptionActive(id);
  if (!updated) {
    return res.status(404).json({ message: `Subscription with id ${id} not found.` });
  }

  res.json(updated);
}

export async function removeSubscription(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "id must be a valid integer." });
  }

  const deleted = await deleteSubscription(id);
  if (!deleted) {
    return res.status(404).json({ message: `Subscription with id ${id} not found.` });
  }

  res.status(204).send();
}
