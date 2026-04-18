import { prisma } from "@/lib/prisma";

export async function getLinkedStudentIdForParent(parentId?: string | null) {
  if (!parentId) {
    return null;
  }

  if (!process.env.DATABASE_URL) {
    return null;
  }

  const link = await prisma.parentStudentLink.findFirst({
    where: { parentId },
    select: { studentId: true },
    orderBy: { createdAt: "asc" },
  });

  return link?.studentId ?? null;
}

function toEmailSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 32);
}

export function buildPendingStudentEmail(studentName: string, parentId: string) {
  const slug = toEmailSlug(studentName) || "student";
  const parentSuffix = parentId.replace(/[^a-z0-9]/gi, "").slice(-8).toLowerCase();

  return `${slug}.${parentSuffix}@pending.ailearning.local`;
}
