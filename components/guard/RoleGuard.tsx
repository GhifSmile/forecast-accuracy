"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";

type Role = "officer" | "viewer";

export default function RoleGuard({
  allow,
  children,
}: {
  allow: Role[];
  children: ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") return null;
  if (!session?.user?.role) return null;

  if (!allow.includes(session.user.role)) {
    return null;
  }

  return <>{children}</>;
}
