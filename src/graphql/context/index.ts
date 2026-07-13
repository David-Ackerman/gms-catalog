import { ExpressContextFunctionArgument } from "@as-integrations/express5";
import { prisma } from "@/lib/prisma";
import { JwtPayload, verifyJwt } from "@/utils/jwt";

export type GraphQLContext = {
  user: string | undefined;
  role: "USER" | "ADMIN" | undefined;
  isAdmin: boolean;
  token: string | undefined;
  req: ExpressContextFunctionArgument["req"];
  res: ExpressContextFunctionArgument["res"];
};

export const buildContext = async ({
  req,
  res,
}: ExpressContextFunctionArgument): Promise<GraphQLContext> => {
  const authHeader = req.headers.authorization || "";
  let user: string | undefined;
  let role: "USER" | "ADMIN" | undefined;
  let token: string | undefined;

  if (!authHeader.startsWith("Bearer ")) {
    return {
      user: undefined,
      role: undefined,
      isAdmin: false,
      token: undefined,
      req,
      res,
    };
  }

  token = authHeader.substring("Bearer ".length);

  try {
    const payload = verifyJwt(token as string) as JwtPayload;
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, role: true },
    });

    if (!dbUser) {
      return {
        user: undefined,
        role: undefined,
        isAdmin: false,
        token: undefined,
        req,
        res,
      };
    }

    user = dbUser.id;
    role = dbUser.role;
  } catch (err) {
    console.error("Invalid token", err);
    return {
      user: undefined,
      role: undefined,
      isAdmin: false,
      token: undefined,
      req,
      res,
    };
  }

  return { user, role, isAdmin: role === "ADMIN", token, req, res };
};
