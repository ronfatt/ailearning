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
      curriculumTopicCode: string | null;
      curriculumTopicName: string | null;
      masteryNodeTitles: string[];
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

  const activeHomeworkCount = state.data.assignedHomework.filter(
    (item) => item.canSubmit || item.canResubmit,
  ).length;
  const nextHomework = state.data.assignedHomework.find(
    (item) => item.canSubmit || item.canResubmit,
  ) ?? state.data.assignedHomework[0] ?? null;
  const priorityTopic =
    state.data.subjectProgress.find((topic) => topic.status !== "strong") ??
    state.data.subjectProgress[0] ??
    null;
  const todayMissionSteps = [
    {
      id: "warmup",
      label: "Step 1",
      title: "Do your class warm-up",
      detail:
        "Finish the short check before class so your tutor knows where you need help.",
      status: "2 mins",
      href: "/student/diagnostic",
      cta: "Start Warm-up",
      tone: "from-[#3B6CFF] to-[#12CFF3]",
    },
    {
      id: "homework",
      label: "Step 2",
      title: nextHomework ? `Finish ${nextHomework.title}` : "Finish your homework",
      detail: nextHomework
        ? `${nextHomework.dueDate} · ${nextHomework.curriculumTopicName ?? nextHomework.scope}`
        : "Homework will show up here as soon as your tutor sends it.",
      status:
        activeHomeworkCount > 0
          ? `${activeHomeworkCount} task${activeHomeworkCount === 1 ? "" : "s"}`
          : "Clear",
      href: "#assigned-homework",
      cta: nextHomework ? "Open Homework" : "View Homework",
      tone: "from-[#7C5CFF] to-[#3B6CFF]",
    },
    {
      id: "revision",
      label: "Step 3",
      title: priorityTopic
        ? `Fix ${priorityTopic.title}`
        : "Fix one weak topic",
      detail: priorityTopic
        ? `${priorityTopic.mastery}% mastery · ${priorityTopic.note}`
        : "Revision will show up here after your tutor sets your first focus plan.",
      status: priorityTopic ? priorityTopic.status : "Pending",
      href: "#revision-focus",
      cta: "Open Revision",
      tone: "from-[#20C997] to-[#12CFF3]",
    },
  ] as const;
  const missionRemaining =
    1 +
    (activeHomeworkCount > 0 ? 1 : 0) +
    (state.data.revisionTasks.length > 0 ? 1 : 0);

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

  function getHistoryCardTheme(
    type: StudentDashboardResponse["data"]["learningHistory"][number]["type"],
  ) {
    if (type === "class") {
      return {
        shell:
          "border-[#cfe0ff] bg-[linear-gradient(180deg,#ffffff_0%,#f5f9ff_100%)]",
        media: "bg-[linear-gradient(135deg,#3B6CFF_0%,#12CFF3_100%)]",
        icon: "●",
      };
    }

    if (type === "homework") {
      return {
        shell:
          "border-[#ccefe6] bg-[linear-gradient(180deg,#ffffff_0%,#f2fffb_100%)]",
        media: "bg-[linear-gradient(135deg,#20C997_0%,#12CFF3_100%)]",
        icon: "✎",
      };
    }

    if (type === "mastery") {
      return {
        shell:
          "border-[#ffe0a8] bg-[linear-gradient(180deg,#ffffff_0%,#fff8e8_100%)]",
        media: "bg-[linear-gradient(135deg,#FFD166_0%,#FF9F1C_100%)]",
        icon: "↑",
      };
    }

    return {
      shell:
        "border-[#e6d8ff] bg-[linear-gradient(180deg,#ffffff_0%,#faf5ff_100%)]",
      media: "bg-[linear-gradient(135deg,#7C5CFF_0%,#3B6CFF_100%)]",
      icon: "★",
    };
  }

  function getSeriesTone(
    tone: StudentDashboardResponse["data"]["progressSeries"][number]["tone"],
  ) {
    if (tone === "mint") {
      return {
        bar: "from-[#20C997] to-[#12CFF3]",
        chip: "bg-[#ecfdf5] text-[#0f9b74]",
        shell: "from-[#ffffff] to-[#f1fffb]",
        media: "from-[#20C997] to-[#12CFF3]",
      };
    }

    if (tone === "gold") {
      return {
        bar: "from-[#FFD166] to-[#FF9F1C]",
        chip: "bg-[#fff4dd] text-[#a86b00]",
        shell: "from-[#ffffff] to-[#fff8ea]",
        media: "from-[#FFD166] to-[#FF9F1C]",
      };
    }

    if (tone === "purple") {
      return {
        bar: "from-[#7C5CFF] to-[#3B6CFF]",
        chip: "bg-[#f3e8ff] text-[#7c5cff]",
        shell: "from-[#ffffff] to-[#f7f1ff]",
        media: "from-[#7C5CFF] to-[#3B6CFF]",
      };
    }

    return {
      bar: "from-[#3B6CFF] to-[#12CFF3]",
      chip: "bg-[#e7f0ff] text-[#2f5bff]",
      shell: "from-[#ffffff] to-[#f5f9ff]",
      media: "from-[#3B6CFF] to-[#12CFF3]",
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

      <section
        id="today-mission"
        className="overflow-hidden rounded-[2.2rem] border border-[#dbe7ff] bg-[radial-gradient(circle_at_top_left,rgba(18,207,243,0.18),transparent_22%),radial-gradient(circle_at_top_right,rgba(124,92,255,0.14),transparent_20%),linear-gradient(145deg,#ffffff_0%,#eef4ff_52%,#f7f3ff_100%)] p-8 shadow-[0_24px_64px_rgba(59,108,255,0.12)]"
      >
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3B6CFF]">
              Today&apos;s mission
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              Do these in order so you never have to guess what comes next
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Start with the warm-up, clear the homework your tutor assigned, then
              spend your energy on one weak topic only.
            </p>
          </div>
          <div className="grid gap-3 sm:min-w-[250px] sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/80 bg-white/92 p-5 shadow-[0_14px_28px_rgba(59,108,255,0.08)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8597]">
                Left today
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                {missionRemaining}
              </p>
              <p className="mt-2 text-sm text-muted">
                Focus on one step at a time.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/80 bg-white/92 p-5 shadow-[0_14px_28px_rgba(59,108,255,0.08)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8597]">
                AI help
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                Ready
              </p>
              <p className="mt-2 text-sm text-muted">
                Use it when you get stuck, not as your first move.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {todayMissionSteps.map((step) => (
            <article
              key={step.id}
              className="overflow-hidden rounded-[1.7rem] border border-[#dbe7ff] bg-white/95 shadow-[0_14px_28px_rgba(59,108,255,0.06)]"
            >
              <div className={`bg-gradient-to-r ${step.tone} px-5 py-4 text-white`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/76">
                      {step.label}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
                  </div>
                  <span className="rounded-full bg-white/18 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                    {step.status}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-7 text-muted">{step.detail}</p>
                <Link
                  href={step.href}
                  className="mt-5 inline-flex rounded-full border border-[#d8e5ff] bg-[#f8fbff] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#3B6CFF] transition hover:border-[#3B6CFF] hover:bg-[#eef4ff]"
                >
                  {step.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="overview" className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
        <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#3B6CFF_0%,#4F7CFF_46%,#7C5CFF_100%)] p-8 text-white shadow-[0_24px_64px_rgba(59,108,255,0.22)]">
          <p className="text-sm font-medium text-white/72">Good to see you</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {state.data.welcomeMessage.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/88">
            {state.data.welcomeMessage.body}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-full border border-white/18 bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/88">
              Tutor-led class active
            </div>
            <div className="rounded-full border border-white/18 bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/88">
              AI follow-up ready
            </div>
          </div>
        </section>
      ) : null}

      {state.data.assistantUnlockNotice ? (
        <section className="overflow-hidden rounded-[2rem] border border-[#dbe7ff] bg-[linear-gradient(135deg,#eef4ff_0%,#f2edff_54%,#ffffff_100%)] p-8 shadow-[0_18px_44px_rgba(59,108,255,0.1)]">
          <p className="text-sm font-medium text-[#3B6CFF]">Ask AI when you&apos;re stuck</p>
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

      <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#ffffff_0%,#eef4ff_44%,#f2edff_100%)] p-8 shadow-[0_20px_52px_rgba(59,108,255,0.1)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
              <p className="text-sm font-medium text-[#5B6472]">Your class</p>
            <h2 className="mt-2 text-3xl font-semibold text-foreground">
              {state.data.enrollmentStatus?.className ?? "Class assignment pending"}
            </h2>
          </div>
          {state.data.enrollmentStatus ? (
            <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#3B6CFF] shadow-[0_12px_26px_rgba(59,108,255,0.1)]">
              {state.data.enrollmentStatus.statusLabel}
            </div>
          ) : null}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {state.data.enrollmentStatus ? (
            <>
              <div className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-[0_14px_28px_rgba(59,108,255,0.08)]">
                <p className="text-sm font-medium text-muted">Subject</p>
                <p className="mt-3 text-base font-semibold text-foreground">
                  {state.data.enrollmentStatus.subject}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-[0_14px_28px_rgba(59,108,255,0.08)]">
                <p className="text-sm font-medium text-muted">Tutor</p>
                <p className="mt-3 text-base font-semibold text-foreground">
                  {state.data.enrollmentStatus.tutorName}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-[0_14px_28px_rgba(59,108,255,0.08)]">
                <p className="text-sm font-medium text-muted">Schedule</p>
                <p className="mt-3 text-base font-semibold text-foreground">
                  {state.data.enrollmentStatus.schedule}
                </p>
              </div>
            </>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-5 text-sm leading-7 text-muted sm:col-span-3">
              Your class details will show up here as soon as enrollment is confirmed.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <article id="progress-overview" className="glass-panel rounded-[2rem] p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">Your progress this week</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                See what is getting stronger and what still needs help
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
            <div className="overflow-hidden rounded-[1.6rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f5f9ff_100%)] p-0 shadow-[0_14px_30px_rgba(59,108,255,0.08)]">
              <div className="bg-[linear-gradient(135deg,#3B6CFF_0%,#12CFF3_100%)] px-5 py-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/78">
                  Average Mastery
                </p>
              </div>
              <div className="p-5">
                <p className="text-3xl font-semibold text-foreground">
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
            </div>

            <div className="overflow-hidden rounded-[1.6rem] border border-[#ccefe6] bg-[linear-gradient(180deg,#ffffff_0%,#f1fffb_100%)] p-0 shadow-[0_14px_30px_rgba(32,201,151,0.08)]">
              <div className="bg-[linear-gradient(135deg,#20C997_0%,#12CFF3_100%)] px-5 py-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/78">
                  Attendance
                </p>
              </div>
              <div className="p-5">
                <p className="text-3xl font-semibold text-foreground">
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
            </div>

            <div className="overflow-hidden rounded-[1.6rem] border border-[#ffe0a8] bg-[linear-gradient(180deg,#ffffff_0%,#fff8ea_100%)] p-0 shadow-[0_14px_30px_rgba(255,209,102,0.08)]">
              <div className="bg-[linear-gradient(135deg,#FFD166_0%,#FF9F1C_100%)] px-5 py-4 text-[#6b4100]">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b4100]/78">
                  Homework done
                </p>
              </div>
              <div className="p-5">
                <p className="text-3xl font-semibold text-foreground">
                  {state.data.progressSnapshot.homeworkCompletionRate !== null
                    ? `${state.data.progressSnapshot.homeworkCompletionRate}%`
                    : "Pending"}
                </p>
                <p className="mt-3 text-sm text-muted">
                  {state.data.progressSnapshot.submissionCount} submission
                  {state.data.progressSnapshot.submissionCount === 1 ? "" : "s"} sent to your tutor.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.6rem] border border-[#e6d8ff] bg-[linear-gradient(180deg,#ffffff_0%,#f8f3ff_100%)] p-0 shadow-[0_14px_30px_rgba(124,92,255,0.08)]">
              <div className="bg-[linear-gradient(135deg,#7C5CFF_0%,#3B6CFF_100%)] px-5 py-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/78">
                  Reviewed Topics
                </p>
              </div>
              <div className="p-5">
                <p className="text-3xl font-semibold text-foreground">
                  {state.data.progressSnapshot.reviewedTopics}
                </p>
                <p className="mt-3 text-sm text-muted">
                  Topics your tutor is actively tracking with you.
                </p>
              </div>
            </div>
          </div>
        </article>

        <article id="learning-history" className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Recent activity</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            A quick look at what you finished and learned lately
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {state.data.learningHistory.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-5 text-sm leading-7 text-muted lg:col-span-2">
                Your learning history will start to build after your first tutor-reviewed class cycle.
              </div>
            ) : (
              state.data.learningHistory.map((item) => {
                const theme = getHistoryCardTheme(item.type);

                return (
                  <article
                    key={item.id}
                    className={`overflow-hidden rounded-[1.6rem] border p-0 shadow-[0_14px_28px_rgba(59,108,255,0.06)] ${theme.shell}`}
                  >
                    <div className={`flex items-center justify-between bg-gradient-to-r ${theme.media} px-5 py-4 text-white`}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/18 text-lg font-semibold">
                          {theme.icon}
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/74">
                            {item.type}
                          </p>
                          <p className="text-base font-semibold text-white">{item.title}</p>
                        </div>
                      </div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/78">
                        {item.dateLabel}
                      </p>
                    </div>
                    <div className="p-5">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${getHistoryTone(item.type)}`}
                      >
                        Learning update
                      </span>
                      <p className="mt-4 text-sm leading-7 text-muted">{item.detail}</p>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </article>
      </section>

      <section className="rounded-[2rem] border border-[#e6ecf5] bg-white/94 p-8 shadow-[0_20px_52px_rgba(59,108,255,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">Learning momentum</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              How this learning cycle is moving
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
                className={`overflow-hidden rounded-[1.75rem] border border-[#dbe7ff] bg-gradient-to-b ${tone.shell} p-0 shadow-[0_14px_28px_rgba(59,108,255,0.06)]`}
              >
                <div className={`bg-gradient-to-r ${tone.media} px-5 py-4 text-white`}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <span className="rounded-full bg-white/18 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                      {item.value}%
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${tone.chip}`}
                  >
                    this cycle
                  </span>
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
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article id="assigned-homework" className="rounded-[2rem] border border-[#e6ecf5] bg-white/94 p-8 shadow-[0_20px_52px_rgba(59,108,255,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">Next class</p>
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
                <p className="text-sm font-medium text-muted">Homework to clear</p>
                <Link
                  href="/student/diagnostic"
                  className="rounded-full bg-teal px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#09443c]"
                >
                  Warm-up
                </Link>
              </div>
              <div className="mt-4 space-y-4">
                {state.data.assignedHomework.length === 0 ? (
                  <div className="rounded-2xl bg-white/75 p-4 text-sm text-muted">
                    No homework is waiting yet. Your tutor will drop it here when it is ready.
                  </div>
                ) : (
                  state.data.assignedHomework.map((item) => (
                    <article key={item.id} className="overflow-hidden rounded-[1.6rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-0 shadow-[0_14px_28px_rgba(59,108,255,0.06)]">
                      <div className="flex items-center justify-between gap-3 bg-[linear-gradient(135deg,#3B6CFF_0%,#12CFF3_100%)] px-4 py-4 text-white">
                        <p className="text-base font-semibold text-white">
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
                          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                            {item.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3B6CFF]">
                              {item.dueDate}
                            </span>
                            {item.curriculumTopicName ? (
                              <span className="rounded-full bg-[#f5f9ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3B6CFF]">
                                {item.curriculumTopicCode
                                  ? `${item.curriculumTopicCode} ${item.curriculumTopicName}`
                                  : item.curriculumTopicName}
                              </span>
                            ) : null}
                            {item.masteryNodeTitles.length > 0 ? (
                              <span className="rounded-full bg-[#f8fbff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5B6472]">
                                {item.masteryNodeTitles.length} focus point
                                {item.masteryNodeTitles.length === 1 ? "" : "s"}
                              </span>
                            ) : null}
                          </div>

                          <p className="text-sm leading-7 text-muted">{item.scope}</p>

                          {item.submittedAt ? (
                            <div className="rounded-2xl border border-[#ccefe6] bg-[#eefaf7] px-4 py-3">
                              <p className="text-sm font-semibold text-[#0f9b74]">
                                Submitted {item.submittedAt}
                              </p>
                              <p className="mt-1 text-sm text-muted">
                                {item.tutorFeedback || item.score
                                  ? "Tutor feedback is attached below."
                                  : "Waiting for your tutor to review it."}
                              </p>
                            </div>
                          ) : null}
                        </div>
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
                                ? "Hide details"
                                : item.canResubmit
                                  ? "Open redo"
                                  : "Start homework"}
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
                                Finish this before your next class
                              </p>
                              <p className="mt-2 text-sm leading-7 text-muted">
                                Answer the questions first. If you got stuck, leave a short note so your tutor knows where to help.
                              </p>
                              <div className="mt-4 rounded-2xl border border-border bg-white px-4 py-4">
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
                                      className="rounded-2xl bg-[#f8fbff] px-4 py-3 text-sm leading-7 text-muted"
                                    >
                                      {checkpoint}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {item.masteryNodeTitles.length > 0 ? (
                                <div className="mt-4 rounded-2xl border border-[#dbe7ff] bg-white px-4 py-4">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3B6CFF]">
                                    Focus for this homework
                                  </p>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {item.masteryNodeTitles.map((nodeTitle) => (
                                      <span
                                        key={`${item.id}-focus-${nodeTitle}`}
                                        className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#2f5bff]"
                                      >
                                        {nodeTitle}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ) : null}
                              {item.submissionDetails ? (
                                <div className="mt-4 rounded-2xl border border-border bg-[#eefaf7] px-4 py-4">
                                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">
                                    Your latest submission
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
                                <p className="mt-4 text-xs font-semibold text-teal">
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
                      ) : item.tutorFeedback || item.score || item.submissionDetails?.tutorReview.length ? (
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenHomeworkId((current) =>
                                current === item.id ? null : item.id,
                              )
                            }
                            className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground transition hover:border-teal hover:text-teal"
                          >
                            {openHomeworkId === item.id ? "Hide review" : "Open review"}
                          </button>
                          {openHomeworkId === item.id ? (
                            <div className="mt-4 space-y-4 rounded-[1.5rem] border border-border bg-surface-strong p-5">
                              <div className="rounded-2xl border border-border bg-white px-4 py-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">
                                  Homework brief
                                </p>
                                <p className="mt-3 text-sm leading-7 text-foreground/88">
                                  {item.prompt}
                                </p>
                              </div>
                              {item.score ? (
                                <p className="text-xs font-semibold text-teal">
                                  Tutor score: {item.score}
                                </p>
                              ) : null}
                              {item.tutorFeedback ? (
                                <p className="text-sm leading-6 text-muted">
                                  Tutor feedback: {item.tutorFeedback}
                                </p>
                              ) : null}
                              {item.submissionDetails?.tutorReview.length ? (
                                <div className="rounded-2xl border border-border bg-[#eef4ff] px-4 py-4">
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
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
            <div className="overflow-hidden rounded-[1.6rem] border border-[#e6d8ff] bg-[linear-gradient(180deg,#ffffff_0%,#f8f3ff_100%)] p-0 shadow-[0_14px_30px_rgba(124,92,255,0.08)]">
              <div className="bg-[linear-gradient(135deg,#7C5CFF_0%,#3B6CFF_100%)] px-5 py-4 text-white">
                <p className="text-sm font-semibold text-white">Notes from your tutor</p>
              </div>
              <div className="p-5">
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
          </div>
        </article>

        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Topics you&apos;re fixing</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Your main focus areas right now
          </h2>
          <div className="mt-8 grid gap-4">
            {state.data.subjectProgress.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-5 text-sm leading-7 text-muted">
                Progress by topic will show up after your tutor reviews the first learning cycle.
              </div>
            ) : (
              state.data.subjectProgress.map((topic) => (
                <article
                  key={topic.id}
                  className="overflow-hidden rounded-[1.6rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-0 shadow-[0_12px_24px_rgba(59,108,255,0.05)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[linear-gradient(135deg,#3B6CFF_0%,#12CFF3_100%)] px-5 py-4 text-white">
                    <div>
                      <p className="text-lg font-semibold text-white">{topic.title}</p>
                      <p className="text-sm text-white/78">{topic.note}</p>
                    </div>
                    <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-semibold text-white">
                      {topic.status}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-muted">Mastery level</p>
                      <p className="text-sm font-semibold text-[#2f5bff]">{topic.mastery}%</p>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#e8dcc5]">
                      <div
                        className="metric-bar h-full rounded-full"
                        style={{ width: `${topic.mastery}%` }}
                      />
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </article>
      </section>

      <section
        id="revision-focus"
        className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]"
      >
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">What to revise today</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Stay inside the plan your tutor already approved
          </h2>
          <div className="mt-8 grid gap-4">
            {state.data.revisionTasks.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-5 text-sm leading-7 text-muted">
                Your revision list will show up after your tutor publishes your study plan.
              </div>
            ) : (
              state.data.revisionTasks.map((task) => (
                <article
                  key={task}
                  className="overflow-hidden rounded-[1.6rem] border border-[#ccefe6] bg-[linear-gradient(180deg,#ffffff_0%,#f1fffb_100%)] p-0 shadow-[0_12px_24px_rgba(32,201,151,0.05)]"
                >
                  <div className="bg-[linear-gradient(135deg,#20C997_0%,#12CFF3_100%)] px-5 py-4 text-white">
                    <p className="text-sm font-semibold text-white">Today&apos;s focus</p>
                  </div>
                  <p className="px-5 py-5 text-sm font-medium leading-7 text-foreground">{task}</p>
                </article>
              ))
            )}
          </div>
        </article>

        <article id="assistant" className="glass-panel rounded-[2rem] p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">Need help?</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                Ask AI after you know what task or topic you are working on
              </h2>
            </div>
            <button
              type="button"
              onClick={() => askStudentAssistant("What should I do next today?")}
              className="solace-soft-pill rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#3B6CFF]"
            >
              Ask AI
            </button>
          </div>
            <div className="mt-6 rounded-[1.5rem] border border-[#dbe7ff] bg-white/80 px-5 py-4">
              <p className="text-sm leading-7 text-muted">
                Best time to use it:
                {" "}
                after you open a homework task, while fixing a weak topic, or when you are unsure what to do next.
              </p>
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
            <p className="text-sm font-medium text-white/70">One important rule</p>
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
