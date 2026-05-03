"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { GlowBadge } from "@/components/solace/youthful-ui";
import { passwordRequirementText } from "@/lib/auth-validation";

type RegisterResponse = {
  data?: {
    redirectTo?: string;
  };
  error?: string;
};

const roleOptions = [
  {
    id: "student",
    label: "Student",
    helper: "Students usually join after a parent, tutor, or centre has already created the learning path.",
  },
  {
    id: "parent",
    label: "Parent",
    helper: "Parents create the family account, book classes, and follow progress in one place.",
  },
  {
    id: "tutor",
    label: "Tutor",
    helper: "Tutors either apply first or activate an invited workspace after approval.",
  },
] as const;

export function SignUpForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] =
    useState<(typeof roleOptions)[number]["id"]>("parent");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const activeRole =
    roleOptions.find((option) => option.id === selectedRole) ?? roleOptions[1];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(() => {
      void fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      })
        .then(async (response) => {
          const payload = (await response.json().catch(() => null)) as
            | RegisterResponse
            | null;

          if (!response.ok) {
            throw new Error(payload?.error ?? "Unable to create account.");
          }

          router.push(payload?.data?.redirectTo ?? "/parent");
          router.refresh();
        })
        .catch((reason: unknown) => {
          setError(
            reason instanceof Error
              ? reason.message
              : "Unable to create account.",
          );
        });
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-[2rem] border border-[#e6ecf5] bg-white/96 p-7 shadow-[0_24px_60px_rgba(59,108,255,0.1)] sm:p-8"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-[#5B6472]">Parent registration</p>
        <h2 className="text-[2rem] font-semibold leading-tight tracking-tight text-[#111827] sm:text-[2.15rem]">
          Create your family account
        </h2>
        <p className="text-sm leading-7 text-[#5B6472]">
          Choose the right access path first so registration stays clear and role-specific.
        </p>
        <div className="rounded-[1.35rem] border border-[#e6ecf5] bg-[#f8fbff] p-2">
          <div className="grid grid-cols-3 gap-2">
            {roleOptions.map((option) => {
              const isActive = option.id === selectedRole;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedRole(option.id)}
                  className={`rounded-[1rem] px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[linear-gradient(135deg,#3B6CFF_0%,#7C5CFF_100%)] text-white shadow-[0_14px_32px_rgba(59,108,255,0.18)]"
                      : "bg-white text-[#111827] hover:border-[#dbe7ff] hover:text-[#3B6CFF]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <p className="px-2 pt-3 text-sm leading-6 text-[#5B6472]">
            {activeRole.helper}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <GlowBadge label={activeRole.label} tone={selectedRole === "student" ? "purple" : selectedRole === "tutor" ? "mint" : "blue"} />
          <GlowBadge label="Private access" tone="blue" />
          <GlowBadge label="Tutor-linked" tone="mint" />
        </div>
      </div>
      {selectedRole === "parent" ? (
        <>
          <div className="mt-6 grid gap-4">
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#5B6472]">Full name</span>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#5B6472]">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#5B6472]">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
              />
              <p className="text-xs leading-6 text-[#5B6472]">{passwordRequirementText}</p>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#5B6472]">Confirm password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className={`mt-6 w-full rounded-full bg-[linear-gradient(135deg,#3B6CFF_0%,#7C5CFF_100%)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(59,108,255,0.2)] transition hover:-translate-y-0.5 hover:opacity-95 ${
              isPending ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            {isPending ? "Creating account..." : "Create Account"}
          </button>
          {error ? <p className="mt-4 text-sm leading-7 text-[#FF6B6B]">{error}</p> : null}
        </>
      ) : selectedRole === "student" ? (
        <div className="mt-6 rounded-[1.7rem] border border-[#e6ecf5] bg-[#f8fbff] p-5">
          <p className="text-sm leading-7 text-[#5B6472]">
            Students do not create independent accounts here. Join through a parent, tutor, or invited workspace.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/activate-account"
              className="rounded-full bg-[linear-gradient(135deg,#3B6CFF_0%,#7C5CFF_100%)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(59,108,255,0.2)] transition hover:-translate-y-0.5"
            >
              Activate student account
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-[#dbe7ff] bg-white px-5 py-3.5 text-sm font-semibold text-[#111827] transition hover:border-[#7C5CFF] hover:text-[#3B6CFF]"
            >
              Back to login
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-[1.7rem] border border-[#e6ecf5] bg-[#f8fbff] p-5">
          <p className="text-sm leading-7 text-[#5B6472]">
            Tutors usually apply first, then activate an invited workspace after approval.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/tutor-apply"
              className="rounded-full bg-[linear-gradient(135deg,#3B6CFF_0%,#7C5CFF_100%)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(59,108,255,0.2)] transition hover:-translate-y-0.5"
            >
              Apply as a tutor
            </Link>
            <Link
              href="/activate-account"
              className="rounded-full border border-[#dbe7ff] bg-white px-5 py-3.5 text-sm font-semibold text-[#111827] transition hover:border-[#7C5CFF] hover:text-[#3B6CFF]"
            >
              Activate invited account
            </Link>
          </div>
        </div>
      )}
      <p className="mt-4 text-sm leading-7 text-[#5B6472]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#3B6CFF]">
          Sign in
        </Link>
      </p>
    </form>
  );
}
