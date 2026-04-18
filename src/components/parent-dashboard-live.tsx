"use client";

import { useEffect, useState } from "react";

import { MetricCard } from "@/components/metric-card";
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
    }>;
    insights: Array<{
      label: string;
      value: string;
      note: string;
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
            {state.data.latestReport ? <StatusPill status="approved" /> : null}
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

      <section id="homework-feedback" className="glass-panel rounded-[2rem] p-8">
        <p className="text-sm font-medium text-muted">Recent Tutor Feedback</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          Homework feedback parents can actually understand
        </h2>
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
                <p className="mt-2 text-sm leading-7 text-muted">
                  {item.tutorFeedback}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted">
                  Submitted {item.submittedAt}
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
