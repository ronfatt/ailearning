"use client";

import { useEffect, useState, useTransition } from "react";

import { promptRoleAssistant } from "@/components/role-assistant-chatbox";
import { StatusPill } from "@/components/status-pill";
import type { ApprovalStatus } from "@/lib/mvp-data";

type ApprovalQueueItem = {
  id: string;
  entityType:
    | "lesson_plan"
    | "study_plan"
    | "class_summary"
    | "homework_assignment"
    | "parent_report"
    | "readiness_check";
  resourcePath: string;
  title: string;
  owner: string;
  status: ApprovalStatus;
  generatedAt: string;
  reviewedAt: string;
  approvedByTutorId: string;
  versionHistory: string[];
  availableActions: ApprovalStatus[];
  draftPreview?: {
    summary?: string;
    lines: string[];
  };
  studyPlanTopics?: Array<{
    id: string;
    topicKey: string;
    topicLabel: string;
    accessApproved: boolean;
    sequenceOrder: number;
  }>;
};

type LessonSuggestionItem = {
  id: string;
  entityType: "lesson_plan";
  resourcePath: string;
  title: string;
  detail: string;
  status: ApprovalStatus;
  generatedAt: string;
  reviewedAt: string;
  approvedByTutorId: string;
  versionHistory: string[];
  availableActions: ApprovalStatus[];
  draftPreview?: {
    summary?: string;
    lines: string[];
  };
};

type TutorDashboardResponse = {
  data: {
    summary: {
      lessonPlanDrafts: number;
      studyPlanQueue: number;
      homeworkQueue: number;
      parentReportQueue: number;
      readinessQueue: number;
      submissionReviewQueue: number;
      classSummaryQueue: number;
      totalPendingApprovals: number;
    };
    lessonSuggestions: LessonSuggestionItem[];
    studyPlanQueue: ApprovalQueueItem[];
    classSummaryQueue: ApprovalQueueItem[];
    assignmentQueue: ApprovalQueueItem[];
    parentReportQueue: ApprovalQueueItem[];
    readinessQueue: ApprovalQueueItem[];
    submissionReviewQueue: Array<{
      id: string;
      studentId: string;
      homeworkAssignmentId: string;
      title: string;
      owner: string;
      curriculumTopicCode: string | null;
      curriculumTopicName: string | null;
      masteryNodeTitles: string[];
      submittedAt: string;
      score: string;
      tutorFeedback: string;
      needsReview: boolean;
      submissionPreview?: {
        summary?: string;
        lines: string[];
      };
      answerDetails: Array<{
        questionId: string;
        prompt: string;
        answer: string;
        feedback: string;
      }>;
    }>;
    todaysClasses: Array<{
      id: string;
      name: string;
      subject: string;
      schedule: string;
      readiness: string;
      attendance: string;
      focus: string;
    }>;
    liveClassWorkspace: Array<{
      classId: string;
      sessionTitle: string;
      sessionStatus: string;
      sessionTime: string;
      liveRoomUrl: string | null;
      focusTopic: string;
      sessionMode: string;
      rosterReadyCount: number;
      supportCount: number;
      quickWins: string[];
      tutorChecklist: string[];
      studentSignals: Array<{
        studentId: string;
        studentName: string;
        readinessLabel: string;
        masteryLabel: string;
        attendanceLabel: string;
        homeworkLabel: string;
        priority: "high" | "medium" | "steady";
        coachNote: string;
        recentActionLabel?: string;
      }>;
    }>;
    afterClassFollowUp: Array<{
      classId: string;
      className: string;
      focusTopic: string;
      flaggedStudents: Array<{
        studentId: string;
        studentName: string;
        reason: string;
        nextAction: string;
      }>;
      miniRevisionDrafts: Array<{
        id: string;
        studentId: string;
        studentName: string;
        title: string;
        status: ApprovalStatus;
        updatedAt: string;
      }>;
      parentNoteDrafts: Array<{
        id: string;
        studentId: string;
        studentName: string;
        title: string;
        status: ApprovalStatus;
        updatedAt: string;
      }>;
      summary: string;
    }>;
    weakTopicHeatmap: Array<{
      className: string;
      topic: string;
      intensity: number;
      note: string;
    }>;
    riskAlerts: Array<{
      student: string;
      risk: string;
      action: string;
    }>;
    classIntelligence: Array<{
      classId: string;
      className: string;
      subject: string;
      linkedLessonPlanId: string | null;
      linkedLessonPlanTitle: string | null;
      linkedLessonPlanStatus: ApprovalStatus | null;
      durationMinutes: number;
      readinessScore: number;
      participationScore: number;
      tutorGuidanceRatio: number;
      studentPracticeRatio: number;
      teachingPattern: string;
      aiInsight: string;
      nextMove: string;
      pulseRows: Array<{
        label: string;
        values: number[];
      }>;
      focusCheckpoints: Array<{
        id: string;
        timeLabel: string;
        title: string;
        signal: string;
        note: string;
      }>;
      teachingBalance: Array<{
        mode: string;
        percent: number;
        note: string;
      }>;
      teachingSlices: Array<{
        id: string;
        timeLabel: string;
        title: string;
        summary: string;
        teacherMove: string;
        studentSignal: string;
      }>;
      coreQuestions: Array<{
        id: string;
        timeLabel: string;
        question: string;
        intent: string;
        recommendedFollowUp: string;
      }>;
    }>;
    source: "database" | "unconfigured";
    message?: string;
  };
};

type TutorDashboardLiveProps = {
  tutorId?: string;
};

const actionLabels: Record<ApprovalStatus, string> = {
  draft: "Save Draft",
  tutor_reviewed: "Mark Reviewed",
  approved: "Approve",
  assigned: "Assign",
  archived: "Archive",
};

async function fetchTutorDashboard(tutorId?: string) {
  const params = new URLSearchParams();
  if (tutorId) params.set("tutorId", tutorId);

  const response = await fetch(`/api/tutor-dashboard?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load tutor dashboard data.");
  }

  return (await response.json()) as TutorDashboardResponse;
}

function ActionButtons({
  item,
  busy,
  onRunAction,
}: {
  item: ApprovalQueueItem | LessonSuggestionItem;
  busy: boolean;
  onRunAction: (item: ApprovalQueueItem | LessonSuggestionItem, nextStatus: ApprovalStatus) => void;
}) {
  if (item.availableActions.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 flex flex-wrap gap-3">
      {item.availableActions.map((nextStatus) => (
        <button
          key={`${item.id}-${nextStatus}`}
          type="button"
          disabled={busy}
          onClick={() => onRunAction(item, nextStatus)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            nextStatus === "archived"
              ? "border border-border bg-white/80 text-muted hover:border-coral hover:text-coral"
              : "bg-teal text-white hover:bg-[#09443c]"
          } ${busy ? "cursor-not-allowed opacity-60" : ""}`}
        >
          {actionLabels[nextStatus]}
        </button>
      ))}
    </div>
  );
}

