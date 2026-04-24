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
      /* =========================
       VALIDATION
    ========================= */
    if (!body.name || !body.ip) {
      return NextResponse.json(
        { message: "Name dan IP wajib diisi" },
        { status: 400 }
      );
    }

    const port = Number(body.port);
    const unitId = Number(body.unitId);
    const timeout = body.timeout ? Number(body.timeout) : 1000;

    if (isNaN(port) || isNaN(unitId)) {
      return NextResponse.json(
        { message: "Port dan Unit ID harus number" },
        { status: 400 }
      );
    }

    /* =========================
       UPDATE
    ========================= */
    const data = await prisma.mtcplist.update({
      where: { id },
      data: {
        name: body.name,
        ip: body.ip,
        port,
        unitId,
        timeout,
      },
    });

    wsSender.reload("/mtcpsettings");

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("PUT ERROR:", err);

    /* =========================
       DUPLICATE HANDLER
    ========================= */
    if (err.code === "P2002") {
      return NextResponse.json(
        {
          message:
            "Kombinasi IP, Port, dan Unit ID sudah digunakan",
        },
        { status: 400 }
      );
    }

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