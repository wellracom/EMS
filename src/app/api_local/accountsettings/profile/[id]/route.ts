import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, email, oldPassword, newPassword } = body;

    // ================= GET USER =================
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // ================= PASSWORD CHECK =================
    if (newPassword) {
      if (!oldPassword) {
        return NextResponse.json(
          { message: "Old password is required" },
          { status: 400 }
        );
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return NextResponse.json(
          { message: "Old password is incorrect" },
          { status: 400 }
        );
      }
    }

    // ================= UPDATE =================
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        ...(newPassword && {
          password: await bcrypt.hash(newPassword, 10),
        }),
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated",
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}