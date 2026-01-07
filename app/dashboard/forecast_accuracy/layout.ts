import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function ForecastLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("token")?.value!;
  const user = jwt.verify(token, JWT_SECRET) as any;

  if (user.role !== "forecast" && user.role !== "both") {
    redirect("/dashboard");
  }

  return children;
}

