import { Router, Request, Response } from "express";
import { games } from "../data/games";

const router = Router();

// GET /games
router.get("/", (req: Request, res: Response) => {
  const search = req.query.search?.toString().toLowerCase();

  if (!search) {
    return res.json(games);
  }

  const filtered = games.filter((g) => g.title.toLowerCase().includes(search));

  res.json(filtered);
});

export default router;
