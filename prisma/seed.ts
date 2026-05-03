import { PrismaClient } from "@prisma/client";

import { resetDemoData } from "@/lib/server/demo-seed";

const prisma = new PrismaClient();

async function main() {
  if (process.env.ALLOW_DEMO_SEED !== "true") {
    console.log(
      "Skipping demo seed. Use `npm run db:seed:demo` only when you intentionally want demo data.",
    );
    return;
  }

  const result = await resetDemoData(prisma);

  console.log("Demo seed complete.");
  console.log(`Tutor ID: ${result.tutorId}`);
  console.log(`Class ID: ${result.classId}`);
}

main()
  .catch((error) => {
    console.error("Demo seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
