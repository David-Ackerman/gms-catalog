import { MiddlewareFn } from "type-graphql";
import { GraphQLError } from "graphql";
import { GraphQLContext } from "@/graphql/context";

export const IsAuth: MiddlewareFn<GraphQLContext> = async (
  { context },
  next,
) => {
  if (!context.user) {
    throw new GraphQLError("Not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });
  }

  return next();
};

export const IsAdmin: MiddlewareFn<GraphQLContext> = async (
  { context },
  next,
) => {
  if (!context.user) {
    throw new GraphQLError("Not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });
  }

  if (!context.isAdmin) {
    throw new GraphQLError("Forbidden", {
      extensions: {
        code: "FORBIDDEN",
      },
    });
  }

  return next();
};
