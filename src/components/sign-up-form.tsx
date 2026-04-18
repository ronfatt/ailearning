"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type RegisterResponse = {
  data?: {
    redirectTo?: string;
  };
  error?: string;
};

export function SignUpForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

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
      className="rounded-[2rem] border border-border bg-white/80 p-6 shadow-[0_18px_50px_rgba(13,92,82,0.06)]"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted">Parent registration</p>
        <h2 className="text-2xl font-semibold text-foreground">
          Create your parent account
        </h2>
      </div>
      <div className="mt-6 grid gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium text-muted">Full name</span>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
            className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-muted">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-muted">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full rounded-[1.25rem] border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-teal"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className={`mt-6 w-full rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#09443c] ${
          isPending ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        {isPending ? "Creating account..." : "Create Account"}
      </button>
      {error ? <p className="mt-4 text-sm leading-7 text-coral">{error}</p> : null}
      <p className="mt-4 text-sm leading-7 text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-teal">
          Sign in
        </Link>
      </p>
    </form>
  );
}
