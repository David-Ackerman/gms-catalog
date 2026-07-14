import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const prismaRoot = resolve(currentDir, "prisma");
config({ path: resolve(currentDir, "../../.env") });
config({ path: resolve(currentDir, ".env"), override: false });

const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl?.startsWith("file:")) {
  const sqlitePath = databaseUrl.slice("file:".length);

  if (sqlitePath === "./dev.db") {
    process.env.DATABASE_URL = `file:${resolve(prismaRoot, "dev.db")}`;
  } else if (sqlitePath.startsWith("./")) {
    process.env.DATABASE_URL = `file:${resolve(prismaRoot, sqlitePath.slice(2))}`;
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
