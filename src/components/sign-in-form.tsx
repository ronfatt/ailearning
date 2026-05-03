"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { GlowBadge } from "@/components/solace/youthful-ui";

type SessionResponse = {
  data?: {
    redirectTo?: string;
  };
  error?: string;
};

const roleOptions = [
  {
    id: "student",
    label: "Student",
    helper: "Homework, revision, and tutor-linked AI study support.",
    secondaryLabel: "Need an invited student account?",
    secondaryHref: "/activate-account",
    secondaryCta: "Activate account",
  },
  {
    id: "parent",
    label: "Parent",
    helper: "Progress reports, bookings, attendance, and tutor updates.",
    secondaryLabel: "Need a family account?",
    secondaryHref: "/signup",
    secondaryCta: "Register",
  },
  {
    id: "tutor",
    label: "Tutor",
    helper: "Class prep, approvals, live workflow, and follow-up tools.",
    secondaryLabel: "Need an invited tutor account?",
    secondaryHref: "/activate-account",
    secondaryCta: "Activate account",
  },
] as const;

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] =
    useState<(typeof roleOptions)[number]["id"]>("parent");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const activeRole =
    roleOptions.find((option) => option.id === selectedRole) ?? roleOptions[1];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(() => {
      void fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then(async (response) => {
          const payload = (await response.json().catch(() => null)) as
            | SessionResponse
            | null;

          if (!response.ok) {
            throw new Error(payload?.error ?? "Unable to sign in.");
          }

          const redirectTo = payload?.data?.redirectTo ?? "/";
          router.push(redirectTo);
          router.refresh();
        })
        .catch((reason: unknown) => {
          setError(
            reason instanceof Error ? reason.message : "Unable to sign in.",
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
        <p className="text-sm font-medium text-[#5B6472]">Account sign in</p>
        <h2 className="text-[2rem] font-semibold leading-tight tracking-tight text-[#111827] sm:text-[2.15rem]">
          Continue to your workspace
        </h2>
        <p className="text-sm leading-7 text-[#5B6472]">
          Choose your access type first so the sign-in path feels clearer.
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
          <GlowBadge label="Role-based workspace" tone="mint" />
        </div>
      </div>
      <label className="mt-6 block space-y-2">
        <span className="text-sm font-medium text-[#5B6472]">Email address</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
          className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
          required
        />
      </label>
      <label className="mt-4 block space-y-2">
        <span className="text-sm font-medium text-[#5B6472]">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          className="w-full rounded-[1.25rem] border border-[#e6ecf5] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#dbeafe]"
          required
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className={`mt-6 w-full rounded-full bg-[linear-gradient(135deg,#3B6CFF_0%,#7C5CFF_100%)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(59,108,255,0.2)] transition hover:-translate-y-0.5 hover:opacity-95 ${
          isPending ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>
      {error ? (
        <p className="mt-4 text-sm leading-7 text-[#FF6B6B]">{error}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm leading-7 text-[#5B6472]">
        <span>
          {activeRole.secondaryLabel}{" "}
          <Link className="font-semibold text-[#3B6CFF]" href={activeRole.secondaryHref}>
            {activeRole.secondaryCta}
          </Link>
        </span>
        <span>
          Forgot password?{" "}
          <Link className="font-semibold text-[#3B6CFF]" href="/forgot-password">
            Reset it
          </Link>
        </span>
      </div>
    </form>
  );
}
