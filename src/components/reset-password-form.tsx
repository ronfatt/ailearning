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
      className="rounded-[2.2rem] border border-border bg-white/82 p-6 shadow-[0_24px_60px_rgba(13,92,82,0.08)]"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted">New password</p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Choose a new password
        </h2>
        <p className="text-sm leading-7 text-muted">
          Once saved, you will be signed in automatically.
        </p>
      </div>
      <div className="mt-6 grid gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium text-muted">New password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-[#d7efe9]"
          />
          <p className="text-xs leading-6 text-muted">{passwordRequirementText}</p>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-muted">Confirm password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-[#d7efe9]"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className={`mt-6 w-full rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(13,92,82,0.18)] transition hover:-translate-y-0.5 hover:bg-[#09443c] ${
          isPending ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        {isPending ? "Saving new password..." : "Save new password"}
      </button>
      {error ? <p className="mt-4 text-sm leading-7 text-coral">{error}</p> : null}
      <p className="mt-4 text-sm leading-7 text-muted">
        Need a fresh link?{" "}
        <Link href="/forgot-password" className="font-semibold text-teal">
          Request another reset
        </Link>
      </p>
    </form>
  );
}
