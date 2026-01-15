import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ROLE_ACCESS: Record<string, string[]> = {
  officer: [
    "/forecast-accuracy",
  ],
  viewer: [
    "/forecast-accuracy",
  ],
};

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // 1️⃣ Allow public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  // 2️⃣ Not logged in
  if (!token) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  const userRole = token.role as string;

  // 3️⃣ Role not defined
  if (!userRole) {
    return NextResponse.redirect(
      new URL("/unauthorized", req.url)
    );
  }

  // 4️⃣ Check role access
  const allowedPaths = ROLE_ACCESS[userRole] || [];

  const isAllowed = allowedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (!isAllowed) {
    return NextResponse.redirect(
      new URL("/unauthorized", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
