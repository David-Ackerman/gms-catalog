import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const apiRoot = resolve(currentDir, "../..");
const workspaceRoot = resolve(apiRoot, "../..");
const prismaRoot = resolve(apiRoot, "prisma");

config({ path: resolve(workspaceRoot, ".env") });
config({ path: resolve(apiRoot, ".env"), override: false });

const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl?.startsWith("file:")) {
  const sqlitePath = databaseUrl.slice("file:".length);

  if (sqlitePath === "./dev.db") {
    process.env.DATABASE_URL = `file:${resolve(prismaRoot, "dev.db")}`;
  } else if (sqlitePath.startsWith("./")) {
    process.env.DATABASE_URL = `file:${resolve(prismaRoot, sqlitePath.slice(2))}`;
  }
}
