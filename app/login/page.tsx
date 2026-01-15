"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm text-center">
        <h1 className="text-xl font-bold mb-6">
          Login Forecast Accuracy
        </h1>

        <Button
          className="w-full"
          onClick={() =>
            signIn("google", {
              callbackUrl: "/forecast-accuracy/executive_summary",
            })
          }
        >
          Login with Google
        </Button>
      </div>
    </div>
  );
}
