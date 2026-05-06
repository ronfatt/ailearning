import {
  ApprovalStatus,
  ClassStatus,
  EnrollmentStatus,
  IntakeStatus,
  UserRole,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  aiActivityLogs as fallbackAiLogs,
  assignmentQueue as fallbackAssignmentQueue,
  complianceGuardrails,
  rolePermissions,
} from "@/lib/mvp-data";
import { formatDateTime } from "@/lib/server/dashboard-helpers";
import { prismaApprovalStatusToApi } from "@/lib/server/workflow-api";

type AdminMetric = {
  label: string;
  value: string;
  detail: string;
  tone: "teal" | "gold" | "coral";
};

type AdminApprovalItem = {
  id: string;
  title: string;
  owner: string;
  status: "draft" | "tutor_reviewed" | "approved" | "assigned" | "archived";
  generatedAt: string;
  reviewedAt: string;
};

type AdminAiLog = {
  feature: string;
  role: string;
  input: string;
  output: string;
  approval: string;
  approvedBy: string;
};

type AdminBookingRequest = {
  id: string;
  parentName: string;
  studentName: string;
  studentLevel: string;
  subjectFocus: string;
  preferredTime: string;
  status: IntakeStatus;
  submittedAt: string;
};

type AdminTutorApplication = {
  id: string;
  fullName: string;
  email: string;
  primarySubject: string;
  levelsTaught: string;
  status: IntakeStatus;
  submittedAt: string;
};

type AdminContactInquiry = {
  id: string;
  fullName: string;
  email: string;
  enquiryType: string;
  organization: string;
  status: IntakeStatus;
  submittedAt: string;
};

type AdminEnrollmentDraft = {
  id: string;
  studentId: string | null;
  matchedTutorId: string | null;
  classId: string | null;
  studentName: string;
  studentLevel: string;
  subjectFocus: string;
  preferredTime: string;
  status: string;
  updatedAt: string;
};

type AdminTutorOption = {
  id: string;
  name: string;
  email: string;
};

type AdminClassOption = {
  id: string;
  tutorId: string;
  title: string;
  subjectName: string;
  schedule: string;
};

type AdminClassRoster = {
  id: string;
  title: string;
  subjectName: string;
  tutorName: string;
  schedule: string;
  students: string[];
};

type AdminFunnelStage = {
  label: string;
  value: number;
  note: string;
  tone: "blue" | "mint" | "gold" | "purple";
};

type AdminTutorWorkload = {
  tutorName: string;
  activeClasses: number;
  activeStudents: number;
  note: string;
};

type AdminClassHealth = {
  id: string;
  title: string;
  tutorName: string;
  studentCount: number;
  subjectName: string;
  schedule: string;
};

type AdminCurriculumHotspot = {
  classId: string;
  className: string;
  subjectName: string;
  topic: string;
  topicName: string;
  averageMastery: number;
  affectedStudents: number;
  readinessFlags: number;
  intensity: number;
  note: string;
};

export type AdminConsoleData = {
  metrics: AdminMetric[];
  aiLogs: AdminAiLog[];
  approvalQueue: AdminApprovalItem[];
  bookingRequests: AdminBookingRequest[];
  tutorApplications: AdminTutorApplication[];
  contactEnquiries: AdminContactInquiry[];
  enrollmentDrafts: AdminEnrollmentDraft[];
  tutorOptions: AdminTutorOption[];
  classOptions: AdminClassOption[];
  classRosters: AdminClassRoster[];
  intakeFunnel: AdminFunnelStage[];
  tutorWorkload: AdminTutorWorkload[];
  classHealth: AdminClassHealth[];
  curriculumHotspots: AdminCurriculumHotspot[];
  rolePermissionsData: typeof rolePermissions;
  complianceRules: typeof complianceGuardrails;
  source: "database" | "unconfigured";
  message?: string;
};

function buildUnconfiguredAdminConsoleData(message: string): AdminConsoleData {
  return {
    metrics: [
      {
        label: "Platform Source",
        value: "Setup",
        detail: "Connect DATABASE_URL to load live admin operations data.",
        tone: "gold",
      },
    ],
    aiLogs: fallbackAiLogs,
    approvalQueue: fallbackAssignmentQueue.map((item) => ({
      id: item.id,
      title: item.title,
      owner: item.owner,
      status: item.status,
      generatedAt: item.generatedAt,
      reviewedAt: item.reviewedAt,
    })),
    bookingRequests: [],
    tutorApplications: [],
    contactEnquiries: [],
    enrollmentDrafts: [],
    tutorOptions: [],
    classOptions: [],
    classRosters: [],
    intakeFunnel: [],
    tutorWorkload: [],
    classHealth: [],
    curriculumHotspots: [],
    rolePermissionsData: rolePermissions,
    complianceRules: complianceGuardrails,
    source: "unconfigured",
    message,
  };
}

