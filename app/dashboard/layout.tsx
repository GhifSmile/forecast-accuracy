import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";

const JWT_SECRET = process.env.JWT_SECRET!;

type JWTPayload = {
  email: string;
  role: "forecast" | "admin" | "both";
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("token")?.value!;
  const user = jwt.verify(token, JWT_SECRET) as JWTPayload;

  const canForecast =
    user.role === "forecast" || user.role === "both";
  const canTurnover =
    user.role === "admin" || user.role === "both";

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r p-4 space-y-6">
        <h2 className="text-lg font-bold">Dashboard</h2>

        {canForecast && (
          <div>
            <p className="text-sm font-semibold mb-2">
              Forecast Accuracy
            </p>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/dashboard/forecast-accuracy/executive-summary">
                  Executive Summary
                </Link>
              </li>
              <li>
                <Link href="/dashboard/forecast-accuracy/trend-analysis">
                  Trend Analysis
                </Link>
              </li>
              <li>
                <Link href="/dashboard/forecast-accuracy/plant-performance">
                  Plant Performance Detail
                </Link>
              </li>
            </ul>
          </div>
        )}

        {canTurnover && (
          <div>
            <p className="text-sm font-semibold mb-2">
              Turnover
            </p>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/dashboard/turnover/dashboard-a">
                  Dashboard A
                </Link>
              </li>
              <li>
                <Link href="/dashboard/turnover/dashboard-b">
                  Dashboard B
                </Link>
              </li>
            </ul>
          </div>
        )}
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
