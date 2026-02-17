import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.send("Server OK");
});

app.listen(3001, () => console.log("Server běží na portu 3001"));
