-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TUTOR', 'STUDENT', 'PARENT');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('INVITED', 'ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "ClassType" AS ENUM ('LIVE_ONLINE', 'HYBRID', 'REVISION_CLINIC', 'COMMUNITY_SESSION');

-- CreateEnum
CREATE TYPE "ClassStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'PAUSED', 'EXITED');

-- CreateEnum
CREATE TYPE "ClassSessionStatus" AS ENUM ('SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('DRAFT', 'TUTOR_REVIEWED', 'APPROVED', 'ASSIGNED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "HomeworkLifecycleStatus" AS ENUM ('DRAFT', 'APPROVED', 'ASSIGNED', 'SUBMITTED', 'OVERDUE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "StudyPlanStatus" AS ENUM ('ACTIVE', 'LOCKED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PartnershipType" AS ENUM ('PIBG', 'SCHOOL', 'COMMUNITY');

-- CreateEnum
CREATE TYPE "PartnershipStatus" AS ENUM ('LEAD', 'PILOT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "IntakeStatus" AS ENUM ('NEW', 'REVIEWING', 'CONTACTED', 'CONVERTED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "phoneNumber" TEXT,
    "passwordHash" TEXT,
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'INVITED',
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "profileData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "schedule" TEXT NOT NULL,
    "classType" "ClassType" NOT NULL,
    "status" "ClassStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassEnrollment" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentStudentLink" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "relationship" TEXT NOT NULL DEFAULT 'Parent',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentStudentLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionTokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassSession" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "lessonPlanId" TEXT,
    "title" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "liveRoomUrl" TEXT,
    "participationRate" DOUBLE PRECISION,
    "status" "ClassSessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonPlan" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "objectives" JSONB NOT NULL,
    "aiDraft" JSONB,
    "tutorEditedContent" JSONB,
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'DRAFT',
    "generatedByAiAt" TIMESTAMP(3),
    "reviewedByTutorAt" TIMESTAMP(3),
    "approvedByTutorId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "versionHistory" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassSummary" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "classSessionId" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "aiDraft" JSONB,
    "tutorEditedContent" JSONB,
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'DRAFT',
    "generatedByAiAt" TIMESTAMP(3),
    "reviewedByTutorAt" TIMESTAMP(3),
    "approvedByTutorId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "versionHistory" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyPlan" (
    "id" TEXT NOT NULL,
    "classId" TEXT,
    "tutorId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "planType" TEXT NOT NULL DEFAULT 'REVISION',
    "status" "StudyPlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'DRAFT',
    "aiDraft" JSONB,
    "tutorEditedContent" JSONB,
    "generatedByAiAt" TIMESTAMP(3),
    "reviewedByTutorAt" TIMESTAMP(3),
    "approvedByTutorId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "versionHistory" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyPlanTopic" (
    "id" TEXT NOT NULL,
    "studyPlanId" TEXT NOT NULL,
    "topicKey" TEXT NOT NULL,
    "topicLabel" TEXT NOT NULL,
    "accessApproved" BOOLEAN NOT NULL DEFAULT false,
    "sequenceOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyPlanTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentMastery" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "topicLabel" TEXT NOT NULL,
    "masteryScore" DOUBLE PRECISION NOT NULL,
    "updatedByAiAt" TIMESTAMP(3),
    "reviewedByTutorAt" TIMESTAMP(3),
    "tutorReviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentMastery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeworkAssignment" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "lessonPlanId" TEXT,
    "studyPlanId" TEXT,
    "studentId" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "generatedByAi" BOOLEAN NOT NULL DEFAULT true,
    "approvedByTutor" BOOLEAN NOT NULL DEFAULT false,
    "assignmentContent" JSONB NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "HomeworkLifecycleStatus" NOT NULL DEFAULT 'DRAFT',
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'DRAFT',
    "generatedByAiAt" TIMESTAMP(3),
    "reviewedByTutorAt" TIMESTAMP(3),
    "approvedByTutorId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "versionHistory" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeworkAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeworkSubmission" (
    "id" TEXT NOT NULL,
    "homeworkAssignmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "submissionContent" JSONB,
    "score" DOUBLE PRECISION,
    "tutorFeedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeworkSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadinessCheckSubmission" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "responses" JSONB NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "readinessLevel" TEXT NOT NULL,
    "weakTopics" JSONB,
    "aiSummary" JSONB,
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'DRAFT',
    "generatedByAiAt" TIMESTAMP(3),
    "reviewedByTutorAt" TIMESTAMP(3),
    "approvedByTutorId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "versionHistory" JSONB,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadinessCheckSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentReport" (
    "id" TEXT NOT NULL,
    "classId" TEXT,
    "studentId" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "aiSummary" JSONB,
    "tutorNotes" TEXT,
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'DRAFT',
    "generatedByAiAt" TIMESTAMP(3),
    "reviewedByTutorAt" TIMESTAMP(3),
    "approvedByTutorId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "versionHistory" JSONB,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentMessage" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "messageChannel" TEXT NOT NULL,
    "aiDraft" JSONB,
    "tutorEditedContent" JSONB,
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'DRAFT',
    "generatedByAiAt" TIMESTAMP(3),
    "reviewedByTutorAt" TIMESTAMP(3),
    "approvedByTutorId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "versionHistory" JSONB,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" TEXT NOT NULL,
    "classSessionId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "participationScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "featureUsed" TEXT NOT NULL,
    "inputType" TEXT NOT NULL,
    "outputType" TEXT NOT NULL,
    "approvalRequired" BOOLEAN NOT NULL DEFAULT true,
    "approvedBy" TEXT,
    "sourceEntityType" TEXT,
    "sourceEntityId" TEXT,
    "moderationStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolPartnership" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "partnershipType" "PartnershipType" NOT NULL,
    "status" "PartnershipStatus" NOT NULL DEFAULT 'LEAD',
    "contactName" TEXT,
    "contactEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolPartnership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TuitionSubscription" (
    "id" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "activeSeatCount" INTEGER NOT NULL DEFAULT 0,
    "billingCycle" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "renewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TuitionSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralEvent" (
    "id" TEXT NOT NULL,
    "referrerUserId" TEXT NOT NULL,
    "referredUserId" TEXT,
    "referralCode" TEXT NOT NULL,
    "conversionStatus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferralEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingRequest" (
    "id" TEXT NOT NULL,
    "parentUserId" TEXT,
    "parentName" TEXT NOT NULL,
    "parentEmail" TEXT NOT NULL,
    "parentPhone" TEXT,
    "studentName" TEXT NOT NULL,
    "studentEmail" TEXT,
    "studentLevel" TEXT NOT NULL,
    "subjectFocus" TEXT NOT NULL,
    "preferredTime" TEXT,
    "notes" TEXT,
    "status" "IntakeStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorApplication" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "primarySubject" TEXT NOT NULL,
    "levelsTaught" TEXT,
    "availability" TEXT,
    "teachingExperience" TEXT,
    "notes" TEXT,
    "status" "IntakeStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnrollmentDraft" (
    "id" TEXT NOT NULL,
    "bookingRequestId" TEXT NOT NULL,
    "parentUserId" TEXT,
    "studentId" TEXT,
    "matchedTutorId" TEXT,
    "classId" TEXT,
    "studentName" TEXT NOT NULL,
    "studentLevel" TEXT NOT NULL,
    "subjectFocus" TEXT NOT NULL,
    "preferredTime" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING_MATCH',
    "fulfilledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnrollmentDraft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_code_key" ON "Subject"("code");

-- CreateIndex
CREATE INDEX "Class_tutorId_idx" ON "Class"("tutorId");

-- CreateIndex
CREATE INDEX "Class_subjectId_idx" ON "Class"("subjectId");

-- CreateIndex
CREATE INDEX "ClassEnrollment_studentId_idx" ON "ClassEnrollment"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassEnrollment_classId_studentId_key" ON "ClassEnrollment"("classId", "studentId");

-- CreateIndex
CREATE INDEX "ParentStudentLink_studentId_idx" ON "ParentStudentLink"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "ParentStudentLink_parentId_studentId_key" ON "ParentStudentLink"("parentId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthSession_sessionTokenHash_key" ON "AuthSession"("sessionTokenHash");

-- CreateIndex
CREATE INDEX "AuthSession_userId_expiresAt_idx" ON "AuthSession"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "ClassSession_classId_startsAt_idx" ON "ClassSession"("classId", "startsAt");

-- CreateIndex
CREATE INDEX "LessonPlan_classId_idx" ON "LessonPlan"("classId");

-- CreateIndex
CREATE INDEX "LessonPlan_tutorId_idx" ON "LessonPlan"("tutorId");

-- CreateIndex
CREATE INDEX "LessonPlan_approvalStatus_idx" ON "LessonPlan"("approvalStatus");

-- CreateIndex
CREATE INDEX "ClassSummary_classId_idx" ON "ClassSummary"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassSummary_classSessionId_key" ON "ClassSummary"("classSessionId");

-- CreateIndex
CREATE INDEX "StudyPlan_studentId_idx" ON "StudyPlan"("studentId");

-- CreateIndex
CREATE INDEX "StudyPlan_subjectId_idx" ON "StudyPlan"("subjectId");

-- CreateIndex
CREATE INDEX "StudyPlan_approvalStatus_idx" ON "StudyPlan"("approvalStatus");

-- CreateIndex
CREATE INDEX "StudyPlanTopic_studyPlanId_sequenceOrder_idx" ON "StudyPlanTopic"("studyPlanId", "sequenceOrder");

-- CreateIndex
CREATE INDEX "StudentMastery_studentId_subjectId_idx" ON "StudentMastery"("studentId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentMastery_studentId_subjectId_topicId_key" ON "StudentMastery"("studentId", "subjectId", "topicId");

-- CreateIndex
CREATE INDEX "HomeworkAssignment_classId_dueDate_idx" ON "HomeworkAssignment"("classId", "dueDate");

-- CreateIndex
CREATE INDEX "HomeworkAssignment_studentId_idx" ON "HomeworkAssignment"("studentId");

-- CreateIndex
CREATE INDEX "HomeworkAssignment_approvalStatus_idx" ON "HomeworkAssignment"("approvalStatus");

-- CreateIndex
CREATE INDEX "HomeworkSubmission_studentId_idx" ON "HomeworkSubmission"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "HomeworkSubmission_homeworkAssignmentId_studentId_key" ON "HomeworkSubmission"("homeworkAssignmentId", "studentId");

-- CreateIndex
CREATE INDEX "ReadinessCheckSubmission_tutorId_approvalStatus_idx" ON "ReadinessCheckSubmission"("tutorId", "approvalStatus");

-- CreateIndex
CREATE INDEX "ReadinessCheckSubmission_studentId_submittedAt_idx" ON "ReadinessCheckSubmission"("studentId", "submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReadinessCheckSubmission_classId_studentId_key" ON "ReadinessCheckSubmission"("classId", "studentId");

-- CreateIndex
CREATE INDEX "ParentReport_studentId_tutorId_idx" ON "ParentReport"("studentId", "tutorId");

-- CreateIndex
CREATE INDEX "ParentReport_approvalStatus_idx" ON "ParentReport"("approvalStatus");

-- CreateIndex
CREATE INDEX "ParentMessage_parentId_studentId_idx" ON "ParentMessage"("parentId", "studentId");

-- CreateIndex
CREATE INDEX "ParentMessage_approvalStatus_idx" ON "ParentMessage"("approvalStatus");

-- CreateIndex
CREATE INDEX "AttendanceRecord_studentId_idx" ON "AttendanceRecord"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceRecord_classSessionId_studentId_key" ON "AttendanceRecord"("classSessionId", "studentId");

-- CreateIndex
CREATE INDEX "AiActivityLog_userId_createdAt_idx" ON "AiActivityLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AiActivityLog_featureUsed_idx" ON "AiActivityLog"("featureUsed");

-- CreateIndex
CREATE INDEX "SchoolPartnership_status_partnershipType_idx" ON "SchoolPartnership"("status", "partnershipType");

-- CreateIndex
CREATE INDEX "TuitionSubscription_tutorId_status_idx" ON "TuitionSubscription"("tutorId", "status");

-- CreateIndex
CREATE INDEX "ReferralEvent_referrerUserId_referralCode_idx" ON "ReferralEvent"("referrerUserId", "referralCode");

-- CreateIndex
CREATE INDEX "BookingRequest_parentEmail_createdAt_idx" ON "BookingRequest"("parentEmail", "createdAt");

-- CreateIndex
CREATE INDEX "BookingRequest_status_createdAt_idx" ON "BookingRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "TutorApplication_email_createdAt_idx" ON "TutorApplication"("email", "createdAt");

-- CreateIndex
CREATE INDEX "TutorApplication_status_createdAt_idx" ON "TutorApplication"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "EnrollmentDraft_bookingRequestId_key" ON "EnrollmentDraft"("bookingRequestId");

-- CreateIndex
CREATE INDEX "EnrollmentDraft_status_createdAt_idx" ON "EnrollmentDraft"("status", "createdAt");

-- CreateIndex
CREATE INDEX "EnrollmentDraft_studentId_idx" ON "EnrollmentDraft"("studentId");

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassEnrollment" ADD CONSTRAINT "ClassEnrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassEnrollment" ADD CONSTRAINT "ClassEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentStudentLink" ADD CONSTRAINT "ParentStudentLink_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentStudentLink" ADD CONSTRAINT "ParentStudentLink_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSession" ADD CONSTRAINT "ClassSession_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSession" ADD CONSTRAINT "ClassSession_lessonPlanId_fkey" FOREIGN KEY ("lessonPlanId") REFERENCES "LessonPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonPlan" ADD CONSTRAINT "LessonPlan_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonPlan" ADD CONSTRAINT "LessonPlan_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSummary" ADD CONSTRAINT "ClassSummary_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSummary" ADD CONSTRAINT "ClassSummary_classSessionId_fkey" FOREIGN KEY ("classSessionId") REFERENCES "ClassSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyPlan" ADD CONSTRAINT "StudyPlan_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyPlanTopic" ADD CONSTRAINT "StudyPlanTopic_studyPlanId_fkey" FOREIGN KEY ("studyPlanId") REFERENCES "StudyPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMastery" ADD CONSTRAINT "StudentMastery_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkAssignment" ADD CONSTRAINT "HomeworkAssignment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkAssignment" ADD CONSTRAINT "HomeworkAssignment_lessonPlanId_fkey" FOREIGN KEY ("lessonPlanId") REFERENCES "LessonPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkAssignment" ADD CONSTRAINT "HomeworkAssignment_studyPlanId_fkey" FOREIGN KEY ("studyPlanId") REFERENCES "StudyPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkSubmission" ADD CONSTRAINT "HomeworkSubmission_homeworkAssignmentId_fkey" FOREIGN KEY ("homeworkAssignmentId") REFERENCES "HomeworkAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadinessCheckSubmission" ADD CONSTRAINT "ReadinessCheckSubmission_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadinessCheckSubmission" ADD CONSTRAINT "ReadinessCheckSubmission_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentReport" ADD CONSTRAINT "ParentReport_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_classSessionId_fkey" FOREIGN KEY ("classSessionId") REFERENCES "ClassSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiActivityLog" ADD CONSTRAINT "AiActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

