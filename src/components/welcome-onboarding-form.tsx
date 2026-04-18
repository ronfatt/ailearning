"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { WorkspaceRole } from "@/lib/auth-session";

type WelcomeOnboardingFormProps = {
  role: WorkspaceRole;
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
};

type CompletionResponse = {
  data?: {
    redirectTo?: string;
  };
  error?: string;
};

export function WelcomeOnboardingForm({
  role,
  name,
  email,
  phoneNumber,
}: WelcomeOnboardingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    phoneNumber: phoneNumber ?? "",
    studentName: "",
    studentEmail: "",
    studentLevel: "",
    subjectInterest: "SPM Mathematics",
    primarySubject: "SPM Mathematics",
    levelsTaught: "",
    learningGoal: "",
    adminFocus: "",
  });

  const roleCopy: Record<
    WorkspaceRole,
    {
      title: string;
      detail: string;
      steps: string[];
      launchLabel: string;
      launchDescription: string;
    }
  > = {
    Tutor: {
      title: "Set up your tutor workspace",
      detail:
        "Tell us what you teach so the dashboard and class operations can stay focused from day one.",
      steps: [
        "Confirm your contact details.",
        "Tell us your main subject and levels taught.",
        "Open the tutor dashboard and create your first class.",
      ],
      launchLabel: "After setup",
      launchDescription:
        "You will land in the tutor dashboard with focus mode on, so the first thing you see is today’s class, approvals, and follow-up.",
    },
    Student: {
      title: "Get your student workspace ready",
      detail:
        "We keep the first setup light so you can quickly move into class, homework, and revision.",
      steps: [
        "Confirm how we can contact your account holder.",
        "Tell us what you want help with first.",
        "Open your student workspace and finish today’s assigned tasks.",
      ],
      launchLabel: "After setup",
      launchDescription:
        "You will go straight into the student workspace, where the next class, homework, and revision tasks are already lined up.",
    },
    Parent: {
      title: "Set up your parent workspace",
      detail:
        "Add a few details so we can route your first class request and make reports easier to follow.",
      steps: [
        "Confirm your contact details.",
        "Tell us the student level and subject focus.",
        "Open the parent portal and track progress from the first learning cycle.",
      ],
      launchLabel: "After setup",
      launchDescription:
        "You will land in the parent portal with the weekly summary first, then homework feedback and the next support options.",
    },
    Admin: {
      title: "Prepare the admin workspace",
      detail:
        "Capture your operating focus so internal alerts and workflows reflect the right priorities.",
      steps: [
        "Confirm your contact details.",
        "Choose your main admin focus area.",
        "Open the admin console and review platform health.",
      ],
      launchLabel: "After setup",
      launchDescription:
        "You will enter the admin console with platform health, operations, and workflow visibility in one place.",
    },
  };

  const currentCopy = roleCopy[role];

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(() => {
      void fetch("/api/onboarding/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })
        .then(async (response) => {
          const payload = (await response.json().catch(() => null)) as
            | CompletionResponse
            | null;

          if (!response.ok) {
            throw new Error(payload?.error ?? "Unable to finish setup.");
          }

          router.push(payload?.data?.redirectTo ?? "/");
          router.refresh();
        })
        .catch((reason: unknown) => {
          setError(
            reason instanceof Error ? reason.message : "Unable to finish setup.",
          );
        });
    });
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <article className="glass-panel rounded-[2rem] p-8">
        <p className="text-sm font-medium text-muted">Welcome</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          {currentCopy.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted">{currentCopy.detail}</p>
        <div className="mt-8 space-y-4">
          {currentCopy.steps.map((step, index) => (
            <div
              key={step}
              className="rounded-[1.5rem] border border-border bg-surface-strong p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                Step {index + 1}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">{step}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-[1.75rem] bg-[#103b35] p-6 text-white">
          <p className="text-sm font-medium text-white/70">Account</p>
          <p className="mt-3 text-lg font-semibold">{name}</p>
          <p className="mt-2 text-sm text-white/80">{email ?? "Email pending"}</p>
        </div>
        <div className="mt-4 rounded-[1.75rem] border border-border bg-surface-strong p-6">
          <p className="text-sm font-medium text-muted">
            {currentCopy.launchLabel}
          </p>
          <p className="mt-3 text-sm leading-7 text-muted">
            {currentCopy.launchDescription}
          </p>
        </div>
      </article>

      <form
        onSubmit={submitForm}
        className="rounded-[2rem] border border-border bg-white/80 p-6 shadow-[0_18px_50px_rgba(13,92,82,0.06)]"
      >
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted">Complete setup</p>
          <h2 className="text-2xl font-semibold text-foreground">
            A few details before you continue
          </h2>
        </div>

        <div className="mt-6 grid gap-4">
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted">Phone number</span>
            <input
              value={form.phoneNumber}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  phoneNumber: event.target.value,
                }))
              }
              placeholder="+60 12-345 6789"
              className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal"
            />
          </label>

          {role === "Parent" ? (
            <>
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted">Student name</span>
                <input
                  value={form.studentName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      studentName: event.target.value,
                    }))
                  }
                  placeholder="Aina Sofia"
                  className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted">
                  Student email
                </span>
                <input
                  type="email"
                  value={form.studentEmail}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      studentEmail: event.target.value,
                    }))
                  }
                  placeholder="Optional if the student already has an account"
                  className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted">Student level</span>
                  <select
                    value={form.studentLevel}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        studentLevel: event.target.value,
                      }))
                    }
                    className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal"
                  >
                    <option value="">Select level</option>
                    <option>Foundation</option>
                    <option>Form 4</option>
                    <option>Form 5</option>
                    <option>SPM Intensive</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted">Subject focus</span>
                  <select
                    value={form.subjectInterest}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        subjectInterest: event.target.value,
                      }))
                    }
                    className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal"
                  >
                    <option>SPM Mathematics</option>
                    <option>English</option>
                    <option>Science</option>
                  </select>
                </label>
              </div>
              <p className="text-sm leading-7 text-muted">
                Add the student email if the child already has an account. Leave it blank and we
                will create a student profile placeholder for you.
              </p>
            </>
          ) : null}

          {role === "Tutor" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted">Primary subject</span>
                <select
                  value={form.primarySubject}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      primarySubject: event.target.value,
                    }))
                  }
                  className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal"
                >
                  <option>SPM Mathematics</option>
                  <option>English</option>
                  <option>Science</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted">Levels taught</span>
                <input
                  value={form.levelsTaught}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      levelsTaught: event.target.value,
                    }))
                  }
                  placeholder="Form 4, Form 5, SPM"
                  className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal"
                />
              </label>
            </div>
          ) : null}

          {role === "Student" ? (
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted">Main learning goal</span>
              <input
                value={form.learningGoal}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    learningGoal: event.target.value,
                  }))
                }
                placeholder="Improve algebra and word problems"
                className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal"
              />
            </label>
          ) : null}

          {role === "Admin" ? (
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted">Primary admin focus</span>
              <input
                value={form.adminFocus}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    adminFocus: event.target.value,
                  }))
                }
                placeholder="Operations, partnerships, or platform quality"
                className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal"
              />
            </label>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={`mt-6 w-full rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#09443c] ${
            isPending ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          {isPending ? "Finishing setup..." : "Continue to Workspace"}
        </button>
        {error ? <p className="mt-4 text-sm leading-7 text-coral">{error}</p> : null}
      </form>
    </section>
  );
}
