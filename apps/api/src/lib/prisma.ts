import "@/config/env";
import { PrismaClient } from "@/generated/prisma/client";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const apiRoot = resolve(currentDir, "../..");

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `file:${resolve(apiRoot, "prisma/dev.db")}`;
}

export const prisma = new PrismaClient();
