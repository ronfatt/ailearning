"use client";

import { useEffect, useState, useTransition } from "react";

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
      submittedAt: string;
      score: string;
      tutorFeedback: string;
      needsReview: boolean;
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
              className="rounded-[1.75rem] border border-border bg-surface-strong p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted">{item.owner}</p>
                </div>
                <StatusPill status={item.status} />
              </div>
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
    Record<string, { score: string; tutorFeedback: string }>
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
    nextValue: Partial<{ score: string; tutorFeedback: string }>,
  ) {
    setReviewDrafts((current) => ({
      ...current,
      [submissionId]: {
        score: current[submissionId]?.score ?? "",
        tutorFeedback: current[submissionId]?.tutorFeedback ?? "",
        ...nextValue,
      },
    }));
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

  function submitTutorReview(submissionId: string) {
    if (!tutorId) {
      return;
    }

    const draft = reviewDrafts[submissionId];

    startTransition(() => {
      setState((current) => ({
        ...current,
        busyId: submissionId,
      }));

      void fetch(`/api/homework-submissions/${submissionId}`, {
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
            delete next[submissionId];
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
  const selectedIntelligenceDraft = selectedClassIntelligence
    ? intelligenceDrafts[selectedClassIntelligence.classId] ?? {
        aiInsight: selectedClassIntelligence.aiInsight,
        nextMove: selectedClassIntelligence.nextMove,
        teachingSlices: selectedClassIntelligence.teachingSlices,
        coreQuestions: selectedClassIntelligence.coreQuestions,
      }
    : null;

  return (
    <>
      {state.error ? (
        <section className="grid gap-6">
          <div className="glass-panel rounded-[2rem] border border-coral/30 p-5 text-sm leading-7 text-coral">
            {state.error}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Workspace Mode</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Start in focus mode, open analytics only when you need them
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
            Focus mode keeps the first screen centered on live teaching, follow-up,
            approvals, and student support. Full mode opens deeper teaching analytics
            and editing tools.
          </p>
        </article>
        <article className="glass-panel rounded-[2rem] p-8">
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
              ["Live class", "Run the room and act on student signals."],
              ["Approvals", "Review lesson, homework, and parent drafts."],
              ["Follow-up", "Close the loop before the next class starts."],
            ].map(([title, note]) => (
              <div
                key={title}
                className="rounded-[1.5rem] bg-surface-strong p-4"
              >
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-2 text-sm leading-7 text-muted">{note}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section id="live-workspace" className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">Live Class Workspace</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                Everything the tutor needs during the session
              </h2>
            </div>
            {selectedLiveWorkspace ? (
              <span className="rounded-full bg-gold-soft px-4 py-2 text-sm font-semibold text-[#8b5a13]">
                {selectedLiveWorkspace.sessionStatus}
              </span>
            ) : null}
          </div>

          {selectedLiveWorkspace ? (
            <>
              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[1.5rem] bg-surface-strong p-5">
                  <p className="text-sm font-medium text-muted">Session</p>
                  <p className="mt-3 text-xl font-semibold text-foreground">
                    {selectedLiveWorkspace.sessionTitle}
                  </p>
                  <p className="mt-2 text-sm text-muted">{selectedLiveWorkspace.sessionTime}</p>
                </div>
                <div className="rounded-[1.5rem] bg-surface-strong p-5">
                  <p className="text-sm font-medium text-muted">Focus topic</p>
                  <p className="mt-3 text-xl font-semibold text-foreground">
                    {selectedLiveWorkspace.focusTopic}
                  </p>
                  <p className="mt-2 text-sm text-muted">{selectedLiveWorkspace.sessionMode}</p>
                </div>
                <div className="rounded-[1.5rem] bg-surface-strong p-5">
                  <p className="text-sm font-medium text-muted">Room ready</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                    {selectedLiveWorkspace.rosterReadyCount}
                  </p>
                  <p className="mt-2 text-sm text-muted">students currently steady</p>
                </div>
                <div className="rounded-[1.5rem] bg-surface-strong p-5">
                  <p className="text-sm font-medium text-muted">Need attention</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                    {selectedLiveWorkspace.supportCount}
                  </p>
                  <p className="mt-2 text-sm text-muted">students to check early</p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[1.75rem] border border-border bg-surface-strong p-5">
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
                        className="rounded-[1.5rem] border border-border bg-white/80 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-base font-semibold text-foreground">
                            {student.studentName}
                          </p>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              student.priority === "high"
                                ? "bg-[#f8d2c7] text-coral"
                                : student.priority === "medium"
                                  ? "bg-gold-soft text-[#8b5a13]"
                                  : "bg-teal-soft text-teal"
                            }`}
                          >
                            {student.priority === "high"
                              ? "Support first"
                              : student.priority === "medium"
                                ? "Watch closely"
                                : "Steady"}
                          </span>
                        </div>
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
                      </article>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <article className="rounded-[1.75rem] border border-border bg-surface-strong p-5">
                    <p className="text-lg font-semibold text-foreground">Quick wins</p>
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
                  </article>

                  <article className="rounded-[1.75rem] border border-border bg-surface-strong p-5">
                    <p className="text-lg font-semibold text-foreground">Tutor checklist</p>
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

        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">During Class Prompting</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Tutor-facing prompts for the next 45 minutes
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

      <section id="after-class-follow-up" className="grid gap-6 xl:grid-cols-[1fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">After Class Follow-Up</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                The items the tutor should close right after class
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
          <p className="text-sm font-medium text-muted">Readiness Queue</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {state.data.summary.readinessQueue}
          </p>
          <p className="mt-5 text-sm leading-7 text-muted">
            Student pre-class submissions waiting for tutor review.
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

      <section className="grid gap-6 xl:grid-cols-[1fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-muted">AI Teaching Copilot</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                Trigger real tutor-facing actions
              </h2>
            </div>
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

      <section id="approval-center" className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">AI Teaching Copilot</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Live lesson suggestion panel
          </h2>
          <div className="mt-8 space-y-4">
            {state.data.lessonSuggestions.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
                No lesson drafts are in the approval queue yet.
              </div>
            ) : (
              state.data.lessonSuggestions.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.5rem] border border-border bg-surface-strong p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-lg font-semibold text-foreground">
                      {item.title}
                    </p>
                    <StatusPill status={item.status} />
                  </div>
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
                </article>
              ))
            )}
          </div>
        </article>

        <QueueSection
          title="Enrollment Plans"
          subtitle="Starter study plan queue"
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
          title="Post-Class Queue"
          subtitle="Assignment approval queue"
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
          title="Parent Communication"
          subtitle="Parent report draft queue"
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
          title="Pre-Class Readiness"
          subtitle="Readiness submissions queue"
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
          title="Post-Class Summaries"
          subtitle="Class summary draft queue"
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
                No active tutor-led classes are connected yet.
              </div>
            ) : (
              state.data.todaysClasses.map((classItem) => (
                <article
                  key={classItem.id}
                  className="rounded-[1.75rem] border border-border bg-surface-strong p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {classItem.name}
                      </p>
                      <p className="mt-1 text-sm text-muted">{classItem.subject}</p>
                    </div>
                    <p className="rounded-full bg-teal-soft px-4 py-2 text-xs font-semibold text-teal">
                      {classItem.schedule}
                    </p>
                  </div>
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
                Heatmap data will appear once mastery or readiness signals are available.
              </div>
            ) : (
              state.data.weakTopicHeatmap.map((item) => (
                <div key={`${item.className}-${item.topic}`} className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {item.topic}
                      </p>
                      <p className="text-sm text-muted">{item.className}</p>
                    </div>
                    <span className="rounded-full bg-[#f8d2c7] px-3 py-1 text-xs font-semibold text-coral">
                      {item.intensity}% risk
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[#e8dcc5]">
                    <div
                      className="metric-bar h-full rounded-full"
                      style={{ width: `${item.intensity}%` }}
                    />
                  </div>
                  <p className="text-sm leading-7 text-muted">{item.note}</p>
                </div>
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
                <div className="rounded-[1.5rem] bg-surface-strong p-5">
                  <p className="text-sm font-medium text-muted">Class duration</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                    {selectedClassIntelligence.durationMinutes}
                  </p>
                  <p className="mt-2 text-sm text-muted">minutes</p>
                </div>
                <div className="rounded-[1.5rem] bg-surface-strong p-5">
                  <p className="text-sm font-medium text-muted">Readiness</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                    {selectedClassIntelligence.readinessScore}%
                  </p>
                  <p className="mt-2 text-sm text-muted">Tutor-approved baseline signal</p>
                </div>
                <div className="rounded-[1.5rem] bg-surface-strong p-5">
                  <p className="text-sm font-medium text-muted">Tutor guidance</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                    {selectedClassIntelligence.tutorGuidanceRatio}%
                  </p>
                  <p className="mt-2 text-sm text-muted">Teacher-led explanation time</p>
                </div>
                <div className="rounded-[1.5rem] bg-surface-strong p-5">
                  <p className="text-sm font-medium text-muted">Student practice</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                    {selectedClassIntelligence.studentPracticeRatio}%
                  </p>
                  <p className="mt-2 text-sm text-muted">Independent or guided attempts</p>
                </div>
              </div>

              <div className="mt-6 rounded-[1.75rem] border border-border bg-[#103b35] p-6 text-white">
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
              Classroom intelligence will appear once a tutor-led class has attendance, readiness,
              or mastery signals.
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
                    className="grid grid-cols-[76px_1fr] items-center gap-4"
                  >
                    <p className="text-sm font-medium text-muted">{row.label}</p>
                    <div className="grid grid-cols-6 gap-2">
                      {row.values.map((value, index) => (
                        <div
                          key={`${row.label}-${index}`}
                          className="h-10 rounded-2xl border border-white/60 bg-white/70"
                          style={{
                            backgroundColor: `rgba(23, 161, 132, ${0.12 + value / 120})`,
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
              Pulse mapping becomes available after the platform sees participation and readiness
              signals from a tutor-led class.
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
                  className="rounded-[1.5rem] border border-border bg-surface-strong p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-foreground">{checkpoint.title}</p>
                    <span className="rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-[#8b5a13]">
                      {checkpoint.timeLabel}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-teal">{checkpoint.signal}</p>
                  <p className="mt-2 text-sm leading-7 text-muted">{checkpoint.note}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
              Focus checkpoints will appear after the tutor has at least one live class signal.
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
                <div key={`${selectedClassIntelligence.classId}-${item.mode}`} className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-foreground">{item.mode}</p>
                      <p className="text-sm text-muted">{item.note}</p>
                    </div>
                    <span className="rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-teal">
                      {item.percent}%
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[#e8dcc5]">
                    <div
                      className="metric-bar h-full rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-sm leading-7 text-muted">
                This balances structure and flexibility. It helps tutors pace the session, but the
                tutor remains the primary educator and final decision-maker.
              </p>
            </div>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
              Teaching balance will appear once a tutor-led class has enough session data.
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
                    className="w-full rounded-[1.5rem] border border-border bg-white/80 px-4 py-4 text-sm leading-7 text-foreground outline-none transition focus:border-teal"
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
                    className="w-full rounded-[1.5rem] border border-border bg-white/80 px-4 py-4 text-sm leading-7 text-foreground outline-none transition focus:border-teal"
                  />
                </label>
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
                <div className="space-y-4">
                  <p className="text-sm font-medium text-muted">Teaching slices</p>
                  {selectedIntelligenceDraft.teachingSlices.map((slice) => (
                    <article
                      key={slice.id}
                      className="rounded-[1.5rem] border border-border bg-surface-strong p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-base font-semibold text-foreground">{slice.title}</p>
                        <span className="rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-teal">
                          {slice.timeLabel}
                        </span>
                      </div>
                      <label className="mt-4 block space-y-2">
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
                          className="w-full rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm leading-7 text-foreground outline-none transition focus:border-teal"
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
                          className="w-full rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm leading-7 text-foreground outline-none transition focus:border-teal"
                        />
                      </label>
                    </article>
                  ))}
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-medium text-muted">Core questions</p>
                  {selectedIntelligenceDraft.coreQuestions.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-[1.5rem] border border-border bg-surface-strong p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-base font-semibold text-foreground">{item.timeLabel}</p>
                        <span className="rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-[#8b5a13]">
                          Tutor prompt
                        </span>
                      </div>
                      <label className="mt-4 block space-y-2">
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
                          className="w-full rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm leading-7 text-foreground outline-none transition focus:border-teal"
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
                          className="w-full rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm leading-7 text-foreground outline-none transition focus:border-teal"
                        />
                      </label>
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
                  className="rounded-[1.5rem] border border-border bg-surface-strong p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-foreground">{slice.title}</p>
                    <span className="rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-teal">
                      {slice.timeLabel}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted">{slice.summary}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl bg-white/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                        Tutor move
                      </p>
                      <p className="mt-3 text-sm leading-7 text-foreground/88">
                        {slice.teacherMove}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral">
                        Student signal
                      </p>
                      <p className="mt-3 text-sm leading-7 text-foreground/88">
                        {slice.studentSignal}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
              Teaching slices will appear once the selected tutor-led class has enough class
              context to build a timeline.
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
                  className="rounded-[1.5rem] border border-border bg-surface-strong p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-foreground">{item.question}</p>
                    <span className="rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-[#8b5a13]">
                      {item.timeLabel}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted">{item.intent}</p>
                  <div className="mt-4 rounded-2xl bg-white/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                      Follow-up if the room is unsure
                    </p>
                    <p className="mt-3 text-sm leading-7 text-foreground/88">
                      {item.recommendedFollowUp}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
              Core questions will appear once the system can build a tutor-facing class plan.
            </div>
          )}
        </article>
      </section>
        </>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Homework Reviews</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Student submissions waiting for tutor feedback
          </h2>
          <div className="mt-8 space-y-4">
            {state.data.submissionReviewQueue.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
                No student homework submissions are waiting for tutor review.
              </div>
            ) : (
              state.data.submissionReviewQueue.map((item) => {
                const draft = reviewDrafts[item.id] ?? {
                  score: item.score === "Pending" ? "" : item.score.replace("%", ""),
                  tutorFeedback:
                    item.tutorFeedback === "Pending tutor feedback"
                      ? ""
                      : item.tutorFeedback,
                };

                return (
                  <article
                    key={item.id}
                    className="rounded-[1.75rem] border border-border bg-surface-strong p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="text-sm text-muted">
                          Student {item.studentId} · {item.owner}
                        </p>
                      </div>
                      <span className="rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-[#8b5a13]">
                        Submitted {item.submittedAt}
                      </span>
                    </div>
                    <div className="mt-5 grid gap-4 lg:grid-cols-[140px_1fr_auto]">
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
                              draft.tutorFeedback.trim().length === 0)
                          }
                          onClick={() => submitTutorReview(item.id)}
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
                No high-priority risk alerts are active right now.
              </div>
            ) : (
              state.data.riskAlerts.map((alert) => (
                <article
                  key={`${alert.student}-${alert.risk}`}
                  className="rounded-[1.5rem] border border-border bg-surface-strong p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-lg font-semibold text-foreground">
                      {alert.student}
                    </p>
                    <span className="rounded-full bg-[#f8d2c7] px-3 py-1 text-xs font-semibold text-coral">
                      Risk alert
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted">{alert.risk}</p>
                  <p className="mt-2 text-sm leading-7 text-teal">{alert.action}</p>
                </article>
              ))
            )}
          </div>
        </article>
      </section>
    </>
  );
}
