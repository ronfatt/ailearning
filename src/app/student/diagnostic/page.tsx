import { AccessGuard } from "@/components/access-guard";
import { DiagnosticReadinessForm } from "@/components/diagnostic-readiness-form";
import { PageShell } from "@/components/page-shell";
import { canAccessRole, getCurrentSession } from "@/lib/auth-session";
import { platformSummary } from "@/lib/mvp-data";
import { getStudentClassContext } from "@/lib/server/student-context";
import { redirect } from "next/navigation";

export default async function DiagnosticPage() {
  const session = await getCurrentSession();
  const studentId = session.user.id ?? "student_aina_01";

  if (
    !canAccessRole({
      currentRole: session.user.role,
      allowedRoles: ["Student"],
    })
  ) {
    return (
      <AccessGuard
        allowedRoles={["Student"]}
        currentRole={session.user.role}
        currentUserName={session.user.name}
        title="Pre-Class Warm-up"
      />
    );
  }

  if (!session.user.onboardingCompleted) {
    redirect("/welcome");
  }

  const studentContext = await getStudentClassContext(studentId);

  return (
    <PageShell
      title="2-minute class warm-up"
      description="Answer a few quick questions before class so your tutor can focus on the parts that may slow you down."
      action={
        <div className="rounded-[1.5rem] bg-gold-soft px-5 py-4 text-sm font-semibold text-[#8b5a13]">
          Today&apos;s class: {platformSummary.className}
        </div>
      }
      eyebrow="Before Class"
    >
      <DiagnosticReadinessForm
        studentId={studentId}
        classId={studentContext?.classId}
        tutorId={studentContext?.tutorId}
        subjectId={studentContext?.subjectId}
      />
    </PageShell>
  );
}
