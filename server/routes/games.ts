import { Router } from "express";
import { prisma } from "../prisma";
import axios from "axios";

const router = Router();
const RAWG_BASE_URL = "https://api.rawg.io/api/games";
const RAWG_KEY = process.env.RAWG_API_KEY;

if (!RAWG_KEY) {
  throw new Error("RAWG_API_KEY missing in .env");
}

router.get("/", async (req, res) => {
  const { page = 1, page_size = 50, search } = req.query;

  try {
    // Fetch from RAWG
    const params: any = {
      key: RAWG_KEY,
      page,
      page_size,
      ordering: "-rating", // popular/high-rated first
    };
    if (search) params.search = search;

    const response = await axios.get(RAWG_BASE_URL, { params });
    const rawgGames = response.data.results;

    // Upsert each into DB (transaction for efficiency)
    const upsertedGames = await prisma.$transaction(
      rawgGames.map((g: any) =>
        prisma.game.upsert({
          where: { rawgId: g.id },
          update: {
            title: g.name,
            cover: g.background_image || null,
            released: g.released || null,
            rating: g.rating || null,
          },
          create: {
            rawgId: g.id,
            title: g.name,
            cover: g.background_image || null,
            released: g.released || null,
            rating: g.rating || null,
          },
        })
      )
    );

    // Map games for frontend (id = rawgId)
    const games = upsertedGames.map((game) => ({
      id: game.rawgId,
      title: game.title,
      cover: game.cover,
      released: game.released,
      rating: game.rating,
    }));

    res.json(games);
  } catch (error: any) {
    console.error("Games fetch/upsert error:", error.message);
    res.status(500).json({ error: "Failed to load games" });
  }
});

export default router;