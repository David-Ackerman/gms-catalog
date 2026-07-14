import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { IsAdmin, IsAuth } from "@/middlewares/auth.middleware";
import { GameModel } from "@/models/game.model";
import { GameService } from "@/services/game.service";
import {
  CreateGameInput,
  GameListFilterInput,
  UpdateGameInput,
} from "@/dtos/input/game.input";
import { GraphQLContext } from "@/graphql/context";

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
    @Ctx() context: GraphQLContext,
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
      isActive: filters?.includeInactive && context.isAdmin
        ? filters?.isActive
        : true,
    });
  }

  @Query(() => GameModel, { nullable: true })
  async game(@Arg("id", () => String) id: string): Promise<GameModel | null> {
    return this.gameService.findGameById(id);
  }
}
