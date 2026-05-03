"use client";

import { useEffect, useState } from "react";

import { MetricCard } from "@/components/metric-card";
import { promptRoleAssistant } from "@/components/role-assistant-chatbox";
import { StatusPill } from "@/components/status-pill";

type ParentDashboardResponse = {
  data: {
    metrics: Array<{
      label: string;
      value: string;
      detail: string;
      tone: "teal" | "gold" | "coral";
    }>;
    latestReport: {
      summary: string;
      tutorNotes: string;
      status: "approved";
    } | null;
    recentHomeworkFeedback: Array<{
      id: string;
      title: string;
      score: string;
      tutorFeedback: string;
      submittedAt: string;
      versionCount: number;
      progressNote: string;
    }>;
    insights: Array<{
      label: string;
      value: string;
      note: string;
    }>;
    progressSnapshot: {
      averageMastery: number | null;
      attendanceRate: number | null;
      homeworkCompletionRate: number | null;
      reviewedHomeworkCount: number;
    };
    progressSeries: Array<{
      label: string;
      value: number;
      note: string;
      tone: "blue" | "mint" | "gold" | "purple";
    }>;
    learningHistory: Array<{
      id: string;
      title: string;
      detail: string;
      dateLabel: string;
      type: "class" | "homework" | "mastery" | "report";
    }>;
    reportTrace: string[];
    reportWindow: string;
    studentName: string;
    latestWelcomeMessage: {
      title: string;
      body: string;
      sentAt: string;
    } | null;
    enrolledClass: {
      classId: string;
      className: string;
      subject: string;
      tutorName: string;
      schedule: string;
    } | null;
    linkedStudent: {
      name: string;
      email: string;
      accountStatus: string;
      onboardingStatus: string;
    } | null;
    latestBookingRequest: {
      subjectFocus: string;
      studentLevel: string;
      preferredTime: string;
      status: string;
      submittedAt: string;
    } | null;
    source: "database" | "unconfigured";
    message?: string;
  };
};

type ParentDashboardLiveProps = {
  parentId?: string;
};