function DraftPreviewCard({
  draftPreview,
  label = "Draft preview",
}: {
  draftPreview?: {
    summary?: string;
    lines: string[];
  };
  label?: string;
}) {
  if (!draftPreview || (!draftPreview.summary && draftPreview.lines.length === 0)) {
    return null;
  }

  return (
    <div className="mt-5 rounded-[1.5rem] border border-border bg-white/75 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
        {label}
      </p>
      {draftPreview.summary ? (
        <p className="mt-3 text-sm leading-7 text-foreground/88">{draftPreview.summary}</p>
      ) : null}
      {draftPreview.lines.length > 0 ? (
        <div className="mt-4 grid gap-2">
          {draftPreview.lines.map((line, index) => (
            <div
              key={`${label}-${index}-${line}`}
              className="rounded-2xl bg-surface-strong px-4 py-3 text-sm leading-7 text-muted"
            >
              {line}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TutorChannelCard({
  title,
  subtitle,
  accent,
}: {
  title: string;
  subtitle: string;
  accent: "blue" | "purple" | "mint";
}) {
  const theme =
    accent === "blue"
      ? "border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f5f9ff_100%)]"
      : accent === "purple"
        ? "border-[#e6d8ff] bg-[linear-gradient(180deg,#ffffff_0%,#f8f3ff_100%)]"
        : "border-[#ccefe6] bg-[linear-gradient(180deg,#ffffff_0%,#f1fffb_100%)]";

  const media =
    accent === "blue"
      ? "from-[#3B6CFF] to-[#12CFF3]"
      : accent === "purple"
        ? "from-[#7C5CFF] to-[#3B6CFF]"
        : "from-[#20C997] to-[#12CFF3]";

  return (
    <div className={`overflow-hidden rounded-[1.6rem] border ${theme} p-0 shadow-[0_12px_24px_rgba(59,108,255,0.05)]`}>
      <div className={`bg-gradient-to-r ${media} px-4 py-4 text-white`}>
        <p className="text-sm font-semibold text-white">{title}</p>
      </div>
      <p className="px-4 py-4 text-sm leading-7 text-muted">{subtitle}</p>
    </div>
  );
}

function QueueSection({
  title,
  subtitle,
  items,
  emptyMessage,
  busyId,
  onRunAction,
  studyPlanDrafts,
  onUpdateStudyPlanTopic,
  onAddStudyPlanTopic,
  onRemoveStudyPlanTopic,
  onMoveStudyPlanTopic,
  onSaveStudyPlanTopics,
}: {
  title: string;
  subtitle: string;
  items: ApprovalQueueItem[];
  emptyMessage: string;
  busyId: string | null;
  onRunAction: (item: ApprovalQueueItem, nextStatus: ApprovalStatus) => void;
  studyPlanDrafts: Record<
    string,
    Array<{
      id: string;
      topicKey: string;
      topicLabel: string;
      accessApproved: boolean;
      sequenceOrder: number;
    }>
  >;
  onUpdateStudyPlanTopic: (
    studyPlanId: string,
    topicId: string,
    field: "topicLabel" | "accessApproved",
    value: string | boolean,
  ) => void;
  onAddStudyPlanTopic: (studyPlanId: string) => void;
  onRemoveStudyPlanTopic: (studyPlanId: string, topicId: string) => void;
  onMoveStudyPlanTopic: (
    studyPlanId: string,
    topicId: string,
    direction: "up" | "down",
  ) => void;
  onSaveStudyPlanTopics: (studyPlanId: string) => void;
}) {
  return (
    <article className="glass-panel rounded-[2rem] p-8">
      <p className="text-sm font-medium text-muted">{title}</p>
      <h2 className="mt-2 text-2xl font-semibold text-foreground">{subtitle}</h2>
      <div className="mt-8 space-y-4">
        {items.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
            {emptyMessage}
          </div>
        ) : (
          items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-[1.75rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-0 shadow-[0_12px_24px_rgba(59,108,255,0.05)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[linear-gradient(135deg,#3B6CFF_0%,#12CFF3_100%)] px-5 py-4 text-white">
                <div>
                  <p className="text-lg font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-white/78">{item.owner}</p>
                </div>
                <div className="rounded-full bg-white/18 px-3 py-1 text-xs font-semibold text-white">
                  {item.status}
                </div>
              </div>
              <div className="p-5">
              <div className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-3">
                <p>AI draft: {item.generatedAt}</p>
                <p>Tutor review: {item.reviewedAt}</p>
                <p>Approver: {item.approvedByTutorId}</p>
              </div>
              <DraftPreviewCard draftPreview={item.draftPreview} />
              {item.entityType === "study_plan" &&
              (studyPlanDrafts[item.id]?.length ?? 0) > 0 ? (
                <div className="mt-5 rounded-[1.5rem] border border-border bg-white/75 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                      Tutor topic access editor
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onAddStudyPlanTopic(item.id)}
                        className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground transition hover:border-teal hover:text-teal"
                      >
                        Add Topic
                      </button>
                      <button
                        type="button"
                        disabled={busyId === `study-plan-save-${item.id}`}
                        onClick={() => onSaveStudyPlanTopics(item.id)}
                        className={`rounded-full bg-teal px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#09443c] ${
                          busyId === `study-plan-save-${item.id}`
                            ? "cursor-not-allowed opacity-60"
                            : ""
                        }`}
                      >
                        {busyId === `study-plan-save-${item.id}`
                          ? "Saving..."
                          : "Save Topics"}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {studyPlanDrafts[item.id].map((topic, index, list) => (
                      <div
                        key={topic.id}
                        className="grid gap-3 rounded-2xl border border-border bg-surface-strong p-4 lg:grid-cols-[1fr_auto_auto]"
                      >
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                            {topic.topicKey}
                          </p>
                          <input
                            value={topic.topicLabel}
                            onChange={(event) =>
                              onUpdateStudyPlanTopic(
                                item.id,
                                topic.id,
                                "topicLabel",
                                event.target.value,
                              )
                            }
                            className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium text-foreground outline-none transition focus:border-teal"
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => onMoveStudyPlanTopic(item.id, topic.id, "up")}
                            className={`rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground transition hover:border-teal hover:text-teal ${
                              index === 0 ? "cursor-not-allowed opacity-50" : ""
                            }`}
                          >
                            Up
                          </button>
                          <button
                            type="button"
                            disabled={index === list.length - 1}
                            onClick={() => onMoveStudyPlanTopic(item.id, topic.id, "down")}
                            className={`rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground transition hover:border-teal hover:text-teal ${
                              index === list.length - 1
                                ? "cursor-not-allowed opacity-50"
                                : ""
                            }`}
                          >
                            Down
                          </button>
                          <button
                            type="button"
                            disabled={list.length <= 1}
                            onClick={() => onRemoveStudyPlanTopic(item.id, topic.id)}
                            className={`rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-coral transition hover:border-coral ${
                              list.length <= 1 ? "cursor-not-allowed opacity-50" : ""
                            }`}
                          >
                            Remove
                          </button>
                        </div>
                        <label className="flex items-center gap-3 rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium text-foreground">
                          <input
                            type="checkbox"
                            checked={topic.accessApproved}
                            onChange={(event) =>
                              onUpdateStudyPlanTopic(
                                item.id,
                                topic.id,
                                "accessApproved",
                                event.target.checked,
                              )
                            }
                            className="h-4 w-4 accent-[#0f766e]"
                          />
                          AI access approved
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <p className="mt-4 text-sm leading-7 text-muted">
                Version history:{" "}
                {item.versionHistory.length > 0
                  ? item.versionHistory.join(", ")
                  : "No changes recorded yet"}
              </p>
              <ActionButtons
                item={item}
                busy={busyId === item.id}
                onRunAction={(target, nextStatus) =>
                  onRunAction(target as ApprovalQueueItem, nextStatus)
                }
              />
              </div>
            </article>
          ))
        )}
      </div>
    </article>
  );
}

export function TutorDashboardLive({ tutorId }: TutorDashboardLiveProps) {
  const [isPending, startTransition] = useTransition();
  const [workspaceMode, setWorkspaceMode] = useState<"focus" | "full">("focus");
  const [reviewDrafts, setReviewDrafts] = useState<
    Record<string, { score: string; tutorFeedback: string; questionFeedback: string[] }>
  >({});
  const [studyPlanDrafts, setStudyPlanDrafts] = useState<
    Record<
      string,
      Array<{
        id: string;
        topicKey: string;
        topicLabel: string;
        accessApproved: boolean;
        sequenceOrder: number;
      }>
    >
  >({});
  const [intelligenceDrafts, setIntelligenceDrafts] = useState<
    Record<
      string,
      {
        aiInsight: string;
        nextMove: string;
        teachingSlices: Array<{
          id: string;
          timeLabel: string;
          title: string;
          summary: string;
          teacherMove: string;
          studentSignal: string;
        }>;
        coreQuestions: Array<{
          id: string;
          timeLabel: string;
          question: string;
          intent: string;
          recommendedFollowUp: string;
        }>;
      }
    >
  >({});
  const [selectedClassId, setSelectedClassId] = useState("");
  const [state, setState] = useState<{
    loading: boolean;
    data: TutorDashboardResponse["data"] | null;
    error: string | null;
    busyId: string | null;
  }>({
    loading: true,
    data: null,
    error: null,
    busyId: null,
  });

  function syncIntelligenceDrafts(data: TutorDashboardResponse["data"]) {
    setIntelligenceDrafts((current) => {
      const next = { ...current };

      for (const item of data.classIntelligence) {
        next[item.classId] = {
          aiInsight: item.aiInsight,
          nextMove: item.nextMove,
          teachingSlices: item.teachingSlices.map((slice) => ({ ...slice })),
          coreQuestions: item.coreQuestions.map((question) => ({ ...question })),
        };
      }

      return next;
    });
  }

  function syncStudyPlanDrafts(data: TutorDashboardResponse["data"]) {
    setStudyPlanDrafts((current) => {
      const next = { ...current };

      for (const item of data.studyPlanQueue) {
        next[item.id] = (item.studyPlanTopics ?? []).map((topic) => ({ ...topic }));
      }

      return next;
    });
  }

  useEffect(() => {
    let cancelled = false;

    void fetchTutorDashboard(tutorId)
      .then((payload) => {
        if (!cancelled) {
          const firstClassId = payload.data.todaysClasses[0]?.id ?? "";
          setState({
            loading: false,
            data: payload.data,
            error: null,
            busyId: null,
          });
          syncIntelligenceDrafts(payload.data);
          syncStudyPlanDrafts(payload.data);
          setSelectedClassId((current) => current || firstClassId);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            loading: false,
            data: null,
            error:
              error instanceof Error
                ? error.message
                : "Failed to load tutor dashboard data.",
            busyId: null,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [tutorId]);

  function runApprovalAction(
    item: ApprovalQueueItem | LessonSuggestionItem,
    nextStatus: ApprovalStatus,
  ) {
    startTransition(() => {
      setState((current) => ({
        ...current,
        busyId: item.id,
      }));

      void fetch(item.resourcePath, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approvalStatus: nextStatus,
          tutorId,
          versionNote: `Tutor action: ${actionLabels[nextStatus]}`,
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as
              | { error?: string }
              | null;
            throw new Error(payload?.error ?? "Failed to update approval status.");
          }

          return fetchTutorDashboard(tutorId);
        })
        .then((payload) => {
          setState({
            loading: false,
            data: payload.data,
            error: null,
            busyId: null,
          });
          syncIntelligenceDrafts(payload.data);
          syncStudyPlanDrafts(payload.data);
        })
        .catch((error: unknown) => {
          setState((current) => ({
            ...current,
            error:
              error instanceof Error
                ? error.message
                : "Failed to update approval status.",
            busyId: null,
          }));
        });
    });
  }

  function updateReviewDraft(
    submissionId: string,
    nextValue: Partial<{
      score: string;
      tutorFeedback: string;
      questionFeedback: string[];
    }>,
  ) {
    setReviewDrafts((current) => ({
      ...current,
      [submissionId]: {
        score: current[submissionId]?.score ?? "",
        tutorFeedback: current[submissionId]?.tutorFeedback ?? "",
        questionFeedback: current[submissionId]?.questionFeedback ?? [],
        ...nextValue,
      },
    }));
  }

  function updateQuestionFeedbackDraft(
    submissionId: string,
    answerIndex: number,
    value: string,
  ) {
    setReviewDrafts((current) => {
      const existing = current[submissionId] ?? {
        score: "",
        tutorFeedback: "",
        questionFeedback: [],
      };
      const questionFeedback = [...existing.questionFeedback];
      questionFeedback[answerIndex] = value;

      return {
        ...current,
        [submissionId]: {
          ...existing,
          questionFeedback,
        },
      };
    });
  }

  function updateStudyPlanTopicDraft(
    studyPlanId: string,
    topicId: string,
    field: "topicLabel" | "accessApproved",
    value: string | boolean,
  ) {
    setStudyPlanDrafts((current) => {
      const existing = current[studyPlanId];

      if (!existing) {
        return current;
      }

      return {
        ...current,
        [studyPlanId]: existing.map((topic) =>
          topic.id === topicId ? { ...topic, [field]: value } : topic,
        ),
      };
    });
  }

  function addStudyPlanTopic(studyPlanId: string) {
    setStudyPlanDrafts((current) => {
      const existing = current[studyPlanId] ?? [];
      const nextIndex = existing.length + 1;

      return {
        ...current,
        [studyPlanId]: [
          ...existing,
          {
            id: `draft-topic-${Date.now()}-${nextIndex}`,
            topicKey: `custom-topic-${nextIndex}`,
            topicLabel: `New Topic ${nextIndex}`,
            accessApproved: false,
            sequenceOrder: nextIndex,
          },
        ],
      };
    });
  }

  function removeStudyPlanTopic(studyPlanId: string, topicId: string) {
    setStudyPlanDrafts((current) => {
      const existing = current[studyPlanId] ?? [];

      if (existing.length <= 1) {
        return current;
      }

      return {
        ...current,
        [studyPlanId]: existing
          .filter((topic) => topic.id !== topicId)
          .map((topic, index) => ({
            ...topic,
            sequenceOrder: index + 1,
          })),
      };
    });
  }

  function moveStudyPlanTopic(
    studyPlanId: string,
    topicId: string,
    direction: "up" | "down",
  ) {
    setStudyPlanDrafts((current) => {
      const existing = [...(current[studyPlanId] ?? [])];
      const index = existing.findIndex((topic) => topic.id === topicId);

      if (index === -1) {
        return current;
      }

      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= existing.length) {
        return current;
      }

      const [topic] = existing.splice(index, 1);
      existing.splice(targetIndex, 0, topic);

      return {
        ...current,
        [studyPlanId]: existing.map((item, order) => ({
          ...item,
          sequenceOrder: order + 1,
        })),
      };
    });
  }

  function normalizeTopicKey(label: string, fallback: string) {
    const normalized = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 32);

    return normalized || fallback;
  }

  function saveStudyPlanTopics(studyPlanId: string) {
    if (!tutorId) {
      return;
    }

    const draft = studyPlanDrafts[studyPlanId];

    if (!draft) {
      return;
    }

    startTransition(() => {
      setState((current) => ({
        ...current,
        busyId: `study-plan-save-${studyPlanId}`,
      }));

      void fetch(`/api/study-plans/${studyPlanId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tutorId,
          revisionTopics: draft.map((topic, index) => ({
            topicKey: normalizeTopicKey(topic.topicLabel, topic.topicKey),
            topicLabel: topic.topicLabel.trim() || `Topic ${index + 1}`,
            accessApproved: topic.accessApproved,
            sequenceOrder: index + 1,
          })),
          versionNote: "tutor updated starter study plan topics",
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as
              | { error?: string }
              | null;
            throw new Error(payload?.error ?? "Failed to save study plan topics.");
          }

          return fetchTutorDashboard(tutorId);
        })
        .then((payload) => {
          setState({
            loading: false,
            data: payload.data,
            error: null,
            busyId: null,
          });
          syncIntelligenceDrafts(payload.data);
          syncStudyPlanDrafts(payload.data);
        })
        .catch((error: unknown) => {
          setState((current) => ({
            ...current,
            error:
              error instanceof Error
                ? error.message
                : "Failed to save study plan topics.",
            busyId: null,
          }));
        });
    });
  }

  function submitTutorReview(
    item: TutorDashboardResponse["data"]["submissionReviewQueue"][number],
  ) {
    if (!tutorId) {
      return;
    }

    const draft = reviewDrafts[item.id];

    startTransition(() => {
      setState((current) => ({
        ...current,
        busyId: item.id,
      }));

      void fetch(`/api/homework-submissions/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tutorId,
          score:
            draft?.score && draft.score.trim().length > 0
              ? Number(draft.score)
              : undefined,
          tutorFeedback: draft?.tutorFeedback,
          questionFeedback: item.answerDetails.map((detail, index) => ({
            questionId: detail.questionId,
            prompt: detail.prompt,
            answer: detail.answer,
            feedback:
              draft?.questionFeedback[index]?.trim() ??
              detail.feedback,
          })),
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as
              | { error?: string }
              | null;
            throw new Error(payload?.error ?? "Failed to review homework submission.");
          }

          return fetchTutorDashboard(tutorId);
        })
        .then((payload) => {
          setState({
            loading: false,
            data: payload.data,
            error: null,
            busyId: null,
          });
          syncIntelligenceDrafts(payload.data);
          syncStudyPlanDrafts(payload.data);
          setReviewDrafts((current) => {
            const next = { ...current };
            delete next[item.id];
            return next;
          });
        })
        .catch((error: unknown) => {
          setState((current) => ({
            ...current,
            error:
              error instanceof Error
                ? error.message
                : "Failed to review homework submission.",
            busyId: null,
          }));
        });
    });
  }

  function updateIntelligenceDraft(
    classId: string,
    field: "aiInsight" | "nextMove",
    value: string,
  ) {
    setIntelligenceDrafts((current) => {
      const existing = current[classId];

      if (!existing) {
        return current;
      }

      return {
        ...current,
        [classId]: {
          ...existing,
          [field]: value,
        },
      };
    });
  }

  function updateTeachingSliceDraft(
    classId: string,
    sliceId: string,
    field: "summary" | "teacherMove",
    value: string,
  ) {
    setIntelligenceDrafts((current) => {
      const existing = current[classId];

      if (!existing) {
        return current;
      }

      return {
        ...current,
        [classId]: {
          ...existing,
          teachingSlices: existing.teachingSlices.map((slice) =>
            slice.id === sliceId ? { ...slice, [field]: value } : slice,
          ),
        },
      };
    });
  }

  function updateCoreQuestionDraft(
    classId: string,
    questionId: string,
    field: "question" | "recommendedFollowUp",
    value: string,
  ) {
    setIntelligenceDrafts((current) => {
      const existing = current[classId];

      if (!existing) {
        return current;
      }

      return {
        ...current,
        [classId]: {
          ...existing,
          coreQuestions: existing.coreQuestions.map((question) =>
            question.id === questionId ? { ...question, [field]: value } : question,
          ),
        },
      };
    });
  }

  function saveIntelligenceDraft(mode: "save" | "review") {
    if (!tutorId || !selectedClassIntelligence?.linkedLessonPlanId) {
      return;
    }

    const draft = intelligenceDrafts[selectedClassIntelligence.classId];

    if (!draft) {
      return;
    }

    const shouldMarkReviewed =
      mode === "review" && selectedClassIntelligence.linkedLessonPlanStatus === "draft";

    startTransition(() => {
      setState((current) => ({
        ...current,
        busyId: `${mode}-intelligence-${selectedClassIntelligence.classId}`,
      }));

      void fetch(`/api/lesson-plans/${selectedClassIntelligence.linkedLessonPlanId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tutorId,
          tutorEditedContent: {
            aiInsight: draft.aiInsight,
            nextMove: draft.nextMove,
            teachingSlices: draft.teachingSlices,
            coreQuestions: draft.coreQuestions,
            updatedFrom: "tutor-dashboard-intelligence-editor",
          },
          approvalStatus: shouldMarkReviewed ? "tutor_reviewed" : undefined,
          versionNote: shouldMarkReviewed
            ? "tutor refined classroom intelligence and marked lesson draft reviewed"
            : "tutor refined classroom intelligence draft",
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as
              | { error?: string }
              | null;
            throw new Error(payload?.error ?? "Failed to save classroom intelligence draft.");
          }

          return fetchTutorDashboard(tutorId);
        })
        .then((payload) => {
          setState({
            loading: false,
            data: payload.data,
            error: null,
            busyId: null,
          });
          syncIntelligenceDrafts(payload.data);
          syncStudyPlanDrafts(payload.data);
        })
        .catch((error: unknown) => {
          setState((current) => ({
            ...current,
            error:
              error instanceof Error
                ? error.message
                : "Failed to save classroom intelligence draft.",
            busyId: null,
          }));
        });
    });
  }

  function runCopilotAction(
    tool:
      | "warm-up"
      | "quick-quiz"
      | "class-poll"
      | "concept-explanation"
      | "class-summary",
  ) {
    if (!tutorId || !selectedClassId) {
      return;
    }

    const endpointMap = {
      "warm-up": "/api/tutor-tools/warm-up-quiz",
      "quick-quiz": "/api/tutor-tools/quick-quiz",
      "class-poll": "/api/tutor-tools/class-poll",
      "concept-explanation": "/api/tutor-tools/concept-explanation",
      "class-summary": "/api/tutor-tools/class-summary-draft",
    } as const;

    const endpoint = endpointMap[tool];

    startTransition(() => {
      setState((current) => ({
        ...current,
        busyId: tool,
      }));

      void fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tutorId,
          classId: selectedClassId,
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as
              | { error?: string }
              | null;
            throw new Error(payload?.error ?? "Failed to run tutor copilot action.");
          }

          return fetchTutorDashboard(tutorId);
        })
        .then((payload) => {
          setState({
            loading: false,
            data: payload.data,
            error: null,
            busyId: null,
          });
          syncIntelligenceDrafts(payload.data);
        })
        .catch((error: unknown) => {
          setState((current) => ({
            ...current,
            error:
              error instanceof Error
                ? error.message
                : "Failed to run tutor copilot action.",
            busyId: null,
          }));
        });
    });
  }

  function runLiveWorkspaceAction(
    action:
      | "mark_checked"
      | "flag_follow_up"
      | "draft_parent_note"
      | "draft_mini_revision",
    student: {
      studentId: string;
      studentName: string;
    },
  ) {
    if (!tutorId || !selectedLiveWorkspace) {
      return;
    }

    const busyKey = `${action}-${student.studentId}`;

    startTransition(() => {
      setState((current) => ({
        ...current,
        busyId: busyKey,
      }));

      void fetch("/api/live-workspace-actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          tutorId,
          classId: selectedLiveWorkspace.classId,
          studentId: student.studentId,
          studentName: student.studentName,
          focusTopic: selectedLiveWorkspace.focusTopic,
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as
              | { error?: string }
              | null;
            throw new Error(payload?.error ?? "Failed to run live workspace action.");
          }

          return fetchTutorDashboard(tutorId);
        })
        .then((payload) => {
          setState({
            loading: false,
            data: payload.data,
            error: null,
            busyId: null,
          });
          syncIntelligenceDrafts(payload.data);
        })
        .catch((error: unknown) => {
          setState((current) => ({
            ...current,
            error:
              error instanceof Error
                ? error.message
                : "Failed to run live workspace action.",
            busyId: null,
          }));
        });
    });
  }

  if (state.loading) {
    return (
      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="glass-panel rounded-[2rem] p-8 text-sm leading-7 text-muted">
          Loading lesson suggestions and approval queues from the live workflow API.
        </div>
      </section>
    );
  }

  if (state.error && !state.data) {
    return (
      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="glass-panel rounded-[2rem] p-8 text-sm leading-7 text-coral">
          {state.error}
        </div>
      </section>
    );
  }

  if (!state.data) {
    return null;
  }

  function askTutorAssistant(message: string) {
    promptRoleAssistant({
      role: "tutor",
      message,
    });
  }

  const selectedClassIntelligence =
    state.data.classIntelligence.find((item) => item.classId === selectedClassId) ??
    state.data.classIntelligence[0] ??
    null;
  const selectedLiveWorkspace =
    state.data.liveClassWorkspace.find((item) => item.classId === selectedClassId) ??
    state.data.liveClassWorkspace[0] ??
    null;
  const selectedAfterClassFollowUp =
    state.data.afterClassFollowUp.find((item) => item.classId === selectedClassId) ??
    state.data.afterClassFollowUp[0] ??
    null;
  const selectedClassHeatmap =
    selectedClassIntelligence
      ? state.data.weakTopicHeatmap.filter(
          (item) => item.className === selectedClassIntelligence.className,
        )
      : [];
  const selectedIntelligenceDraft = selectedClassIntelligence
    ? intelligenceDrafts[selectedClassIntelligence.classId] ?? {
        aiInsight: selectedClassIntelligence.aiInsight,
        nextMove: selectedClassIntelligence.nextMove,
        teachingSlices: selectedClassIntelligence.teachingSlices,
        coreQuestions: selectedClassIntelligence.coreQuestions,
      }
    : null;
  const todayPriorityCards = [
    {
      id: "live",
      label: "Step 1",
      title: selectedLiveWorkspace
        ? `Run ${selectedLiveWorkspace.sessionTitle}`
        : "Run the live class",
      detail: selectedLiveWorkspace
        ? `${selectedLiveWorkspace.supportCount} students need early attention · ${selectedLiveWorkspace.focusTopic}`
        : "Open the live workspace and teach from one screen.",
      status: selectedLiveWorkspace?.sessionStatus ?? "Pending",
      href: "#live-workspace",
      cta: "Open Live Class",
      tone: "from-[#7C5CFF] to-[#3B6CFF]",
    },
    {
      id: "queue",
      label: "Step 2",
      title: "Clear blocked approvals",
      detail: `${state.data.summary.totalPendingApprovals} approval item${
        state.data.summary.totalPendingApprovals === 1 ? "" : "s"
      } are waiting for tutor action.`,
      status: `${state.data.summary.totalPendingApprovals} waiting`,
      href: "#approval-center",
      cta: "Open Queue",
      tone: "from-[#3B6CFF] to-[#12CFF3]",
    },
    {
      id: "follow-up",
      label: "Step 3",
      title: "Close follow-up before you log off",
      detail: selectedAfterClassFollowUp
        ? selectedAfterClassFollowUp.summary
        : "Handle mini revision, parent notes, and flagged students after class.",
      status: selectedAfterClassFollowUp
        ? `${selectedAfterClassFollowUp.flaggedStudents.length} flagged`
        : "Review",
      href: "#after-class-follow-up",
      cta: "Open Follow-Up",
      tone: "from-[#FF9F1C] to-[#FB7185]",
    },
  ] as const;
  const priorityStudents = selectedLiveWorkspace
    ? selectedLiveWorkspace.studentSignals.filter(
        (student) => student.priority === "high" || student.priority === "medium",
      )
    : [];

  return (
    <>
      {state.error ? (
        <section className="grid gap-6">
          <div className="glass-panel rounded-[2rem] border border-coral/30 p-5 text-sm leading-7 text-coral">
            {state.error}
          </div>
        </section>
      ) : null}

      <section
        id="tutor-priority"
        className="overflow-hidden rounded-[2.2rem] border border-[#e4ddff] bg-[radial-gradient(circle_at_top_left,rgba(124,92,255,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(59,108,255,0.12),transparent_20%),linear-gradient(145deg,#ffffff_0%,#f3f0ff_54%,#eef4ff_100%)] p-8 shadow-[0_24px_64px_rgba(124,92,255,0.1)]"
      >
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7C5CFF]">
              Today&apos;s priority
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              Start with the class, clear blockers second, then close follow-up fast
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              This screen should tell you what to do first before you dive into deeper
              analytics or editing tools.
            </p>
          </div>
          <div className="grid gap-3 sm:min-w-[250px] sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/80 bg-white/92 p-5 shadow-[0_14px_28px_rgba(124,92,255,0.06)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8597]">
                Next class
              </p>
              <p className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                {selectedLiveWorkspace?.sessionTime ?? "Pending"}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/80 bg-white/92 p-5 shadow-[0_14px_28px_rgba(124,92,255,0.06)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8597]">
                Students to watch
              </p>
              <p className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                {selectedLiveWorkspace?.supportCount ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {todayPriorityCards.map((card) => (
            <article
              key={card.id}
              className="overflow-hidden rounded-[1.7rem] border border-[#e4ddff] bg-white/95 shadow-[0_14px_28px_rgba(124,92,255,0.05)]"
            >
              <div className={`bg-gradient-to-r ${card.tone} px-5 py-4 text-white`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/76">
                      {card.label}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{card.title}</h3>
                  </div>
                  <span className="rounded-full bg-white/18 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                    {card.status}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-7 text-muted">{card.detail}</p>
                <button
                  type="button"
                  onClick={() => {
                    window.location.hash = card.href;
                  }}
                  className="mt-5 inline-flex rounded-full border border-[#ddd4ff] bg-[#faf8ff] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7C5CFF] transition hover:border-[#7C5CFF] hover:bg-[#f4efff]"
                >
                  {card.cta}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="overview" className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#3B6CFF_0%,#4F7CFF_42%,#7C5CFF_100%)] p-8 text-white shadow-[0_24px_64px_rgba(59,108,255,0.2)]">
          <p className="text-sm font-medium text-white/72">Workspace mode</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Stay in focus mode until you need the deeper teaching view
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/84">
            Focus mode keeps the first screen centered on live teaching, follow-up,
            approvals, and student support. Full mode opens deeper teaching analytics
            and editing tools.
          </p>
        </article>
        <article className="rounded-[2rem] border border-[#e6ecf5] bg-white/94 p-8 shadow-[0_20px_52px_rgba(59,108,255,0.08)]">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setWorkspaceMode("focus")}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                workspaceMode === "focus"
                  ? "bg-teal text-white"
                  : "border border-border bg-white/80 text-foreground hover:border-teal hover:text-teal"
              }`}
            >
              Focus Mode
            </button>
            <button
              type="button"
              onClick={() => setWorkspaceMode("full")}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                workspaceMode === "full"
                  ? "bg-teal text-white"
                  : "border border-border bg-white/80 text-foreground hover:border-teal hover:text-teal"
              }`}
            >
              Full Analytics
            </button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["Live class", "Run the room and act on student signals.", "blue"],
              ["Approvals", "Review lesson, homework, and parent drafts.", "purple"],
              ["Follow-up", "Close the loop before the next class starts.", "mint"],
            ].map(([title, note, accent]) => (
              <TutorChannelCard
                key={title}
                title={title}
                subtitle={note}
                accent={accent as "blue" | "purple" | "mint"}
              />
            ))}
          </div>
        </article>
      </section>

      <section id="live-workspace" className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[2rem] border border-[#e6ecf5] bg-white/94 p-8 shadow-[0_20px_52px_rgba(59,108,255,0.08)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">Live class</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                Everything you need during the session
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => askTutorAssistant("Which student needs attention?")}
                className="solace-soft-pill rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7C5CFF]"
              >
                Ask AI
              </button>
              {selectedLiveWorkspace ? (
                <span className="rounded-full bg-gold-soft px-4 py-2 text-sm font-semibold text-[#8b5a13]">
                  {selectedLiveWorkspace.sessionStatus}
                </span>
              ) : null}
            </div>
          </div>

          {selectedLiveWorkspace ? (
            <>
              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#eef4ff_0%,#ffffff_100%)] p-5">
                  <p className="text-sm font-medium text-muted">Session</p>
                  <p className="mt-3 text-xl font-semibold text-foreground">
                    {selectedLiveWorkspace.sessionTitle}
                  </p>
                  <p className="mt-2 text-sm text-muted">{selectedLiveWorkspace.sessionTime}</p>
                </div>
                <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#f2edff_0%,#ffffff_100%)] p-5">
                  <p className="text-sm font-medium text-muted">Focus topic</p>
                  <p className="mt-3 text-xl font-semibold text-foreground">
                    {selectedLiveWorkspace.focusTopic}
                  </p>
                  <p className="mt-2 text-sm text-muted">{selectedLiveWorkspace.sessionMode}</p>
                </div>
                <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_100%)] p-5">
                  <p className="text-sm font-medium text-muted">Room ready</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                    {selectedLiveWorkspace.rosterReadyCount}
                  </p>
                  <p className="mt-2 text-sm text-muted">students currently steady</p>
                </div>
                <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#fff4dd_0%,#ffffff_100%)] p-5">
                  <p className="text-sm font-medium text-muted">Need attention</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                    {selectedLiveWorkspace.supportCount}
                  </p>
                  <p className="mt-2 text-sm text-muted">students to check early</p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[1.75rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-5 shadow-[0_12px_24px_rgba(59,108,255,0.05)]">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-lg font-semibold text-foreground">
                      Student attention queue
                    </p>
                    {selectedLiveWorkspace.liveRoomUrl ? (
                      <a
                        href={selectedLiveWorkspace.liveRoomUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#09443c]"
                      >
                        Open Live Room
                      </a>
                    ) : null}
                  </div>
                  <div className="mt-5 space-y-4">
                    {selectedLiveWorkspace.studentSignals.map((student) => (
                      <article
                        key={student.studentId}
                        className="overflow-hidden rounded-[1.6rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-0 shadow-[0_12px_24px_rgba(59,108,255,0.05)]"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 bg-[linear-gradient(135deg,#3B6CFF_0%,#12CFF3_100%)] px-4 py-4 text-white">
                          <p className="text-base font-semibold text-white">
                            {student.studentName}
                          </p>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              student.priority === "high"
                                ? "bg-white/20 text-white"
                                : student.priority === "medium"
                                  ? "bg-white/20 text-white"
                                  : "bg-white/20 text-white"
                            }`}
                          >
                            {student.priority === "high"
                              ? "Support first"
                              : student.priority === "medium"
                                ? "Watch closely"
                                : "Steady"}
                          </span>
                        </div>
                        <div className="p-4">
                        {student.recentActionLabel ? (
                          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                            {student.recentActionLabel}
                          </p>
                        ) : null}
                        <div className="mt-4 grid gap-2 text-sm text-muted md:grid-cols-2">
                          <p>{student.readinessLabel}</p>
                          <p>{student.masteryLabel}</p>
                          <p>{student.attendanceLabel}</p>
                          <p>{student.homeworkLabel}</p>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-foreground/88">
                          {student.coachNote}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={state.busyId === `mark_checked-${student.studentId}`}
                            onClick={() =>
                              runLiveWorkspaceAction("mark_checked", student)
                            }
                            className={`rounded-full bg-teal px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#09443c] ${
                              state.busyId === `mark_checked-${student.studentId}`
                                ? "cursor-not-allowed opacity-60"
                                : ""
                            }`}
                          >
                            Mark Checked
                          </button>
                          <button
                            type="button"
                            disabled={state.busyId === `flag_follow_up-${student.studentId}`}
                            onClick={() =>
                              runLiveWorkspaceAction("flag_follow_up", student)
                            }
                            className={`rounded-full border border-border bg-white/80 px-3 py-2 text-xs font-semibold text-foreground transition hover:border-coral hover:text-coral ${
                              state.busyId === `flag_follow_up-${student.studentId}`
                                ? "cursor-not-allowed opacity-60"
                                : ""
                            }`}
                          >
                            Needs Follow-Up
                          </button>
                          <button
                            type="button"
                            disabled={state.busyId === `draft_parent_note-${student.studentId}`}
                            onClick={() =>
                              runLiveWorkspaceAction("draft_parent_note", student)
                            }
                            className={`rounded-full border border-border bg-white/80 px-3 py-2 text-xs font-semibold text-foreground transition hover:border-teal hover:text-teal ${
                              state.busyId === `draft_parent_note-${student.studentId}`
                                ? "cursor-not-allowed opacity-60"
                                : ""
                            }`}
                          >
                            Parent Note
                          </button>
                          <button
                            type="button"
                            disabled={
                              state.busyId === `draft_mini_revision-${student.studentId}`
                            }
                            onClick={() =>
                              runLiveWorkspaceAction("draft_mini_revision", student)
                            }
                            className={`rounded-full border border-border bg-white/80 px-3 py-2 text-xs font-semibold text-foreground transition hover:border-teal hover:text-teal ${
                              state.busyId === `draft_mini_revision-${student.studentId}`
                                ? "cursor-not-allowed opacity-60"
                                : ""
                            }`}
                          >
                            Mini Revision
                          </button>
                        </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <article className="overflow-hidden rounded-[1.75rem] border border-[#ddd4ff] bg-[linear-gradient(180deg,#ffffff_0%,#f4efff_100%)] p-0 shadow-[0_12px_24px_rgba(124,92,255,0.06)]">
                    <div className="bg-[linear-gradient(135deg,#7C5CFF_0%,#3B6CFF_100%)] px-5 py-4 text-white">
                      <p className="text-lg font-semibold text-white">Quick wins</p>
                    </div>
                    <div className="p-5">
                    <div className="mt-5 space-y-3">
                      {selectedLiveWorkspace.quickWins.map((item, index) => (
                        <div
                          key={`${selectedLiveWorkspace.classId}-quick-win-${index}`}
                          className="rounded-2xl bg-white/80 px-4 py-3 text-sm leading-7 text-muted"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                    </div>
                  </article>

                  <article className="overflow-hidden rounded-[1.75rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-0 shadow-[0_12px_24px_rgba(59,108,255,0.05)]">
                    <div className="bg-[linear-gradient(135deg,#20C997_0%,#12CFF3_100%)] px-5 py-4 text-white">
                      <p className="text-lg font-semibold text-white">Tutor checklist</p>
                    </div>
                    <div className="p-5">
                    <div className="mt-5 space-y-3">
                      {selectedLiveWorkspace.tutorChecklist.map((item, index) => (
                        <div
                          key={`${selectedLiveWorkspace.classId}-checklist-${index}`}
                          className="rounded-2xl bg-white/80 px-4 py-3 text-sm leading-7 text-muted"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                    </div>
                  </article>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
              A live class workspace will appear once the tutor has at least one active or recent
              class with student signals.
            </div>
          )}
        </article>

        <article className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#ffffff_0%,#eef4ff_40%,#f3f7ff_100%)] p-8 shadow-[0_20px_52px_rgba(59,108,255,0.08)]">
          <p className="text-sm font-medium text-muted">During class prompts</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Questions and prompts to keep the session moving
          </h2>
          {selectedClassIntelligence ? (
            <div className="mt-8 space-y-4">
              {selectedClassIntelligence.coreQuestions.map((item) => (
                <article
                  key={`${item.id}-workspace`}
                  className="rounded-[1.5rem] border border-border bg-surface-strong p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-base font-semibold text-foreground">{item.question}</p>
                    <span className="rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-teal">
                      {item.timeLabel}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted">{item.intent}</p>
                  <p className="mt-3 text-sm leading-7 text-foreground/88">
                    Follow-up: {item.recommendedFollowUp}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
              Tutor-facing prompts will appear when the selected class has a live plan.
            </div>
          )}
        </article>
      </section>

      {workspaceMode === "focus" ? (
        <section id="class-snapshot" className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <article className="glass-panel rounded-[2rem] p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted">Quick class snapshot</p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  The few students worth checking again
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setWorkspaceMode("full")}
                className="rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7C5CFF] transition hover:border-[#7C5CFF]"
              >
                Open Full View
              </button>
            </div>

            {priorityStudents.length > 0 ? (
              <div className="mt-8 space-y-4">
                {priorityStudents.slice(0, 3).map((student) => (
                  <article
                    key={`focus-${student.studentId}`}
                    className="rounded-[1.5rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-foreground">
                          {student.studentName}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-muted">{student.coachNote}</p>
                      </div>
                      <span className="rounded-full bg-[#f4efff] px-3 py-1 text-xs font-semibold text-[#7C5CFF]">
                        {student.priority === "high" ? "Support first" : "Watch closely"}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-muted">
                      <p>{student.readinessLabel}</p>
                      <p>{student.masteryLabel}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
                Once a class starts sending warm-up, mastery, or homework signals, the top students to re-check will show here.
              </div>
            )}
          </article>

          <article className="glass-panel rounded-[2rem] p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted">Whole-class drag</p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  The topics slowing this class down
                </h2>
              </div>
              <button
                type="button"
                onClick={() => askTutorAssistant("Summarise the class trend for this week.")}
                className="solace-soft-pill rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7C5CFF]"
              >
                Ask AI
              </button>
            </div>

            {selectedClassIntelligence ? (
              <>
                <div className="mt-8 rounded-[1.75rem] border border-border bg-[#103b35] p-6 text-white">
                  <p className="text-sm font-medium text-white/70">Tutor takeaway</p>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {selectedClassIntelligence.teachingPattern}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-white/88">
                    {selectedClassIntelligence.aiInsight}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#b8efe4]">
                    Next move: {selectedClassIntelligence.nextMove}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  {selectedClassHeatmap.length === 0 ? (
                    <div className="rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-5 text-sm leading-7 text-muted">
                      Topic drag cards will show up here when the class has enough mastery or warm-up signals.
                    </div>
                  ) : (
                    selectedClassHeatmap.slice(0, 3).map((item) => (
                      <div
                        key={`${item.className}-${item.topic}-trend`}
                        className="rounded-[1.5rem] border border-border bg-white/80 p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-base font-semibold text-foreground">
                            {item.topic}
                          </p>
                          <span className="rounded-full bg-[#fff0f3] px-3 py-1 text-xs font-semibold text-[#e25575]">
                            {item.intensity}% risk
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-muted">{item.note}</p>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
                Class trend data will appear here once the selected class has live intelligence and weak-topic signals.
              </div>
            )}
          </article>
        </section>
      ) : (
        <section id="homework-reviews" className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <article className="glass-panel rounded-[2rem] p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted">Student signals</p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  Who is improving, steady, or stalled right now
                </h2>
              </div>
              <button
                type="button"
                onClick={() => askTutorAssistant("Which learner is improving and who is stalled?")}
                className="solace-soft-pill rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7C5CFF]"
              >
                Ask AI
              </button>
            </div>

            {selectedLiveWorkspace ? (
              <div className="mt-8 grid gap-4">
                {selectedLiveWorkspace.studentSignals.map((student) => (
                  <article
                    key={`growth-${student.studentId}`}
                    className="overflow-hidden rounded-[1.6rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-0 shadow-[0_12px_24px_rgba(59,108,255,0.05)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-[linear-gradient(135deg,#7C5CFF_0%,#3B6CFF_100%)] px-5 py-4 text-white">
                      <div>
                        <p className="text-lg font-semibold text-white">
                          {student.studentName}
                        </p>
                        <p className="mt-1 text-sm text-white/78">{student.coachNote}</p>
                      </div>
                      <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-semibold text-white">
                        {student.priority === "high"
                          ? "Needs intervention"
                          : student.priority === "medium"
                            ? "Watch this cycle"
                            : "Steady progress"}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-2">
                        <div className="rounded-2xl bg-[#eef4ff] px-4 py-3 text-[#2f5bff]">
                          {student.readinessLabel}
                        </div>
                        <div className="rounded-2xl bg-[#f3f7ff] px-4 py-3">
                          {student.masteryLabel}
                        </div>
                        <div className="rounded-2xl bg-[#ecfdf5] px-4 py-3 text-[#0f9b74]">
                          {student.attendanceLabel}
                        </div>
                        <div className="rounded-2xl bg-[#fff4dd] px-4 py-3 text-[#a86b00]">
                          {student.homeworkLabel}
                        </div>
                      </div>
                      {student.recentActionLabel ? (
                        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                          Latest tutor action: {student.recentActionLabel}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
                Student growth signals will appear here once the tutor has a linked class with readiness,
                attendance, homework, and mastery data.
              </div>
            )}
          </article>

          <article className="glass-panel rounded-[2rem] p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted">Class trend</p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  What the whole class looks like this week
                </h2>
              </div>
              <button
                type="button"
                onClick={() => askTutorAssistant("Summarise the class trend for this week.")}
                className="solace-soft-pill rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7C5CFF]"
              >
                Ask AI
              </button>
            </div>

            {selectedClassIntelligence ? (
              <>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="overflow-hidden rounded-[1.6rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f5f9ff_100%)] p-0 shadow-[0_14px_30px_rgba(59,108,255,0.08)]">
                    <div className="bg-[linear-gradient(135deg,#3B6CFF_0%,#12CFF3_100%)] px-5 py-4 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/78">
                        Readiness Trend
                      </p>
                    </div>
                    <div className="p-5">
                      <p className="text-3xl font-semibold text-foreground">
                        {selectedClassIntelligence.readinessScore}%
                      </p>
                      <p className="mt-3 text-sm text-muted">
                        Current tutor-approved pre-class baseline for the selected class.
                      </p>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-[1.6rem] border border-[#ccefe6] bg-[linear-gradient(180deg,#ffffff_0%,#f1fffb_100%)] p-0 shadow-[0_14px_30px_rgba(32,201,151,0.08)]">
                    <div className="bg-[linear-gradient(135deg,#20C997_0%,#12CFF3_100%)] px-5 py-4 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/78">
                        Participation Trend
                      </p>
                    </div>
                    <div className="p-5">
                      <p className="text-3xl font-semibold text-foreground">
                        {selectedClassIntelligence.participationScore}%
                      </p>
                      <p className="mt-3 text-sm text-muted">
                        Class energy signal based on recent completed teaching cycles.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-[1.75rem] border border-border bg-[#103b35] p-6 text-white">
                  <p className="text-sm font-medium text-white/70">Tutor takeaway</p>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {selectedClassIntelligence.teachingPattern}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-white/88">
                    {selectedClassIntelligence.aiInsight}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#b8efe4]">
                    Next move: {selectedClassIntelligence.nextMove}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  {selectedClassHeatmap.length === 0 ? (
                    <div className="rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-5 text-sm leading-7 text-muted">
                      Weak-topic trend cards will appear here when the class has enough mastery or readiness signals.
                    </div>
                  ) : (
                    selectedClassHeatmap.slice(0, 3).map((item) => (
                      <div
                        key={`${item.className}-${item.topic}-trend`}
                        className="rounded-[1.5rem] border border-border bg-white/80 p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-base font-semibold text-foreground">
                            {item.topic}
                          </p>
                          <span className="rounded-full bg-[#fff0f3] px-3 py-1 text-xs font-semibold text-[#e25575]">
                            {item.intensity}% risk
                          </span>
                        </div>
                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#eef4ff]">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(135deg,#7C5CFF_0%,#3B6CFF_100%)]"
                            style={{ width: `${item.intensity}%` }}
                          />
                        </div>
                        <p className="mt-3 text-sm leading-7 text-muted">{item.note}</p>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
                Class trend data will appear here once the selected class has live intelligence and weak-topic signals.
              </div>
            )}
          </article>
        </section>
      )}

      <section id="after-class-follow-up" className="grid gap-6 xl:grid-cols-[1fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">After class follow-up</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                The items to close before the next class starts
              </h2>
            </div>
            {selectedAfterClassFollowUp ? (
              <span className="rounded-full bg-teal-soft px-4 py-2 text-sm font-semibold text-teal">
                {selectedAfterClassFollowUp.focusTopic}
              </span>
            ) : null}
          </div>

          {selectedAfterClassFollowUp ? (
            <>
              <div className="mt-6 rounded-[1.75rem] border border-border bg-surface-strong p-5 text-sm leading-7 text-muted">
                {selectedAfterClassFollowUp.summary}
              </div>

              <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr_1fr]">
                <article className="rounded-[1.75rem] border border-border bg-surface-strong p-5">
                  <p className="text-lg font-semibold text-foreground">Students needing follow-up</p>
                  <div className="mt-5 space-y-4">
                    {selectedAfterClassFollowUp.flaggedStudents.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-border bg-white/70 p-4 text-sm leading-7 text-muted">
                        No learners are currently flagged from the live workspace.
                      </div>
                    ) : (
                      selectedAfterClassFollowUp.flaggedStudents.map((item) => (
                        <article
                          key={`${selectedAfterClassFollowUp.classId}-${item.studentId}`}
                          className="rounded-2xl bg-white/80 p-4"
                        >
                          <p className="text-base font-semibold text-foreground">
                            {item.studentName}
                          </p>
                          <p className="mt-3 text-sm leading-7 text-muted">{item.reason}</p>
                          <p className="mt-3 text-sm leading-7 text-teal">{item.nextAction}</p>
                        </article>
                      ))
                    )}
                  </div>
                </article>

                <article className="rounded-[1.75rem] border border-border bg-surface-strong p-5">
                  <p className="text-lg font-semibold text-foreground">Mini revision drafts</p>
                  <div className="mt-5 space-y-4">
                    {selectedAfterClassFollowUp.miniRevisionDrafts.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-border bg-white/70 p-4 text-sm leading-7 text-muted">
                        No mini revision drafts are waiting right now.
                      </div>
                    ) : (
                      selectedAfterClassFollowUp.miniRevisionDrafts.map((item) => (
                        <article key={item.id} className="rounded-2xl bg-white/80 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-base font-semibold text-foreground">
                              {item.title}
                            </p>
                            <StatusPill status={item.status} />
                          </div>
                          <p className="mt-3 text-sm text-muted">{item.studentName}</p>
                          <p className="mt-2 text-sm leading-7 text-muted">
                            Updated {item.updatedAt}
                          </p>
                        </article>
                      ))
                    )}
                  </div>
                </article>

                <article className="rounded-[1.75rem] border border-border bg-surface-strong p-5">
                  <p className="text-lg font-semibold text-foreground">Parent note drafts</p>
                  <div className="mt-5 space-y-4">
                    {selectedAfterClassFollowUp.parentNoteDrafts.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-border bg-white/70 p-4 text-sm leading-7 text-muted">
                        No parent note drafts are waiting right now.
                      </div>
                    ) : (
                      selectedAfterClassFollowUp.parentNoteDrafts.map((item) => (
                        <article key={item.id} className="rounded-2xl bg-white/80 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-base font-semibold text-foreground">
                              {item.title}
                            </p>
                            <StatusPill status={item.status} />
                          </div>
                          <p className="mt-3 text-sm text-muted">{item.studentName}</p>
                          <p className="mt-2 text-sm leading-7 text-muted">
                            Updated {item.updatedAt}
                          </p>
                        </article>
                      ))
                    )}
                  </div>
                </article>
              </div>
            </>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
              After-class follow-up will appear once live workspace actions or tutor drafts are
              created for a class.
            </div>
          )}
        </article>
      </section>

      {workspaceMode === "full" ? (
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-7">
        <article className="glass-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-medium text-muted">Live Lesson Drafts</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {state.data.summary.lessonPlanDrafts}
          </p>
          <p className="mt-5 text-sm leading-7 text-muted">
            Pulled from the Prisma-backed lesson plan workflow.
          </p>
        </article>
        <article className="glass-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-medium text-muted">Study Plan Queue</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {state.data.summary.studyPlanQueue}
          </p>
          <p className="mt-5 text-sm leading-7 text-muted">
            Starter revision plans waiting for tutor approval.
          </p>
        </article>
        <article className="glass-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-medium text-muted">Homework Queue</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {state.data.summary.homeworkQueue}
          </p>
          <p className="mt-5 text-sm leading-7 text-muted">
            Tutor approval work waiting after class.
          </p>
        </article>
        <article className="glass-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-medium text-muted">Parent Report Queue</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {state.data.summary.parentReportQueue}
          </p>
          <p className="mt-5 text-sm leading-7 text-muted">
            AI-drafted updates waiting for tutor review or sending.
          </p>
        </article>
        <article className="glass-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-medium text-muted">Workflow Source</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {isPending ? "Saving" : state.data.source === "database" ? "Live" : "Setup"}
          </p>
          <p className="mt-5 text-sm leading-7 text-muted">
            {state.data.message ??
              "Tutor dashboard is connected to the live approval workflow API."}
          </p>
        </article>
        <article className="glass-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-medium text-muted">Warm-up queue</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {state.data.summary.readinessQueue}
          </p>
          <p className="mt-5 text-sm leading-7 text-muted">
            Student warm-ups waiting for tutor review before class starts.
          </p>
        </article>
        <article className="glass-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-medium text-muted">Submission Reviews</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {state.data.summary.submissionReviewQueue}
          </p>
          <p className="mt-5 text-sm leading-7 text-muted">
            Student homework that needs tutor scoring or written feedback.
          </p>
        </article>
      </section>
      ) : null}

      {workspaceMode === "full" ? (
      <section className="grid gap-6 xl:grid-cols-[1fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-muted">AI teaching copilot</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                Trigger real tutor-facing actions
              </h2>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <button
                type="button"
                onClick={() => askTutorAssistant("What should I do first today?")}
                className="solace-soft-pill rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7C5CFF]"
              >
                Ask AI
              </button>
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted">Target class</span>
                <select
                  value={selectedClassId}
                  onChange={(event) => setSelectedClassId(event.target.value)}
                  className="rounded-xl border border-border bg-white/80 px-3 py-2 text-sm font-medium text-foreground outline-none transition focus:border-teal"
                >
                  {state.data.todaysClasses.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-5">
            <button
              type="button"
              disabled={!selectedClassId || state.busyId === "warm-up"}
              onClick={() => runCopilotAction("warm-up")}
              className={`rounded-[1.5rem] border border-border bg-surface-strong p-5 text-left transition hover:border-teal ${
                !selectedClassId || state.busyId === "warm-up"
                  ? "cursor-not-allowed opacity-60"
                  : ""
              }`}
            >
              <p className="text-sm font-medium text-muted">Pre-Class</p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                One-click warm-up quiz generation
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                Create or refresh a tutor-reviewed lesson draft from the latest readiness and mastery signals.
              </p>
            </button>
            <button
              type="button"
              disabled={!selectedClassId || state.busyId === "quick-quiz"}
              onClick={() => runCopilotAction("quick-quiz")}
              className={`rounded-[1.5rem] border border-border bg-surface-strong p-5 text-left transition hover:border-teal ${
                !selectedClassId || state.busyId === "quick-quiz"
                  ? "cursor-not-allowed opacity-60"
                  : ""
              }`}
            >
              <p className="text-sm font-medium text-muted">During Class</p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                Quick quiz draft
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                Draft a short in-class quiz the tutor can use to check understanding without leaving the live flow.
              </p>
            </button>
            <button
              type="button"
              disabled={!selectedClassId || state.busyId === "class-poll"}
              onClick={() => runCopilotAction("class-poll")}
              className={`rounded-[1.5rem] border border-border bg-surface-strong p-5 text-left transition hover:border-teal ${
                !selectedClassId || state.busyId === "class-poll"
                  ? "cursor-not-allowed opacity-60"
                  : ""
              }`}
            >
              <p className="text-sm font-medium text-muted">During Class</p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                Class poll draft
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                Generate live confidence-check prompts the tutor can use to decide whether to slow down or move on.
              </p>
            </button>
            <button
              type="button"
              disabled={!selectedClassId || state.busyId === "concept-explanation"}
              onClick={() => runCopilotAction("concept-explanation")}
              className={`rounded-[1.5rem] border border-border bg-surface-strong p-5 text-left transition hover:border-teal ${
                !selectedClassId || state.busyId === "concept-explanation"
                  ? "cursor-not-allowed opacity-60"
                  : ""
              }`}
            >
              <p className="text-sm font-medium text-muted">During Class</p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                Concept explanation draft
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                Build tutor-facing talking points for a difficult concept without turning AI into the main teacher.
              </p>
            </button>
            <button
              type="button"
              disabled={!selectedClassId || state.busyId === "class-summary"}
              onClick={() => runCopilotAction("class-summary")}
              className={`rounded-[1.5rem] border border-border bg-surface-strong p-5 text-left transition hover:border-teal ${
                !selectedClassId || state.busyId === "class-summary"
                  ? "cursor-not-allowed opacity-60"
                  : ""
              }`}
            >
              <p className="text-sm font-medium text-muted">Post-Class</p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                Generate class summary draft
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                Turn the latest completed session into a tutor approval draft with attendance and next-step signals.
              </p>
            </button>
          </div>
        </article>
      </section>
      ) : null}

      <section id="approval-center" className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">AI teaching copilot</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Live lesson suggestion panel
          </h2>
          <div className="mt-8 space-y-4">
            {state.data.lessonSuggestions.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
                No lesson drafts are waiting right now.
              </div>
            ) : (
              state.data.lessonSuggestions.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[1.5rem] border border-[#ddd4ff] bg-[linear-gradient(180deg,#ffffff_0%,#f4efff_100%)] p-0 shadow-[0_12px_24px_rgba(124,92,255,0.06)]"
                >
                  <div className="flex items-center justify-between gap-4 bg-[linear-gradient(135deg,#7C5CFF_0%,#3B6CFF_100%)] px-5 py-4 text-white">
                    <p className="text-lg font-semibold text-white">
                      {item.title}
                    </p>
                    <div className="rounded-full bg-white/18 px-3 py-1 text-xs font-semibold text-white">
                      {item.status}
                    </div>
                  </div>
                  <div className="p-5">
                  <p className="mt-3 text-sm leading-7 text-muted">{item.detail}</p>
                  <div className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-3">
                    <p>AI draft: {item.generatedAt}</p>
                    <p>Tutor review: {item.reviewedAt}</p>
                    <p>Approver: {item.approvedByTutorId}</p>
                  </div>
                  <DraftPreviewCard
                    draftPreview={item.draftPreview}
                    label="Lesson draft preview"
                  />
                  <p className="mt-4 text-sm leading-7 text-muted">
                    Version history:{" "}
                    {item.versionHistory.length > 0
                      ? item.versionHistory.join(", ")
                      : "No changes recorded yet"}
                  </p>
                  <ActionButtons
                    item={item}
                    busy={state.busyId === item.id}
                    onRunAction={runApprovalAction}
                  />
                  </div>
                </article>
              ))
            )}
          </div>
        </article>

        <QueueSection
          title="Study plan setup"
          subtitle="Starter study plans waiting for review"
          items={state.data.studyPlanQueue}
          emptyMessage="No starter study plans are waiting right now."
          busyId={state.busyId}
          onRunAction={runApprovalAction}
          studyPlanDrafts={studyPlanDrafts}
          onUpdateStudyPlanTopic={updateStudyPlanTopicDraft}
          onAddStudyPlanTopic={addStudyPlanTopic}
          onRemoveStudyPlanTopic={removeStudyPlanTopic}
          onMoveStudyPlanTopic={moveStudyPlanTopic}
          onSaveStudyPlanTopics={saveStudyPlanTopics}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <QueueSection
          title="Homework approvals"
          subtitle="Assignments waiting for review"
          items={state.data.assignmentQueue}
          emptyMessage="No homework approvals are waiting right now."
          busyId={state.busyId}
          onRunAction={runApprovalAction}
          studyPlanDrafts={studyPlanDrafts}
          onUpdateStudyPlanTopic={updateStudyPlanTopicDraft}
          onAddStudyPlanTopic={addStudyPlanTopic}
          onRemoveStudyPlanTopic={removeStudyPlanTopic}
          onMoveStudyPlanTopic={moveStudyPlanTopic}
          onSaveStudyPlanTopics={saveStudyPlanTopics}
        />
        <QueueSection
          title="Parent updates"
          subtitle="Parent report drafts waiting for review"
          items={state.data.parentReportQueue}
          emptyMessage="No parent reports are waiting right now."
          busyId={state.busyId}
          onRunAction={runApprovalAction}
          studyPlanDrafts={studyPlanDrafts}
          onUpdateStudyPlanTopic={updateStudyPlanTopicDraft}
          onAddStudyPlanTopic={addStudyPlanTopic}
          onRemoveStudyPlanTopic={removeStudyPlanTopic}
          onMoveStudyPlanTopic={moveStudyPlanTopic}
          onSaveStudyPlanTopics={saveStudyPlanTopics}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <QueueSection
          title="Pre-class warm-ups"
          subtitle="Warm-up submissions waiting for review"
          items={state.data.readinessQueue}
          emptyMessage="No readiness submissions are waiting right now."
          busyId={state.busyId}
          onRunAction={runApprovalAction}
          studyPlanDrafts={studyPlanDrafts}
          onUpdateStudyPlanTopic={updateStudyPlanTopicDraft}
          onAddStudyPlanTopic={addStudyPlanTopic}
          onRemoveStudyPlanTopic={removeStudyPlanTopic}
          onMoveStudyPlanTopic={moveStudyPlanTopic}
          onSaveStudyPlanTopics={saveStudyPlanTopics}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr]">
        <QueueSection
          title="Class summaries"
          subtitle="Post-class summaries waiting for review"
          items={state.data.classSummaryQueue}
          emptyMessage="No class summaries are waiting right now."
          busyId={state.busyId}
          onRunAction={runApprovalAction}
          studyPlanDrafts={studyPlanDrafts}
          onUpdateStudyPlanTopic={updateStudyPlanTopicDraft}
          onAddStudyPlanTopic={addStudyPlanTopic}
          onRemoveStudyPlanTopic={removeStudyPlanTopic}
          onMoveStudyPlanTopic={moveStudyPlanTopic}
          onSaveStudyPlanTopics={saveStudyPlanTopics}
        />
      </section>

      {workspaceMode === "full" ? (
        <>
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">Today&apos;s Classes</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                Live teaching schedule and readiness
              </h2>
            </div>
            <div className="rounded-full bg-gold-soft px-4 py-2 text-sm font-semibold text-[#8b5a13]">
              Tutor-led workflow
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {state.data.todaysClasses.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
                No active classes are connected yet.
              </div>
            ) : (
              state.data.todaysClasses.map((classItem) => (
                <article
                  key={classItem.id}
                  className="overflow-hidden rounded-[1.75rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-0 shadow-[0_12px_24px_rgba(59,108,255,0.05)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 bg-[linear-gradient(135deg,#3B6CFF_0%,#12CFF3_100%)] px-6 py-5 text-white">
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {classItem.name}
                      </p>
                      <p className="mt-1 text-sm text-white/78">{classItem.subject}</p>
                    </div>
                    <p className="rounded-full bg-white/18 px-4 py-2 text-xs font-semibold text-white">
                      {classItem.schedule}
                    </p>
                  </div>
                  <div className="p-6">
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white/80 p-4 text-sm text-muted">
                      {classItem.readiness}
                    </div>
                    <div className="rounded-2xl bg-white/80 p-4 text-sm text-muted">
                      {classItem.attendance}
                    </div>
                    <div className="rounded-2xl bg-white/80 p-4 text-sm text-muted">
                      {classItem.focus}
                    </div>
                  </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </article>

        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Pre-Class Intelligence</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Weak topic heatmap by class
          </h2>
          <div className="mt-8 space-y-5">
            {state.data.weakTopicHeatmap.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
                Weak-topic heat will show up once mastery or warm-up signals start coming in.
              </div>
            ) : (
              state.data.weakTopicHeatmap.map((item) => (
                <article
                  key={`${item.className}-${item.topic}`}
                  className="overflow-hidden rounded-[1.75rem] border border-[#ffd9b4] bg-[linear-gradient(180deg,#ffffff_0%,#fff7ec_100%)] shadow-[0_12px_24px_rgba(255,166,77,0.06)]"
                >
                  <div className="flex items-center justify-between gap-4 bg-[linear-gradient(135deg,#FFB86B_0%,#FF8A65_100%)] px-5 py-4 text-[#6f3400]">
                    <div>
                      <p className="text-lg font-semibold text-[#6f3400]">{item.topic}</p>
                      <p className="text-sm text-[#6f3400]/70">{item.className}</p>
                    </div>
                    <span className="rounded-full bg-white/28 px-3 py-1 text-xs font-semibold text-[#6f3400]">
                      {item.intensity}% risk
                    </span>
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="h-3 overflow-hidden rounded-full bg-white/80">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#ff8a65_0%,#ffb86b_100%)]"
                        style={{ width: `${item.intensity}%` }}
                      />
                    </div>
                    <p className="text-sm leading-7 text-muted">{item.note}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Classroom Intelligence</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Teacher-friendly snapshot for the selected class
          </h2>
          {selectedClassIntelligence ? (
            <>
              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: "Class duration",
                    value: selectedClassIntelligence.durationMinutes,
                    suffix: "minutes",
                    note: "Session length",
                    header: "bg-[linear-gradient(135deg,#8B5CF6_0%,#6D7CFF_100%)]",
                    text: "text-white",
                  },
                  {
                    label: "Readiness",
                    value: `${selectedClassIntelligence.readinessScore}%`,
                    suffix: "Tutor-approved baseline",
                    note: "Tutor-approved baseline signal",
                    header: "bg-[linear-gradient(135deg,#3B82F6_0%,#22D3EE_100%)]",
                    text: "text-white",
                  },
                  {
                    label: "Tutor guidance",
                    value: `${selectedClassIntelligence.tutorGuidanceRatio}%`,
                    suffix: "Teacher-led time",
                    note: "Teacher-led explanation time",
                    header: "bg-[linear-gradient(135deg,#F59E0B_0%,#FB7185_100%)]",
                    text: "text-[#6b4100]",
                  },
                  {
                    label: "Student practice",
                    value: `${selectedClassIntelligence.studentPracticeRatio}%`,
                    suffix: "Practice window",
                    note: "Independent or guided attempts",
                    header: "bg-[linear-gradient(135deg,#34D399_0%,#22C55E_100%)]",
                    text: "text-[#0b4c32]",
                  },
                ].map((card) => (
                  <article
                    key={card.label}
                    className="overflow-hidden rounded-[1.5rem] border border-[#dbe7ff] bg-white shadow-[0_12px_24px_rgba(59,108,255,0.05)]"
                  >
                    <div className={`px-5 py-4 ${card.header} ${card.text}`}>
                      <p className={`text-sm font-semibold ${card.text}`}>{card.label}</p>
                      <p className={`mt-3 text-3xl font-semibold tracking-tight ${card.text}`}>
                        {card.value}
                      </p>
                    </div>
                    <div className="space-y-2 p-5">
                      <p className="text-sm font-semibold text-foreground">{card.suffix}</p>
                      <p className="text-sm text-muted">{card.note}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-[#cfdcff] bg-[linear-gradient(135deg,#1d4ed8_0%,#5b5cf6_58%,#12cff3_100%)] p-6 text-white shadow-[0_18px_40px_rgba(59,108,255,0.18)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white/70">
                      {selectedClassIntelligence.className} · {selectedClassIntelligence.subject}
                    </p>
                    <p className="mt-3 text-xl font-semibold text-white">
                      {selectedClassIntelligence.teachingPattern}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/12 px-4 py-2 text-xs font-semibold text-white/80">
                    {selectedClassIntelligence.participationScore}% participation energy
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/88">
                  {selectedClassIntelligence.aiInsight}
                </p>
                <p className="mt-3 text-sm leading-7 text-[#b8efe4]">
                  Next move: {selectedClassIntelligence.nextMove}
                </p>
              </div>
            </>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
              Class intelligence will show up once a live class has attendance, warm-up, or mastery signals.
            </div>
          )}
        </article>

        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Engagement Pulse Map</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            A lighter, more useful version of classroom activity tracking
          </h2>
          {selectedClassIntelligence ? (
            <>
              <div className="mt-8 space-y-4">
                {selectedClassIntelligence.pulseRows.map((row) => (
                <div
                  key={`${selectedClassIntelligence.classId}-${row.label}`}
                  className="overflow-hidden rounded-[1.5rem] border border-[#dbe7ff] bg-white shadow-[0_12px_24px_rgba(59,108,255,0.05)]"
                >
                  <div className="flex items-center justify-between gap-4 bg-[linear-gradient(135deg,#EEF4FF_0%,#F4ECFF_100%)] px-5 py-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3B6CFF]">
                      {row.label}
                    </p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#7C5CFF]">
                      6 checkpoints
                    </span>
                  </div>
                  <div className="grid grid-cols-6 gap-2 p-5">
                    {row.values.map((value, index) => (
                      <div
                        key={`${row.label}-${index}`}
                        className="h-14 rounded-2xl border border-white/60"
                        style={{
                          background: `linear-gradient(180deg, rgba(79,124,255,${0.18 + value / 180}) 0%, rgba(18,207,243,${0.14 + value / 200}) 100%)`,
                        }}
                        title={`${row.label} checkpoint ${index + 1}: ${value}%`}
                      />
                    ))}
                  </div>
                </div>
              ))}
              </div>
              <p className="mt-6 text-sm leading-7 text-muted">
                Darker cells signal stronger class energy. This is meant to guide tutor pacing,
                not to replace teacher judgment or act as autonomous classroom scoring.
              </p>
            </>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
              Pulse mapping will show up after the platform sees enough participation and warm-up signals from a live class.
            </div>
          )}
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Focus Checkpoints</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            What the tutor should pay attention to during class
          </h2>
          {selectedClassIntelligence ? (
            <div className="mt-8 space-y-4">
              {selectedClassIntelligence.focusCheckpoints.map((checkpoint) => (
                <article
                  key={checkpoint.id}
                  className="overflow-hidden rounded-[1.5rem] border border-[#e6dcff] bg-white shadow-[0_12px_24px_rgba(124,92,255,0.05)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[linear-gradient(135deg,#F3E8FF_0%,#EEF4FF_100%)] px-5 py-4">
                    <p className="text-lg font-semibold text-foreground">{checkpoint.title}</p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#7C5CFF]">
                      {checkpoint.timeLabel}
                    </span>
                  </div>
                  <div className="space-y-3 p-5">
                    <p className="text-sm font-medium text-teal">{checkpoint.signal}</p>
                    <p className="text-sm leading-7 text-muted">{checkpoint.note}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
              Focus checkpoints will show up after the class has at least one live signal.
            </div>
          )}
        </article>

        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Teaching Balance</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Explain, check, practice, reflect
          </h2>
          {selectedClassIntelligence ? (
            <div className="mt-8 space-y-5">
              {selectedClassIntelligence.teachingBalance.map((item) => (
                <article
                  key={`${selectedClassIntelligence.classId}-${item.mode}`}
                  className="overflow-hidden rounded-[1.5rem] border border-[#dbe7ff] bg-white shadow-[0_12px_24px_rgba(59,108,255,0.05)]"
                >
                  <div className="flex items-center justify-between gap-4 bg-[linear-gradient(135deg,#EEF4FF_0%,#ECFDF5_100%)] px-5 py-4">
                    <div>
                      <p className="text-lg font-semibold text-foreground">{item.mode}</p>
                      <p className="text-sm text-muted">{item.note}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-teal">
                      {item.percent}%
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="h-3 overflow-hidden rounded-full bg-[#e8dcc5]">
                      <div
                        className="metric-bar h-full rounded-full"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                </article>
              ))}
              <p className="text-sm leading-7 text-muted">
                This balances structure and flexibility. It helps tutors pace the session, but the
                tutor remains the primary educator and final decision-maker.
              </p>
            </div>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
              Teaching balance will show up once a live class has enough session data.
            </div>
          )}
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">Tutor Intelligence Editor</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                Refine the lesson draft before approval
              </h2>
            </div>
            {selectedClassIntelligence?.linkedLessonPlanTitle ? (
              <div className="rounded-[1.25rem] bg-surface-strong px-4 py-3 text-sm text-muted">
                Linked lesson draft:{" "}
                <span className="font-semibold text-foreground">
                  {selectedClassIntelligence.linkedLessonPlanTitle}
                </span>
              </div>
            ) : null}
          </div>

          {!selectedClassIntelligence || !selectedIntelligenceDraft ? (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
              Select a tutor-led class with a live lesson draft to edit intelligence suggestions.
            </div>
          ) : !selectedClassIntelligence.linkedLessonPlanId ? (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
              This class does not have an open lesson draft yet. Generate a warm-up or quick quiz
              draft first, then refine it here.
            </div>
          ) : (
            <>
              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted">Tutor-facing AI insight</span>
                  <textarea
                    rows={5}
                    value={selectedIntelligenceDraft.aiInsight}
                    onChange={(event) =>
                      updateIntelligenceDraft(
                        selectedClassIntelligence.classId,
                        "aiInsight",
                        event.target.value,
                      )
                    }
                    className="w-full rounded-[1.5rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f6faff_100%)] px-4 py-4 text-sm leading-7 text-foreground outline-none transition focus:border-teal"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted">Tutor next move</span>
                  <textarea
                    rows={5}
                    value={selectedIntelligenceDraft.nextMove}
                    onChange={(event) =>
                      updateIntelligenceDraft(
                        selectedClassIntelligence.classId,
                        "nextMove",
                        event.target.value,
                      )
                    }
                    className="w-full rounded-[1.5rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f6faff_100%)] px-4 py-4 text-sm leading-7 text-foreground outline-none transition focus:border-teal"
                  />
                </label>
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
                <div className="space-y-4">
                  <p className="text-sm font-medium text-muted">Teaching slices</p>
                  {selectedIntelligenceDraft.teachingSlices.map((slice) => (
                    <article
                      key={slice.id}
                      className="overflow-hidden rounded-[1.5rem] border border-[#dbe7ff] bg-white shadow-[0_12px_24px_rgba(59,108,255,0.05)]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 bg-[linear-gradient(135deg,#EEF4FF_0%,#ECFDF5_100%)] px-5 py-4">
                        <p className="text-base font-semibold text-foreground">{slice.title}</p>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-teal">
                          {slice.timeLabel}
                        </span>
                      </div>
                      <div className="p-5">
                      <label className="block space-y-2">
                        <span className="text-sm font-medium text-muted">Slice summary</span>
                        <textarea
                          rows={3}
                          value={slice.summary}
                          onChange={(event) =>
                            updateTeachingSliceDraft(
                              selectedClassIntelligence.classId,
                              slice.id,
                              "summary",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-2xl border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f6faff_100%)] px-4 py-3 text-sm leading-7 text-foreground outline-none transition focus:border-teal"
                        />
                      </label>
                      <label className="mt-4 block space-y-2">
                        <span className="text-sm font-medium text-muted">Tutor move</span>
                        <textarea
                          rows={3}
                          value={slice.teacherMove}
                          onChange={(event) =>
                            updateTeachingSliceDraft(
                              selectedClassIntelligence.classId,
                              slice.id,
                              "teacherMove",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-2xl border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f6faff_100%)] px-4 py-3 text-sm leading-7 text-foreground outline-none transition focus:border-teal"
                        />
                      </label>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-medium text-muted">Core questions</p>
                  {selectedIntelligenceDraft.coreQuestions.map((item) => (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-[1.5rem] border border-[#ffe0b8] bg-white shadow-[0_12px_24px_rgba(255,166,77,0.05)]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 bg-[linear-gradient(135deg,#FFF3D6_0%,#FFE5B4_100%)] px-5 py-4">
                        <p className="text-base font-semibold text-foreground">{item.timeLabel}</p>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#8b5a13]">
                          Tutor prompt
                        </span>
                      </div>
                      <div className="p-5">
                      <label className="block space-y-2">
                        <span className="text-sm font-medium text-muted">Question</span>
                        <textarea
                          rows={3}
                          value={item.question}
                          onChange={(event) =>
                            updateCoreQuestionDraft(
                              selectedClassIntelligence.classId,
                              item.id,
                              "question",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-2xl border border-[#ffe0b8] bg-[linear-gradient(180deg,#ffffff_0%,#fffaf0_100%)] px-4 py-3 text-sm leading-7 text-foreground outline-none transition focus:border-teal"
                        />
                      </label>
                      <p className="mt-4 text-sm leading-7 text-muted">{item.intent}</p>
                      <label className="mt-4 block space-y-2">
                        <span className="text-sm font-medium text-muted">Follow-up</span>
                        <textarea
                          rows={3}
                          value={item.recommendedFollowUp}
                          onChange={(event) =>
                            updateCoreQuestionDraft(
                              selectedClassIntelligence.classId,
                              item.id,
                              "recommendedFollowUp",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-2xl border border-[#ffe0b8] bg-[linear-gradient(180deg,#ffffff_0%,#fffaf0_100%)] px-4 py-3 text-sm leading-7 text-foreground outline-none transition focus:border-teal"
                        />
                      </label>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={state.busyId === `save-intelligence-${selectedClassIntelligence.classId}`}
                  onClick={() => saveIntelligenceDraft("save")}
                  className={`rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#09443c] ${
                    state.busyId === `save-intelligence-${selectedClassIntelligence.classId}`
                      ? "cursor-not-allowed opacity-60"
                      : ""
                  }`}
                >
                  {state.busyId === `save-intelligence-${selectedClassIntelligence.classId}`
                    ? "Saving..."
                    : "Save Tutor Edit"}
                </button>
                {selectedClassIntelligence.linkedLessonPlanStatus === "draft" ? (
                  <button
                    type="button"
                    disabled={
                      state.busyId === `review-intelligence-${selectedClassIntelligence.classId}`
                    }
                    onClick={() => saveIntelligenceDraft("review")}
                    className={`rounded-full border border-border bg-white/80 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-teal hover:text-teal ${
                      state.busyId === `review-intelligence-${selectedClassIntelligence.classId}`
                        ? "cursor-not-allowed opacity-60"
                        : ""
                    }`}
                  >
                    {state.busyId === `review-intelligence-${selectedClassIntelligence.classId}`
                      ? "Saving..."
                      : "Save and Mark Reviewed"}
                  </button>
                ) : null}
              </div>
            </>
          )}
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Teaching Slices</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            A more actionable lesson timeline for tutors
          </h2>
          {selectedClassIntelligence ? (
            <div className="mt-8 space-y-4">
              {selectedClassIntelligence.teachingSlices.map((slice) => (
                <article
                  key={slice.id}
                  className="overflow-hidden rounded-[1.5rem] border border-[#dbe7ff] bg-white shadow-[0_12px_24px_rgba(59,108,255,0.05)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[linear-gradient(135deg,#EEF4FF_0%,#F3E8FF_100%)] px-5 py-4">
                    <p className="text-lg font-semibold text-foreground">{slice.title}</p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-teal">
                      {slice.timeLabel}
                    </span>
                  </div>
                  <div className="space-y-4 p-5">
                  <p className="text-sm leading-7 text-muted">{slice.summary}</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl bg-[linear-gradient(180deg,#ffffff_0%,#f6faff_100%)] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                        Tutor move
                      </p>
                      <p className="mt-3 text-sm leading-7 text-foreground/88">
                        {slice.teacherMove}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[linear-gradient(180deg,#ffffff_0%,#fff5f7_100%)] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral">
                        Student signal
                      </p>
                      <p className="mt-3 text-sm leading-7 text-foreground/88">
                        {slice.studentSignal}
                      </p>
                    </div>
                  </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
              Teaching slices will show up once the selected class has enough context to build a timeline.
            </div>
          )}
        </article>

        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Core Questions</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            High-value prompts for the live class
          </h2>
          {selectedClassIntelligence ? (
            <div className="mt-8 space-y-4">
              {selectedClassIntelligence.coreQuestions.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[1.5rem] border border-[#ffe0b8] bg-white shadow-[0_12px_24px_rgba(255,166,77,0.05)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[linear-gradient(135deg,#FFF3D6_0%,#FFE5B4_100%)] px-5 py-4">
                    <p className="text-lg font-semibold text-foreground">{item.question}</p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#8b5a13]">
                      {item.timeLabel}
                    </span>
                  </div>
                  <div className="space-y-4 p-5">
                  <p className="text-sm leading-7 text-muted">{item.intent}</p>
                  <div className="rounded-2xl bg-[linear-gradient(180deg,#ffffff_0%,#fffaf0_100%)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                      Follow-up if the room is unsure
                    </p>
                    <p className="mt-3 text-sm leading-7 text-foreground/88">
                      {item.recommendedFollowUp}
                    </p>
                  </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
              Core questions will show up once the system can build a tutor-facing class plan.
            </div>
          )}
        </article>
      </section>
        </>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">Homework Reviews</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                Student submissions waiting for tutor feedback
              </h2>
            </div>
            <button
              type="button"
              onClick={() => askTutorAssistant("How should I handle follow-up after class?")}
              className="solace-soft-pill rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7C5CFF]"
            >
              Ask AI
            </button>
          </div>
          <div className="mt-8 space-y-4">
            {state.data.submissionReviewQueue.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
                No student homework is waiting for review right now.
              </div>
            ) : (
              state.data.submissionReviewQueue.map((item) => {
                const draft = reviewDrafts[item.id] ?? {
                  score: item.score === "Pending" ? "" : item.score.replace("%", ""),
                  tutorFeedback:
                    item.tutorFeedback === "Pending tutor feedback"
                      ? ""
                      : item.tutorFeedback,
                  questionFeedback: item.answerDetails.map((detail) => detail.feedback),
                };

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-[1.75rem] border border-[#ffe0a8] bg-[linear-gradient(180deg,#ffffff_0%,#fff8ea_100%)] p-0 shadow-[0_12px_24px_rgba(255,209,102,0.06)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-[linear-gradient(135deg,#FFD166_0%,#FF9F1C_100%)] px-5 py-4 text-[#6b4100]">
                      <div>
                        <p className="text-lg font-semibold text-[#6b4100]">
                          {item.title}
                        </p>
                        <p className="text-sm text-[#6b4100]/72">
                          Student {item.studentId} · {item.owner}
                        </p>
                      </div>
                      <span className="rounded-full bg-white/30 px-3 py-1 text-xs font-semibold text-[#6b4100]">
                        Submitted {item.submittedAt}
                      </span>
                    </div>
                    <div className="p-5">
                    {(item.curriculumTopicName || item.masteryNodeTitles.length > 0) ? (
                      <div className="rounded-[1.5rem] border border-[#ffe8bf] bg-white/85 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a86b00]">
                          Revision focus
                        </p>
                        {item.curriculumTopicName ? (
                          <p className="mt-2 text-sm font-semibold text-foreground">
                            {item.curriculumTopicCode
                              ? `${item.curriculumTopicCode} ${item.curriculumTopicName}`
                              : item.curriculumTopicName}
                          </p>
                        ) : null}
                        {item.masteryNodeTitles.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.masteryNodeTitles.map((nodeTitle) => (
                              <span
                                key={`${item.id}-${nodeTitle}`}
                                className="rounded-full bg-[#fff4dd] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a86b00]"
                              >
                                {nodeTitle}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    <div className="mt-5 grid gap-4 lg:grid-cols-[140px_1fr_auto]">
                      {item.submissionPreview ? (
                        <div className="lg:col-span-3">
                          <DraftPreviewCard
                            draftPreview={item.submissionPreview}
                            label="Student submission"
                          />
                        </div>
                      ) : null}
                      {item.answerDetails.length > 0 ? (
                        <div className="lg:col-span-3 space-y-3">
                          {item.answerDetails.map((detail, index) => (
                            <div
                              key={`${item.id}-${detail.questionId}`}
                              className="rounded-[1.5rem] border border-border bg-white/85 p-4"
                            >
                              <p className="text-sm font-semibold text-foreground">
                                {detail.prompt}
                              </p>
                              <p className="mt-2 text-sm leading-7 text-muted">
                                Student answer: {detail.answer}
                              </p>
                              <label className="mt-3 block space-y-2">
                                <span className="text-sm font-medium text-muted">
                                  Per-question feedback
                                </span>
                                <textarea
                                  rows={2}
                                  value={draft.questionFeedback[index] ?? ""}
                                  onChange={(event) =>
                                    updateQuestionFeedbackDraft(
                                      item.id,
                                      index,
                                      event.target.value,
                                    )
                                  }
                                  className="w-full rounded-2xl border border-border bg-surface-strong px-4 py-3 text-sm text-foreground outline-none transition focus:border-teal"
                                />
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : null}
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-muted">Score</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={draft.score}
                          onChange={(event) =>
                            updateReviewDraft(item.id, { score: event.target.value })
                          }
                          className="w-full rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-teal"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-muted">Tutor feedback</span>
                        <textarea
                          rows={3}
                          value={draft.tutorFeedback}
                          onChange={(event) =>
                            updateReviewDraft(item.id, {
                              tutorFeedback: event.target.value,
                            })
                          }
                          className="w-full rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-teal"
                        />
                      </label>
                      <div className="flex items-end">
                        <button
                          type="button"
                          disabled={
                            state.busyId === item.id ||
                            (draft.score.trim().length === 0 &&
                              draft.tutorFeedback.trim().length === 0 &&
                              draft.questionFeedback.every(
                                (entry) => entry.trim().length === 0,
                              ))
                          }
                          onClick={() => submitTutorReview(item)}
                          className={`rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#09443c] ${
                            state.busyId === item.id
                              ? "cursor-not-allowed opacity-60"
                              : ""
                          }`}
                        >
                          {state.busyId === item.id ? "Saving..." : "Save Review"}
                        </button>
                      </div>
                    </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Student Risk Alerts</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Learners who need personal attention
          </h2>
          <div className="mt-8 space-y-4">
            {state.data.riskAlerts.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
                No high-priority student alerts are active right now.
              </div>
            ) : (
              state.data.riskAlerts.map((alert) => (
                <article
                  key={`${alert.student}-${alert.risk}`}
                  className="overflow-hidden rounded-[1.5rem] border border-[#ffd3db] bg-[linear-gradient(180deg,#ffffff_0%,#fff5f7_100%)] p-0 shadow-[0_12px_24px_rgba(226,85,117,0.06)]"
                >
                  <div className="flex items-center justify-between gap-4 bg-[linear-gradient(135deg,#ff7a8a_0%,#ff9f6b_100%)] px-5 py-4 text-white">
                    <p className="text-lg font-semibold text-white">
                      {alert.student}
                    </p>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                      Risk alert
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-sm leading-7 text-muted">{alert.risk}</p>
                    <p className="mt-2 text-sm leading-7 text-teal">{alert.action}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </article>
      </section>
    </>
  );
}
