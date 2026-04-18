"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import { MetricCard } from "@/components/metric-card";

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
      dueDate: string;
      status: string;
      canSubmit: boolean;
      submittedAt: string | null;
      score: string | null;
      tutorFeedback: string | null;
    }>;
    teacherNotes: string[];
    subjectProgress: Array<{
      id: string;
      title: string;
      note: string;
      mastery: number;
      status: "strong" | "watch" | "support";
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

  function submitHomework(homeworkId: string) {
    if (!studentId) {
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
            status: "completed",
            source: "student_dashboard",
          },
          reflection: "Submitted from the student dashboard workspace.",
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

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article id="assigned-homework" className="glass-panel rounded-[2rem] p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">Upcoming Tutor-Led Class</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                {state.data.upcomingClass.className}
              </h2>
            </div>
            <div className="rounded-full bg-teal-soft px-4 py-2 text-sm font-semibold text-teal">
              {state.data.upcomingClass.nextClassLabel}
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
                        <span className="rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-[#8b5a13]">
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted">{item.scope}</p>
                      <p className="mt-1 text-sm text-teal">{item.dueDate}</p>
                      {item.submittedAt ? (
                        <p className="mt-2 text-xs font-medium text-muted">
                          Submitted {item.submittedAt}
                        </p>
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
                      {item.canSubmit ? (
                        <button
                          type="button"
                          disabled={isPending && state.busyHomeworkId === item.id}
                          onClick={() => submitHomework(item.id)}
                          className={`mt-4 rounded-full bg-teal px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#09443c] ${
                            isPending && state.busyHomeworkId === item.id
                              ? "cursor-not-allowed opacity-60"
                              : ""
                          }`}
                        >
                          {isPending && state.busyHomeworkId === item.id
                            ? "Submitting..."
                            : "Mark as Submitted"}
                        </button>
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
          <p className="text-sm font-medium text-muted">AI Study Assistant</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Limited to approved topics and study plans
          </h2>
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
