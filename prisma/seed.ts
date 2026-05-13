import { PrismaClient } from "@prisma/client";

import { seedCurriculumData } from "@/lib/server/curriculum-seed";

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
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
