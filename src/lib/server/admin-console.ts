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
    rolePermissionsData: rolePermissions,
    complianceRules: complianceGuardrails,
    source: "unconfigured",
    message,
  };
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
