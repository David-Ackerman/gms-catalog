import { prisma } from "@/lib/prisma";
import { LoginInput, RegisterInput } from "@/dtos/input/auth.input";
import { RegisterOutput } from "@/dtos/output/auth.output";
import { comparePassword, hashPassword } from "@/utils/hash";
import { signJwt } from "@/utils/jwt";
import { User } from "@/generated/prisma/client";

export class AuthService {
  async login(data: LoginInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!existingUser) throw new Error("User not found");

    const compare = await comparePassword(data.password, existingUser.password);
    if (!compare) throw new Error("Invalid credentials");

    return this.generateTokens(existingUser);
  }

  async register(data: RegisterInput): Promise<RegisterOutput> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) throw new Error("User with this email already exists");

    const hash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hash,
        role: "USER",
      },
    });
    return this.generateTokens(user);
  }

  generateTokens(user: User) {
    const token = signJwt(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      "15m",
    );
    const refreshToken = signJwt(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      "7d",
    );
    return { token, refreshToken, user };
  }
}
