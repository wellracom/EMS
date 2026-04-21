import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

type JwtPayload = {
  id: string;
  username: string;
  role: string;
};

export function getUserFromToken(req: NextRequest): JwtPayload | null {
  try {
    // ambil dari cookie atau header
    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    return decoded;
  } catch (err) {
    return null;
  }
}