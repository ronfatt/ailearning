import { EnrollmentStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function getStudentClassContext(studentId?: string) {
  if (!process.env.DATABASE_URL || !studentId) {
    return null;
  }

  const enrollment = await prisma.classEnrollment.findFirst({
    where: {
      studentId,
      status: EnrollmentStatus.ACTIVE,
    },
    include: {
      class: {
        include: {
          subject: true,
          tutor: true,
        },
      },
    },
    orderBy: {
      joinedAt: "desc",
    },
  });

  if (!enrollment) {
    return null;
  }

  return {
    classId: enrollment.classId,
    classTitle: enrollment.class.title,
    tutorId: enrollment.class.tutorId,
    tutorName: enrollment.class.tutor.fullName,
    subjectId: enrollment.class.subjectId,
    subjectName: enrollment.class.subject.name,
  };
}
