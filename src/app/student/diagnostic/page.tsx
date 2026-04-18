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
        title="Tutor-Linked Readiness Check"
      />
    );
  }

  if (!session.user.onboardingCompleted) {
    redirect("/welcome");
  }

  const studentContext = await getStudentClassContext(studentId);

  return (
    <PageShell
      title="Tutor-Linked Readiness Check"
      description="Finish this quick check before class so your tutor can focus on the topics that need the most support."
      action={
        <div className="rounded-[1.5rem] bg-gold-soft px-5 py-4 text-sm font-semibold text-[#8b5a13]">
          Linked to {platformSummary.className}
        </div>
      }
      eyebrow="Pre-Class Student Flow"
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
