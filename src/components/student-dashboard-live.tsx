"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import { MetricCard } from "@/components/metric-card";
import { promptRoleAssistant } from "@/components/role-assistant-chatbox";

type StudentDashboardResponse = {
  data: {
    metrics: Array<{
      label: string;
      value: string;
      detail: string;
      tone: "teal" | "gold" | "coral";
    }>;
    welcomeMessage: {
      title: string;
      body: string;
    } | null;
    assistantUnlockNotice: {
      title: string;
      body: string;
      topics: string[];
    } | null;
    enrollmentStatus: {
      className: string;
      subject: string;
      tutorName: string;
      schedule: string;
      statusLabel: string;
    } | null;
    upcomingClass: {
      className: string;
      subject: string;
      nextClassLabel: string;
      tutorName: string;
    };
    assignedHomework: Array<{
      id: string;
      submissionId: string | null;
      title: string;
      scope: string;
      prompt: string;
      questionCount: number | null;
      checkpoints: string[];
      questions: Array<{
        id: string;
        prompt: string;
        hint: string | null;
      }>;
      dueDate: string;
      status: string;
      canSubmit: boolean;
      canResubmit: boolean;
      submittedAt: string | null;
      score: string | null;
      tutorFeedback: string | null;
      submissionDetails: {
        completedQuestions: string | null;
        answerSummary: string | null;
        answers: Array<{
          questionId: string;
          prompt: string;
          answer: string;
        }>;
        workingNotes: string | null;
        reflection: string | null;
        confidenceLabel: string | null;
        confidenceValue: number | null;
        tutorReview: Array<{
          questionId: string;
          prompt: string;
          answer: string;
          feedback: string;
        }>;
        versionCount: number;
      } | null;
    }>;
    teacherNotes: string[];
    progressSnapshot: {
      averageMastery: number | null;
      attendanceRate: number | null;
      homeworkCompletionRate: number | null;
      reviewedTopics: number;
      submissionCount: number;
    };
    progressSeries: Array<{
      label: string;
      value: number;
      note: string;
      tone: "blue" | "mint" | "gold" | "purple";
    }>;
    subjectProgress: Array<{
      id: string;
      title: string;
      note: string;
      mastery: number;
      status: "strong" | "watch" | "support";
    }>;
    learningHistory: Array<{
      id: string;
      title: string;
      detail: string;
      dateLabel: string;
      type: "class" | "homework" | "mastery" | "report";
    }>;
    revisionTasks: string[];
    approvedAssistantScope: string[];
    source: "database" | "unconfigured";
    message?: string;
  };
};

type StudentDashboardLiveProps = {
  studentId?: string;
};

