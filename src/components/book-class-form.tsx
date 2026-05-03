"use client";

import { useState, useTransition } from "react";

import { GlowBadge } from "@/components/solace/youthful-ui";

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
      <div className="w-full rounded-[2rem] border border-[#e6ecf5] bg-white/96 p-7 shadow-[0_24px_60px_rgba(59,108,255,0.1)] sm:p-8">
        <p className="text-sm font-medium text-[#3B6CFF]">Request received</p>
        <h2 className="mt-2 text-[2rem] font-semibold leading-tight tracking-tight text-[#111827] sm:text-[2.15rem]">
          We’ve received your class request
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#5B6472]">
          Next, we confirm the student level, preferred time, and tutor fit before moving into scheduling.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <GlowBadge label="Tutor match next" tone="blue" />
          <GlowBadge label="Trial class setup" tone="mint" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-[#e6ecf5] bg-[#f8fbff] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3B6CFF]">
              Booking reference
            </p>
            <p className="mt-3 text-sm font-semibold text-[#111827]">
              {submitted.bookingId}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[#e6ecf5] bg-[#f8fbff] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3B6CFF]">
              Status
            </p>
            <p className="mt-3 text-sm font-semibold text-[#111827]">
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
      className="w-full rounded-[2rem] border border-[#e6ecf5] bg-white/96 p-7 shadow-[0_24px_60px_rgba(59,108,255,0.1)] sm:p-8"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-[#5B6472]">Parent intake</p>
        <h2 className="text-[2rem] font-semibold leading-tight tracking-tight text-[#111827] sm:text-[2.15rem]">
          Tell us what support your child needs
        </h2>
        <p className="text-sm leading-7 text-[#5B6472]">
          A quick intake so we can recommend the right tutor-led starting point.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <GlowBadge label="Free trial" tone="blue" />
          <GlowBadge label="Right tutor fit" tone="purple" />
          <GlowBadge label="Simple next step" tone="mint" />
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-[#5B6472]">Parent name</span>
          <input
            required
            value={form.parentName}
            onChange={(event) =>
              setForm((current) => ({ ...current, parentName: event.target.value }))
            }
            className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[#5B6472]">Student name</span>
          <input
            required
            value={form.studentName}
            onChange={(event) =>
              setForm((current) => ({ ...current, studentName: event.target.value }))
            }
            className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[#5B6472]">Level</span>
          <select
            required
            value={form.studentLevel}
            onChange={(event) =>
              setForm((current) => ({ ...current, studentLevel: event.target.value }))
            }
            className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
          >
            <option value="">Select level</option>
            <option>Foundation</option>
            <option>Form 4</option>
            <option>Form 5</option>
            <option>SPM Intensive</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[#5B6472]">Subject</span>
          <select
            required
            value={form.subjectFocus}
            onChange={(event) =>
              setForm((current) => ({ ...current, subjectFocus: event.target.value }))
            }
            className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
          >
            <option value="">Select subject</option>
            <option>SPM Mathematics</option>
            <option>English</option>
            <option>Science</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[#5B6472]">Parent email</span>
          <input
            type="email"
            required
            value={form.parentEmail}
            onChange={(event) =>
              setForm((current) => ({ ...current, parentEmail: event.target.value }))
            }
            className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[#5B6472]">Parent phone</span>
          <input
            value={form.parentPhone}
            onChange={(event) =>
              setForm((current) => ({ ...current, parentPhone: event.target.value }))
            }
            placeholder="+60 12-345 6789"
            className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[#5B6472]">Student email</span>
          <input
            type="email"
            value={form.studentEmail}
            onChange={(event) =>
              setForm((current) => ({ ...current, studentEmail: event.target.value }))
            }
            placeholder="Optional if the student already has an account"
            className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[#5B6472]">Preferred time</span>
          <input
            value={form.preferredTime}
            onChange={(event) =>
              setForm((current) => ({ ...current, preferredTime: event.target.value }))
            }
            placeholder="Weeknights after 8 PM"
            className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
          />
        </label>
      </div>
      <label className="mt-4 block space-y-2">
        <span className="text-sm font-medium text-[#5B6472]">Notes</span>
        <textarea
          rows={4}
          value={form.notes}
          onChange={(event) =>
            setForm((current) => ({ ...current, notes: event.target.value }))
          }
          placeholder="Tell us what support the student needs most right now."
          className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className={`mt-6 w-full rounded-full bg-[linear-gradient(135deg,#3B6CFF_0%,#7C5CFF_100%)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(59,108,255,0.2)] transition hover:-translate-y-0.5 hover:opacity-95 ${
          isPending ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        {isPending ? "Submitting request..." : "Submit Request"}
      </button>
      {error ? <p className="mt-4 text-sm leading-7 text-[#FF6B6B]">{error}</p> : null}
    </form>
  );
}
