import type { Metadata } from "next";

import { SolaceLandingHeader } from "@/components/solace/landing-header";
import { TutorApplyForm } from "@/components/tutor-apply-form";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Apply as a Tutor",
  description:
    "Apply to teach live classes with AI-supported lesson prep, homework follow-up, and clearer parent communication.",
  path: "/tutor-apply",
  keywords: [
    "tutor application Malaysia",
    "online tuition tutor job",
    "AI teaching platform tutors",
  ],
});

export default function TutorApplyPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.16),transparent_18%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.16),transparent_20%),linear-gradient(180deg,#f7fbff_0%,#eef5ff_42%,#ffffff_100%)]">
      <SolaceLandingHeader />
      <main className="px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-[640px] items-center justify-center">
          <TutorApplyForm />
        </div>
      </main>
    </div>
  );
}
