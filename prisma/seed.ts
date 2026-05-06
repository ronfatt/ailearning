import { PrismaClient } from "@prisma/client";

import { seedCurriculumData } from "@/lib/server/curriculum-seed";
import { resetDemoData } from "@/lib/server/demo-seed";

const prisma = new PrismaClient();

async function main() {
  const curriculumResult = await seedCurriculumData(prisma);

  console.log("Curriculum seed complete.");
  console.log(`Subject ID: ${curriculumResult.subjectId}`);
  console.log(`Primary level ID: ${curriculumResult.levelId}`);
  if ("levelIds" in curriculumResult) {
    console.log(`Levels seeded: ${curriculumResult.levelIds.join(", ")}`);
  }
  console.log(`Domains seeded: ${curriculumResult.domainCount}`);
  console.log(`Topics seeded: ${curriculumResult.topicCount}`);
  console.log(`Mastery nodes seeded: ${curriculumResult.masteryNodeCount}`);

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
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
