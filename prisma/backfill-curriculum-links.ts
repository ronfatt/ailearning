import { PrismaClient } from "@prisma/client";

import { normalizeTopicReferenceForSubject } from "@/lib/server/curriculum-topic-links";

const prisma = new PrismaClient();

async function main() {
  const mathSubjects = await prisma.subject.findMany({
    where: {
      OR: [{ code: "MATH-KSSM" }, { name: { contains: "math", mode: "insensitive" } }],
    },
    select: {
      id: true,
      code: true,
      name: true,
    },
  });

  const mathSubjectIds = mathSubjects.map((subject) => subject.id);

  if (mathSubjectIds.length === 0) {
    console.log("No math subjects found. Nothing to backfill.");
    return;
  }

  const studyPlanTopics = await prisma.studyPlanTopic.findMany({
    where: {
      studyPlan: {
        subjectId: {
          in: mathSubjectIds,
        },
      },
    },
    include: {
      studyPlan: {
        select: {
          id: true,
          subjectId: true,
          title: true,
        },
      },
    },
  });

  const masteryRecords = await prisma.studentMastery.findMany({
    where: {
      subjectId: {
        in: mathSubjectIds,
      },
    },
    select: {
      id: true,
      subjectId: true,
      topicId: true,
      topicLabel: true,
    },
  });

  let updatedStudyPlanTopics = 0;
  let updatedMasteryRecords = 0;

  await prisma.$transaction(async (tx) => {
    for (const topic of studyPlanTopics) {
      const normalized = await normalizeTopicReferenceForSubject(
        tx,
        topic.studyPlan.subjectId,
        topic.topicKey,
        topic.topicLabel,
      );

      if (
        normalized.topicKey !== topic.topicKey ||
        normalized.topicLabel !== topic.topicLabel
      ) {
        await tx.studyPlanTopic.update({
          where: { id: topic.id },
          data: {
            topicKey: normalized.topicKey,
            topicLabel: normalized.topicLabel,
          },
        });
        updatedStudyPlanTopics += 1;
      }
    }

    for (const mastery of masteryRecords) {
      const normalized = await normalizeTopicReferenceForSubject(
        tx,
        mastery.subjectId,
        mastery.topicId,
        mastery.topicLabel,
      );

      if (
        normalized.topicKey !== mastery.topicId ||
        normalized.topicLabel !== mastery.topicLabel
      ) {
        await tx.studentMastery.update({
          where: { id: mastery.id },
          data: {
            topicId: normalized.topicKey,
            topicLabel: normalized.topicLabel,
          },
        });
        updatedMasteryRecords += 1;
      }
    }
  });

  console.log("Curriculum link backfill complete.");
  console.log(`Math subjects scanned: ${mathSubjects.length}`);
  console.log(`Study plan topics updated: ${updatedStudyPlanTopics}`);
  console.log(`Student mastery rows updated: ${updatedMasteryRecords}`);
}

main()
  .catch((error) => {
    console.error("Curriculum link backfill failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
