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
      exclude_additions: true, // exclude dlcs and others only games
    };
    if (search) params.search = search;

    const response = await axios.get(RAWG_BASE_URL, { params });

    const rawgGames = response.data.results.filter((g: any) => !g.parent_game);

    // Upsert each into DB
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
        }),
      ),
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
router.get("/:id", async (req, res) => {
  const rawgId = Number(req.params.id);

  try {
    // find in db
    let game = await prisma.game.findUnique({
      where: { rawgId },
    });

    // get from rawg if not in db
    if (!game || !game.description) {
      const response = await axios.get(`${RAWG_BASE_URL}/${rawgId}`, {
        params: { key: RAWG_KEY },
      });

      const g = response.data;

      game = await prisma.game.upsert({
        where: { rawgId },
        update: {
          description: g.description || null,
          backgroundExtra: g.background_image_additional || null,
          website: g.website || null,
          metacritic: g.metacritic || null,
          playtime: g.playtime || null,
          platforms: g.platforms
            ? JSON.stringify(g.platforms.map((p: any) => p.platform.name))
            : null,
        },
        create: {
          rawgId: g.id,
          title: g.name,
          cover: g.background_image || null,
          released: g.released || null,
          rating: g.rating || null,
          description: g.description || null,
          backgroundExtra: g.background_image_additional || null,
          website: g.website || null,
          metacritic: g.metacritic || null,
          playtime: g.playtime || null,
          platforms: g.platforms
            ? JSON.stringify(g.platforms.map((p: any) => p.platform.name))
            : null,
        },
      });
    }

    res.json(game);
  } catch (error) {
    console.error("Game detail error:", error);
    res.status(500).json({ error: "Failed to fetch game detail" });
  }
});

export default router;
