import {
  AccountStatus,
  ApprovalStatus,
  ClassSessionStatus,
  ClassStatus,
  ClassType,
  StudyPlanStatus,
  UserRole,
} from "@prisma/client";
import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/auth-session";
import { buildPendingStudentEmail } from "@/lib/account-links";
import { prisma } from "@/lib/prisma";
import {
  ApiError,
  assertRecord,
  optionalString,
  requireString,
  toErrorResponse,
  toPrismaJsonValue,
} from "@/lib/server/workflow-api";

function slugifySubjectCode(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

function getDefaultStudyPlanTopics(subjectName: string) {
  const normalized = subjectName.toLowerCase();

  if (normalized.includes("math")) {
    return [
      { key: "foundations", label: "Concept Foundations", approved: true },
      { key: "guided-practice", label: "Guided Practice", approved: true },
      { key: "word-problems", label: "Word Problems", approved: false },
    ];
  }

  if (normalized.includes("english")) {
    return [
      { key: "reading", label: "Reading Comprehension", approved: true },
      { key: "writing", label: "Writing Practice", approved: true },
      { key: "revision", label: "Vocabulary Revision", approved: false },
    ];
  }

  return [
    { key: "foundations", label: "Core Foundations", approved: true },
    { key: "guided-practice", label: "Guided Practice", approved: true },
    { key: "revision", label: "Revision Practice", approved: false },
  ];
}

function parseWeekdayFromText(value: string) {
  const normalized = value.toLowerCase();
  const weekdays = [
    { day: 0, tokens: ["sun", "sunday"] },
    { day: 1, tokens: ["mon", "monday"] },
    { day: 2, tokens: ["tue", "tues", "tuesday"] },
    { day: 3, tokens: ["wed", "wednesday"] },
    { day: 4, tokens: ["thu", "thur", "thurs", "thursday"] },
    { day: 5, tokens: ["fri", "friday"] },
    { day: 6, tokens: ["sat", "saturday"] },
  ];

  for (const weekday of weekdays) {
    if (weekday.tokens.some((token) => normalized.includes(token))) {
      return weekday.day;
    }
  }

  return null;
}

function parseTimeFromText(value: string) {
  const match = value.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);

  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = match[2] ? Number(match[2]) : 0;
  const meridiem = match[3]?.toLowerCase();

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return null;
  }

  if (meridiem === "pm" && hour < 12) {
    hour += 12;
  }

  if (meridiem === "am" && hour === 12) {
    hour = 0;
  }

  if (hour > 23 || minute > 59) {
    return null;
  }

  return { hour, minute };
}

