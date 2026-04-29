"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type SessionResponse = {
  data?: {
    redirectTo?: string;
  };
  error?: string;
};

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
      className="rounded-[2.2rem] border border-border bg-white/82 p-6 shadow-[0_24px_60px_rgba(13,92,82,0.08)]"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted">Account sign in</p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Continue to your workspace
        </h2>
        <p className="text-sm leading-7 text-muted">
          Parents can sign in after registration. Tutors, students, and invited users can sign in after activation.
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
      <label className="mt-4 block space-y-2">
        <span className="text-sm font-medium text-muted">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
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
        {isPending ? "Signing in..." : "Sign In"}
      </button>
      {error ? (
        <p className="mt-4 text-sm leading-7 text-coral">{error}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm leading-7 text-muted">
        <span>
          Need a family account?{" "}
          <Link className="font-semibold text-teal" href="/signup">
            Register
          </Link>
        </span>
        <span>
          Invited user?{" "}
          <Link className="font-semibold text-teal" href="/activate-account">
            Activate account
          </Link>
        </span>
        <span>
          Forgot password?{" "}
          <Link className="font-semibold text-teal" href="/forgot-password">
            Reset it
          </Link>
        </span>
      </div>
    </form>
  );
}
