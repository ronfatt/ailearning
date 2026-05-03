"use client";

import { useState, useTransition } from "react";

type ContactResponse = {
  data?: {
    inquiryId?: string;
    status?: string;
  };
  error?: string;
};

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{
    inquiryId: string;
    status: string;
  } | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    organization: "",
    enquiryType: "",
    message: "",
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(() => {
      void fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })
        .then(async (response) => {
          const payload = (await response.json().catch(() => null)) as
            | ContactResponse
            | null;

          if (!response.ok) {
            throw new Error(payload?.error ?? "Unable to send enquiry.");
          }

          setSubmitted({
            inquiryId: payload?.data?.inquiryId ?? "Pending",
            status: payload?.data?.status ?? "NEW",
          });
        })
        .catch((reason: unknown) => {
          setError(
            reason instanceof Error ? reason.message : "Unable to send enquiry.",
          );
        });
    });
  }

  if (submitted) {
    return (
      <div className="rounded-[2.2rem] border border-[#e6ecf5] bg-white/94 p-8 shadow-[0_24px_60px_rgba(59,108,255,0.1)]">
        <p className="text-sm font-medium text-[#3B6CFF]">Enquiry received</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#111827]">
          We’ve received your message
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#5B6472]">
          Our team can now route this to the right next step for your family,
          tutor application, or centre conversation.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-[#e6ecf5] bg-[#f8fbff] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3B6CFF]">
              Enquiry reference
            </p>
            <p className="mt-3 text-sm font-semibold text-[#111827]">
              {submitted.inquiryId}
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
      className="rounded-[2.2rem] border border-[#e6ecf5] bg-white/94 p-6 shadow-[0_24px_60px_rgba(59,108,255,0.1)]"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-[#5B6472]">General enquiry</p>
        <h2 className="text-3xl font-semibold tracking-tight text-[#111827]">
          Send a message to the team
        </h2>
        <p className="text-sm leading-7 text-[#5B6472]">
          Use this when your question does not fit a direct class booking or
          tutor application.
        </p>
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
          <span className="text-sm font-medium text-[#5B6472]">Phone</span>
          <input
            value={form.phoneNumber}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                phoneNumber: event.target.value,
              }))
            }
            placeholder="+60 12-345 6789"
            className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-[#5B6472]">
            Organisation
          </span>
          <input
            value={form.organization}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                organization: event.target.value,
              }))
            }
            placeholder="Optional"
            className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
          />
        </label>
      </div>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-medium text-[#5B6472]">Enquiry type</span>
        <select
          required
          value={form.enquiryType}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              enquiryType: event.target.value,
            }))
          }
          className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
        >
          <option value="">Select enquiry type</option>
          <option>Family support</option>
          <option>Tutor application</option>
          <option>Centre partnership</option>
          <option>Billing or access</option>
          <option>General product question</option>
        </select>
      </label>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-medium text-[#5B6472]">Message</span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(event) =>
            setForm((current) => ({ ...current, message: event.target.value }))
          }
          placeholder="Tell us what you need help with."
          className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className={`mt-6 w-full rounded-full bg-[linear-gradient(135deg,#3B6CFF_0%,#7C5CFF_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(59,108,255,0.2)] transition hover:-translate-y-0.5 hover:opacity-95 ${
          isPending ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        {isPending ? "Sending enquiry..." : "Send Enquiry"}
      </button>

      {error ? (
        <p className="mt-4 text-sm leading-7 text-[#FF6B6B]">{error}</p>
      ) : null}
    </form>
  );
}
