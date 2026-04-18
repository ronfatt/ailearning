"use client";

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
      className="rounded-[2.2rem] border border-border bg-white/82 p-6 shadow-[0_24px_60px_rgba(13,92,82,0.08)]"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted">Invited users</p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Set your password and continue
        </h2>
        <p className="text-sm leading-7 text-muted">
          Use this only if your account was created for you by a tutor, parent, or admin.
        </p>
      </div>
      <div className="mt-6 grid gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium text-muted">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-[#d7efe9]"
          />
        </label>
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
        {isPending ? "Activating..." : "Activate Account"}
      </button>
      {error ? <p className="mt-4 text-sm leading-7 text-coral">{error}</p> : null}
    </form>
  );
}
