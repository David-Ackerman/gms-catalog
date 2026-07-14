import { prisma } from "@/lib/prisma";
import { resetAndSeedDatabase } from "@/seed";

async function main() {
  const result = await resetAndSeedDatabase();
  console.log(`Database reset complete. Seeded ${result.created} games.`);
}

main()
  .catch((error) => {
    console.error("Database seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