function normalizeTopicToken(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatIntakeStatus(status: IntakeStatus) {
  return status.replaceAll("_", " ");
}

function formatReviewTime(value?: Date | null) {
  return value ? formatDateTime(value) : "Pending";
}

export async function getAdminConsoleData(): Promise<AdminConsoleData> {
  if (!process.env.DATABASE_URL) {
    return buildUnconfiguredAdminConsoleData(
      "DATABASE_URL is not configured yet. Admin live intake and workflow data will appear after database setup.",
    );
  }

  try {
    const [
      tutorCount,
      studentCount,
      bookingCount,
      tutorApplicationCount,
      contactInquiryCount,
      bookingRequests,
      tutorApplications,
      contactEnquiries,
      enrollmentDrafts,
      tutors,
      classes,
      classRosters,
      lessonPlans,
      homeworkAssignments,
      parentReports,
      aiLogs,
    ] = await Promise.all([
      prisma.user.count({ where: { role: UserRole.TUTOR } }),
      prisma.user.count({ where: { role: UserRole.STUDENT } }),
      prisma.bookingRequest.count({
        where: {
          status: {
            in: [IntakeStatus.NEW, IntakeStatus.REVIEWING, IntakeStatus.CONTACTED],
          },
        },
      }),
      prisma.tutorApplication.count({
        where: {
          status: {
            in: [IntakeStatus.NEW, IntakeStatus.REVIEWING, IntakeStatus.CONTACTED],
          },
        },
      }),
      prisma.contactInquiry.count({
        where: {
          status: {
            in: [IntakeStatus.NEW, IntakeStatus.REVIEWING, IntakeStatus.CONTACTED],
          },
        },
      }),
      prisma.bookingRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.tutorApplication.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.contactInquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.enrollmentDraft.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
      prisma.user.findMany({
        where: { role: UserRole.TUTOR },
        orderBy: { fullName: "asc" },
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      }),
      prisma.class.findMany({
        where: {
          status: { in: [ClassStatus.ACTIVE, ClassStatus.DRAFT] },
        },
        include: {
          subject: {
            select: { name: true },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: 20,
      }),
      prisma.class.findMany({
        where: {
          status: { in: [ClassStatus.ACTIVE, ClassStatus.DRAFT] },
        },
        include: {
          subject: {
            select: { name: true },
          },
          tutor: {
            select: { fullName: true },
          },
          enrollments: {
            where: { status: EnrollmentStatus.ACTIVE },
            include: {
              student: {
                select: { fullName: true },
              },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: 10,
      }),
      prisma.lessonPlan.findMany({
        where: {
          approvalStatus: { in: [ApprovalStatus.DRAFT, ApprovalStatus.TUTOR_REVIEWED] },
        },
        include: {
          class: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 4,
      }),
      prisma.homeworkAssignment.findMany({
        where: {
          approvalStatus: { in: [ApprovalStatus.DRAFT, ApprovalStatus.TUTOR_REVIEWED] },
        },
        include: {
          class: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 4,
      }),
      prisma.parentReport.findMany({
        where: {
          approvalStatus: { in: [ApprovalStatus.DRAFT, ApprovalStatus.TUTOR_REVIEWED] },
        },
        include: {
          class: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 4,
      }),
      prisma.aiActivityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);

    const subjectIds = Array.from(new Set(classes.map((item) => item.subjectId)));
    const classIds = classes.map((item) => item.id);
    const classStudentIds = Array.from(
      new Set(
        classRosters.flatMap((item) =>
          item.enrollments.map((enrollment) => enrollment.studentId),
        ),
      ),
    );

    const [masteryRecords, readinessSubmissions, subjectTopics] = await Promise.all([
      subjectIds.length > 0 && classStudentIds.length > 0
        ? prisma.studentMastery.findMany({
            where: {
              subjectId: {
                in: subjectIds,
              },
              studentId: {
                in: classStudentIds,
              },
            },
          })
        : Promise.resolve([]),
      classIds.length > 0
        ? prisma.readinessCheckSubmission.findMany({
            where: {
              classId: {
                in: classIds,
              },
              approvalStatus: {
                in: [
                  ApprovalStatus.APPROVED,
                  ApprovalStatus.ASSIGNED,
                  ApprovalStatus.TUTOR_REVIEWED,
                ],
              },
            },
            select: {
              classId: true,
              weakTopics: true,
            },
            take: 120,
            orderBy: { submittedAt: "desc" },
          })
        : Promise.resolve([]),
      subjectIds.length > 0
        ? prisma.subjectTopic.findMany({
            where: {
              subjectId: {
                in: subjectIds,
              },
            },
            select: {
              id: true,
              subjectId: true,
              code: true,
              name: true,
              _count: {
                select: {
                  masteryNodes: true,
                },
              },
            },
          })
        : Promise.resolve([]),
    ]);

    const approvalQueue: AdminApprovalItem[] = [
    ...lessonPlans.map((item) => ({
      id: item.id,
      title: item.title,
      owner: item.class.title,
      status: prismaApprovalStatusToApi[item.approvalStatus],
      generatedAt: formatReviewTime(item.generatedByAiAt ?? item.createdAt),
      reviewedAt: formatReviewTime(item.reviewedByTutorAt),
    })),
    ...homeworkAssignments.map((item) => ({
      id: item.id,
      title:
        (typeof item.assignmentContent === "object" &&
        item.assignmentContent &&
        "title" in item.assignmentContent &&
        typeof item.assignmentContent.title === "string"
          ? item.assignmentContent.title
          : "Homework draft") as string,
      owner: item.class.title,
      status: prismaApprovalStatusToApi[item.approvalStatus],
      generatedAt: formatReviewTime(item.generatedByAiAt ?? item.createdAt),
      reviewedAt: formatReviewTime(item.reviewedByTutorAt),
    })),
    ...parentReports.map((item) => ({
      id: item.id,
      title: `Parent report for ${item.studentId}`,
      owner: item.class?.title ?? "Parent communication",
      status: prismaApprovalStatusToApi[item.approvalStatus],
      generatedAt: formatReviewTime(item.generatedByAiAt ?? item.createdAt),
      reviewedAt: formatReviewTime(item.reviewedByTutorAt),
    })),
  ]
    .sort((left, right) => right.generatedAt.localeCompare(left.generatedAt))
    .slice(0, 8);

    const intakeFunnel: AdminFunnelStage[] = [
    {
      label: "Bookings",
      value: bookingCount,
      note: "Parent class requests currently in the intake pipeline.",
      tone: "blue",
    },
    {
      label: "Tutor apps",
      value: tutorApplicationCount,
      note: "Tutor applications waiting for review or follow-up.",
      tone: "mint",
    },
    {
      label: "Contact",
      value: contactInquiryCount,
      note: "General enquiries that still need routing or response.",
      tone: "gold",
    },
    {
      label: "Enrollments",
      value: enrollmentDrafts.length,
      note: "Draft enrollments already converted from intake work.",
      tone: "purple",
    },
  ];

    const tutorWorkloadMap = new Map<
      string,
      { tutorName: string; activeClasses: number; activeStudents: number }
    >();

    for (const item of classRosters) {
      const tutorName = item.tutor.fullName;
      const existing = tutorWorkloadMap.get(tutorName) ?? {
        tutorName,
        activeClasses: 0,
        activeStudents: 0,
      };

      existing.activeClasses += 1;
      existing.activeStudents += item.enrollments.length;
      tutorWorkloadMap.set(tutorName, existing);
    }

    const tutorWorkload: AdminTutorWorkload[] = [...tutorWorkloadMap.values()]
    .sort((left, right) => right.activeStudents - left.activeStudents)
    .slice(0, 6)
    .map((item) => ({
      ...item,
      note:
        item.activeStudents === 0
          ? "No active students assigned yet."
          : `${item.activeStudents} active student${item.activeStudents === 1 ? "" : "s"} across ${item.activeClasses} class${item.activeClasses === 1 ? "" : "es"}.`,
    }));

    const classHealth: AdminClassHealth[] = classRosters
    .map((item) => ({
      id: item.id,
      title: item.title,
      tutorName: item.tutor.fullName,
      studentCount: item.enrollments.length,
      subjectName: item.subject.name,
      schedule: item.schedule,
    }))
    .sort((left, right) => right.studentCount - left.studentCount)
    .slice(0, 6);

    const subjectTopicById = new Map(
      subjectTopics.map((topic) => [topic.id, topic]),
    );
    const subjectTopicBySubjectAndName = new Map(
      subjectTopics.map((topic) => [
        `${topic.subjectId}:${normalizeTopicToken(topic.name)}`,
        topic,
      ]),
    );

    function resolveSubjectTopic(subjectId: string, topicId: string, topicLabel: string) {
      return (
        subjectTopicById.get(topicId) ??
        subjectTopicBySubjectAndName.get(
          `${subjectId}:${normalizeTopicToken(topicLabel)}`,
        ) ??
        null
      );
    }

    const curriculumHotspots: AdminCurriculumHotspot[] = classRosters
      .flatMap((classItem) => {
        const activeStudentIds = new Set(
          classItem.enrollments.map((enrollment) => enrollment.studentId),
        );
        const masteryForClass = masteryRecords.filter(
          (record) =>
            record.subjectId === classItem.subjectId &&
            activeStudentIds.has(record.studentId),
        );
        const readinessWeakTopics = readinessSubmissions
          .filter((submission) => submission.classId === classItem.id)
          .flatMap((submission) => {
            const weakTopics = submission.weakTopics;

            if (!Array.isArray(weakTopics)) {
              return [];
            }

            return weakTopics.filter(
              (entry): entry is string => typeof entry === "string" && entry.length > 0,
            );
          });

        const grouped = new Map<
          string,
          {
            topic: string;
            topicName: string;
            averageMasterySeed: number[];
            readinessFlags: number;
            studentIds: Set<string>;
            masteryNodeCount: number;
          }
        >();

        for (const record of masteryForClass) {
          const resolvedTopic = resolveSubjectTopic(
            classItem.subjectId,
            record.topicId,
            record.topicLabel,
          );
          const topicKey = resolvedTopic?.id ?? `label:${record.topicLabel}`;
          const existing = grouped.get(topicKey) ?? {
            topic: resolvedTopic
              ? `${resolvedTopic.code} ${resolvedTopic.name}`
              : record.topicLabel,
            topicName: resolvedTopic?.name ?? record.topicLabel,
            averageMasterySeed: [],
            readinessFlags: 0,
            studentIds: new Set<string>(),
            masteryNodeCount: resolvedTopic?._count.masteryNodes ?? 0,
          };

          existing.averageMasterySeed.push(record.masteryScore);
          existing.studentIds.add(record.studentId);
          grouped.set(topicKey, existing);
        }

        for (const topic of readinessWeakTopics) {
          const resolvedTopic = resolveSubjectTopic(classItem.subjectId, "", topic);
          const topicKey = resolvedTopic?.id ?? `label:${topic}`;
          const existing = grouped.get(topicKey) ?? {
            topic: resolvedTopic
              ? `${resolvedTopic.code} ${resolvedTopic.name}`
              : topic,
            topicName: resolvedTopic?.name ?? topic,
            averageMasterySeed: [],
            readinessFlags: 0,
            studentIds: new Set<string>(),
            masteryNodeCount: resolvedTopic?._count.masteryNodes ?? 0,
          };

          existing.readinessFlags += 1;
          grouped.set(topicKey, existing);
        }

        return Array.from(grouped.values()).map((item) => {
          const averageMastery = item.averageMasterySeed.length > 0
            ? Math.round(
                item.averageMasterySeed.reduce((sum, value) => sum + value, 0) /
                  item.averageMasterySeed.length,
              )
            : 45;
          const affectedStudents = item.studentIds.size;
          const intensity = Math.max(
            12,
            Math.min(
              100,
              Math.round((100 - averageMastery) + item.readinessFlags * 12 + affectedStudents * 6),
            ),
          );

          return {
            classId: classItem.id,
            className: classItem.title,
            subjectName: classItem.subject.name,
            topic: item.topic,
            topicName: item.topicName,
            averageMastery,
            affectedStudents,
            readinessFlags: item.readinessFlags,
            intensity,
            note:
              item.readinessFlags > 0
                ? `${item.readinessFlags} readiness flag${item.readinessFlags === 1 ? "" : "s"} and ${affectedStudents} tracked student${affectedStudents === 1 ? "" : "s"} around this topic.`
                : `${affectedStudents} tracked student${affectedStudents === 1 ? "" : "s"} currently map to this topic${item.masteryNodeCount > 0 ? ` across ${item.masteryNodeCount} mastery node${item.masteryNodeCount === 1 ? "" : "s"}` : ""}.`,
          };
        });
      })
      .sort((left, right) => right.intensity - left.intensity)
      .slice(0, 6);

    return {
      metrics: [
        {
          label: "Active Tutors",
          value: `${tutorCount}`,
          detail: "Tutors with accounts inside the live platform.",
          tone: "teal",
        },
        {
          label: "Student Accounts",
          value: `${studentCount}`,
          detail: "Students currently provisioned for tutor-led learning.",
          tone: "gold",
        },
        {
          label: "Booking Requests",
          value: `${bookingCount}`,
          detail: "Open parent enquiries waiting for intake follow-up.",
          tone: bookingCount > 0 ? "teal" : "gold",
        },
        {
          label: "Tutor Applications",
          value: `${tutorApplicationCount}`,
          detail: "Applications currently moving through review.",
          tone: tutorApplicationCount > 0 ? "teal" : "gold",
        },
        {
          label: "Contact Enquiries",
          value: `${contactInquiryCount}`,
          detail: "General messages waiting for intake follow-up.",
          tone: contactInquiryCount > 0 ? "teal" : "gold",
        },
      ],
      aiLogs:
        aiLogs.length > 0
          ? aiLogs.map((log) => ({
              feature: log.featureUsed,
              role: log.role,
              input: log.inputType,
              output: log.outputType,
              approval: log.approvalRequired ? "Required" : "Not required",
              approvedBy: log.approvedBy ?? "Pending",
            }))
          : fallbackAiLogs,
      approvalQueue,
      bookingRequests: bookingRequests.map((item) => ({
        id: item.id,
        parentName: item.parentName,
        studentName: item.studentName,
        studentLevel: item.studentLevel,
        subjectFocus: item.subjectFocus,
        preferredTime: item.preferredTime ?? "To be confirmed",
        status: item.status,
        submittedAt: formatDateTime(item.createdAt),
      })),
      tutorApplications: tutorApplications.map((item) => ({
        id: item.id,
        fullName: item.fullName,
        email: item.email,
        primarySubject: item.primarySubject,
        levelsTaught: item.levelsTaught ?? "To be confirmed",
        status: item.status,
        submittedAt: formatDateTime(item.createdAt),
      })),
      contactEnquiries: contactEnquiries.map((item) => ({
        id: item.id,
        fullName: item.fullName,
        email: item.email,
        enquiryType: item.enquiryType,
        organization: item.organization ?? "Independent / not provided",
        status: item.status,
        submittedAt: formatDateTime(item.createdAt),
      })),
      enrollmentDrafts: enrollmentDrafts.map((item) => ({
        id: item.id,
        studentId: item.studentId,
        matchedTutorId: item.matchedTutorId,
        classId: item.classId,
        studentName: item.studentName,
        studentLevel: item.studentLevel,
        subjectFocus: item.subjectFocus,
        preferredTime: item.preferredTime ?? "To be confirmed",
        status: item.status,
        updatedAt: formatDateTime(item.updatedAt),
      })),
      tutorOptions: tutors.map((item) => ({
        id: item.id,
        name: item.fullName,
        email: item.email,
      })),
      classOptions: classes.map((item) => ({
        id: item.id,
        tutorId: item.tutorId,
        title: item.title,
        subjectName: item.subject.name,
        schedule: item.schedule,
      })),
      classRosters: classRosters.map((item) => ({
        id: item.id,
        title: item.title,
        subjectName: item.subject.name,
        tutorName: item.tutor.fullName,
        schedule: item.schedule,
        students: item.enrollments.map((enrollment) => enrollment.student.fullName),
      })),
      intakeFunnel,
      tutorWorkload,
      classHealth,
      curriculumHotspots,
      rolePermissionsData: rolePermissions,
      complianceRules: complianceGuardrails,
      source: "database",
      message:
        bookingRequests.length === 0 &&
        tutorApplications.length === 0 &&
        contactEnquiries.length === 0
          ? "No active intake records yet. New parent bookings, contact enquiries, and tutor applications will appear here."
          : undefined,
    };
  } catch (error) {
    console.error("Admin console data fallback triggered", error);

    return buildUnconfiguredAdminConsoleData(
      "The admin dashboard could not connect to the database just now. Preview data is still available while the database connection is repaired.",
    );
  }
}

export { formatIntakeStatus };
