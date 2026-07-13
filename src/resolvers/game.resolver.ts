import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { IsAdmin, IsAuth } from "@/middlewares/auth.middleware";
import { GameModel } from "@/models/game.model";
import { GameService } from "@/services/game.service";
import {
  CreateGameInput,
  GameListFilterInput,
  UpdateGameInput,
} from "@/dtos/input/game.input";

@Resolver(() => GameModel)
@UseMiddleware(IsAuth)
export class GameResolver {
  private readonly gameService = new GameService();

  @Mutation(() => GameModel)
  @UseMiddleware(IsAdmin)
  async createGame(
    @Arg("data", () => CreateGameInput) data: CreateGameInput,
  ): Promise<GameModel> {
    return this.gameService.createGame(data);
  }

  @Mutation(() => GameModel)
  @UseMiddleware(IsAdmin)
  async updateGame(
    @Arg("id", () => String) id: string,
    @Arg("data", () => UpdateGameInput) data: UpdateGameInput,
  ): Promise<GameModel> {
    return this.gameService.updateGame(id, data);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(IsAdmin)
  async deleteGame(@Arg("id", () => String) id: string): Promise<boolean> {
    return this.gameService.deleteGame(id);
  }

  @Query(() => [GameModel])
  async listGames(
    @Arg("filters", () => GameListFilterInput, { nullable: true })
    filters?: GameListFilterInput,
  ): Promise<GameModel[]> {
    return this.gameService.listGames({
      title: filters?.title,
      developer: filters?.developer,
      genres: filters?.genres,
      sortBy: filters?.sortBy as
        | "averageScore"
        | "releaseDate"
        | "createdAt"
        | undefined,
      order: filters?.order as "asc" | "desc" | undefined,
    });
  }
}
