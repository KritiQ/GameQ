import { Router, Request, Response } from "express";

const router = Router();

// fake testing database
const games = [
  { id: 1, name: "The Witcher 3", genre: "RPG", year: 2015 },
  { id: 2, name: "Hades", genre: "Roguelike", year: 2020 },
  { id: 3, name: "Cyberpunk 2077", genre: "RPG", year: 2020 },
];

// GET /games
router.get("/", (req: Request, res: Response) => {
  const search = req.query.search?.toString().toLowerCase();

  if (!search) {
    return res.json(games);
  }

  const filtered = games.filter((g) => g.name.toLowerCase().includes(search));

  res.json(filtered);
});

export default router;
