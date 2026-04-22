import { NextRequest, NextResponse } from "next/server";
import { wsSender } from "@/lib/ws/wsSender";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// GET: ambil semua user
export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return NextResponse.json(users);
}

// POST: create user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        username: body.username,
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: body.role || "USER",
      },
    });
   wsSender.reload('/accountsettings')
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}