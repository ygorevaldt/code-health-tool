import express from "express";
import cors from "cors";
import analyzeRoute from "./routes/analyze.js";

export default function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/analyze", analyzeRoute);
  return app;
}
