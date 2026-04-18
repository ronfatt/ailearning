"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(() => {
      void fetch("/api/auth/session", {
        method: "DELETE",
      }).then(() => {
        router.push("/");
        router.refresh();
      });
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleSignOut}
      className={`rounded-full border border-border bg-white/70 px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-teal hover:text-teal ${
        isPending ? "cursor-not-allowed opacity-60" : ""
      }`}
    >
      {isPending ? "Signing out..." : "Sign Out"}
    </button>
  );
}
