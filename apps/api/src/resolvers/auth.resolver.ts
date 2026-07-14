import { LoginInput, RegisterInput } from "@/dtos/input/auth.input";
import { LoginOutput, RegisterOutput } from "@/dtos/output/auth.output";
import { AuthService } from "@/services/auth.service";
import { Arg, Mutation, Resolver } from "type-graphql";

@Resolver()
export class AuthResolver {
  private readonly authService: AuthService = new AuthService();
  constructor() {}

  @Mutation(() => RegisterOutput)
  async register(
    @Arg("data", () => RegisterInput) data: RegisterInput,
  ): Promise<RegisterOutput> {
    return this.authService.register(data);
  }

  @Mutation(() => LoginOutput)
  async login(
    @Arg("data", () => LoginInput) data: LoginInput,
  ): Promise<LoginOutput> {
    return this.authService.login(data);
  }
}
