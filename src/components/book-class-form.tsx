"use client";

import { useState, useTransition } from "react";

type BookClassResponse = {
  data?: {
    bookingId?: string;
    status?: string;
  };
  error?: string;
};

export function BookClassForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{
    bookingId: string;
    status: string;
  } | null>(null);
  const [form, setForm] = useState({
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    studentName: "",
    studentEmail: "",
    studentLevel: "",
    subjectFocus: "",
    preferredTime: "",
    notes: "",
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(() => {
      void fetch("/api/book-class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })
        .then(async (response) => {
          const payload = (await response.json().catch(() => null)) as
            | BookClassResponse
            | null;

          if (!response.ok) {
            throw new Error(payload?.error ?? "Unable to submit class request.");
          }

          setSubmitted({
            bookingId: payload?.data?.bookingId ?? "Pending",
            status: payload?.data?.status ?? "NEW",
          });
        })
        .catch((reason: unknown) => {
          setError(
            reason instanceof Error
              ? reason.message
              : "Unable to submit class request.",
          );
        });
    });
  }

  if (submitted) {
    return (
      <div className="rounded-[2.2rem] border border-border bg-white/82 p-8 shadow-[0_24px_60px_rgba(13,92,82,0.08)]">
        <p className="text-sm font-medium text-teal">Request received</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          We’ve received your class request
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted">
          Next, we confirm the student level, preferred time, and tutor fit before moving into scheduling.
        </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[1.5rem] border border-border bg-surface-strong p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
              Booking reference
            </p>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {submitted.bookingId}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-border bg-surface-strong p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
              Status
            </p>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {submitted.status}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2.2rem] border border-border bg-white/82 p-6 shadow-[0_24px_60px_rgba(13,92,82,0.08)]"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted">Parent intake</p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Book a class in under two minutes
        </h2>
        <p className="text-sm leading-7 text-muted">
          A quick intake so we can recommend the right tutor-led starting point.
        </p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-muted">Parent name</span>
          <input
            required
            value={form.parentName}
            onChange={(event) =>
              setForm((current) => ({ ...current, parentName: event.target.value }))
            }
            className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-[#d7efe9]"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-muted">Student name</span>
          <input
            required
            value={form.studentName}
            onChange={(event) =>
              setForm((current) => ({ ...current, studentName: event.target.value }))
            }
            className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-[#d7efe9]"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-muted">Level</span>
          <select
            required
            value={form.studentLevel}
            onChange={(event) =>
              setForm((current) => ({ ...current, studentLevel: event.target.value }))
            }
            className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-[#d7efe9]"
          >
            <option value="">Select level</option>
            <option>Foundation</option>
            <option>Form 4</option>
            <option>Form 5</option>
            <option>SPM Intensive</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-muted">Subject</span>
          <select
            required
            value={form.subjectFocus}
            onChange={(event) =>
              setForm((current) => ({ ...current, subjectFocus: event.target.value }))
            }
            className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-[#d7efe9]"
          >
            <option value="">Select subject</option>
            <option>SPM Mathematics</option>
            <option>English</option>
            <option>Science</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-muted">Parent email</span>
          <input
            type="email"
            required
            value={form.parentEmail}
            onChange={(event) =>
              setForm((current) => ({ ...current, parentEmail: event.target.value }))
            }
            className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-[#d7efe9]"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-muted">Parent phone</span>
          <input
            value={form.parentPhone}
            onChange={(event) =>
              setForm((current) => ({ ...current, parentPhone: event.target.value }))
            }
            placeholder="+60 12-345 6789"
            className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-[#d7efe9]"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-muted">Student email</span>
          <input
            type="email"
            value={form.studentEmail}
            onChange={(event) =>
              setForm((current) => ({ ...current, studentEmail: event.target.value }))
            }
            placeholder="Optional if the student already has an account"
            className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-[#d7efe9]"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-muted">Preferred time</span>
          <input
            value={form.preferredTime}
            onChange={(event) =>
              setForm((current) => ({ ...current, preferredTime: event.target.value }))
            }
            placeholder="Weeknights after 8 PM"
            className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-[#d7efe9]"
          />
        </label>
      </div>
      <label className="mt-4 block space-y-2">
        <span className="text-sm font-medium text-muted">Notes</span>
        <textarea
          rows={4}
          value={form.notes}
          onChange={(event) =>
            setForm((current) => ({ ...current, notes: event.target.value }))
          }
          placeholder="Tell us what support the student needs most right now."
          className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-[#d7efe9]"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className={`mt-6 w-full rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(13,92,82,0.18)] transition hover:-translate-y-0.5 hover:bg-[#09443c] ${
          isPending ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        {isPending ? "Submitting request..." : "Continue"}
      </button>
      {error ? <p className="mt-4 text-sm leading-7 text-coral">{error}</p> : null}
    </form>
  );
}
