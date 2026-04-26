import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* =========================
   GET BY ID
========================= */
export async function GET(
  req: Request,
   context: { params: Promise<{ id: string }> }
) {
  try {
      const { id } = await context.params; // ✅ WAJIB await
    const data = await prisma.mtcpaddress.findUnique({
      where: { id: id },
      include: {
        tags: true,
      },
    });

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch" },
      { status: 500 }
    );
  }
}

/* =========================
   UPDATE (ADDRESS + TAG)
========================= */
export async function PUT(
  req: Request,
 context: { params: Promise<{ id: string }> }
) {
  try {
     const { id } = await context.params; // ✅ WAJIB await
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "ID is required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      /* =========================
         UPDATE ADDRESS
      ========================= */
      const address = await tx.mtcpaddress.update({
        where: { id },
        data: {
          address: Number(body.address),
          functioncode: body.functioncode,
          typedata: body.typedata,
          canread: Boolean(body.canread),
          canwrite: Boolean(body.canwrite),
        },
      });

      /* =========================
         HANDLE TAG
      ========================= */
      if (body.tag) {
        const existingTag = await tx.tag.findFirst({
          where: { mtcpaddressId: id },
          orderBy: { createdAt: "asc" }, // 🔥 biar konsisten
        });

        if (existingTag) {
          await tx.tag.update({
            where: { id: existingTag.id },
            data: {
              name: body.tag.name,

              offset: body.tag.offset
                ? Number(body.tag.offset)
                : null,
              gain: body.tag.gain
                ? Number(body.tag.gain)
                : null,
              unit: body.tag.unit ?? null,

              lowlow: body.tag.lowlow
                ? Number(body.tag.lowlow)
                : null,
              low: body.tag.low
                ? Number(body.tag.low)
                : null,
              high: body.tag.high
                ? Number(body.tag.high)
                : null,
              highhigh: body.tag.highhigh
                ? Number(body.tag.highhigh)
                : null,
            },
          });
        } else {
          await tx.tag.create({
            data: {
              mtcpaddressId: id,
              name: body.tag.name,

              offset: body.tag.offset
                ? Number(body.tag.offset)
                : null,
              gain: body.tag.gain
                ? Number(body.tag.gain)
                : null,
              unit: body.tag.unit ?? null,

              lowlow: body.tag.lowlow
                ? Number(body.tag.lowlow)
                : null,
              low: body.tag.low
                ? Number(body.tag.low)
                : null,
              high: body.tag.high
                ? Number(body.tag.high)
                : null,
              highhigh: body.tag.highhigh
                ? Number(body.tag.highhigh)
                : null,
            },
          });
        }
      }

      return address;
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("PUT ERROR:", err);

    return NextResponse.json(
      {
        message: err.message || "Failed to update",
      },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE
========================= */
export async function DELETE(
  req: Request,
 context: { params: Promise<{ id: string }> }
) {
      const { id } = await context.params; // ✅ WAJIB await
  try {
    await prisma.mtcpaddress.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to delete" },
      { status: 500 }
    );
  }
}