"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { passwordRequirementText } from "@/lib/auth-validation";

type ActivationResponse = {
  data?: {
    redirectTo?: string;
  };
  error?: string;
};

export function ActivateAccountForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(() => {
      void fetch("/api/auth/activate", {
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
            | ActivationResponse
            | null;

          if (!response.ok) {
            throw new Error(payload?.error ?? "Unable to activate account.");
          }

          router.push(payload?.data?.redirectTo ?? "/");
          router.refresh();
        })
        .catch((reason: unknown) => {
          setError(
            reason instanceof Error
              ? reason.message
              : "Unable to activate account.",
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
        <p className="text-sm font-medium text-[#5B6472]">Invited users</p>
        <h2 className="text-[2rem] font-semibold leading-tight tracking-tight text-[#111827] sm:text-[2.15rem]">
          Set your password and continue
        </h2>
        <p className="text-sm leading-7 text-[#5B6472]">
          Use this only if your account was created for you by a tutor, parent, or admin.
        </p>
      </div>
      <div className="mt-6 grid gap-4">
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
          <span className="text-sm font-medium text-[#5B6472]">New password</span>
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
        {isPending ? "Activating..." : "Activate Account"}
      </button>
      {error ? <p className="mt-4 text-sm leading-7 text-[#FF6B6B]">{error}</p> : null}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm leading-7 text-[#5B6472]">
        <span>
          Already active?{" "}
          <Link className="font-semibold text-[#3B6CFF]" href="/login">
            Sign in
          </Link>
        </span>
        <span>
          Need a family account?{" "}
          <Link className="font-semibold text-[#3B6CFF]" href="/signup">
            Register
          </Link>
        </span>
      </div>
    </form>
  );
}
