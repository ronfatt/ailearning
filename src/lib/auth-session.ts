import { UserRole } from "@prisma/client";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { createSessionToken, hashSessionToken } from "@/lib/auth-security";

export type WorkspaceRole = "Tutor" | "Student" | "Parent" | "Admin";
export type AppRole = WorkspaceRole | "Guest";

export type AppUser = {
  id: string | null;
  role: AppRole;
  name: string;
  email?: string | null;
  onboardingCompleted?: boolean;
};

export type AppSession = {
  isAuthenticated: boolean;
  user: AppUser;
};

export const sessionCookieName = "ai_learning_session";
const sessionDurationSeconds = 60 * 60 * 24 * 30;

const guestSession: AppSession = {
  isAuthenticated: false,
  user: {
    id: null,
    role: "Guest",
    name: "Guest visitor",
    email: null,
  },
};

function mapDatabaseRole(role: UserRole): WorkspaceRole {
  switch (role) {
    case UserRole.TUTOR:
      return "Tutor";
    case UserRole.STUDENT:
      return "Student";
    case UserRole.PARENT:
      return "Parent";
    case UserRole.ADMIN:
      return "Admin";
  }
}

export async function getCurrentSession(): Promise<AppSession> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(sessionCookieName)?.value;

  if (!sessionToken || !process.env.DATABASE_URL) {
    return guestSession;
  }

  try {
    const authSession = await prisma.authSession.findUnique({
      where: {
        sessionTokenHash: hashSessionToken(sessionToken),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            onboardingCompleted: true,
          },
        },
      },
    });

    if (!authSession || authSession.expiresAt <= new Date()) {
      return guestSession;
    }

    return {
      isAuthenticated: true,
      user: {
        id: authSession.user.id,
        email: authSession.user.email,
        name: authSession.user.fullName,
        role: mapDatabaseRole(authSession.user.role),
        onboardingCompleted: authSession.user.onboardingCompleted,
      },
    };
  } catch {
    return guestSession;
  }
}

export function canAccessRole({
  currentRole,
  allowedRoles,
}: {
  currentRole: AppRole;
  allowedRoles: WorkspaceRole[];
}) {
  if (currentRole === "Guest") {
    return false;
  }

  return allowedRoles.includes(currentRole);
}

export function getWorkspacePath(role: WorkspaceRole) {
  switch (role) {
    case "Tutor":
      return "/tutor";
    case "Student":
      return "/student";
    case "Parent":
      return "/parent";
    case "Admin":
      return "/admin";
  }
}

export function getAuthenticatedHomePath(user: AppUser) {
  if (user.role === "Guest") {
    return "/login";
  }

  if (!user.onboardingCompleted) {
    return "/welcome";
  }

  return getWorkspacePath(user.role);
}

export async function createAuthSession(userId: string) {
  const rawToken = createSessionToken();
  const expiresAt = new Date(Date.now() + sessionDurationSeconds * 1000);

  await prisma.authSession.create({
    data: {
      userId,
      sessionTokenHash: hashSessionToken(rawToken),
      expiresAt,
    },
  });

  return {
    rawToken,
    expiresAt,
  };
}

export async function revokeAuthSession(rawToken?: string | null) {
  if (!rawToken) {
    return;
  }

  await prisma.authSession.deleteMany({
    where: {
      sessionTokenHash: hashSessionToken(rawToken),
    },
  });
}
