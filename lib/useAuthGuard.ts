"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthGuard(allowedRoles: string[]) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(role)) {
      router.replace("/login");
    }
  }, [allowedRoles, router]);
}
