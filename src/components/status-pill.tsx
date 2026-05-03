import type { ApprovalStatus } from "@/lib/mvp-data";

type StatusPillProps = {
  status: ApprovalStatus;
};

const statusClasses: Record<ApprovalStatus, string> = {
  draft: "bg-[#fff4d6] text-[#c27b00]",
  tutor_reviewed: "bg-[#eef4ff] text-[#3B6CFF]",
  approved: "bg-[#ecfdf5] text-[#158f67]",
  assigned: "bg-[#e0f2fe] text-[#2450a6]",
  archived: "bg-[#f3f4f6] text-[#6b7280]",
};

export function StatusPill({ status }: StatusPillProps) {
  return (
    <span
      className={`rounded-full border border-white/70 px-3 py-1 text-xs font-semibold shadow-[0_8px_18px_rgba(59,108,255,0.06)] ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}
