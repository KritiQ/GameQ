import { Router, Request, Response } from "express";
import { games } from "../data/games";

const router = Router();

let backlog: any[] = [];

// GET backlog
router.get("/", (req: Request, res: Response) => {
  const enrichedBacklog = backlog.map((entry) => {
    const game = games.find((g) => g.id === entry.gameId);

    return {
      id: entry.id,
      status: entry.status,
      addedAt: entry.addedAt,
      game: game || null,
    };
  });

  res.json(enrichedBacklog);
});

// DELETE remove entry
router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  backlog = backlog.filter((entry) => entry.id !== id);

  res.json({ success: true });
});

// POST add game
router.post("/", (req: Request, res: Response) => {
  const { gameId, status } = req.body;

  const game = games.find((g) => g.id === gameId);
  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  const entry = {
    id: backlog.length + 1,
    gameId,
    status,
    addedAt: new Date(),
  };

  backlog.push(entry);

  res.status(201).json(entry);
});

export default router;
