"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

type PasswordResetResponse = {
  data?: {
    message?: string;
    debugResetUrl?: string;
  };
  error?: string;
};

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    message: string;
    debugResetUrl?: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(() => {
      void fetch("/api/auth/password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
        .then(async (response) => {
          const payload = (await response.json().catch(() => null)) as
            | PasswordResetResponse
            | null;

          if (!response.ok) {
            throw new Error(
              payload?.error ?? "Unable to start password reset.",
            );
          }

          setSuccess({
            message:
              payload?.data?.message ??
              "If an account exists for this email, reset instructions will be sent shortly.",
            debugResetUrl: payload?.data?.debugResetUrl,
          });
        })
        .catch((reason: unknown) => {
          setError(
            reason instanceof Error
              ? reason.message
              : "Unable to start password reset.",
          );
        });
    });
  }

  if (success) {
    return (
      <div className="rounded-[2.2rem] border border-border bg-white/82 p-6 shadow-[0_24px_60px_rgba(13,92,82,0.08)]">
        <p className="text-sm font-medium text-teal">Check your email</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Password reset started
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted">{success.message}</p>
        {success.debugResetUrl ? (
          <div className="mt-5 rounded-[1.5rem] border border-border bg-surface-strong p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
              Local testing link
            </p>
            <Link
              href={success.debugResetUrl}
              className="mt-3 block break-all text-sm font-semibold text-teal"
            >
              {success.debugResetUrl}
            </Link>
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-4 text-sm leading-7 text-muted">
          <Link href="/login" className="font-semibold text-teal">
            Back to login
          </Link>
          <button
            type="button"
            className="font-semibold text-teal"
            onClick={() => {
              setSuccess(null);
              setEmail("");
            }}
          >
            Try another email
          </button>
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
        <p className="text-sm font-medium text-muted">Password reset</p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Reset your password
        </h2>
        <p className="text-sm leading-7 text-muted">
          Enter your email and we will send reset instructions if the account exists.
        </p>
      </div>
      <label className="mt-6 block space-y-2">
        <span className="text-sm font-medium text-muted">Email address</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
          className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-teal focus:ring-2 focus:ring-[#d7efe9]"
          required
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className={`mt-6 w-full rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(13,92,82,0.18)] transition hover:-translate-y-0.5 hover:bg-[#09443c] ${
          isPending ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        {isPending ? "Sending reset link..." : "Send reset link"}
      </button>
      {error ? <p className="mt-4 text-sm leading-7 text-coral">{error}</p> : null}
      <p className="mt-4 text-sm leading-7 text-muted">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-teal">
          Back to login
        </Link>
      </p>
    </form>
  );
}
