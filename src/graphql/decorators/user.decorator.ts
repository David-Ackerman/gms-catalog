import { createParameterDecorator, ResolverData } from "type-graphql";
import { GraphQLContext } from "../context";
import { User } from "../../generated/prisma/browser";
import { prisma } from "@/lib/prisma";

export const GqlUser = () => {
  return createParameterDecorator(
    async ({ context }: ResolverData<GraphQLContext>): Promise<User | null> => {
      if (!context?.user) return null;

      try {
        const user = await prisma.user.findUnique({
          where: { id: context.user },
        });
        if (!user) throw new Error("User not found");
        return user;
      } catch (error) {
        console.log("Error fetching user in GqlUser decorator:", error);
      }
      return null;
    },
  );
};
