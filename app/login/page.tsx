"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center">
      <button
        onClick={() => signIn("google")}
        className="px-4 py-2 rounded bg-black text-white"
      >
        Sign in with Google
      </button>
    </div>
  );
}
