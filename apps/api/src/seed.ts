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
      "https://assets.nintendo.com/image/upload/q_auto/f_auto/store/software/switch/70010000033131/dbc8c55a21688b446a5c57711b726956483a14ef8c5ddb861f897c0595ccb6b5",
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
      "https://assets-prd.ignimgs.com/2021/12/08/portal2-1638924084230.jpg?crop=1%3A1%2Csmart&format=jpg&auto=webp&quality=80",
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
      "https://playerselect.com.br/wp-content/uploads/2023/10/celeste-capa.jpg",
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
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb9Rb2RFXM87C_dfyhPkxpc9-aRhLe6vZHA-xy0hIqhT8ZXuHFV-oMdhk&s=10",
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
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/capsule_616x353.jpg?t=1754692865",
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
      "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/store/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58",
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
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi2rXfWxCUTaqiA3GmChfkZEHb64SVcbEFpopWrQMPZOwsJAK2KkNX0KY&s=10",
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
      "https://sm.ign.com/ign_br/screenshot/default/tmp-cgtjz0-bb7faa1483782db2-minecraft-horizontal-key-art_n1te.jpg",
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
      "https://assets.nuuvem.com/image/upload/v1/products/628b74efbfe81a00159bd3cb/sharing_images/rbthvpkq5qjtzhmhl4xg.jpg",
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
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ6gDdM5hOdprFUM5TiekqiPXwK4skMPcAU1af_Qb6itj4TvaZ7L0MbH8&s=10",
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
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI1pQ9p34yt3JRCqidSmfjS862iCAtJcp9OVbRFCo4jZCK-WA0BC5XBDU&s=10",
    releaseDate: new Date("2018-11-09"),
  },
];

async function createSeedData() {
  const adminPassword = await hashPassword("Admin123!");
  await prisma.user.create({
    data: {
      name: "Administrator",
      email: "admin@gms-catalog.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.game.createMany({
    data: seedGames.map((game) => ({
      ...game,
      isActive: true,
    })),
  });
}

export async function seedDatabase() {
  const existingGames = await prisma.game.count();
  if (existingGames > 0) {
    return { created: 0, games: existingGames };
  }

  await createSeedData();

  return { created: seedGames.length, games: seedGames.length };
}

export async function resetAndSeedDatabase() {
  await prisma.playedGame.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();

  await createSeedData();

  return { created: seedGames.length, games: seedGames.length, reset: true };
}
