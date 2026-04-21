import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, signAccessToken } from "@/lib/JWT/jwt";
import crypto from "crypto";

export async function GET() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  // ✅ 1. cek access token
  if (accessToken) {
    const decoded: any = verifyAccessToken(accessToken);

    if (decoded) {
      return NextResponse.json({
        user: {
          id: decoded.id,
          username: decoded.username,
          role: decoded.role,
          email:decoded.email
        },
      });
    }
  }

  // 🔥 2. fallback refresh token + ROTATION
  if (refreshToken) {
    const token = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (token && token.expiresAt > new Date()) {
      const newAccessToken = signAccessToken({
        id: token.user.id,
        username: token.user.username,
        role: token.user.role,
        email:token.user.email
      });

      const newRefreshToken = crypto.randomUUID();

      // 🔥 delete old refresh token
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });

      // 🔥 create new refresh token
      await prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: token.user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      const res = NextResponse.json({
        user: {
          id: token.user.id,
          username: token.user.username,
          role: token.user.role,
        },
      });

      res.cookies.set("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15,
      });

      res.cookies.set("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return res;
    }
  }

  return NextResponse.json({ user: null });
}