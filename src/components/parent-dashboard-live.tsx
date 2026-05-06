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

  function getHistoryCardTheme(
    type: ParentDashboardResponse["data"]["learningHistory"][number]["type"],
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

      {state.data.latestWelcomeMessage ? (
        <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#20C997_0%,#12CFF3_46%,#3B6CFF_100%)] p-8 text-white shadow-[0_24px_64px_rgba(32,201,151,0.18)]">
          <p className="text-sm font-medium text-white/72">Welcome</p>
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
        <article id="progress-overview" className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#ffffff_0%,#eefcff_38%,#ecfdf5_100%)] p-8 shadow-[0_20px_52px_rgba(32,201,151,0.1)]">
          <p className="text-sm font-medium text-muted">Enrolled Class</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            {state.data.enrolledClass?.className ?? "Class placement pending"}
          </h2>
          {state.data.enrolledClass ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/70 bg-white/92 p-5 shadow-[0_14px_28px_rgba(59,108,255,0.08)]">
                <p className="text-sm font-medium text-muted">Subject</p>
                <p className="mt-3 text-base font-semibold text-foreground">
                  {state.data.enrolledClass.subject}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/70 bg-white/92 p-5 shadow-[0_14px_28px_rgba(59,108,255,0.08)]">
                <p className="text-sm font-medium text-muted">Tutor</p>
                <p className="mt-3 text-base font-semibold text-foreground">
                  {state.data.enrolledClass.tutorName}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/70 bg-white/92 p-5 shadow-[0_14px_28px_rgba(59,108,255,0.08)]">
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
              <div className="overflow-hidden rounded-[1.6rem] border border-[#ffe0a8] bg-[linear-gradient(180deg,#ffffff_0%,#fff8ea_100%)] p-0 shadow-[0_14px_30px_rgba(255,209,102,0.08)]">
                <div className="bg-[linear-gradient(135deg,#FFD166_0%,#FF9F1C_100%)] px-5 py-4 text-[#6b4100]">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-semibold text-foreground">
                    {state.data.latestBookingRequest.subjectFocus}
                  </p>
                  <div className="rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-[#8b5a13]">
                    {state.data.latestBookingRequest.status}
                  </div>
                </div>
                </div>
                <div className="p-5">
                <div className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-2">
                  <p>Level: {state.data.latestBookingRequest.studentLevel}</p>
                  <p>Preferred time: {state.data.latestBookingRequest.preferredTime}</p>
                  <p>Status: {state.data.latestBookingRequest.status}</p>
                  <p>Submitted: {state.data.latestBookingRequest.submittedAt}</p>
                </div>
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
        <article id="weekly-summary" className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#3B6CFF_0%,#4F7CFF_46%,#7C5CFF_100%)] p-8 text-white shadow-[0_24px_64px_rgba(59,108,255,0.18)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white/72">This Week</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Progress summary for {state.data.studentName}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => askParentAssistant("Summarise my child's progress")}
                className="solace-soft-pill rounded-full border border-white/24 bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white"
              >
                Ask AI
              </button>
              {state.data.latestReport ? <StatusPill status="approved" /> : null}
            </div>
          </div>
          <div className="mt-8 rounded-[1.75rem] bg-white/14 p-6 backdrop-blur-sm">
            <p className="text-sm leading-8 text-white/86">
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
                className="rounded-2xl border border-white/18 bg-white/10 p-4 text-sm text-white/84"
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
              </div>
            </div>
            <div className="overflow-hidden rounded-[1.6rem] border border-[#ffe0a8] bg-[linear-gradient(180deg,#ffffff_0%,#fff8ea_100%)] p-0 shadow-[0_14px_30px_rgba(255,209,102,0.08)]">
              <div className="bg-[linear-gradient(135deg,#FFD166_0%,#FF9F1C_100%)] px-5 py-4 text-[#6b4100]">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b4100]/78">
                  Homework Completion
                </p>
              </div>
              <div className="p-5">
                <p className="text-3xl font-semibold text-foreground">
                  {state.data.progressSnapshot.homeworkCompletionRate !== null
                    ? `${state.data.progressSnapshot.homeworkCompletionRate}%`
                    : "Pending"}
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-[1.6rem] border border-[#e6d8ff] bg-[linear-gradient(180deg,#ffffff_0%,#f8f3ff_100%)] p-0 shadow-[0_14px_30px_rgba(124,92,255,0.08)]">
              <div className="bg-[linear-gradient(135deg,#7C5CFF_0%,#3B6CFF_100%)] px-5 py-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/78">
                  Reviewed Homework
                </p>
              </div>
              <div className="p-5">
                <p className="text-3xl font-semibold text-foreground">
                  {state.data.progressSnapshot.reviewedHomeworkCount}
                </p>
              </div>
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
                  className={`overflow-hidden rounded-[1.75rem] border border-border bg-gradient-to-b ${tone.shell} p-0`}
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
        </article>
      </section>

      <section id="learning-history" className="glass-panel rounded-[2rem] p-8">
        <p className="text-sm font-medium text-muted">Learning History</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          Recent class, homework, and report timeline
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {state.data.learningHistory.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-5 text-sm leading-7 text-muted lg:col-span-2">
              Learning history will appear here after the first tutor-reviewed cycle.
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
                      Parent view
                    </span>
                    <p className="mt-4 text-sm leading-7 text-muted">{item.detail}</p>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      <section id="homework-feedback" className="rounded-[2rem] border border-[#e6ecf5] bg-white/94 p-8 shadow-[0_20px_52px_rgba(59,108,255,0.08)]">
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
                className="overflow-hidden rounded-[1.6rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-0 shadow-[0_12px_24px_rgba(59,108,255,0.05)]"
              >
                <div className="bg-[linear-gradient(135deg,#20C997_0%,#12CFF3_100%)] px-5 py-4 text-white">
                  <p className="text-base font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm font-medium text-white/82">
                    Score: {item.score}
                  </p>
                </div>
                <div className="p-5">
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
                </div>
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
            <article
              key={item}
              className="overflow-hidden rounded-[1.6rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-0 shadow-[0_12px_24px_rgba(59,108,255,0.05)]"
            >
              <div className="bg-[linear-gradient(135deg,#3B6CFF_0%,#12CFF3_100%)] px-5 py-4 text-white">
                <p className="text-sm font-semibold text-white">Report step</p>
              </div>
              <p className="px-5 py-5 text-sm leading-7 text-muted">{item}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
