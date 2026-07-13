import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/utils/hash";

const seedGames = [
  {
    title: "Hades",
    slug: "hades",
    description: "A fast-paced action roguelike set in Greek mythology.",
    developer: "Supergiant Games",
    publisher: "Supergiant Games",
    genres: "Action, Roguelike",
    platforms: "PC, Switch, PlayStation, Xbox",
    coverUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    releaseDate: new Date("2020-09-17"),
  },
  {
    title: "Portal 2",
    slug: "portal-2",
    description:
      "A mind-bending first-person puzzle game with clever mechanics.",
    developer: "Valve",
    publisher: "Valve",
    genres: "Puzzle, Adventure",
    platforms: "PC, PlayStation, Xbox",
    coverUrl:
      "https://images.unsplash.com/photo-1511882155315-9f8f7cb02d6b?auto=format&fit=crop&w=800&q=80",
    releaseDate: new Date("2011-04-18"),
  },
  {
    title: "Celeste",
    slug: "celeste",
    description:
      "A challenging platformer focused on precision and emotional storytelling.",
    developer: "Maddy Makes Games",
    publisher: "Maddy Makes Games",
    genres: "Platformer, Indie",
    platforms: "PC, Switch, PlayStation, Xbox",
    coverUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    releaseDate: new Date("2018-01-25"),
  },
  {
    title: "Baldur's Gate 3",
    slug: "baldurs-gate-3",
    description: "A story-rich RPG with deep choice-driven gameplay.",
    developer: "Larian Studios",
    publisher: "Larian Studios",
    genres: "RPG, Strategy",
    platforms: "PC, PlayStation, Xbox",
    coverUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    releaseDate: new Date("2023-08-03"),
  },
  {
    title: "Stardew Valley",
    slug: "stardew-valley",
    description: "A relaxing farming and life sim with endless customization.",
    developer: "ConcernedApe",
    publisher: "ConcernedApe",
    genres: "Simulation, Farming",
    platforms: "PC, Switch, PlayStation, Xbox",
    coverUrl:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc2?auto=format&fit=crop&w=800&q=80",
    releaseDate: new Date("2016-02-26"),
  },
  {
    title: "The Legend of Zelda: Breath of the Wild",
    slug: "zelda-breath-of-the-wild",
    description:
      "An open-world adventure with exploration and physics-driven puzzles.",
    developer: "Nintendo",
    publisher: "Nintendo",
    genres: "Adventure, Action",
    platforms: "Switch",
    coverUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    releaseDate: new Date("2017-03-03"),
  },
  {
    title: "Resident Evil 4",
    slug: "resident-evil-4",
    description: "A tense survival-horror action game with tight pacing.",
    developer: "Capcom",
    publisher: "Capcom",
    genres: "Action, Horror",
    platforms: "PC, PlayStation, Xbox",
    coverUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    releaseDate: new Date("2023-03-24"),
  },
  {
    title: "Minecraft",
    slug: "minecraft",
    description: "A sandbox game focused on building, exploring, and survival.",
    developer: "Mojang Studios",
    publisher: "Mojang Studios",
    genres: "Sandbox, Survival",
    platforms: "PC, Switch, PlayStation, Xbox",
    coverUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    releaseDate: new Date("2011-11-18"),
  },
  {
    title: "Disco Elysium",
    slug: "disco-elysium",
    description:
      "A narrative detective RPG with rich writing and worldbuilding.",
    developer: "ZA/UM",
    publisher: "ZA/UM",
    genres: "RPG, Narrative",
    platforms: "PC, PlayStation, Xbox",
    coverUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    releaseDate: new Date("2019-10-15"),
  },
  {
    title: "Sekiro: Shadows Die Twice",
    slug: "sekiro",
    description: "A brutal action-adventure game with precise swordplay.",
    developer: "FromSoftware",
    publisher: "Activision",
    genres: "Action, Adventure",
    platforms: "PC, PlayStation, Xbox",
    coverUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    releaseDate: new Date("2019-03-22"),
  },
  {
    title: "Tetris Effect",
    slug: "tetris-effect",
    description: "A modern take on Tetris with immersive audiovisual design.",
    developer: "Monstars Inc.",
    publisher: "Enhance",
    genres: "Puzzle, Arcade",
    platforms: "PC, PlayStation, Switch",
    coverUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    releaseDate: new Date("2018-11-09"),
  },
];

export async function seedDatabase() {
  const existingAdmin = await prisma.user.findFirst({
    where: { email: "admin@gms-catalog.com" },
  });

  if (!existingAdmin) {
    const adminPassword = await hashPassword("Admin123!");
    await prisma.user.create({
      data: {
        name: "Administrator",
        email: "admin@gms-catalog.com",
        password: adminPassword,
        role: "ADMIN",
      },
    });
  }

  const existingGames = await prisma.game.count();
  if (existingGames > 0) {
    return { created: 0, games: existingGames };
  }

  await prisma.game.createMany({
    data: seedGames.map((game) => ({
      ...game,
      isActive: true,
    })),
  });

  return { created: seedGames.length, games: seedGames.length };
}
