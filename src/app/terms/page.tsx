import type { Metadata } from "next";
import { SolacePageShell } from "@/components/solace/page-shell";
import { SectionShell } from "@/components/solace/section-shell";
import { createPageMetadata } from "@/lib/site-metadata";

const termsPoints = [
  "Tutor-led classes remain the primary learning experience across the platform.",
  "AI support is limited by tutor-approved scope, class linkage, and internal review workflows.",
  "Families are responsible for providing accurate enrollment, scheduling, and contact information.",
  "Tutors and admins are responsible for reviewing educational outputs before delivery where approval workflows apply.",
];

const usageBoundaries = [
  "The platform supports tuition, revision, reporting, and follow-up workflows.",
  "It is not a fully autonomous AI teaching platform.",
  "It is not a substitute for direct tutor oversight in assigned learning activity.",
  "Availability, pricing, and tutor matching may vary by subject, level, and schedule.",
];

export const metadata: Metadata = createPageMetadata({
  title: "Terms",
  description:
    "Review the core terms for using AI Learning OS as a family, student, tutor, or tuition operator.",
  path: "/terms",
  keywords: ["tuition platform terms", "AI learning platform terms"],
});

export default function TermsPage() {
  return (
    <SolacePageShell
      eyebrow="Terms"
      title="Clear terms for tutor-led learning on the platform."
      description="These terms explain how the tuition platform is intended to be used by families, students, tutors, and tuition operators."
      heroPanelClassName="border-[#e6ecf5] bg-[radial-gradient(circle_at_20%_12%,rgba(18,207,243,0.14),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(124,92,255,0.1),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] shadow-[0_28px_80px_rgba(59,108,255,0.1)]"
    >
      <SectionShell
        title="Core platform terms"
        description="The rules below keep roles, expectations, and AI boundaries clear."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {termsPoints.map((item) => (
            <div
              key={item}
              className="rounded-[1.5rem] border border-[#e6ecf5] bg-white px-5 py-4 text-sm font-medium leading-7 text-[#111827] shadow-[0_12px_28px_rgba(59,108,255,0.06)]"
            >
              {item}
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        title="Usage boundaries"
        description="The platform is built for AI-assisted tuition operations, not generic unsupervised learning."
        inverted
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {usageBoundaries.map((item) => (
            <div
              key={item}
              className="rounded-[1.5rem] border border-white/12 bg-white/8 px-5 py-4 text-sm font-medium leading-7 text-white/86"
            >
              {item}
            </div>
          ))}
        </div>
      </SectionShell>
    </SolacePageShell>
  );
}
