import { CreateGameInput, UpdateGameInput } from "@/dtos/input/game.input";
import { prisma } from "@/lib/prisma";

type GameListFilters = {
  title?: string;
  developer?: string;
  genres?: string;
  sortBy?: "averageScore" | "releaseDate" | "createdAt";
  order?: "asc" | "desc";
  isActive?: boolean;
};

export class GameService {
  private withStats<T extends { playedBy?: Array<{ personalScore: number | null }> }>(
    game: T,
  ) {
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
  }

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
      isActive = true,
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
        ...(typeof isActive === "boolean" ? { isActive } : {}),
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

    const gamesWithStats = games.map((game) => this.withStats(game));

    if (sortBy !== "averageScore") {
      return gamesWithStats;
    }

    return gamesWithStats.sort((left, right) => {
      const leftScore = left.averageScore ?? -1;
      const rightScore = right.averageScore ?? -1;

      return order === "asc" ? leftScore - rightScore : rightScore - leftScore;
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
    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        playedBy: {
          select: {
            personalScore: true,
          },
        },
      },
    });

    return game ? this.withStats(game) : null;
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
