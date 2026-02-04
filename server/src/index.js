import "./polyfill.js";
import { setMaxListeners } from "events";

// Increase default max listeners to prevent warnings from concurrent fetch calls in LangChain agent
// AbortSignal uses EventTarget which has a default limit of 10 listeners
setMaxListeners(20);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import tripRoutes from "./routes/trip.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/trips", tripRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));
