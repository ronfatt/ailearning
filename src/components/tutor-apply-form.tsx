"use client";

import { useState, useTransition } from "react";

type TutorApplyResponse = {
  data?: {
    applicationId?: string;
    status?: string;
  };
  error?: string;
};

export function TutorApplyForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{
    applicationId: string;
    status: string;
  } | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    primarySubject: "",
    levelsTaught: "",
    availability: "",
    teachingExperience: "",
    notes: "",
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(() => {
      void fetch("/api/tutor-apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })
        .then(async (response) => {
          const payload = (await response.json().catch(() => null)) as
            | TutorApplyResponse
            | null;

          if (!response.ok) {
            throw new Error(payload?.error ?? "Unable to submit tutor application.");
          }

          setSubmitted({
            applicationId: payload?.data?.applicationId ?? "Pending",
            status: payload?.data?.status ?? "NEW",
          });
        })
        .catch((reason: unknown) => {
          setError(
            reason instanceof Error
              ? reason.message
              : "Unable to submit tutor application.",
          );
        });
    });
  }

  if (submitted) {
    return (
      <div className="w-full rounded-[2rem] border border-[#e6ecf5] bg-white/96 p-7 shadow-[0_24px_60px_rgba(59,108,255,0.1)] sm:p-8">
        <p className="text-sm font-medium text-[#3B6CFF]">Application started</p>
        <h2 className="mt-2 text-[2rem] font-semibold leading-tight tracking-tight text-[#111827] sm:text-[2.15rem]">
          Your tutor application is now in review
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#5B6472]">
          Next step: we review subject fit, teaching levels, and availability
          before moving into tutor onboarding.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-[#e6ecf5] bg-[#f8fbff] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3B6CFF]">
              Application reference
            </p>
            <p className="mt-3 text-sm font-semibold text-[#111827]">
              {submitted.applicationId}
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
        <p className="text-sm font-medium text-[#5B6472]">Tutor intake</p>
        <h2 className="text-[2rem] font-semibold leading-tight tracking-tight text-[#111827] sm:text-[2.15rem]">
          Apply to teach on the platform
        </h2>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-[#5B6472]">Full name</span>
          <input
            required
            value={form.fullName}
            onChange={(event) =>
              setForm((current) => ({ ...current, fullName: event.target.value }))
            }
            className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[#5B6472]">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[#5B6472]">Phone number</span>
          <input
            value={form.phoneNumber}
            onChange={(event) =>
              setForm((current) => ({ ...current, phoneNumber: event.target.value }))
            }
            placeholder="+60 12-345 6789"
            className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[#5B6472]">Primary subject</span>
          <select
            required
            value={form.primarySubject}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                primarySubject: event.target.value,
              }))
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
          <span className="text-sm font-medium text-[#5B6472]">Levels you teach</span>
          <input
            value={form.levelsTaught}
            onChange={(event) =>
              setForm((current) => ({ ...current, levelsTaught: event.target.value }))
            }
            placeholder="Form 4, Form 5, SPM"
            className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[#5B6472]">Availability</span>
          <input
            value={form.availability}
            onChange={(event) =>
              setForm((current) => ({ ...current, availability: event.target.value }))
            }
            placeholder="Weeknights, weekends, or both"
            className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
          />
        </label>
      </div>
      <label className="mt-4 block space-y-2">
        <span className="text-sm font-medium text-[#5B6472]">Teaching experience</span>
        <textarea
          rows={4}
          value={form.teachingExperience}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              teachingExperience: event.target.value,
            }))
          }
          placeholder="Tell us about subjects taught, student age groups, and online teaching experience."
          className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
        />
      </label>
      <label className="mt-4 block space-y-2">
        <span className="text-sm font-medium text-[#5B6472]">Notes</span>
        <textarea
          rows={3}
          value={form.notes}
          onChange={(event) =>
            setForm((current) => ({ ...current, notes: event.target.value }))
          }
          placeholder="Anything else we should know about your fit or availability?"
          className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className={`mt-6 w-full rounded-full bg-[linear-gradient(135deg,#3B6CFF_0%,#7C5CFF_100%)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(59,108,255,0.2)] transition hover:opacity-95 ${
          isPending ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        {isPending ? "Submitting application..." : "Continue"}
      </button>
      {error ? <p className="mt-4 text-sm leading-7 text-[#FF6B6B]">{error}</p> : null}
    </form>
  );
}
