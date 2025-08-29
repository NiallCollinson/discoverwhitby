import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const hostPaths = [/^\/host(\/|$)/];
const adminPaths = [/^\/admin(\/|$)/];

export async function middleware(req: any) {
  const url = new URL(req.url);
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = url.pathname;

  const needsAuth = hostPaths.some((r) => r.test(path)) || adminPaths.some((r) => r.test(path)) || path.startsWith("/account");
  if (!token && needsAuth) return NextResponse.redirect(new URL("/auth/sign-in", url));

  if (hostPaths.some((r) => r.test(path)) && !["host_owner", "host_member", "admin"].includes((token as any)?.role))
    return NextResponse.redirect(new URL("/auth/sign-in?e=forbidden", url));

  if (adminPaths.some((r) => r.test(path)) && (token as any)?.role !== "admin")
    return NextResponse.redirect(new URL("/auth/sign-in?e=forbidden", url));

  return NextResponse.next();
}

export const config = { matcher: ["/account/:path*", "/host/:path*", "/admin/:path*"] };


