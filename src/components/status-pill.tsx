import type { ApprovalStatus } from "@/lib/mvp-data";

type StatusPillProps = {
  status: ApprovalStatus;
};

const statusClasses: Record<ApprovalStatus, string> = {
  draft: "bg-[#f2e3c7] text-[#8b5a13]",
  tutor_reviewed: "bg-teal-soft text-teal",
  approved: "bg-[#d7f0de] text-[#1f6b3a]",
  assigned: "bg-[#d9e7ff] text-[#2450a6]",
  archived: "bg-[#ede9e1] text-[#6a665d]",
};

export function StatusPill({ status }: StatusPillProps) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[status]}`}>
      {status}
    </span>
  );
}
