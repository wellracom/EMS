import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth/auth";
import bcrypt from "bcrypt";

// UPDATE user
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ WAJIB await

    const body = await req.json();

    let data: any = {};

    if (body.username) data.username = body.username;
    if (body.name) data.name = body.name;
    if (body.email) data.email = body.email;
    if (body.role) data.role = body.role;

    if (body.password) {
      data.password = await bcrypt.hash(body.password, 10);
    }

    const user = await prisma.user.update({
      where: { id }, // ✅ sekarang aman
      data,
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
// DELETE user
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
      const { id } = await context.params; // ✅ WAJIB await
    await prisma.user.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}



export async function GET(
  req: NextRequest,
   context: { params: Promise<{ id: string }> }
) {
  try {
       const { id } = await context.params; // ✅ WAJIB await

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true, // ⚠️ hati-hati expose ini
        role: true,  // ⚠️ ini juga
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}