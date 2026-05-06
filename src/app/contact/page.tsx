import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/contact-form";
import { SolacePageShell } from "@/components/solace/page-shell";
import { SectionShell } from "@/components/solace/section-shell";
import { createPageMetadata } from "@/lib/site-metadata";

const contactStreams = [
  {
    title: "Family enquiries",
    detail:
      "Questions about subjects, student level, trial classes, and parent onboarding.",
    actionLabel: "Book a Class",
    href: "/book-class",
  },
  {
    title: "Tutor applications",
    detail:
      "Apply to teach live classes, use AI follow-up tools, and support student progress on-platform.",
    actionLabel: "Apply as a Tutor",
    href: "/tutor-apply",
  },
  {
    title: "Tuition centre partnerships",
    detail:
      "Talk to the team about centre-wide rollouts, branch readiness, and workflow setup.",
    actionLabel: "See How It Works",
    href: "/how-it-works",
  },
];

const responseExpectations = [
  "Family and trial class enquiries are usually reviewed within one business day.",
  "Tutor applications are checked with subject, level, and availability in mind.",
  "Partnership conversations start with student volume, teaching model, and centre workflow needs.",
];

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Reach AI Learning OS for family enquiries, tutor applications, and tuition centre partnership conversations.",
  path: "/contact",
  keywords: [
    "contact tuition platform",
    "tuition centre enquiries Malaysia",
    "book tuition trial",
    "tutor application contact",
  ],
});

export default function ContactPage() {
  return (
    <SolacePageShell
      eyebrow="Contact"
      title="Talk to the team and we’ll route you to the right next step."
      description="Whether you are booking for a child, applying as a tutor, or exploring a tuition centre rollout, the platform team can point you to the fastest path."
      heroVariant="stage"
      heroColumnsClassName="lg:grid-cols-[0.58fr_0.42fr]"
      actions={
        <>
          <Link
            href="/book-class"
            className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold !text-[#2f5bff] shadow-[0_14px_32px_rgba(255,255,255,0.16)] transition hover:bg-[#f8fbff] hover:!text-[#2448d8]"
          >
            Book a Class
          </Link>
          <Link
            href="/tutor-apply"
            className="rounded-full border border-white/24 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/18"
          >
            Tutor Application
          </Link>
        </>
      }
      highlights={["Family enquiries", "Tutor applications", "Centre partnerships"]}
      aside={
        <div className="rounded-[1.9rem] border border-white/75 bg-white/96 p-6 shadow-[0_22px_54px_rgba(15,23,42,0.14)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3B6CFF]">
            Response expectation
          </p>
          <div className="mt-5 space-y-3">
            {responseExpectations.map((item) => (
              <div
                key={item}
                className="rounded-[1.2rem] border border-[#dbe7ff] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 py-3 text-sm font-medium leading-7 text-[#111827]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <SectionShell
        title="Choose the fastest route"
        description="Different enquiries move faster when they start in the right place."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {contactStreams.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.7rem] border border-[#e6ecf5] bg-white p-6 shadow-[0_14px_32px_rgba(59,108,255,0.06)]"
            >
              <p className="text-2xl font-semibold text-[#111827]">
                {item.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-[#5B6472]">
                {item.detail}
              </p>
              <Link
                href={item.href}
                className="mt-6 inline-flex rounded-full border border-[#dbe7ff] bg-[#eef4ff] px-5 py-3 text-sm font-semibold text-[#3B6CFF] transition hover:border-[#7C5CFF] hover:bg-white"
              >
                {item.actionLabel}
              </Link>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        eyebrow="Direct message"
        title="Need to send a general enquiry?"
        description="Use the message form for centre partnerships, billing questions, or anything that does not fit a direct booking or tutor application."
      >
        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="rounded-[2rem] border border-[#e6ecf5] bg-[linear-gradient(180deg,#ffffff_0%,#eef4ff_100%)] p-6 shadow-[0_18px_50px_rgba(59,108,255,0.08)] lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#3B6CFF]">
              What to include
            </p>
            <h2 className="solace-serif mt-3 text-4xl leading-[1.04] text-[#111827]">
              Help us route the message quickly
            </h2>
            <div className="mt-6 space-y-4">
              {[
                "Tell us whether this is for a family, tutor application, centre rollout, or platform question.",
                "Include the subject, student level, or centre size if it helps us answer faster.",
                "Leave a phone number if you want the team to follow up beyond email.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.4rem] border border-[#e6ecf5] bg-white p-5 text-sm leading-7 text-[#5B6472] shadow-[0_12px_28px_rgba(59,108,255,0.06)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </article>

          <ContactForm />
        </section>
      </SectionShell>

      <section className="rounded-[2rem] border border-[#d6e3ff] bg-[linear-gradient(135deg,#3B6CFF_0%,#4F7CFF_42%,#7C5CFF_78%,#12CFF3_100%)] px-6 py-8 text-white shadow-[0_28px_70px_rgba(59,108,255,0.22)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/72">
              Start here
            </p>
            <h2 className="solace-serif text-4xl leading-[1.04] sm:text-5xl">
              One enquiry can become a clearer weekly learning rhythm.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-white/78">
              Start with a booking request or tutor application and the platform
              takes care of the follow-up from there.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/book-class"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#3B6CFF] transition hover:bg-[#f8fbff]"
            >
              Book a Class
            </Link>
            <Link
              href="/tutor-apply"
              className="rounded-full border border-white/18 bg-transparent px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Apply as a Tutor
            </Link>
          </div>
        </div>
      </section>
    </SolacePageShell>
  );
}