async function fetchStudentDashboard(studentId?: string) {
  const params = new URLSearchParams();

  if (studentId) {
    params.set("studentId", studentId);
  }

  const response = await fetch(`/api/student-dashboard?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load student dashboard data.");
  }

  return (await response.json()) as StudentDashboardResponse;
}

export function StudentDashboardLive({
  studentId,
}: StudentDashboardLiveProps) {
  const [isPending, startTransition] = useTransition();
  const [openHomeworkId, setOpenHomeworkId] = useState<string | null>(null);
  const [homeworkDrafts, setHomeworkDrafts] = useState<
    Record<
      string,
      {
        completedQuestions: string;
        answerSummary: string;
        answers: string[];
        workingNotes: string;
        reflection: string;
        confidence: string;
      }
    >
  >({});
  const [state, setState] = useState<{
    loading: boolean;
    data: StudentDashboardResponse["data"] | null;
    error: string | null;
    busyHomeworkId: string | null;
  }>({
    loading: true,
    data: null,
    error: null,
    busyHomeworkId: null,
  });

  useEffect(() => {
    let cancelled = false;

    void fetchStudentDashboard(studentId)
      .then((payload) => {
        if (!cancelled) {
          setState({
            loading: false,
            data: payload.data,
            error: null,
            busyHomeworkId: null,
          });
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
                : "Failed to load student dashboard data.",
            busyHomeworkId: null,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [studentId]);

  if (state.loading) {
    return (
      <section className="glass-panel rounded-[2rem] p-8 text-sm leading-7 text-muted">
        Loading tutor-linked revision tasks, homework, and mastery signals from the live student dashboard API.
      </section>
    );
  }

  if (state.error && !state.data) {
    return (
      <section className="glass-panel rounded-[2rem] p-8 text-sm leading-7 text-coral">
        {state.error}
      </section>
    );
  }

  if (!state.data) {
    return null;
  }

  function askStudentAssistant(message: string) {
    promptRoleAssistant({
      role: "student",
      message,
    });
  }

  function getHistoryTone(
    type: StudentDashboardResponse["data"]["learningHistory"][number]["type"],
  ) {
    if (type === "class") {
      return "bg-[#e7f0ff] text-[#2f5bff]";
    }

    if (type === "homework") {
      return "bg-[#ecfdf5] text-[#0f9b74]";
    }

    if (type === "mastery") {
      return "bg-[#fff4dd] text-[#a86b00]";
    }

    return "bg-[#f3e8ff] text-[#7c5cff]";
  }

  function getSeriesTone(
    tone: StudentDashboardResponse["data"]["progressSeries"][number]["tone"],
  ) {
    if (tone === "mint") {
      return {
        bar: "from-[#20C997] to-[#12CFF3]",
        chip: "bg-[#ecfdf5] text-[#0f9b74]",
      };
    }

    if (tone === "gold") {
      return {
        bar: "from-[#FFD166] to-[#FF9F1C]",
        chip: "bg-[#fff4dd] text-[#a86b00]",
      };
    }

    if (tone === "purple") {
      return {
        bar: "from-[#7C5CFF] to-[#3B6CFF]",
        chip: "bg-[#f3e8ff] text-[#7c5cff]",
      };
    }

    return {
      bar: "from-[#3B6CFF] to-[#12CFF3]",
      chip: "bg-[#e7f0ff] text-[#2f5bff]",
    };
  }

  function getHomeworkDraft(
    homeworkId: string,
    answerSlots: number | null,
    seed?: StudentDashboardResponse["data"]["assignedHomework"][number]["submissionDetails"],
  ) {
    const fallback = {
      completedQuestions: answerSlots ? String(answerSlots) : "",
      answerSummary: seed?.answerSummary ?? "",
      answers:
        seed && seed.answers.length > 0
          ? Array.from({ length: answerSlots ?? seed.answers.length }, (_, index) => seed.answers[index]?.answer ?? "")
          : Array.from({ length: answerSlots ?? 3 }, () => ""),
      workingNotes: seed?.workingNotes ?? "",
      reflection: seed?.reflection ?? "",
      confidence: seed?.confidenceValue ? String(seed.confidenceValue) : "3",
    };
    const existing = homeworkDrafts[homeworkId];

    if (!existing) {
      return fallback;
    }

    const targetLength = answerSlots ?? existing.answers.length ?? 3;
    const answers = Array.from({ length: targetLength }, (_, index) => existing.answers[index] ?? "");

    return {
      ...fallback,
      ...existing,
      answers,
    };
  }

  function updateHomeworkDraft(
    homeworkId: string,
    answerSlots: number | null,
    field:
      | "completedQuestions"
      | "answerSummary"
      | "workingNotes"
      | "reflection"
      | "confidence",
    value: string,
  ) {
    setHomeworkDrafts((current) => ({
      ...current,
      [homeworkId]: {
        ...getHomeworkDraft(homeworkId, answerSlots),
        ...current[homeworkId],
        [field]: value,
      },
    }));
  }

  function updateHomeworkAnswerDraft(
    homeworkId: string,
    answerSlots: number | null,
    answerIndex: number,
    value: string,
  ) {
    setHomeworkDrafts((current) => {
      const existing = getHomeworkDraft(homeworkId, answerSlots);
      const answers = [...existing.answers];
      answers[answerIndex] = value;

      return {
        ...current,
        [homeworkId]: {
          ...existing,
          ...current[homeworkId],
          answers,
        },
      };
    });
  }

  function submitHomework(homeworkId: string) {
    if (!studentId) {
      return;
    }

    const item = state.data?.assignedHomework.find((entry) => entry.id === homeworkId);

    if (!item) {
      return;
    }

    const draft = getHomeworkDraft(
      homeworkId,
      item.questions.length || item.questionCount,
      item.submissionDetails,
    );
    const completedQuestions =
      draft.completedQuestions.trim().length > 0
        ? Number(draft.completedQuestions)
        : undefined;

    if (draft.answerSummary.trim().length === 0) {
      setState((current) => ({
        ...current,
        error: "Please add a short answer summary before submitting homework.",
      }));
      return;
    }

    if (
      item.questions.some(
        (_question, index) => (draft.answers[index] ?? "").trim().length === 0,
      )
    ) {
      setState((current) => ({
        ...current,
        error: "Please answer each homework question before submitting to your tutor.",
      }));
      return;
    }

    startTransition(() => {
      setState((current) => ({
        ...current,
        busyHomeworkId: homeworkId,
      }));

      void fetch(`/api/homework-assignments/${homeworkId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          submissionContent: {
            source: "student_dashboard_answer_flow",
            completedQuestions,
            answerSummary: draft.answerSummary.trim(),
            answers: item.questions.map((question, index) => ({
              questionId: question.id,
              prompt: question.prompt,
              answer: draft.answers[index]?.trim() ?? "",
            })),
            workingNotes: draft.workingNotes.trim() || undefined,
            reflection: draft.reflection.trim() || undefined,
            confidence: Number(draft.confidence),
          },
          reflection:
            draft.reflection.trim() || "Submitted from the student dashboard workspace.",
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as
              | { error?: string }
              | null;
            throw new Error(payload?.error ?? "Failed to submit homework.");
          }

          return fetchStudentDashboard(studentId);
        })
        .then((payload) => {
          setState({
            loading: false,
            data: payload.data,
            error: null,
            busyHomeworkId: null,
          });
          setHomeworkDrafts((current) => {
            const next = { ...current };
            delete next[homeworkId];
            return next;
          });
          setOpenHomeworkId((current) => (current === homeworkId ? null : current));
        })
        .catch((error: unknown) => {
          setState((current) => ({
            ...current,
            error:
              error instanceof Error ? error.message : "Failed to submit homework.",
            busyHomeworkId: null,
          }));
        });
    });
  }

  return (
    <>
      {state.error ? (
        <section className="glass-panel rounded-[2rem] border border-coral/30 p-5 text-sm leading-7 text-coral">
          {state.error}
        </section>
      ) : null}

      {state.data.message ? (
        <section className="glass-panel rounded-[2rem] border border-border p-5 text-sm leading-7 text-muted">
          {state.data.message}
        </section>
      ) : null}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {state.data.metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            tone={metric.tone}
          />
        ))}
      </section>

      {state.data.welcomeMessage ? (
        <section className="glass-panel rounded-[2rem] bg-[#103b35] p-8 text-white">
          <p className="text-sm font-medium text-white/70">Welcome</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {state.data.welcomeMessage.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/88">
            {state.data.welcomeMessage.body}
          </p>
        </section>
      ) : null}

      {state.data.assistantUnlockNotice ? (
        <section className="glass-panel rounded-[2rem] border border-teal/20 bg-[#eefaf7] p-8">
          <p className="text-sm font-medium text-teal">AI Study Assistant</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            {state.data.assistantUnlockNotice.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            {state.data.assistantUnlockNotice.body}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {state.data.assistantUnlockNotice.topics.map((topic) => (
              <div
                key={topic}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-teal shadow-sm"
              >
                {topic}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="glass-panel rounded-[2rem] p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">Your Class</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              {state.data.enrollmentStatus?.className ?? "Class assignment pending"}
            </h2>
          </div>
          {state.data.enrollmentStatus ? (
            <div className="rounded-full bg-teal-soft px-4 py-2 text-sm font-semibold text-teal">
              {state.data.enrollmentStatus.statusLabel}
            </div>
          ) : null}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {state.data.enrollmentStatus ? (
            <>
              <div className="rounded-[1.5rem] border border-border bg-surface-strong p-5">
                <p className="text-sm font-medium text-muted">Subject</p>
                <p className="mt-3 text-base font-semibold text-foreground">
                  {state.data.enrollmentStatus.subject}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-border bg-surface-strong p-5">
                <p className="text-sm font-medium text-muted">Tutor</p>
                <p className="mt-3 text-base font-semibold text-foreground">
                  {state.data.enrollmentStatus.tutorName}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-border bg-surface-strong p-5">
                <p className="text-sm font-medium text-muted">Schedule</p>
                <p className="mt-3 text-base font-semibold text-foreground">
                  {state.data.enrollmentStatus.schedule}
                </p>
              </div>
            </>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-5 text-sm leading-7 text-muted sm:col-span-3">
              Your tutor-led class will appear here as soon as admin completes enrollment.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">Personal Progress Snapshot</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                See your learning progress clearly
              </h2>
            </div>
            <button
              type="button"
              onClick={() => askStudentAssistant("Summarise my current progress.")}
              className="solace-soft-pill rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#3B6CFF]"
            >
              Ask AI
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-border bg-white/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3B6CFF]">
                Average Mastery
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">
                {state.data.progressSnapshot.averageMastery !== null
                  ? `${state.data.progressSnapshot.averageMastery}%`
                  : "Pending"}
              </p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#e8eefc]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(135deg,#3B6CFF_0%,#12CFF3_100%)]"
                  style={{
                    width: `${state.data.progressSnapshot.averageMastery ?? 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-border bg-white/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#20C997]">
                Attendance
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">
                {state.data.progressSnapshot.attendanceRate !== null
                  ? `${state.data.progressSnapshot.attendanceRate}%`
                  : "Pending"}
              </p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#e9f8f3]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(135deg,#20C997_0%,#12CFF3_100%)]"
                  style={{
                    width: `${state.data.progressSnapshot.attendanceRate ?? 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-border bg-white/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FF9F1C]">
                Homework Completion
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">
                {state.data.progressSnapshot.homeworkCompletionRate !== null
                  ? `${state.data.progressSnapshot.homeworkCompletionRate}%`
                  : "Pending"}
              </p>
              <p className="mt-3 text-sm text-muted">
                {state.data.progressSnapshot.submissionCount} submission
                {state.data.progressSnapshot.submissionCount === 1 ? "" : "s"} sent to your tutor.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-border bg-white/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7C5CFF]">
                Reviewed Topics
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">
                {state.data.progressSnapshot.reviewedTopics}
              </p>
              <p className="mt-3 text-sm text-muted">
                Tutor-reviewed topics currently tracked in your dashboard.
              </p>
            </div>
          </div>
        </article>

        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Learning History</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Your recent class and homework timeline
          </h2>
          <div className="mt-8 space-y-4">
            {state.data.learningHistory.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-5 text-sm leading-7 text-muted">
                Your learning history will start to build after your first tutor-reviewed class cycle.
              </div>
            ) : (
              state.data.learningHistory.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[1.5rem] border border-border bg-white/80 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${getHistoryTone(item.type)}`}
                      >
                        {item.type}
                      </span>
                      <p className="text-base font-semibold text-foreground">
                        {item.title}
                      </p>
                    </div>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                      {item.dateLabel}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted">{item.detail}</p>
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="glass-panel rounded-[2rem] p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">Progress Chart</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              Your learning trend across the current cycle
            </h2>
          </div>
          <button
            type="button"
            onClick={() => askStudentAssistant("Explain my progress chart.")}
            className="solace-soft-pill rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#3B6CFF]"
          >
            Ask AI
          </button>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-4">
          {state.data.progressSeries.map((item) => {
            const tone = getSeriesTone(item.tone);

            return (
              <div
                key={item.label}
                className="rounded-[1.75rem] border border-border bg-white/85 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${tone.chip}`}
                  >
                    {item.value}%
                  </span>
                </div>
                <div className="mt-5 flex h-40 items-end">
                  <div className="relative w-full overflow-hidden rounded-[1.5rem] bg-[#eef4ff]">
                    <div
                      className={`w-full rounded-[1.5rem] bg-gradient-to-t ${tone.bar} transition-all duration-500`}
                      style={{ height: `${Math.max(item.value, 8)}%` }}
                    />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted">{item.note}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article id="assigned-homework" className="glass-panel rounded-[2rem] p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">Upcoming Tutor-Led Class</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                {state.data.upcomingClass.className}
              </h2>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  askStudentAssistant("How should I prepare for the next class?")
                }
                className="solace-soft-pill rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#3B6CFF]"
              >
                Ask AI
              </button>
              <div className="rounded-full bg-teal-soft px-4 py-2 text-sm font-semibold text-teal">
                {state.data.upcomingClass.nextClassLabel}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">
            {state.data.upcomingClass.subject} with {state.data.upcomingClass.tutorName}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div id="teacher-notes" className="rounded-[1.5rem] border border-border bg-surface-strong p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-muted">Assigned Homework</p>
                <Link
                  href="/student/diagnostic"
                  className="rounded-full bg-teal px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#09443c]"
                >
                  Readiness Check
                </Link>
              </div>
              <div className="mt-4 space-y-4">
                {state.data.assignedHomework.length === 0 ? (
                  <div className="rounded-2xl bg-white/75 p-4 text-sm text-muted">
                    No tutor-approved homework has been assigned yet.
                  </div>
                ) : (
                  state.data.assignedHomework.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-white/75 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-base font-semibold text-foreground">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              askStudentAssistant(
                                `Help me understand what to do for ${item.title}.`,
                              )
                            }
                            className="rounded-full border border-[#dbe7ff] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3B6CFF] transition hover:-translate-y-0.5"
                          >
                            Ask AI
                          </button>
                          <span className="rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-[#8b5a13]">
                            {item.status}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted">{item.scope}</p>
                      <p className="mt-1 text-sm text-teal">{item.dueDate}</p>
                      <div className="mt-4 rounded-2xl border border-border bg-surface-strong px-4 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">
                          Homework brief
                        </p>
                              <p className="mt-3 text-sm leading-7 text-foreground/88">
                          {item.prompt}
                        </p>
                        <div className="mt-4 space-y-2">
                          {item.checkpoints.map((checkpoint) => (
                            <div
                              key={`${item.id}-${checkpoint}`}
                              className="rounded-2xl bg-white/80 px-4 py-3 text-sm leading-7 text-muted"
                            >
                              {checkpoint}
                            </div>
                          ))}
                        </div>
                      </div>
                      {item.submittedAt ? (
                        <p className="mt-2 text-xs font-medium text-muted">
                          Submitted {item.submittedAt}
                        </p>
                      ) : null}
                      {item.submissionDetails ? (
                        <div className="mt-4 rounded-2xl border border-border bg-[#eefaf7] px-4 py-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">
                            Your submission
                          </p>
                          <div className="mt-3 space-y-2 text-sm leading-7 text-muted">
                            {item.submissionDetails.completedQuestions ? (
                              <p>{item.submissionDetails.completedQuestions}</p>
                            ) : null}
                            {item.submissionDetails.answerSummary ? (
                              <p>
                                <span className="font-semibold text-foreground">Answer summary:</span>{" "}
                                {item.submissionDetails.answerSummary}
                              </p>
                            ) : null}
                            {item.submissionDetails.answers.length > 0 ? (
                              <div className="space-y-2">
                                {item.submissionDetails.answers.map((answer) => (
                                  <div
                                    key={`${item.id}-${answer.questionId}`}
                                    className="rounded-2xl bg-white/80 px-4 py-3"
                                  >
                                    <p className="font-semibold text-foreground">
                                      {answer.prompt}
                                    </p>
                                    <p className="mt-1">{answer.answer}</p>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                            {item.submissionDetails.workingNotes ? (
                              <p>
                                <span className="font-semibold text-foreground">Working notes:</span>{" "}
                                {item.submissionDetails.workingNotes}
                              </p>
                            ) : null}
                            {item.submissionDetails.reflection ? (
                              <p>
                                <span className="font-semibold text-foreground">Reflection:</span>{" "}
                                {item.submissionDetails.reflection}
                              </p>
                            ) : null}
                            {item.submissionDetails.confidenceLabel ? (
                              <p>
                                <span className="font-semibold text-foreground">Confidence:</span>{" "}
                                {item.submissionDetails.confidenceLabel}
                              </p>
                            ) : null}
                            <p>
                              <span className="font-semibold text-foreground">Submission history:</span>{" "}
                              {item.submissionDetails.versionCount === 1
                                ? "First submission"
                                : `${item.submissionDetails.versionCount} versions submitted`}
                            </p>
                          </div>
                        </div>
                      ) : null}
                      {item.score ? (
                        <p className="mt-2 text-xs font-semibold text-teal">
                          Tutor score: {item.score}
                        </p>
                      ) : null}
                      {item.tutorFeedback ? (
                        <p className="mt-2 text-sm leading-6 text-muted">
                          Tutor feedback: {item.tutorFeedback}
                        </p>
                      ) : null}
                      {item.submissionDetails?.tutorReview.length ? (
                        <div className="mt-4 rounded-2xl border border-border bg-[#eef4ff] px-4 py-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3b6cff]">
                            Per-question tutor feedback
                          </p>
                          <div className="mt-3 space-y-3">
                            {item.submissionDetails.tutorReview.map((review) => (
                              <div
                                key={`${item.id}-${review.questionId}`}
                                className="rounded-2xl bg-white/85 px-4 py-3"
                              >
                                <p className="font-semibold text-foreground">
                                  {review.prompt}
                                </p>
                                <p className="mt-1 text-sm text-muted">
                                  Your answer: {review.answer}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-[#2f5bff]">
                                  Tutor note: {review.feedback}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {item.canSubmit || item.canResubmit ? (
                        <>
                          <div className="mt-4 flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenHomeworkId((current) => {
                                  if (current === item.id) {
                                    return null;
                                  }

                                  setHomeworkDrafts((drafts) => ({
                                    ...drafts,
                                    [item.id]:
                                      drafts[item.id] ??
                                      getHomeworkDraft(
                                        item.id,
                                        item.questions.length || item.questionCount,
                                        item.submissionDetails,
                                      ),
                                  }));

                                  return item.id;
                                })
                              }
                              className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground transition hover:border-teal hover:text-teal"
                            >
                              {openHomeworkId === item.id
                                ? "Close homework"
                                : item.canResubmit
                                  ? "Redo homework"
                                  : "Open homework"}
                            </button>
                            <button
                              type="button"
                              disabled={isPending && state.busyHomeworkId === item.id}
                              onClick={() => submitHomework(item.id)}
                              className={`rounded-full bg-teal px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#09443c] ${
                                isPending && state.busyHomeworkId === item.id
                                  ? "cursor-not-allowed opacity-60"
                                  : ""
                              }`}
                            >
                              {isPending && state.busyHomeworkId === item.id
                                ? "Submitting..."
                                : item.canResubmit
                                  ? "Resubmit to tutor"
                                  : "Submit to tutor"}
                            </button>
                          </div>
                          {openHomeworkId === item.id ? (
                            <div className="mt-5 rounded-[1.5rem] border border-border bg-surface-strong p-5">
                              <p className="text-sm font-semibold text-foreground">
                                Complete your homework before the next class
                              </p>
                              <p className="mt-2 text-sm leading-7 text-muted">
                                Add a short answer summary, your working notes, and a reflection so your tutor can follow up properly.
                              </p>
                              <div className="mt-5 grid gap-4 md:grid-cols-2">
                                <label className="space-y-2">
                                  <span className="text-sm font-medium text-muted">
                                    Questions completed
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    max={item.questionCount ?? undefined}
                                    value={
                                      getHomeworkDraft(
                                        item.id,
                                        item.questions.length || item.questionCount,
                                        item.submissionDetails,
                                      ).completedQuestions
                                    }
                                    onChange={(event) =>
                                      updateHomeworkDraft(
                                        item.id,
                                        item.questions.length || item.questionCount,
                                        "completedQuestions",
                                        event.target.value,
                                      )
                                    }
                                    className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-teal"
                                  />
                                </label>
                                <label className="space-y-2">
                                  <span className="text-sm font-medium text-muted">
                                    Confidence
                                  </span>
                                  <select
                                    value={
                                      getHomeworkDraft(
                                        item.id,
                                        item.questions.length || item.questionCount,
                                        item.submissionDetails,
                                      ).confidence
                                    }
                                    onChange={(event) =>
                                      updateHomeworkDraft(
                                        item.id,
                                        item.questions.length || item.questionCount,
                                        "confidence",
                                        event.target.value,
                                      )
                                    }
                                    className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-teal"
                                  >
                                    <option value="1">Need tutor help</option>
                                    <option value="2">Still unsure</option>
                                    <option value="3">Getting there</option>
                                    <option value="4">Confident</option>
                                    <option value="5">Very confident</option>
                                  </select>
                                </label>
                              </div>
                              <div className="mt-4 space-y-4">
                                {item.questions.map((question, index) => (
                                  <label
                                    key={`${item.id}-${question.id}`}
                                    className="space-y-2"
                                  >
                                    <span className="text-sm font-medium text-muted">
                                      {question.prompt}
                                    </span>
                                    <textarea
                                      rows={3}
                                      value={
                                        getHomeworkDraft(
                                          item.id,
                                          item.questions.length || item.questionCount,
                                          item.submissionDetails,
                                        ).answers[
                                          index
                                        ] ?? ""
                                      }
                                      onChange={(event) =>
                                        updateHomeworkAnswerDraft(
                                          item.id,
                                          item.questions.length || item.questionCount,
                                          index,
                                          event.target.value,
                                        )
                                      }
                                      className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-teal"
                                    />
                                    {question.hint ? (
                                      <p className="text-xs leading-6 text-muted">
                                        {question.hint}
                                      </p>
                                    ) : null}
                                  </label>
                                ))}
                              </div>
                              <div className="mt-4 space-y-4">
                                <label className="space-y-2">
                                  <span className="text-sm font-medium text-muted">
                                    Overall answer summary
                                  </span>
                                  <textarea
                                    rows={3}
                                    value={
                                      getHomeworkDraft(
                                        item.id,
                                        item.questions.length || item.questionCount,
                                        item.submissionDetails,
                                      ).answerSummary
                                    }
                                    onChange={(event) =>
                                      updateHomeworkDraft(
                                        item.id,
                                        item.questions.length || item.questionCount,
                                        "answerSummary",
                                        event.target.value,
                                      )
                                    }
                                    className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-teal"
                                  />
                                </label>
                                <label className="space-y-2">
                                  <span className="text-sm font-medium text-muted">
                                    Working notes
                                  </span>
                                  <textarea
                                    rows={3}
                                    value={
                                      getHomeworkDraft(
                                        item.id,
                                        item.questions.length || item.questionCount,
                                        item.submissionDetails,
                                      ).workingNotes
                                    }
                                    onChange={(event) =>
                                      updateHomeworkDraft(
                                        item.id,
                                        item.questions.length || item.questionCount,
                                        "workingNotes",
                                        event.target.value,
                                      )
                                    }
                                    className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-teal"
                                  />
                                </label>
                                <label className="space-y-2">
                                  <span className="text-sm font-medium text-muted">
                                    Reflection for your tutor
                                  </span>
                                  <textarea
                                    rows={2}
                                    value={
                                      getHomeworkDraft(
                                        item.id,
                                        item.questions.length || item.questionCount,
                                        item.submissionDetails,
                                      ).reflection
                                    }
                                    onChange={(event) =>
                                      updateHomeworkDraft(
                                        item.id,
                                        item.questions.length || item.questionCount,
                                        "reflection",
                                        event.target.value,
                                      )
                                    }
                                    className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-teal"
                                  />
                                </label>
                              </div>
                            </div>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-surface-strong p-5">
              <p className="text-sm font-medium text-muted">Teacher Notes</p>
              <div className="mt-4 space-y-3">
                {state.data.teacherNotes.map((note) => (
                  <p
                    key={note}
                    className="rounded-2xl bg-white/75 p-4 text-sm leading-7 text-muted"
                  >
                    {note}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Progress by Subject</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Tutor-approved revision focus
          </h2>
          <div className="mt-8 space-y-6">
            {state.data.subjectProgress.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-5 text-sm leading-7 text-muted">
                Mastery data will appear after the tutor reviews the first learning cycle.
              </div>
            ) : (
              state.data.subjectProgress.map((topic) => (
                <div key={topic.id} className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {topic.title}
                      </p>
                      <p className="text-sm text-muted">{topic.note}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        topic.status === "strong"
                          ? "bg-teal-soft text-teal"
                          : topic.status === "watch"
                            ? "bg-gold-soft text-[#8b5a13]"
                            : "bg-[#f8d2c7] text-coral"
                      }`}
                    >
                      {topic.status}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[#e8dcc5]">
                    <div
                      className="metric-bar h-full rounded-full"
                      style={{ width: `${topic.mastery}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Revision Tasks</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Post-class learning linked to tutor guidance
          </h2>
          <div className="mt-8 space-y-4">
            {state.data.revisionTasks.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-5 text-sm leading-7 text-muted">
                Tutor-approved revision tasks will appear after the study plan is published.
              </div>
            ) : (
              state.data.revisionTasks.map((task) => (
                <div
                  key={task}
                  className="rounded-[1.5rem] border border-border bg-surface-strong p-5 text-sm font-medium leading-7 text-foreground"
                >
                  {task}
                </div>
              ))
            )}
          </div>
        </article>

        <article id="assistant" className="glass-panel rounded-[2rem] p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">AI Study Assistant</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                Limited to approved topics and study plans
              </h2>
            </div>
            <button
              type="button"
              onClick={() => askStudentAssistant("What is my weakest topic?")}
              className="solace-soft-pill rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#3B6CFF]"
            >
              Ask AI
            </button>
          </div>
          <div className="mt-8 space-y-4">
            {state.data.approvedAssistantScope.map((scope) => (
              <div
                key={scope}
                className="rounded-[1.5rem] border border-border bg-surface-strong p-5 text-sm leading-7 text-muted"
              >
                {scope}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[1.75rem] bg-[#103b35] p-6 text-white">
            <p className="text-sm font-medium text-white/70">Important Rule</p>
            <p className="mt-3 text-sm leading-7 text-white/90">
              The AI Study Assistant cannot unlock new subjects, create its own
              learning path, or act as your main teacher. It only supports the
              plan approved by your tutor.
            </p>
          </div>
        </article>
      </section>
    </>
  );
}
