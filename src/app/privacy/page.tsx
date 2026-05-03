import type { Metadata } from "next";
import { SolacePageShell } from "@/components/solace/page-shell";
import { SectionShell } from "@/components/solace/section-shell";
import { createPageMetadata } from "@/lib/site-metadata";

const privacyPoints = [
  "We collect the details needed to run classes, enrollment, homework tracking, and parent reporting.",
  "Student activity stays linked to tutors, classes, and approved study plans inside the platform.",
  "Parent progress updates are built from class activity, homework, revision, and tutor-reviewed follow-up.",
  "We do not position AI outputs as independent teaching decisions without tutor linkage.",
];

const dataUses = [
  "Match families to tutors and class schedules",
  "Track homework, revision progress, and attendance",
  "Support parent communication and approved reports",
  "Improve platform stability, product quality, and learning workflows",
];

export const metadata: Metadata = createPageMetadata({
  title: "Privacy",
  description:
    "Read how AI Learning OS handles student, parent, tutor, and class data to support tuition workflows responsibly.",
  path: "/privacy",
  keywords: ["privacy policy tuition platform", "student data privacy", "parent reporting privacy"],
});

export default function PrivacyPage() {
  return (
    <SolacePageShell
      eyebrow="Privacy"
      title="Privacy that supports learning, reporting, and trust."
      description="This platform is designed to handle student, parent, and tutor data responsibly while keeping tuition workflows clear and visible."
      heroPanelClassName="border-[#e6ecf5] bg-[radial-gradient(circle_at_20%_12%,rgba(18,207,243,0.14),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(124,92,255,0.1),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] shadow-[0_28px_80px_rgba(59,108,255,0.1)]"
    >
      <SectionShell
        title="What we collect"
        description="We keep this focused on what is needed to run tutor-led tuition and student follow-up."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {privacyPoints.map((item) => (
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
        title="How we use data"
        description="Data is used to deliver classes, revision workflows, reporting, and day-to-day platform operations."
        inverted
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {dataUses.map((item) => (
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
