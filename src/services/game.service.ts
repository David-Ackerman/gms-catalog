import { CreateGameInput, UpdateGameInput } from "@/dtos/input/game.input";
import { prisma } from "@/lib/prisma";

type GameListFilters = {
  title?: string;
  developer?: string;
  genres?: string;
  sortBy?: "averageScore" | "releaseDate" | "createdAt";
  order?: "asc" | "desc";
};

export class GameService {
  async createGame(data: CreateGameInput) {
    return prisma.game.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        synopsis: data.synopsis ?? null,
        developer: data.developer ?? null,
        publisher: data.publisher ?? null,
        releaseDate: data.releaseDate ? new Date(data.releaseDate) : null,
        genres: data.genres ?? null,
        platforms: data.platforms ?? null,
        coverUrl: data.coverUrl ?? null,
        isActive: data.isActive ?? true,
      },
    });
  }

  async listGames(filters: GameListFilters = {}) {
    const {
      title,
      developer,
      genres,
      sortBy = "createdAt",
      order = "desc",
    } = filters;

    const games = await prisma.game.findMany({
      where: {
        ...(title && {
          title: {
            contains: title,
          },
        }),
        ...(developer && {
          developer: {
            contains: developer,
          },
        }),
        ...(genres && {
          genres: {
            contains: genres,
          },
        }),
        isActive: true,
      },
      orderBy:
        sortBy === "averageScore"
          ? { createdAt: order }
          : sortBy === "releaseDate"
            ? { releaseDate: order }
            : { createdAt: order },
      include: {
        playedBy: {
          select: {
            personalScore: true,
          },
        },
      },
    });

    return games.map((game) => {
      const scores = (game.playedBy ?? [])
        .map((playedGame) => playedGame.personalScore)
        .filter((score): score is number => score != null);

      return {
        ...game,
        playedCount: game.playedBy?.length ?? 0,
        averageScore: scores.length
          ? scores.reduce((sum, score) => sum + score, 0) / scores.length
          : null,
        reviewCount: scores.length,
      };
    });
  }

  async deleteGame(id: string) {
    const existingGame = await prisma.game.findUnique({
      where: { id },
    });

    if (!existingGame) {
      throw new Error("Game not found");
    }

    await prisma.game.delete({
      where: { id },
    });

    return true;
  }

  async findGameById(id: string) {
    return prisma.game.findUnique({
      where: { id },
    });
  }

  async updateGame(id: string, data: UpdateGameInput) {
    const existingGame = await prisma.game.findUnique({
      where: { id },
    });

    if (!existingGame) {
      throw new Error("Game not found");
    }

    return prisma.game.update({
      where: { id },
      data: {
        title: data.title ?? existingGame.title,
        description: data.description ?? existingGame.description,
        isActive: data.isActive ?? existingGame.isActive,
        releaseDate: data.releaseDate ?? existingGame.releaseDate,
        developer: data.developer ?? existingGame.developer,
        publisher: data.publisher ?? existingGame.publisher,
        genres: data.genres ?? existingGame.genres,
        platforms: data.platforms ?? existingGame.platforms,
        coverUrl: data.coverUrl ?? existingGame.coverUrl,
        slug: data.slug ?? existingGame.slug,
        synopsis: data.synopsis ?? existingGame.synopsis,
      },
    });
  }
}
