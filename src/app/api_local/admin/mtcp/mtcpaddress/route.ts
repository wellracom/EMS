import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { wsSender } from "@/lib/ws/wsSender";
/* =========================
   GET ALL / FILTER
========================= */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mtcpId = searchParams.get("mtcpId");

    const data = await prisma.mtcpaddress.findMany({
      where: mtcpId ? { mtcpId } : {},
      include: {
        tags: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to fetch" },
      { status: 500 }
    );
  }
}

/* =========================
   CREATE (ADDRESS + TAG)
========================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body)

    const result = await prisma.$transaction(async (tx) => {
      // 🔹 create address
      const address = await tx.mtcpaddress.create({
        data: {
          mtcpId: body.mtcpId,
          address: body.address,
          functioncode: body.functioncode,
          typedata: body.typedata,
          canread: body.canread,
          canwrite: body.canwrite,
        },
      });

      // 🔹 create tag (default 1)
      if (body.tag) {
        await tx.tag.create({
          data: {
            mtcpaddressId: address.id,
            name: body.tag.name,

            offset: body.tag.offset ?? null,
            gain: body.tag.gain ?? null,
            unit: body.tag.unit ?? null,

            lowlow: body.tag.lowlow ?? null,
            low: body.tag.low ?? null,
            high: body.tag.high ?? null,
            highhigh: body.tag.highhigh ?? null,
          },
        });
      }

      return address;
    });
     wsSender.reload(`/mtcpaddresssettings-${body.mtcpId}`);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to create" },
      { status: 500 }
    );
  }
}