import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";
import { UserModel } from "@/models/user.model";
import { UserService } from "@/services/user.service";
import { IsAuth } from "@/middlewares/auth.middleware";
import { GqlUser } from "@/graphql/decorators/user.decorator";
import { User } from "@/generated/prisma/client";

@Resolver(() => UserModel)
@UseMiddleware(IsAuth)
export class UserResolver {
  private readonly userService = new UserService();

  @Query(() => UserModel)
  async me(@GqlUser() user?: User | null): Promise<UserModel> {
    if (!user) {
      throw new Error("User not authenticated");
    }

    return user;
  }

  @Query(() => UserModel)
  async getUser(@Arg("id", () => String) id: string): Promise<UserModel> {
    return this.userService.findUser(id);
  }
}
