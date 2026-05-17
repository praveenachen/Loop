import { PrismaClient } from "@prisma/client";

import { resetAndSeed } from "../lib/dev-seed";

const prisma = new PrismaClient();

async function main() {
  await resetAndSeed(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
