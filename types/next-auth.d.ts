import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role: "officer" | "viewer";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "officer" | "viewer";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "officer" | "viewer";
  }
}
