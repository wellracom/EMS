import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

  let isValid = false;

  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  // ❌ belum login → paksa ke login
  if (!isValid && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // ✅ sudah login → jangan balik ke login page
  if (isValid && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api_local|favicon.ico).*)"],
};