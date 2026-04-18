import {
  AccountStatus,
  ApprovalStatus,
  AttendanceStatus,
  ClassStatus,
  ClassSessionStatus,
  ClassType,
  EnrollmentStatus,
  HomeworkLifecycleStatus,
  IntakeStatus,
  PrismaClient,
  StudyPlanStatus,
  UserRole,
} from "@prisma/client";

import { hashPassword } from "@/lib/auth-security";

export const demoIds = {
  admin: "admin_demo_01",
  tutor: "tutor_farrah_01",
  studentAina: "student_aina_01",
  studentHafiz: "student_hafiz_01",
  parentAina: "parent_aina_01",
  subjectMath: "subject_spm_math_01",
  classForm5: "class_form5_algebra_sprint_01",
  enrollmentAina: "enrollment_aina_01",
  enrollmentHafiz: "enrollment_hafiz_01",
  classSessionPastOne: "class_session_past_01",
  classSessionPastTwo: "class_session_past_02",
  classSessionUpcoming: "class_session_upcoming_01",
  attendanceAinaPastOne: "attendance_aina_01",
  attendanceAinaPastTwo: "attendance_aina_02",
  attendanceHafizPastOne: "attendance_hafiz_01",
  studyPlanAina: "study_plan_aina_01",
  studyTopicWordProblems: "study_topic_aina_01",
  studyTopicLinear: "study_topic_aina_02",
  studyTopicRatios: "study_topic_aina_03",
  masteryWordProblems: "mastery_aina_01",
  masteryLinearEquations: "mastery_aina_02",
  masteryRatios: "mastery_aina_03",
  lessonDraft: "lesson_plan_demo_01",
  lessonReviewed: "lesson_plan_demo_02",
  homeworkDraft: "homework_demo_01",
  homeworkApproved: "homework_demo_02",
  homeworkHafizAssigned: "homework_demo_03",
  homeworkSubmissionApproved: "homework_submission_aina_01",
  homeworkSubmissionPendingReview: "homework_submission_hafiz_01",
  readinessHafiz: "readiness_hafiz_01",
  parentReportDraft: "parent_report_demo_01",
  parentReportApproved: "parent_report_demo_02",
  bookingRequestAina: "booking_request_demo_01",
  tutorApplicationMath: "tutor_application_demo_01",
} as const;

