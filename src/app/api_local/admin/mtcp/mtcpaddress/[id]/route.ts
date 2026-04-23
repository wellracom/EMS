import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔹 UPDATE
export async function PUT(
  req: Request,
 context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
 const { id } = await context.params; // ✅ WAJIB await
    const data = await prisma.mtcpaddress.update({
      where: { id: id },
      data: {
        address: body.address,
        functioncode: body.functioncode,
        typedata: body.typedata,
        canread: body.canread,
        canwrite: body.canwrite,
        nickname: body.nickname,
      },
    });

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Failed to update" },
      { status: 500 }
    );
  }
}

// 🔹 DELETE
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
      const { id } = await context.params; // ✅ WAJIB await
    await prisma.mtcpaddress.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to delete" },
      { status: 500 }
    );
  }
}