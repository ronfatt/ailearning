"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { passwordRequirementText } from "@/lib/auth-validation";

type ResetPasswordResponse = {
  data?: {
    redirectTo?: string;
  };
  error?: string;
};

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
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
      void fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      })
        .then(async (response) => {
          const payload = (await response.json().catch(() => null)) as
            | ResetPasswordResponse
            | null;

          if (!response.ok) {
            throw new Error(payload?.error ?? "Unable to reset password.");
          }

          router.push(payload?.data?.redirectTo ?? "/login");
          router.refresh();
        })
        .catch((reason: unknown) => {
          setError(
            reason instanceof Error ? reason.message : "Unable to reset password.",
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
        <p className="text-sm font-medium text-[#5B6472]">New password</p>
        <h2 className="text-[2rem] font-semibold leading-tight tracking-tight text-[#111827] sm:text-[2.15rem]">
          Choose a new password
        </h2>
        <p className="text-sm leading-7 text-[#5B6472]">
          Once saved, you will be signed in automatically.
        </p>
      </div>
      <div className="mt-6 grid gap-4">
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
        {isPending ? "Saving new password..." : "Save new password"}
      </button>
      {error ? <p className="mt-4 text-sm leading-7 text-[#FF6B6B]">{error}</p> : null}
      <p className="mt-4 text-sm leading-7 text-[#5B6472]">
        Need a fresh link?{" "}
        <Link href="/forgot-password" className="font-semibold text-[#3B6CFF]">
          Request another reset
        </Link>
      </p>
    </form>
  );
}