export async function cleanupDemoData(prisma: PrismaClient) {
  await prisma.parentStudentLink.deleteMany({
    where: {
      parentId: demoIds.parentAina,
    },
  });

  await prisma.authSession.deleteMany({
    where: {
      userId: {
        in: [
          demoIds.admin,
          demoIds.tutor,
          demoIds.studentAina,
          demoIds.studentHafiz,
          demoIds.parentAina,
        ],
      },
    },
  });

  await prisma.readinessCheckSubmission.deleteMany({
    where: {
      id: { in: [demoIds.readinessHafiz] },
    },
  });

  await prisma.homeworkSubmission.deleteMany({
    where: {
      id: {
        in: [
          demoIds.homeworkSubmissionApproved,
          demoIds.homeworkSubmissionPendingReview,
        ],
      },
    },
  });

  await prisma.parentReport.deleteMany({
    where: {
      id: { in: [demoIds.parentReportDraft, demoIds.parentReportApproved] },
    },
  });

  await prisma.bookingRequest.deleteMany({
    where: {
      id: { in: [demoIds.bookingRequestAina] },
    },
  });

  await prisma.enrollmentDraft.deleteMany({
    where: {
      bookingRequestId: demoIds.bookingRequestAina,
    },
  });

  await prisma.tutorApplication.deleteMany({
    where: {
      id: { in: [demoIds.tutorApplicationMath] },
    },
  });

  await prisma.homeworkAssignment.deleteMany({
    where: {
      id: {
        in: [
          demoIds.homeworkDraft,
          demoIds.homeworkApproved,
          demoIds.homeworkHafizAssigned,
        ],
      },
    },
  });

  await prisma.classSummary.deleteMany({
    where: { tutorId: demoIds.tutor },
  });

  await prisma.studentMastery.deleteMany({
    where: {
      id: {
        in: [
          demoIds.masteryWordProblems,
          demoIds.masteryLinearEquations,
          demoIds.masteryRatios,
        ],
      },
    },
  });

  await prisma.studyPlanTopic.deleteMany({
    where: {
      id: {
        in: [
          demoIds.studyTopicWordProblems,
          demoIds.studyTopicLinear,
          demoIds.studyTopicRatios,
        ],
      },
    },
  });

  await prisma.studyPlan.deleteMany({
    where: {
      id: demoIds.studyPlanAina,
    },
  });

  await prisma.lessonPlan.deleteMany({
    where: { id: { in: [demoIds.lessonDraft, demoIds.lessonReviewed] } },
  });

  await prisma.attendanceRecord.deleteMany({
    where: {
      id: {
        in: [
          demoIds.attendanceAinaPastOne,
          demoIds.attendanceAinaPastTwo,
          demoIds.attendanceHafizPastOne,
        ],
      },
    },
  });

  await prisma.classSession.deleteMany({
    where: {
      id: {
        in: [
          demoIds.classSessionPastOne,
          demoIds.classSessionPastTwo,
          demoIds.classSessionUpcoming,
        ],
      },
    },
  });

  await prisma.classEnrollment.deleteMany({
    where: { id: { in: [demoIds.enrollmentAina, demoIds.enrollmentHafiz] } },
  });

  await prisma.class.deleteMany({
    where: { id: demoIds.classForm5 },
  });

  await prisma.subject.deleteMany({
    where: { id: demoIds.subjectMath },
  });

  await prisma.user.deleteMany({
    where: {
      id: {
        in: [
          demoIds.admin,
          demoIds.tutor,
          demoIds.studentAina,
          demoIds.studentHafiz,
          demoIds.parentAina,
        ],
      },
    },
  });
}

