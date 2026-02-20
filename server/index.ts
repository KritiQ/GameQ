import express from "express";
import { prisma } from "./prisma";
import gamesRoutes from "./routes/games";
import backlogRoutes from "./routes/backlog";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/games", gamesRoutes);
app.use("/backlog", backlogRoutes);

app.get("/", (_req, res) => res.send("GameQ API running"));

app.listen(3001, () => console.log("Server running on port 3001"));
