import type { Metadata } from "next";

import { BookClassForm } from "@/components/book-class-form";
import { SolaceLandingHeader } from "@/components/solace/landing-header";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Book a Class",
  description:
    "Start with a simple tuition booking request so we can match the right tutor, subject focus, and class path for your child.",
  path: "/book-class",
  keywords: [
    "book tuition class",
    "tuition trial Malaysia",
    "student class matching",
  ],
});

export default function BookClassPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.16),transparent_18%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.16),transparent_20%),linear-gradient(180deg,#f7fbff_0%,#eef5ff_42%,#ffffff_100%)]">
      <SolaceLandingHeader />
      <main className="px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-[640px] items-center justify-center">
          <BookClassForm />
        </div>
      </main>
    </div>
  );
}
