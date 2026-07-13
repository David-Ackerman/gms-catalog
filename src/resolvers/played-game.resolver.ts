import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { IsAuth } from "@/middlewares/auth.middleware";
import { PlayedGameModel } from "@/models/played-game.model";
import { PlayedGameService } from "@/services/played-game.service";
import {
  CreatePlayedGameInput,
  UpdatePlayedGameInput,
} from "@/dtos/input/played-game.input";
import { GqlUser } from "@/graphql/decorators/user.decorator";
import { User } from "@/generated/prisma/client";

@Resolver(() => PlayedGameModel)
@UseMiddleware(IsAuth)
export class PlayedGameResolver {
  private readonly playedGameService = new PlayedGameService();

  @Mutation(() => PlayedGameModel)
  async createPlayedGame(
    @Arg("gameId", () => String) gameId: string,
    @Arg("data", () => CreatePlayedGameInput, { nullable: true })
    data?: CreatePlayedGameInput,
    @GqlUser() user?: User | null,
  ): Promise<PlayedGameModel> {
    if (!user) throw new Error("User not authenticated");

    return this.playedGameService.createPlayedGame(user.id, gameId, data ?? {});
  }

  @Query(() => [PlayedGameModel])
  async myPlayedGames(
    @GqlUser() user?: User | null,
  ): Promise<PlayedGameModel[]> {
    if (!user) throw new Error("User not authenticated");

    return this.playedGameService.listPlayedGamesByUser(user.id);
  }

  @Mutation(() => PlayedGameModel)
  async updatePlayedGame(
    @Arg("id", () => String) id: string,
    @Arg("data", () => UpdatePlayedGameInput) data: UpdatePlayedGameInput,
    @GqlUser() user?: User | null,
  ): Promise<PlayedGameModel> {
    if (!user) throw new Error("User not authenticated");

    const existingPlayedGame = await this.playedGameService.findPlayedGameById(id);
    if (!existingPlayedGame || existingPlayedGame.userId !== user.id) {
      throw new Error("Played game not found or not owned by user");
    }

    return this.playedGameService.updatePlayedGame(id, data);
  }

  @Mutation(() => Boolean)
  async deletePlayedGame(
    @Arg("id", () => String) id: string,
    @GqlUser() user?: User | null,
  ): Promise<boolean> {
    if (!user) throw new Error("User not authenticated");

    const existingPlayedGame = await this.playedGameService.findPlayedGameById(id);
    if (!existingPlayedGame || existingPlayedGame.userId !== user.id) {
      throw new Error("Played game not found or not owned by user");
    }

    return this.playedGameService.deletePlayedGame(id);
  }
}
