import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: "officer" | "viewer";
    } & DefaultSession["user"];
  }

  interface User {
    role: "officer" | "viewer";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "officer" | "viewer";
  }
}
