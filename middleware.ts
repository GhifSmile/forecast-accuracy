import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

type JwtPayload = {
  user_id: number;
  email: string;
  role: "admin" | "user" | "both";
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // ✅ Public routes
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // ❌ Belum login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const role = decoded.role;

    // 🔒 Forecast Accuracy protection
    if (
      pathname.startsWith("/forecast-accuracy") &&
      !["admin", "both"].includes(role)
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 🔒 Turnover protection
    if (
      pathname.startsWith("/admin") &&
      !["admin", "both"].includes(role)
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    // ❌ Token invalid / expired
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.set("token", "", { maxAge: 0, path: "/" });
    return res;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
