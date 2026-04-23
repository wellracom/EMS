import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { wsSender } from "@/lib/ws/wsSender";
const prisma = new PrismaClient();

// 🔹 UPDATE
export async function PUT(
  req: Request,
 context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
 const { id } = await context.params; // ✅ WAJIB await
    const data = await prisma.mtcplist.update({
      where: { id: id },
      data: {
        name: body.name,
        ip: body.ip,
        port: body.port,
        unitId: body.unitId,
        timeout: body.timeout,
      },
    });
  wsSender.reload('/mtcpsettings')
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { message: "Failed to update data" },
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
    await prisma.mtcplist.delete({
      where: { id: id },
    });
  wsSender.reload('/mtcpsettings')
    return NextResponse.json({ message: "Deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Failed to delete data" },
      { status: 500 }
    );
  }
}