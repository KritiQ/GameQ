import { Router, Request, Response } from "express";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";

const router = Router();

// GET /backlog/:userId
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const backlog = await prisma.backlogEntry.findMany({
      where: { userId },
      include: { game: true },
      orderBy: { addedAt: "desc" },
    });

    res.json(backlog);
  } catch (error) {
    console.error("GET /backlog error:", error);
    res.status(500).json({ error: "Failed to fetch backlog" });
  }
});

// POST /backlog
router.post("/", async (req: Request, res: Response) => {
  console.log("Received POST /backlog with body:", req.body, null, 2);
  try {
    const { userId, rawgId, title, cover, rating, released, status } = req.body;

    if (typeof userId !== "number" || isNaN(userId)) {
      return res.status(400).json({ error: "userId must be a number" });
    }
    if (typeof rawgId !== "number" || isNaN(rawgId)) {
      return res.status(400).json({ error: "rawgId must be a number" });
    }
    if (typeof title !== "string" || title.trim() === "") {
      return res
        .status(400)
        .json({ error: "title is required and cannot be empty" });
    }
    if (!["planned", "playing", "completed", "dropped"].includes(status)) {
      // adjust enum
      return res.status(400).json({ error: "Invalid status" });
    }

    const game = await prisma.game.upsert({
      where: { rawgId },
      update: {
        title: title.trim(),
        cover: cover || null,
        released: released || null,
        rating: rating != null ? Number(rating) : null, // force number
      },
      create: {
        rawgId,
        title: title.trim(),
        cover: cover || null,
        released: released || null,
        rating: rating != null ? Number(rating) : null,
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

    res.status(201).json(entry);
  } catch (error: any) {
    console.error("POST /backlog FAILED:", error);

    let status = 500;
    let message = "Failed to add to backlog";
    let details = error.message;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        status = 409;
        message = "Game already exists (unique constraint)";
      } else if (error.code === "P2003") {
        status = 400;
        message = "Foreign key error – user or game not found";
      } else if (error.code === "P2011") {
        status = 400;
        message = "Missing required field (likely title or other non-nullable)";
      } else if (error.code === "P2000") {
        status = 400;
        message = "Invalid data type (e.g. rating not number)";
      }
      details = error.meta ? JSON.stringify(error.meta) : error.message;
    }

    res
      .status(status)
      .json({ error: message, details, prismaCode: error?.code });
  }
});

// DELETE /backlog/:id
router.delete("/:id", async (req: Request, res: Response) => {
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
    console.error("DELETE /backlog error:", error);
    if (error.code === "P2025") {
      // Prisma record not found
      return res.status(404).json({ error: "Backlog entry not found" });
    }
    res.status(500).json({ error: "Failed to delete" });
  }
});

export default router;
