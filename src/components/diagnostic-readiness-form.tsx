"use client";

import { useEffect, useState, useTransition } from "react";

import { tutorApprovedReadinessQuestions } from "@/lib/readiness-check";

type DiagnosticReadinessFormProps = {
  studentId: string;
  classId?: string | null;
  tutorId?: string | null;
  subjectId?: string | null;
};

type ReadinessResponsePayload = {
  data: {
    id: string;
    score: number;
    readinessLevel: string;
    approvalStatus: string;
    weakTopics: string[];
    summary: string;
  } | null;
};

async function fetchReadinessStatus(studentId: string, classId?: string | null) {
  if (!classId) {
    return { data: null } satisfies ReadinessResponsePayload;
  }

  const params = new URLSearchParams({
    studentId,
    classId,
  });
  const response = await fetch(`/api/readiness-checks?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load readiness status.");
  }

  return (await response.json()) as ReadinessResponsePayload;
}

export function DiagnosticReadinessForm({
  studentId,
  classId,
  tutorId,
  subjectId,
}: DiagnosticReadinessFormProps) {
  const [isPending, startTransition] = useTransition();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submissionState, setSubmissionState] = useState<{
    loading: boolean;
    latest: ReadinessResponsePayload["data"] | null;
    error: string | null;
  }>({
    loading: true,
    latest: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    void fetchReadinessStatus(studentId, classId)
      .then((payload) => {
        if (!cancelled) {
          setSubmissionState({
            loading: false,
            latest: payload.data,
            error: null,
          });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setSubmissionState({
            loading: false,
            latest: null,
            error:
              error instanceof Error
                ? error.message
                : "Failed to load readiness status.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [classId, studentId]);

  function submitReadiness() {
    if (!classId || !tutorId || !subjectId) {
      setSubmissionState((current) => ({
        ...current,
        error: "This readiness check is not linked to a tutor-approved class yet.",
      }));
      return;
    }

    startTransition(() => {
      void fetch("/api/readiness-checks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId,
          studentId,
          tutorId,
          subjectId,
          responses: answers,
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as
              | { error?: string }
              | null;
            throw new Error(payload?.error ?? "Failed to submit readiness check.");
          }

          return response.json() as Promise<ReadinessResponsePayload>;
        })
        .then((payload) => {
          setSubmissionState({
            loading: false,
            latest: payload.data,
            error: null,
          });
        })
        .catch((error: unknown) => {
          setSubmissionState((current) => ({
            ...current,
            error:
              error instanceof Error
                ? error.message
                : "Failed to submit readiness check.",
          }));
        });
    });
  }

  const completedCount = Object.keys(answers).length;
  const canSubmit = completedCount === tutorApprovedReadinessQuestions.length && !isPending;
  const remainingCount = tutorApprovedReadinessQuestions.length - completedCount;

  return (
    <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <article className="glass-panel rounded-[2rem] p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">Quick warm-up</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              Start class already knowing what needs attention
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              This is not a full test. It is just a quick check-in so class time can
              focus on the parts that may trip you up.
            </p>
          </div>
          <div className="grid gap-3 sm:min-w-[240px] sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[#e6ecf5] bg-white/92 p-4 shadow-[0_12px_24px_rgba(59,108,255,0.06)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8597]">
                Answered
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {completedCount}/{tutorApprovedReadinessQuestions.length}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[#e6ecf5] bg-white/92 p-4 shadow-[0_12px_24px_rgba(59,108,255,0.06)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8597]">
                Left
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {remainingCount}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-5">
          {tutorApprovedReadinessQuestions.map((question) => (
            <article
              key={question.id}
              className="rounded-[1.75rem] border border-border bg-surface-strong p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">
                  {question.skill}
                </p>
                <span className="rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-teal">
                  Quick check
                </span>
              </div>
              <p className="mt-4 text-lg font-medium text-foreground">
                {question.prompt}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">{question.note}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {question.options.map((option) => {
                  const selected = answers[question.id] === option.key;

                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() =>
                        setAnswers((current) => ({
                          ...current,
                          [question.id]: option.key,
                        }))
                      }
                      className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                        selected
                          ? "border-teal bg-teal-soft text-teal"
                          : "border-border bg-white/80 text-foreground hover:border-teal hover:text-teal"
                      }`}
                    >
                      {option.key}. {option.label}
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={submitReadiness}
            className={`rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#09443c] ${
              !canSubmit ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            {isPending ? "Sending..." : "Send warm-up"}
          </button>
          <p className="text-sm text-muted">
            Your tutor sees this before class starts.
          </p>
        </div>
      </article>

      <article className="glass-panel rounded-[2rem] p-8">
        <p className="text-sm font-medium text-muted">What happens next</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          This helps your tutor teach better, not replace the tutor
        </h2>
        <div className="mt-6 space-y-5">
          {[
            "Your answers show which parts feel easy and which need more help.",
            "AI groups the weak spots so your tutor can spot patterns faster.",
            "Your tutor decides what to slow down, explain again, or practise live.",
            "Only tutor-approved follow-up turns into class focus or homework.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[1.5rem] border border-border bg-surface-strong p-5"
            >
              <p className="text-sm leading-7 text-muted">{item}</p>
            </div>
          ))}
        </div>

        {submissionState.error ? (
          <div className="mt-6 rounded-[1.5rem] border border-coral/30 bg-[#fff1ee] p-5 text-sm leading-7 text-coral">
            {submissionState.error}
          </div>
        ) : null}

        {submissionState.latest ? (
          <div className="mt-6 rounded-[1.75rem] bg-surface-strong p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-muted">Latest warm-up</p>
              <span className="rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-teal">
                {submissionState.latest.approvalStatus}
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
              {submissionState.latest.score}%
            </p>
            <p className="mt-2 text-sm leading-7 text-muted">
              {submissionState.latest.summary}
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              Topics to watch:{" "}
              {submissionState.latest.weakTopics.length > 0
                ? submissionState.latest.weakTopics.join(", ")
                : "No flagged topics right now"}
            </p>
          </div>
        ) : submissionState.loading ? (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-5 text-sm leading-7 text-muted">
            Loading your latest warm-up result.
          </div>
        ) : null}

        <div className="mt-6 rounded-[1.75rem] bg-[#103b35] p-6 text-white">
          <p className="text-sm font-medium text-white/70">Important rule</p>
          <p className="mt-3 text-sm leading-7 text-white/90">
            This warm-up cannot turn into a random AI learning path. Your tutor is
            still the one who decides the next step.
          </p>
        </div>
      </article>
    </section>
  );
}
