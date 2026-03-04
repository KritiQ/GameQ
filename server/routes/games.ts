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
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.page_size) || 24;
  const search = req.query.search as string | undefined;

  try {
    const whereCondition = search
      ? {
          title: {
            contains: search,
          },
        }
      : {};

    const [games, total] = await prisma.$transaction([
      prisma.game.findMany({
        where: whereCondition,
        orderBy: {
          rating: "desc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.game.count({
        where: whereCondition,
      }),
    ]);

    res.json({
      results: games.map((game) => ({
        id: game.rawgId,
        title: game.title,
        cover: game.cover,
        released: game.released,
        rating: game.rating,
        genres: game.genres ? JSON.parse(game.genres) : [],
      })),
      page,
      pageSize,
      total,
    });
  } catch (error) {
    console.error("DB fetch error:", error);
    res.status(500).json({ error: "Failed to fetch games" });
  }
});
router.post("/sync", async (req, res) => {
  try {
    let currentPage = 1;
    let hasNextPage = true;
    const pageSize = 40;

    while (hasNextPage && currentPage <= 50) {
      const response = await axios.get(RAWG_BASE_URL, {
        params: {
          key: RAWG_KEY,
          page: currentPage,
          page_size: pageSize,
          ordering: "-added",
          exclude_additions: true,
        },
      });

      const rawgGames = response.data.results.filter(
        (g: any) => !g.parent_game && g.released,
      );

      await prisma.$transaction(
        rawgGames.map((g: any) =>
          prisma.game.upsert({
            where: { rawgId: g.id },
            update: {
              title: g.name,
              cover: g.background_image || null,
              released: g.released || null,
              rating: g.rating || null,
              genres: g.genres
                ? JSON.stringify(g.genres.map((genre: any) => genre.name))
                : null,
            },
            create: {
              rawgId: g.id,
              title: g.name,
              cover: g.background_image || null,
              released: g.released || null,
              rating: g.rating || null,
              genres: g.genres
                ? JSON.stringify(g.genres.map((genre: any) => genre.name))
                : null,
            },
          }),
        ),
      );

      console.log(`Synced page ${currentPage}`);

      hasNextPage = !!response.data.next;
      currentPage++;
    }

    res.json({ message: "Database fully synced!" });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ error: "Failed to sync database" });
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

    res.json({
      ...game,
      genres: game.genres ? JSON.parse(game.genres) : [],
    });
  } catch (error) {
    console.error("Game detail error:", error);
    res.status(500).json({ error: "Failed to fetch game detail" });
  }
});

export default router;
