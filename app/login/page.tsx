"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  setLoading(true);

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  setLoading(false);

  if (!res.ok) {
    alert(data.message);
    return;
  }

  // ✅ SIMPAN TOKEN
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);

  console.log("✅ TOKEN SAVED:", data.token);
  console.log("👤 ROLE:", data.role);

  if (data.role === "user" || data.role === "admin") {
    router.push("/forecast-accuracy/executive-summary");
  } else {
    router.push("/turnover/dashboard-a");
  }
};

  return (
    <div className="h-screen flex items-center justify-center bg-muted">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle className="text-center">Login Dashboard</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
