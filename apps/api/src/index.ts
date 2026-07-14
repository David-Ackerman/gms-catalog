import "reflect-metadata";
import "@/config/env";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { buildContext } from "@/graphql/context";
import { AuthResolver } from "@/resolvers/auth.resolver";
import { GameResolver } from "@/resolvers/game.resolver";
import { PlayedGameResolver } from "@/resolvers/played-game.resolver";
import { UserResolver } from "@/resolvers/user.resolver";
import { seedDatabase } from "@/seed";

const requiredEnv = ["JWT_SECRET"] as const;

function validateEnv() {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}

async function startServer() {
  validateEnv();

  const app = express();

  await seedDatabase();

  const schema = await buildSchema({
    resolvers: [AuthResolver, GameResolver, PlayedGameResolver, UserResolver],
    validate: false,
    emitSchemaFile: "./schema.graphql",
  });

  const server = new ApolloServer({
    schema,
  });

  await server.start();
  app.use(cors({ origin: true, credentials: true }));

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, { context: buildContext }),
  );

  app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000/");
  });
}

startServer();
