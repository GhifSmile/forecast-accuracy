export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/forecast-accuracy/:path*"],
};