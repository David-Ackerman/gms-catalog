import { PrismaClient } from "@/generated/prisma/client";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}

export const prisma = new PrismaClient();
