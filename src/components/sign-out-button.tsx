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
      className={`rounded-full border border-[#dbe7ff] bg-white px-4 py-2.5 text-sm font-semibold text-[#111827] transition hover:-translate-y-0.5 hover:border-[#7C5CFF] hover:text-[#3B6CFF] ${
        isPending ? "cursor-not-allowed opacity-60" : ""
      }`}
    >
      {isPending ? "Signing out..." : "Sign Out"}
    </button>
  );
}
