import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import { masterUser } from "@/lib/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const users = await db
    .select()
    .from(masterUser)
    .where(eq(masterUser.email, email))
    .limit(1);

  if (users.length === 0) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const user = users[0];

  if (!user.isActive || password !== user.password) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    {
      user_id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return NextResponse.json({
    success: true,
    token,
    role: user.role,
  });
}