function buildKickoffSessionTimeFromHints(scheduleHints: string[]) {
  const utcOffsetHours = 8;
  const nowUtc = new Date();
  const nowLocal = new Date(nowUtc.getTime() + utcOffsetHours * 60 * 60 * 1000);
  const primaryHint = scheduleHints.find((hint) => hint.trim().length > 0) ?? "";
  const parsedWeekday = primaryHint ? parseWeekdayFromText(primaryHint) : null;
  const parsedTime = primaryHint ? parseTimeFromText(primaryHint) : null;

  const localTarget = new Date(nowLocal);
  localTarget.setUTCSeconds(0, 0);

  if (parsedWeekday !== null) {
    const diff = (parsedWeekday - localTarget.getUTCDay() + 7) % 7 || 7;
    localTarget.setUTCDate(localTarget.getUTCDate() + diff);
  } else {
    localTarget.setUTCDate(localTarget.getUTCDate() + 2);
  }

  localTarget.setUTCHours(parsedTime?.hour ?? 20, parsedTime?.minute ?? 0, 0, 0);

  if (localTarget.getTime() <= nowLocal.getTime()) {
    localTarget.setUTCDate(localTarget.getUTCDate() + 7);
  }

  const startsAt = new Date(
    localTarget.getTime() - utcOffsetHours * 60 * 60 * 1000,
  );
  const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000);

  return { startsAt, endsAt };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new ApiError(
        "Database access is required before fulfilling enrollment drafts.",
      );
    }

    const session = await getCurrentSession();

    if (!session.isAuthenticated || session.user.role !== "Admin") {
      throw new ApiError("Admin access is required to fulfill enrollment drafts.", 403);
    }

    const { id } = await params;
    const body = assertRecord(await request.json());
    const tutorId = requireString(body, "tutorId");
    const classMode = requireString(body, "classMode");
    const classId = optionalString(body, "classId");
    const newClassTitle = optionalString(body, "newClassTitle");
    const newClassSchedule = optionalString(body, "newClassSchedule");

    if (classMode !== "existing" && classMode !== "new") {
      throw new ApiError('Field "classMode" must be either "existing" or "new".');
    }

    const result = await prisma.$transaction(async (tx) => {
      const draft = await tx.enrollmentDraft.findUnique({
        where: { id },
      });

      if (!draft) {
        throw new ApiError("Enrollment draft not found.", 404);
      }

      const tutor = await tx.user.findUnique({
        where: { id: tutorId },
        select: { id: true, role: true, fullName: true },
      });

      if (!tutor || tutor.role !== UserRole.TUTOR) {
        throw new ApiError("Selected tutor is invalid.", 404);
      }

      const subjectName = draft.subjectFocus.trim();

      let subject = await tx.subject.findFirst({
        where: {
          name: {
            equals: subjectName,
            mode: "insensitive",
          },
        },
      });

      if (!subject) {
        subject = await tx.subject.create({
          data: {
            code: slugifySubjectCode(subjectName),
            name: subjectName,
            description: `${subjectName} subject created during enrollment fulfillment.`,
          },
        });
      }

      let studentId = draft.studentId;

      if (!studentId) {
        const booking = await tx.bookingRequest.findUnique({
          where: { id: draft.bookingRequestId },
        });

        const createdStudent = await tx.user.create({
          data: {
            email:
              booking?.studentEmail ??
              buildPendingStudentEmail(draft.studentName, draft.parentUserId ?? draft.id),
            fullName: draft.studentName,
            role: UserRole.STUDENT,
            accountStatus: AccountStatus.INVITED,
            onboardingCompleted: false,
            profileData: toPrismaJsonValue({
              source: "admin_fulfillment",
              studentLevel: draft.studentLevel,
              subjectFocus: draft.subjectFocus,
              pendingInvite: !booking?.studentEmail,
            }),
          },
          select: { id: true },
        });

        studentId = createdStudent.id;
      }

      let targetClassId = classId ?? null;

      if (classMode === "existing") {
        if (!targetClassId) {
          throw new ApiError("Please select an existing class.");
        }

        const existingClass = await tx.class.findUnique({
          where: { id: targetClassId },
          select: { id: true, tutorId: true },
        });

        if (!existingClass || existingClass.tutorId !== tutorId) {
          throw new ApiError("The selected class does not belong to the chosen tutor.", 409);
        }
      } else {
        const title =
          newClassTitle?.trim() ||
          `${draft.studentLevel} ${draft.subjectFocus} Guided Class`;
        const schedule =
          newClassSchedule?.trim() || draft.preferredTime?.trim() || "Schedule to confirm";

        const createdClass = await tx.class.create({
          data: {
            tutorId,
            subjectId: subject.id,
            title,
            description: `Created from enrollment draft for ${draft.studentName}.`,
            schedule,
            classType: ClassType.LIVE_ONLINE,
            status: ClassStatus.ACTIVE,
          },
          select: { id: true },
        });

        targetClassId = createdClass.id;
      }

      if (!targetClassId || !studentId) {
        throw new ApiError("Enrollment draft could not be completed.");
      }

      await tx.classEnrollment.upsert({
        where: {
          classId_studentId: {
            classId: targetClassId,
            studentId,
          },
        },
        update: {
          status: "ACTIVE",
        },
        create: {
          classId: targetClassId,
          studentId,
          status: "ACTIVE",
        },
      });

      const targetClass = await tx.class.findUnique({
        where: { id: targetClassId },
        include: {
          sessions: {
            where: {
              status: {
                in: [ClassSessionStatus.SCHEDULED, ClassSessionStatus.LIVE],
              },
            },
            orderBy: { startsAt: "asc" },
            take: 1,
          },
        },
      });

      if (!targetClass) {
        throw new ApiError("Assigned class could not be loaded after enrollment.", 404);
      }

      if (targetClass.sessions.length === 0) {
        const kickoff = buildKickoffSessionTimeFromHints([
          targetClass.schedule,
          draft.preferredTime ?? "",
          newClassSchedule ?? "",
        ]);

        await tx.classSession.create({
          data: {
            classId: targetClass.id,
            title: `${targetClass.title} kickoff session`,
            startsAt: kickoff.startsAt,
            endsAt: kickoff.endsAt,
            status: ClassSessionStatus.SCHEDULED,
            liveRoomUrl: `https://demo.ailearningos.my/class/${targetClass.id}-kickoff`,
          },
        });
      }

      const existingStudyPlan = await tx.studyPlan.findFirst({
        where: {
          studentId,
          subjectId: subject.id,
          classId: targetClass.id,
          status: StudyPlanStatus.ACTIVE,
        },
        include: {
          revisionTopics: true,
        },
        orderBy: { updatedAt: "desc" },
      });

      if (!existingStudyPlan) {
        const createdPlan = await tx.studyPlan.create({
          data: {
            classId: targetClass.id,
            tutorId,
            studentId,
            subjectId: subject.id,
            title: `${draft.studentName} ${subject.name} Start Plan`,
            planType: "ENROLLMENT_START",
            status: StudyPlanStatus.ACTIVE,
            approvalStatus: ApprovalStatus.DRAFT,
            aiDraft: toPrismaJsonValue({
              summary: `Starter study plan created automatically when ${draft.studentName} was enrolled into ${targetClass.title}.`,
            }),
            tutorEditedContent: toPrismaJsonValue({
              welcomeNote: `${tutor.fullName} will guide the first cycle through class, homework, and revision.`,
            }),
            generatedByAiAt: new Date(),
            versionHistory: toPrismaJsonValue([
              "auto-created from enrollment fulfillment",
              "awaiting tutor approval before student revision opens",
            ]),
            revisionTopics: {
              create: getDefaultStudyPlanTopics(subject.name).map((topic, index) => ({
                topicKey: topic.key,
                topicLabel: topic.label,
                accessApproved: topic.approved,
                sequenceOrder: index + 1,
              })),
            },
          },
        });

        await tx.studentMastery.createMany({
          data: getDefaultStudyPlanTopics(subject.name).map((topic) => ({
            studentId,
            subjectId: subject.id,
            topicId: topic.key,
            topicLabel: topic.label,
            masteryScore: topic.approved ? 55 : 40,
            updatedByAiAt: new Date(),
            reviewedByTutorAt: new Date(),
            tutorReviewNotes: `Starter mastery baseline created with ${createdPlan.title}.`,
          })),
          skipDuplicates: true,
        });
      }

      if (draft.parentUserId) {
        const existingParentMessage = await tx.parentMessage.findFirst({
          where: {
            parentId: draft.parentUserId,
            studentId,
            tutorId,
            messageChannel: "IN_APP_WELCOME",
          },
          orderBy: { createdAt: "desc" },
        });

        if (!existingParentMessage) {
          await tx.parentMessage.create({
            data: {
              parentId: draft.parentUserId,
              studentId,
              tutorId,
              messageChannel: "IN_APP_WELCOME",
              aiDraft: toPrismaJsonValue({
                title: "Enrollment confirmed",
                summary: `${draft.studentName} is now enrolled in ${targetClass.title}.`,
              }),
              tutorEditedContent: toPrismaJsonValue({
                body: `${tutor.fullName} will guide ${draft.studentName} in ${subject.name}. The first class is now scheduled and the starter study plan is waiting for tutor approval before revision opens.`,
              }),
              approvalStatus: ApprovalStatus.APPROVED,
              generatedByAiAt: new Date(),
              reviewedByTutorAt: new Date(),
              approvedByTutorId: tutorId,
              approvedAt: new Date(),
              sentAt: new Date(),
              versionHistory: toPrismaJsonValue([
                "auto-created from enrollment fulfillment",
              ]),
            },
          });
        }
      }

      const updatedDraft = await tx.enrollmentDraft.update({
        where: { id: draft.id },
        data: {
          studentId,
          matchedTutorId: tutorId,
          classId: targetClassId,
          status: "ENROLLED",
          fulfilledAt: new Date(),
        },
        select: {
          id: true,
          status: true,
          classId: true,
          matchedTutorId: true,
        },
      });

      return updatedDraft;
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    return toErrorResponse(error);
  }
}
