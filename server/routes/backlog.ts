import { Router } from "express";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /backlog/
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    const backlog = await prisma.backlogEntry.findMany({
      where: { userId },
      include: { game: true },
      orderBy: { addedAt: "desc" },
    });

    res.json(
      backlog.map((entry) => ({
        ...entry,
        game: {
          id: entry.game.rawgId,
          title: entry.game.title,
          cover: entry.game.cover,
          released: entry.game.released,
          rating: entry.game.rating,
          genres: entry.game?.genres ? JSON.parse(entry.game.genres) : [],
        },
      })),
    );
  } catch (error) {
    console.error("GET backlog error:", error);
    res.status(500).json({ error: "Failed to fetch backlog" });
  }
});

// POST /backlog/

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { rawgId, title, cover, rating, released, status } = req.body;

    if (!rawgId || !title || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!["planned", "playing", "completed", "dropped"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const game = await prisma.game.upsert({
      where: { rawgId },
      update: {
        title: title.trim(),
        cover: cover || null,
        released: released || null,
        rating: rating ? Number(rating) : null,
      },
      create: {
        rawgId,
        title: title.trim(),
        cover: cover || null,
        released: released || null,
        rating: rating ? Number(rating) : null,
      },
    });

    const entry = await prisma.backlogEntry.create({
      data: {
        userId,
        gameId: game.id,
        status,
      },
      include: { game: true },
    });

    res.status(201).json({
      ...entry,
      game: {
        id: entry.game.rawgId,
        title: entry.game.title,
        cover: entry.game.cover,
        released: entry.game.released,
        rating: entry.game.rating,
        genres: entry.game?.genres ? JSON.parse(entry.game.genres) : [],
      },
    });
  } catch (error) {
    console.error("POST backlog error:", error);
    res.status(500).json({ error: "Failed to add backlog" });
  }
});

// DELETE /backlog/:id

router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    await prisma.backlogEntry.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error("DELETE backlog error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Backlog entry not found" });
    }

    res.status(500).json({ error: "Failed to delete backlog" });
  }
});

// PUT /backlog/:id/status

router.put("/:id/status", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    if (!["planned", "playing", "completed", "dropped"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await prisma.backlogEntry.update({
      where: { id },
      data: { status },
      include: { game: true },
    });

    res.json({
      ...updated,
      game: {
        id: updated.game.rawgId,
        title: updated.game.title,
        cover: updated.game.cover,
        released: updated.game.released,
        rating: updated.game.rating,
        genres: updated.game?.genres ? JSON.parse(updated.game.genres) : [],
      },
    });
  } catch (error: any) {
    console.error("PUT backlog status error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Backlog entry not found" });
    }

    res.status(500).json({ error: "Failed to update backlog status" });
  }
});

export default router;
