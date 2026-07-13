import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";
import { UserModel } from "@/models/user.model";
import { UserService } from "@/services/user.service";
import { IsAuth } from "@/middlewares/auth.middleware";

@Resolver(() => UserModel)
@UseMiddleware(IsAuth)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserModel)
  async getUser(@Arg("id", () => String) id: string): Promise<UserModel> {
    return this.userService.findUser(id);
  }
}
