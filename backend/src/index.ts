import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import metricsRouter from "./routes/metrics";
import subscriptionsRouter from "./routes/subscriptions";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(cors());
app.use(express.json());

app.use("/api/subscriptions", subscriptionsRouter);
app.use("/api/metrics", metricsRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Not found." });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
