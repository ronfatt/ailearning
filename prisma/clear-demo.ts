import { PrismaClient } from "@prisma/client";

import { cleanupDemoData } from "@/lib/server/demo-seed";

const prisma = new PrismaClient();

async function main() {
  await cleanupDemoData(prisma);
  console.log("Demo data cleared.");
}

main()
  .catch((error) => {
    console.error("Demo cleanup failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
