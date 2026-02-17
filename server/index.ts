import express, { Router, Request, Response } from "express";
import gamesRoutes from "./routes/games";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/games", gamesRoutes);

app.get("/", (req, res) => {
  res.send("GameQ API running");
});

app.listen(3001, () => console.log("Server běží na portu 3001"));
