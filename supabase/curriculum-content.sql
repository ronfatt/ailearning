DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ContentStatus') THEN
    CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'ACADEMIC_REVIEW', 'QA_REVIEW', 'APPROVED', 'LIVE', 'REVISION_NEEDED', 'ARCHIVED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MasteryNodeType') THEN
    CREATE TYPE "MasteryNodeType" AS ENUM ('RECOGNITION', 'PROCEDURE', 'APPLICATION', 'RETENTION');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MasteryEdgeType') THEN
    CREATE TYPE "MasteryEdgeType" AS ENUM ('REQUIRED', 'RECOMMENDED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'LessonModuleType') THEN
    CREATE TYPE "LessonModuleType" AS ENUM ('MICRO_LESSON', 'WORKED_EXAMPLE', 'GUIDED_PRACTICE', 'CHECKPOINT_PREP');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'QuestionPoolType') THEN
    CREATE TYPE "QuestionPoolType" AS ENUM ('TEACH', 'GUIDED_PRACTICE', 'DIAGNOSTIC', 'MASTERY', 'REVISION');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'QuestionFormat') THEN
    CREATE TYPE "QuestionFormat" AS ENUM ('MCQ', 'SHORT_ANSWER', 'STEP_ORDER', 'MATCH', 'OPEN_RESPONSE');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'DifficultyBand') THEN
    CREATE TYPE "DifficultyBand" AS ENUM ('FOUNDATION', 'CORE', 'STRETCH');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'QuestionDifficulty') THEN
    CREATE TYPE "QuestionDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InterventionTriggerType') THEN
    CREATE TYPE "InterventionTriggerType" AS ENUM ('STALLED_MASTERY', 'HINT_DEPENDENCE', 'RETENTION_DROP', 'REPEAT_MISCONCEPTION');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'RevisionScheduleType') THEN
    CREATE TYPE "RevisionScheduleType" AS ENUM ('SPACED', 'WEAK_TOPIC', 'PRE_CLASS', 'PRE_EXAM');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "CurriculumLevel" (
  "id" TEXT NOT NULL,
  "subjectId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "formLabel" TEXT NOT NULL,
  "ageBand" TEXT,
  "track" TEXT,
  "examStage" TEXT,
  "curriculumFramework" TEXT NOT NULL DEFAULT 'KSSM',
  "sequenceOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CurriculumLevel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SubjectDomain" (
  "id" TEXT NOT NULL,
  "subjectId" TEXT NOT NULL,
  "levelId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "sequenceOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SubjectDomain_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SubjectTopic" (
  "id" TEXT NOT NULL,
  "subjectId" TEXT NOT NULL,
  "levelId" TEXT NOT NULL,
  "domainId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "summary" TEXT,
  "prerequisiteSummary" TEXT,
  "sequenceOrder" INTEGER NOT NULL DEFAULT 0,
  "estimatedLearningMinutes" INTEGER,
  "estimatedRevisionCycles" INTEGER,
  "contentStatus" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SubjectTopic_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "MasteryNode" (
  "id" TEXT NOT NULL,
  "topicId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "nodeType" "MasteryNodeType" NOT NULL,
  "title" TEXT NOT NULL,
  "learningObjective" TEXT NOT NULL,
  "difficultyBand" "DifficultyBand" NOT NULL DEFAULT 'CORE',
  "sequenceOrder" INTEGER NOT NULL DEFAULT 0,
  "masteryThreshold" INTEGER NOT NULL DEFAULT 80,
  "hintDependencyLimit" INTEGER NOT NULL DEFAULT 1,
  "retryLimit" INTEGER NOT NULL DEFAULT 2,
  "retentionReviewDays" INTEGER NOT NULL DEFAULT 7,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MasteryNode_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "MasteryEdge" (
  "id" TEXT NOT NULL,
  "fromNodeId" TEXT NOT NULL,
  "toNodeId" TEXT NOT NULL,
  "edgeType" "MasteryEdgeType" NOT NULL DEFAULT 'REQUIRED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MasteryEdge_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "LessonModule" (
  "id" TEXT NOT NULL,
  "nodeId" TEXT NOT NULL,
  "moduleType" "LessonModuleType" NOT NULL,
  "title" TEXT NOT NULL,
  "teachingScript" JSONB,
  "exampleCount" INTEGER,
  "estimatedMinutes" INTEGER,
  "tutorVisible" BOOLEAN NOT NULL DEFAULT true,
  "sequenceOrder" INTEGER NOT NULL DEFAULT 0,
  "contentStatus" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LessonModule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "QuestionPool" (
  "id" TEXT NOT NULL,
  "nodeId" TEXT NOT NULL,
  "poolType" "QuestionPoolType" NOT NULL,
  "targetCount" INTEGER,
  "adaptivePriority" INTEGER NOT NULL DEFAULT 0,
  "contentStatus" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "QuestionPool_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "QuestionItem" (
  "id" TEXT NOT NULL,
  "poolId" TEXT NOT NULL,
  "nodeId" TEXT NOT NULL,
  "questionFormat" "QuestionFormat" NOT NULL,
  "difficulty" "QuestionDifficulty" NOT NULL DEFAULT 'MEDIUM',
  "prompt" JSONB NOT NULL,
  "answerKey" JSONB NOT NULL,
  "solutionSteps" JSONB,
  "hintLevel1" TEXT,
  "hintLevel2" TEXT,
  "hintLevel3" TEXT,
  "misconceptionTag" TEXT,
  "autoMarkable" BOOLEAN NOT NULL DEFAULT true,
  "languageSupport" TEXT,
  "contentStatus" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "QuestionItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "MasteryCheckpoint" (
  "id" TEXT NOT NULL,
  "nodeId" TEXT NOT NULL,
  "stage" "MasteryNodeType" NOT NULL,
  "passRule" TEXT NOT NULL,
  "questionCount" INTEGER NOT NULL,
  "timeLimitMinutes" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MasteryCheckpoint_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "TopicMisconception" (
  "id" TEXT NOT NULL,
  "topicId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "remedialStrategy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TopicMisconception_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "InterventionRule" (
  "id" TEXT NOT NULL,
  "nodeId" TEXT NOT NULL,
  "triggerType" "InterventionTriggerType" NOT NULL,
  "triggerCondition" TEXT NOT NULL,
  "systemAction" TEXT NOT NULL,
  "tutorAction" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "InterventionRule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "RevisionRule" (
  "id" TEXT NOT NULL,
  "nodeId" TEXT NOT NULL,
  "scheduleType" "RevisionScheduleType" NOT NULL,
  "dayOffsets" JSONB,
  "stopCondition" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RevisionRule_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "CurriculumLevel_subjectId_code_key" ON "CurriculumLevel"("subjectId", "code");
CREATE INDEX IF NOT EXISTS "CurriculumLevel_subjectId_sequenceOrder_idx" ON "CurriculumLevel"("subjectId", "sequenceOrder");

CREATE UNIQUE INDEX IF NOT EXISTS "SubjectDomain_levelId_code_key" ON "SubjectDomain"("levelId", "code");
CREATE INDEX IF NOT EXISTS "SubjectDomain_subjectId_sequenceOrder_idx" ON "SubjectDomain"("subjectId", "sequenceOrder");
CREATE INDEX IF NOT EXISTS "SubjectDomain_levelId_sequenceOrder_idx" ON "SubjectDomain"("levelId", "sequenceOrder");

CREATE UNIQUE INDEX IF NOT EXISTS "SubjectTopic_levelId_code_key" ON "SubjectTopic"("levelId", "code");
CREATE INDEX IF NOT EXISTS "SubjectTopic_domainId_sequenceOrder_idx" ON "SubjectTopic"("domainId", "sequenceOrder");
CREATE INDEX IF NOT EXISTS "SubjectTopic_subjectId_levelId_sequenceOrder_idx" ON "SubjectTopic"("subjectId", "levelId", "sequenceOrder");
CREATE INDEX IF NOT EXISTS "SubjectTopic_contentStatus_idx" ON "SubjectTopic"("contentStatus");

CREATE UNIQUE INDEX IF NOT EXISTS "MasteryNode_topicId_code_key" ON "MasteryNode"("topicId", "code");
CREATE INDEX IF NOT EXISTS "MasteryNode_topicId_sequenceOrder_idx" ON "MasteryNode"("topicId", "sequenceOrder");
CREATE INDEX IF NOT EXISTS "MasteryNode_nodeType_active_idx" ON "MasteryNode"("nodeType", "active");

CREATE UNIQUE INDEX IF NOT EXISTS "MasteryEdge_fromNodeId_toNodeId_key" ON "MasteryEdge"("fromNodeId", "toNodeId");
CREATE INDEX IF NOT EXISTS "MasteryEdge_toNodeId_idx" ON "MasteryEdge"("toNodeId");

CREATE INDEX IF NOT EXISTS "LessonModule_nodeId_sequenceOrder_idx" ON "LessonModule"("nodeId", "sequenceOrder");
CREATE INDEX IF NOT EXISTS "LessonModule_contentStatus_idx" ON "LessonModule"("contentStatus");

CREATE UNIQUE INDEX IF NOT EXISTS "QuestionPool_nodeId_poolType_key" ON "QuestionPool"("nodeId", "poolType");
CREATE INDEX IF NOT EXISTS "QuestionPool_contentStatus_idx" ON "QuestionPool"("contentStatus");

CREATE INDEX IF NOT EXISTS "QuestionItem_poolId_idx" ON "QuestionItem"("poolId");
CREATE INDEX IF NOT EXISTS "QuestionItem_nodeId_difficulty_idx" ON "QuestionItem"("nodeId", "difficulty");
CREATE INDEX IF NOT EXISTS "QuestionItem_contentStatus_idx" ON "QuestionItem"("contentStatus");

CREATE UNIQUE INDEX IF NOT EXISTS "MasteryCheckpoint_nodeId_stage_key" ON "MasteryCheckpoint"("nodeId", "stage");

CREATE UNIQUE INDEX IF NOT EXISTS "TopicMisconception_topicId_code_key" ON "TopicMisconception"("topicId", "code");
CREATE INDEX IF NOT EXISTS "TopicMisconception_topicId_idx" ON "TopicMisconception"("topicId");

CREATE INDEX IF NOT EXISTS "InterventionRule_nodeId_triggerType_idx" ON "InterventionRule"("nodeId", "triggerType");
CREATE INDEX IF NOT EXISTS "RevisionRule_nodeId_scheduleType_idx" ON "RevisionRule"("nodeId", "scheduleType");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CurriculumLevel_subjectId_fkey') THEN
    ALTER TABLE "CurriculumLevel" ADD CONSTRAINT "CurriculumLevel_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SubjectDomain_subjectId_fkey') THEN
    ALTER TABLE "SubjectDomain" ADD CONSTRAINT "SubjectDomain_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SubjectDomain_levelId_fkey') THEN
    ALTER TABLE "SubjectDomain" ADD CONSTRAINT "SubjectDomain_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "CurriculumLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SubjectTopic_subjectId_fkey') THEN
    ALTER TABLE "SubjectTopic" ADD CONSTRAINT "SubjectTopic_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SubjectTopic_levelId_fkey') THEN
    ALTER TABLE "SubjectTopic" ADD CONSTRAINT "SubjectTopic_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "CurriculumLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SubjectTopic_domainId_fkey') THEN
    ALTER TABLE "SubjectTopic" ADD CONSTRAINT "SubjectTopic_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "SubjectDomain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MasteryNode_topicId_fkey') THEN
    ALTER TABLE "MasteryNode" ADD CONSTRAINT "MasteryNode_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "SubjectTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MasteryEdge_fromNodeId_fkey') THEN
    ALTER TABLE "MasteryEdge" ADD CONSTRAINT "MasteryEdge_fromNodeId_fkey" FOREIGN KEY ("fromNodeId") REFERENCES "MasteryNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MasteryEdge_toNodeId_fkey') THEN
    ALTER TABLE "MasteryEdge" ADD CONSTRAINT "MasteryEdge_toNodeId_fkey" FOREIGN KEY ("toNodeId") REFERENCES "MasteryNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LessonModule_nodeId_fkey') THEN
    ALTER TABLE "LessonModule" ADD CONSTRAINT "LessonModule_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "MasteryNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'QuestionPool_nodeId_fkey') THEN
    ALTER TABLE "QuestionPool" ADD CONSTRAINT "QuestionPool_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "MasteryNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'QuestionItem_poolId_fkey') THEN
    ALTER TABLE "QuestionItem" ADD CONSTRAINT "QuestionItem_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "QuestionPool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'QuestionItem_nodeId_fkey') THEN
    ALTER TABLE "QuestionItem" ADD CONSTRAINT "QuestionItem_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "MasteryNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MasteryCheckpoint_nodeId_fkey') THEN
    ALTER TABLE "MasteryCheckpoint" ADD CONSTRAINT "MasteryCheckpoint_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "MasteryNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TopicMisconception_topicId_fkey') THEN
    ALTER TABLE "TopicMisconception" ADD CONSTRAINT "TopicMisconception_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "SubjectTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'InterventionRule_nodeId_fkey') THEN
    ALTER TABLE "InterventionRule" ADD CONSTRAINT "InterventionRule_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "MasteryNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'RevisionRule_nodeId_fkey') THEN
    ALTER TABLE "RevisionRule" ADD CONSTRAINT "RevisionRule_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "MasteryNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