export async function seedDemoData(prisma: PrismaClient) {
  const seededPasswordHash = await hashPassword("Password123!");

  await prisma.user.createMany({
    data: [
      {
        id: demoIds.admin,
        email: "admin@ailearningos.demo",
        fullName: "Demo Admin",
        role: UserRole.ADMIN,
        passwordHash: seededPasswordHash,
        accountStatus: AccountStatus.ACTIVE,
        onboardingCompleted: true,
      },
      {
        id: demoIds.tutor,
        email: "farah@ailearningos.demo",
        fullName: "Teacher Farah",
        role: UserRole.TUTOR,
        phoneNumber: "+60 12-345 6789",
        passwordHash: seededPasswordHash,
        accountStatus: AccountStatus.ACTIVE,
        onboardingCompleted: true,
      },
      {
        id: demoIds.studentAina,
        email: "aina@ailearningos.demo",
        fullName: "Aina Sofia",
        role: UserRole.STUDENT,
        passwordHash: seededPasswordHash,
        accountStatus: AccountStatus.ACTIVE,
        onboardingCompleted: true,
      },
      {
        id: demoIds.studentHafiz,
        email: "hafiz@ailearningos.demo",
        fullName: "Hafiz Rahman",
        role: UserRole.STUDENT,
        passwordHash: seededPasswordHash,
        accountStatus: AccountStatus.ACTIVE,
        onboardingCompleted: true,
      },
      {
        id: demoIds.parentAina,
        email: "parent.aina@ailearningos.demo",
        fullName: "Nurul Sofia",
        role: UserRole.PARENT,
        passwordHash: seededPasswordHash,
        accountStatus: AccountStatus.ACTIVE,
        onboardingCompleted: true,
      },
    ],
  });

  await prisma.parentStudentLink.create({
    data: {
      parentId: demoIds.parentAina,
      studentId: demoIds.studentAina,
      relationship: "Mother",
    },
  });

  await prisma.subject.create({
    data: {
      id: demoIds.subjectMath,
      code: "SPM-MATH",
      name: "SPM Mathematics",
      description: "Malaysia SPM mathematics subject for tutor-led online tuition.",
    },
  });

  await prisma.class.create({
    data: {
      id: demoIds.classForm5,
      tutorId: demoIds.tutor,
      subjectId: demoIds.subjectMath,
      title: "Form 5 Algebra Sprint",
      description: "Teacher-led evening class focused on algebra and word problems.",
      schedule: "Mondays and Thursdays, 8:00 PM",
      classType: ClassType.LIVE_ONLINE,
      status: ClassStatus.ACTIVE,
    },
  });

  await prisma.classEnrollment.createMany({
    data: [
      {
        id: demoIds.enrollmentAina,
        classId: demoIds.classForm5,
        studentId: demoIds.studentAina,
        status: EnrollmentStatus.ACTIVE,
      },
      {
        id: demoIds.enrollmentHafiz,
        classId: demoIds.classForm5,
        studentId: demoIds.studentHafiz,
        status: EnrollmentStatus.ACTIVE,
      },
    ],
  });

  await prisma.classSession.createMany({
    data: [
      {
        id: demoIds.classSessionPastOne,
        classId: demoIds.classForm5,
        title: "Algebra translation clinic",
        startsAt: new Date("2026-04-01T12:00:00.000Z"),
        endsAt: new Date("2026-04-01T13:00:00.000Z"),
        liveRoomUrl: "https://demo.ailearningos.my/class/farah-algebra-1",
        participationRate: 0.87,
        status: ClassSessionStatus.COMPLETED,
      },
      {
        id: demoIds.classSessionPastTwo,
        classId: demoIds.classForm5,
        title: "Simultaneous equations practice",
        startsAt: new Date("2026-04-03T12:00:00.000Z"),
        endsAt: new Date("2026-04-03T13:00:00.000Z"),
        liveRoomUrl: "https://demo.ailearningos.my/class/farah-algebra-2",
        participationRate: 0.91,
        status: ClassSessionStatus.COMPLETED,
      },
      {
        id: demoIds.classSessionUpcoming,
        classId: demoIds.classForm5,
        title: "Live class: word problems sprint",
        startsAt: new Date("2026-04-07T12:00:00.000Z"),
        endsAt: new Date("2026-04-07T13:00:00.000Z"),
        liveRoomUrl: "https://demo.ailearningos.my/class/farah-algebra-3",
        status: ClassSessionStatus.SCHEDULED,
      },
    ],
  });

  await prisma.attendanceRecord.createMany({
    data: [
      {
        id: demoIds.attendanceAinaPastOne,
        classSessionId: demoIds.classSessionPastOne,
        studentId: demoIds.studentAina,
        status: AttendanceStatus.PRESENT,
        participationScore: 0.82,
      },
      {
        id: demoIds.attendanceAinaPastTwo,
        classSessionId: demoIds.classSessionPastTwo,
        studentId: demoIds.studentAina,
        status: AttendanceStatus.LATE,
        participationScore: 0.77,
      },
      {
        id: demoIds.attendanceHafizPastOne,
        classSessionId: demoIds.classSessionPastTwo,
        studentId: demoIds.studentHafiz,
        status: AttendanceStatus.PRESENT,
        participationScore: 0.88,
      },
    ],
  });

  await prisma.lessonPlan.createMany({
    data: [
      {
        id: demoIds.lessonDraft,
        classId: demoIds.classForm5,
        tutorId: demoIds.tutor,
        subjectId: demoIds.subjectMath,
        title: "Lesson objective draft for narrative-to-equation translation",
        objectives: [
          "Turn word problems into equations",
          "Solve two-step algebra questions",
        ],
        aiDraft: {
          summary:
            "AI draft recommends a warm-up on narrative translation before solving equations.",
        },
        tutorEditedContent: {
          warmup: "Use 3 short taxi fare examples before the main lesson.",
        },
        approvalStatus: ApprovalStatus.DRAFT,
        generatedByAiAt: new Date("2026-04-03T09:00:00.000Z"),
        versionHistory: ["v1 AI draft"],
      },
      {
        id: demoIds.lessonReviewed,
        classId: demoIds.classForm5,
        tutorId: demoIds.tutor,
        subjectId: demoIds.subjectMath,
        title: "Warm-up quiz draft for algebra word problems",
        objectives: ["Check class readiness before live teaching begins"],
        aiDraft: {
          summary: "5-question warm-up for readiness check",
        },
        tutorEditedContent: {
          tutorNote: "Question 4 simplified for weaker students.",
        },
        approvalStatus: ApprovalStatus.TUTOR_REVIEWED,
        generatedByAiAt: new Date("2026-04-03T09:20:00.000Z"),
        reviewedByTutorAt: new Date("2026-04-03T10:00:00.000Z"),
        versionHistory: ["v1 AI draft", "v2 tutor simplified question 4"],
      },
    ],
  });

  await prisma.studyPlan.create({
    data: {
      id: demoIds.studyPlanAina,
      classId: demoIds.classForm5,
      tutorId: demoIds.tutor,
      studentId: demoIds.studentAina,
      subjectId: demoIds.subjectMath,
      title: "Aina weekly algebra recovery plan",
      planType: "REVISION",
      status: StudyPlanStatus.ACTIVE,
      approvalStatus: ApprovalStatus.APPROVED,
      aiDraft: {
        summary:
          "AI suggests three short revision bursts on narrative translation and linear equations.",
      },
      tutorEditedContent: {
        tutorNote: "Keep tasks short and focused before the next live class.",
      },
      generatedByAiAt: new Date("2026-04-03T10:30:00.000Z"),
      reviewedByTutorAt: new Date("2026-04-03T11:00:00.000Z"),
      approvedByTutorId: demoIds.tutor,
      approvedAt: new Date("2026-04-03T11:00:00.000Z"),
      versionHistory: ["v1 AI draft", "v2 tutor shortened task sequence"],
    },
  });

  await prisma.studyPlanTopic.createMany({
    data: [
      {
        id: demoIds.studyTopicWordProblems,
        studyPlanId: demoIds.studyPlanAina,
        topicKey: "word-problems",
        topicLabel: "Word Problems",
        accessApproved: true,
        sequenceOrder: 1,
      },
      {
        id: demoIds.studyTopicLinear,
        studyPlanId: demoIds.studyPlanAina,
        topicKey: "linear-equations",
        topicLabel: "Linear Equations",
        accessApproved: true,
        sequenceOrder: 2,
      },
      {
        id: demoIds.studyTopicRatios,
        studyPlanId: demoIds.studyPlanAina,
        topicKey: "ratios",
        topicLabel: "Ratios",
        accessApproved: false,
        sequenceOrder: 3,
      },
    ],
  });

  await prisma.studentMastery.createMany({
    data: [
      {
        id: demoIds.masteryWordProblems,
        studentId: demoIds.studentAina,
        subjectId: demoIds.subjectMath,
        topicId: "word-problems",
        topicLabel: "Word Problems",
        masteryScore: 42,
        updatedByAiAt: new Date("2026-04-03T13:10:00.000Z"),
        reviewedByTutorAt: new Date("2026-04-03T13:25:00.000Z"),
        tutorReviewNotes: "Needs guided translation from story format into equations.",
      },
      {
        id: demoIds.masteryLinearEquations,
        studentId: demoIds.studentAina,
        subjectId: demoIds.subjectMath,
        topicId: "linear-equations",
        topicLabel: "Linear Equations",
        masteryScore: 68,
        updatedByAiAt: new Date("2026-04-03T13:10:00.000Z"),
        reviewedByTutorAt: new Date("2026-04-03T13:25:00.000Z"),
        tutorReviewNotes: "Improving, but still slow on two-step questions.",
      },
      {
        id: demoIds.masteryRatios,
        studentId: demoIds.studentAina,
        subjectId: demoIds.subjectMath,
        topicId: "ratios",
        topicLabel: "Ratios",
        masteryScore: 81,
        updatedByAiAt: new Date("2026-04-03T13:10:00.000Z"),
        reviewedByTutorAt: new Date("2026-04-03T13:25:00.000Z"),
        tutorReviewNotes: "Stable performance. Keep as maintenance practice only.",
      },
    ],
  });

  await prisma.homeworkAssignment.createMany({
    data: [
      {
        id: demoIds.homeworkDraft,
        classId: demoIds.classForm5,
        lessonPlanId: demoIds.lessonDraft,
        studentId: demoIds.studentAina,
        tutorId: demoIds.tutor,
        generatedByAi: true,
        approvedByTutor: false,
        assignmentContent: {
          title: "Word problem revision set A",
          questions: 5,
          focus: "Narrative translation",
        },
        dueDate: new Date("2026-04-10T10:00:00.000Z"),
        status: HomeworkLifecycleStatus.DRAFT,
        approvalStatus: ApprovalStatus.DRAFT,
        generatedByAiAt: new Date("2026-04-03T11:00:00.000Z"),
        versionHistory: ["v1 AI draft"],
      },
      {
        id: demoIds.homeworkApproved,
        classId: demoIds.classForm5,
        lessonPlanId: demoIds.lessonReviewed,
        studyPlanId: demoIds.studyPlanAina,
        studentId: demoIds.studentAina,
        tutorId: demoIds.tutor,
        generatedByAi: true,
        approvedByTutor: true,
        assignmentContent: {
          title: "Post-class revision for narrative word problems",
          questions: 8,
          focus: "Short guided revision",
        },
        dueDate: new Date("2026-04-11T10:00:00.000Z"),
        status: HomeworkLifecycleStatus.ASSIGNED,
        approvalStatus: ApprovalStatus.APPROVED,
        generatedByAiAt: new Date("2026-04-03T12:00:00.000Z"),
        reviewedByTutorAt: new Date("2026-04-03T12:20:00.000Z"),
        approvedByTutorId: demoIds.tutor,
        approvedAt: new Date("2026-04-03T12:20:00.000Z"),
        versionHistory: ["v1 AI draft", "tutor approved"],
      },
      {
        id: demoIds.homeworkHafizAssigned,
        classId: demoIds.classForm5,
        lessonPlanId: demoIds.lessonReviewed,
        studentId: demoIds.studentHafiz,
        tutorId: demoIds.tutor,
        generatedByAi: true,
        approvedByTutor: true,
        assignmentContent: {
          title: "Hafiz ratio recovery set",
          questions: 6,
          focus: "Ratio simplification and checking working",
        },
        dueDate: new Date("2026-04-11T10:00:00.000Z"),
        status: HomeworkLifecycleStatus.SUBMITTED,
        approvalStatus: ApprovalStatus.APPROVED,
        generatedByAiAt: new Date("2026-04-03T12:10:00.000Z"),
        reviewedByTutorAt: new Date("2026-04-03T12:25:00.000Z"),
        approvedByTutorId: demoIds.tutor,
        approvedAt: new Date("2026-04-03T12:25:00.000Z"),
        versionHistory: ["v1 AI draft", "tutor approved"],
      },
    ],
  });

  await prisma.homeworkSubmission.create({
    data: {
      id: demoIds.homeworkSubmissionApproved,
      homeworkAssignmentId: demoIds.homeworkApproved,
      studentId: demoIds.studentAina,
      submittedAt: new Date("2026-04-03T15:30:00.000Z"),
      submissionContent: {
        completedQuestions: 8,
        note: "Student finished the set after class.",
      },
      score: 78,
      tutorFeedback: "Good recovery on questions 1 to 6. Recheck the final translation step.",
    },
  });

  await prisma.homeworkSubmission.create({
    data: {
      id: demoIds.homeworkSubmissionPendingReview,
      homeworkAssignmentId: demoIds.homeworkHafizAssigned,
      studentId: demoIds.studentHafiz,
      submittedAt: new Date("2026-04-03T16:10:00.000Z"),
      submissionContent: {
        completedQuestions: 6,
        note: "Student submitted before the next live session.",
      },
    },
  });

  await prisma.readinessCheckSubmission.create({
    data: {
      id: demoIds.readinessHafiz,
      classId: demoIds.classForm5,
      subjectId: demoIds.subjectMath,
      studentId: demoIds.studentHafiz,
      tutorId: demoIds.tutor,
      responses: {
        "word-problems": "B",
        "linear-equations": "C",
        ratios: "D",
      },
      score: 33,
      readinessLevel: "support",
      weakTopics: ["Word Problems", "Ratios"],
      aiSummary: {
        summary:
          "Hafiz needs extra support in narrative translation and ratio simplification before the next live class.",
      },
      approvalStatus: ApprovalStatus.DRAFT,
      generatedByAiAt: new Date("2026-04-03T14:00:00.000Z"),
      submittedAt: new Date("2026-04-03T14:00:00.000Z"),
      versionHistory: ["student submitted readiness check with 33% readiness"],
    },
  });

  await prisma.parentReport.createMany({
    data: [
      {
        id: demoIds.parentReportDraft,
        classId: demoIds.classForm5,
        studentId: demoIds.studentAina,
        tutorId: demoIds.tutor,
        aiSummary: {
          summary:
            "Aina is improving in algebra but still needs support with word problems.",
        },
        tutorNotes: "Add a short note after Thursday's live class.",
        approvalStatus: ApprovalStatus.DRAFT,
        generatedByAiAt: new Date("2026-04-03T13:00:00.000Z"),
        versionHistory: ["v1 AI draft"],
      },
      {
        id: demoIds.parentReportApproved,
        classId: demoIds.classForm5,
        studentId: demoIds.studentAina,
        tutorId: demoIds.tutor,
        aiSummary: {
          summary:
            "Aina attended class consistently and is improving in algebra, but she still needs support when translating longer word problems into equations.",
        },
        tutorNotes:
          "Please keep revision bursts short this week. I will review her word problem accuracy again in the next live class.",
        approvalStatus: ApprovalStatus.APPROVED,
        generatedByAiAt: new Date("2026-04-03T13:20:00.000Z"),
        reviewedByTutorAt: new Date("2026-04-03T13:40:00.000Z"),
        approvedByTutorId: demoIds.tutor,
        approvedAt: new Date("2026-04-03T13:40:00.000Z"),
        versionHistory: ["v1 AI draft", "v2 tutor added attendance context"],
      },
    ],
  });

  await prisma.bookingRequest.create({
    data: {
      id: demoIds.bookingRequestAina,
      parentUserId: demoIds.parentAina,
      parentName: "Nur Aina",
      parentEmail: "parent.aina@ailearningos.demo",
      parentPhone: "+60 12-345 6789",
      studentName: "Aina Sofia",
      studentEmail: "aina@ailearningos.demo",
      studentLevel: "Form 5",
      subjectFocus: "SPM Mathematics",
      preferredTime: "Weeknights after 8 PM",
      notes: "Looking for stronger support in word problems before SPM.",
      status: IntakeStatus.REVIEWING,
    },
  });

  await prisma.tutorApplication.create({
    data: {
      id: demoIds.tutorApplicationMath,
      fullName: "Khai Wen Jun",
      email: "khai.math@ailearningos.demo",
      phoneNumber: "+60 19-222 3344",
      primarySubject: "SPM Mathematics",
      levelsTaught: "Form 4, Form 5, SPM",
      availability: "Weeknights and Saturday mornings",
      teachingExperience:
        "5 years teaching online secondary mathematics and exam prep classes.",
      notes: "Comfortable with live online tuition and tutor-reviewed AI workflows.",
      status: IntakeStatus.NEW,
    },
  });
}

export async function resetDemoData(prisma: PrismaClient) {
  await cleanupDemoData(prisma);
  await seedDemoData(prisma);

  return {
    tutorId: demoIds.tutor,
    classId: demoIds.classForm5,
  };
}
