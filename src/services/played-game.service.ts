import {
  CreatePlayedGameInput,
  UpdatePlayedGameInput,
} from "@/dtos/input/played-game.input";
import { prisma } from "@/lib/prisma";

export class PlayedGameService {
  async createPlayedGame(
    userId: string,
    gameId: string,
    data: CreatePlayedGameInput,
  ) {
    return prisma.playedGame.create({
      data: {
        userId,
        gameId,
        status:
          (data.status as "WANT_TO_PLAY" | "PLAYING" | "PLAYED" | "DROPPED") ??
          "PLAYED",
        personalScore: data.personalScore ?? null,
        reviewNote: data.reviewNote ?? null,
        notes: data.notes ?? null,
      },
    });
  }

  async listPlayedGamesByUser(userId: string) {
    return prisma.playedGame.findMany({
      where: { userId },
      include: { game: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findPlayedGameById(id: string) {
    return prisma.playedGame.findUnique({
      where: { id },
      include: { game: true, user: true },
    });
  }

  async updatePlayedGame(id: string, data: UpdatePlayedGameInput) {
    const existingPlayedGame = await prisma.playedGame.findUnique({
      where: { id },
    });

    if (!existingPlayedGame) {
      throw new Error("Played game not found");
    }

    return prisma.playedGame.update({
      where: { id },
      data: {
        status:
          (data.status as "WANT_TO_PLAY" | "PLAYING" | "PLAYED" | "DROPPED") ??
          existingPlayedGame.status,
        personalScore: data.personalScore ?? existingPlayedGame.personalScore,
        reviewNote: data.reviewNote ?? existingPlayedGame.reviewNote,
        notes: data.notes ?? existingPlayedGame.notes,
      },
    });
  }

  async deletePlayedGame(id: string) {
    const existingPlayedGame = await prisma.playedGame.findUnique({
      where: { id },
    });

    if (!existingPlayedGame) {
      throw new Error("Played game not found");
    }

    await prisma.playedGame.delete({
      where: { id },
    });

    return true;
  }
}