async function fetchParentDashboard(parentId?: string) {
  const params = new URLSearchParams();

  if (parentId) {
    params.set("parentId", parentId);
  }

  const response = await fetch(`/api/parent-dashboard?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load parent dashboard data.");
  }

  return (await response.json()) as ParentDashboardResponse;
}

export function ParentDashboardLive({ parentId }: ParentDashboardLiveProps) {
  const [state, setState] = useState<{
    loading: boolean;
    data: ParentDashboardResponse["data"] | null;
    error: string | null;
  }>({
    loading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    void fetchParentDashboard(parentId)
      .then((payload) => {
        if (!cancelled) {
          setState({
            loading: false,
            data: payload.data,
            error: null,
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
                : "Failed to load parent dashboard data.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [parentId]);

  if (state.loading) {
    return (
      <section className="glass-panel rounded-[2rem] p-8 text-sm leading-7 text-muted">
        Loading attendance, tutor-approved reports, and progress summaries from the live parent dashboard API.
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

  function askParentAssistant(message: string) {
    promptRoleAssistant({
      role: "parent",
      message,
    });
  }

  function getSeriesTone(
    tone: ParentDashboardResponse["data"]["progressSeries"][number]["tone"],
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

  function getHistoryTone(
    type: ParentDashboardResponse["data"]["learningHistory"][number]["type"],
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

      {state.data.latestWelcomeMessage ? (
        <section className="glass-panel rounded-[2rem] bg-[#103b35] p-8 text-white">
          <p className="text-sm font-medium text-white/70">Welcome</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {state.data.latestWelcomeMessage.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/88">
            {state.data.latestWelcomeMessage.body}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/60">
            Sent {state.data.latestWelcomeMessage.sentAt}
          </p>
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Enrolled Class</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            {state.data.enrolledClass?.className ?? "Class placement pending"}
          </h2>
          {state.data.enrolledClass ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-border bg-surface-strong p-5">
                <p className="text-sm font-medium text-muted">Subject</p>
                <p className="mt-3 text-base font-semibold text-foreground">
                  {state.data.enrolledClass.subject}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-border bg-surface-strong p-5">
                <p className="text-sm font-medium text-muted">Tutor</p>
                <p className="mt-3 text-base font-semibold text-foreground">
                  {state.data.enrolledClass.tutorName}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-border bg-surface-strong p-5">
                <p className="text-sm font-medium text-muted">Schedule</p>
                <p className="mt-3 text-base font-semibold text-foreground">
                  {state.data.enrolledClass.schedule}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-5 text-sm leading-7 text-muted">
              Once admin completes enrollment, the assigned class and tutor will appear here.
            </div>
          )}
        </article>

        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Linked Student</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Account and onboarding status
          </h2>
          {state.data.linkedStudent ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-border bg-surface-strong p-5">
                <p className="text-sm font-medium text-muted">Student</p>
                <p className="mt-3 text-lg font-semibold text-foreground">
                  {state.data.linkedStudent.name}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {state.data.linkedStudent.email}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-border bg-surface-strong p-5">
                <p className="text-sm font-medium text-muted">Status</p>
                <p className="mt-3 text-lg font-semibold text-foreground">
                  {state.data.linkedStudent.accountStatus}
                </p>
                <p className="mt-2 text-sm text-muted">
                  Onboarding {state.data.linkedStudent.onboardingStatus}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-5 text-sm leading-7 text-muted">
              No linked student profile yet. Complete parent onboarding or create a class request to start the linkage.
            </div>
          )}
        </article>

        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Latest Booking</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Current support request
          </h2>
          {state.data.latestBookingRequest ? (
            <div className="mt-8 space-y-4">
              <div className="rounded-[1.5rem] border border-border bg-surface-strong p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-semibold text-foreground">
                    {state.data.latestBookingRequest.subjectFocus}
                  </p>
                  <div className="rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-[#8b5a13]">
                    {state.data.latestBookingRequest.status}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-2">
                  <p>Level: {state.data.latestBookingRequest.studentLevel}</p>
                  <p>Preferred time: {state.data.latestBookingRequest.preferredTime}</p>
                  <p>Status: {state.data.latestBookingRequest.status}</p>
                  <p>Submitted: {state.data.latestBookingRequest.submittedAt}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-5 text-sm leading-7 text-muted">
              No booking request is attached to this parent account yet.
            </div>
          )}
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article id="weekly-summary" className="glass-panel rounded-[2rem] p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">This Week</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                Progress summary for {state.data.studentName}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => askParentAssistant("Summarise my child's progress")}
                className="solace-soft-pill rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#20C997]"
              >
                Ask AI
              </button>
              {state.data.latestReport ? <StatusPill status="approved" /> : null}
            </div>
          </div>
          <div className="mt-8 rounded-[1.75rem] bg-surface-strong p-6">
            <p className="text-sm leading-8 text-muted">
              {state.data.latestReport?.summary ??
                "A tutor-approved weekly report will appear here after the current learning cycle is reviewed."}
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              state.data.latestReport?.tutorNotes ?? "Tutor note pending approval",
              "Attendance visible to parents",
              "Homework completion tracked",
              "No direct AI messaging without review",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-border bg-white/75 p-4 text-sm text-muted"
              >
                {item}
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-4">
          {state.data.insights.map((insight) => (
            <article
              key={insight.label}
              className="glass-panel rounded-[1.75rem] p-6"
            >
              <p className="text-sm font-medium text-muted">{insight.label}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {insight.value}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">{insight.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted">Child Progress Snapshot</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                See the learning trend clearly
              </h2>
            </div>
            <button
              type="button"
              onClick={() => askParentAssistant("Summarise my child's learning trend.")}
              className="solace-soft-pill rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#20C997]"
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
            </div>
            <div className="rounded-[1.5rem] border border-border bg-white/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7C5CFF]">
                Reviewed Homework
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">
                {state.data.progressSnapshot.reviewedHomeworkCount}
              </p>
            </div>
          </div>
        </article>

        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Progress Chart</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Parent-friendly view of this learning cycle
          </h2>
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
        </article>
      </section>

      <section className="glass-panel rounded-[2rem] p-8">
        <p className="text-sm font-medium text-muted">Learning History</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          Recent class, homework, and report timeline
        </h2>
        <div className="mt-8 space-y-4">
          {state.data.learningHistory.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-5 text-sm leading-7 text-muted">
              Learning history will appear here after the first tutor-reviewed cycle.
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
      </section>

      <section id="homework-feedback" className="glass-panel rounded-[2rem] p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">Recent Tutor Feedback</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              Homework feedback parents can actually understand
            </h2>
          </div>
          <button
            type="button"
            onClick={() => askParentAssistant("Explain the latest homework feedback")}
            className="solace-soft-pill rounded-full border border-[#dbe7ff] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#20C997]"
          >
            Ask AI
          </button>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {state.data.recentHomeworkFeedback.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-5 text-sm leading-7 text-muted lg:col-span-3">
              Tutor-reviewed homework feedback will appear here after the first marked submission.
            </div>
          ) : (
            state.data.recentHomeworkFeedback.map((item) => (
              <article
                key={item.id}
                className="rounded-[1.5rem] border border-border bg-surface-strong p-5"
              >
                <p className="text-base font-semibold text-foreground">{item.title}</p>
                <p className="mt-2 text-sm font-medium text-teal">
                  Score: {item.score}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    askParentAssistant(`Explain the feedback for ${item.title}.`)
                  }
                  className="mt-3 rounded-full border border-[#dbe7ff] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20C997] transition hover:-translate-y-0.5"
                >
                  Ask AI
                </button>
                <p className="mt-2 text-sm leading-7 text-muted">
                  {item.tutorFeedback}
                </p>
                <p className="mt-2 text-sm leading-7 text-[#2f5bff]">
                  {item.progressNote}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted">
                  Submitted {item.submittedAt} · {item.versionCount === 1 ? "First version" : `${item.versionCount} versions`}
                </p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="glass-panel rounded-[2rem] p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">Report History</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              Clear report delivery and approval history
            </h2>
          </div>
          <div className="rounded-[1.5rem] bg-teal px-5 py-4 text-sm font-semibold text-white">
            Report window: {state.data.reportWindow}
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {state.data.reportTrace.map((item) => (
            <div
              key={item}
              className="rounded-[1.5rem] border border-border bg-surface-strong p-5 text-sm leading-7 text-muted"
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
