import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma"; // ✅ pakai singleton
import { wsSender } from "@/lib/ws/wsSender";

/* =========================
   GET (ALL / BY ID)
========================= */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    /* =========================
       GET BY ID
    ========================= */
    if (id) {
      const data = await prisma.mtcplist.findUnique({
        where: { id },
        include: {
          mtcpaddrs: {
            include: {
              tags: true, // 🔥 include tag
            },
          },
        },
      });

      if (!data) {
        return NextResponse.json(
          { message: "Data not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(data);
    }

    /* =========================
       GET ALL
    ========================= */
    const data = await prisma.mtcplist.findMany({
      include: {
        mtcpaddrs: {
          include: {
            tags: true, // 🔥 include tag
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET ERROR:", err);

    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

/* =========================
   CREATE
========================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    /* =========================
       VALIDATION
    ========================= */
    if (!body.name || !body.ip) {
      return NextResponse.json(
        { message: "Name dan IP wajib diisi" },
        { status: 400 }
      );
    }

    if (!body.port || !body.unitId) {
      return NextResponse.json(
        { message: "Port dan Unit ID wajib diisi" },
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
       CREATE
    ========================= */
    const data = await prisma.mtcplist.create({
      data: {
        name: body.name,
        ip: body.ip,
        port,
        unitId,
        timeout,
      },
    });

    /* =========================
       WS NOTIFY
    ========================= */
    wsSender.reload("/mtcpsettings");

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("POST ERROR:", err);

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
      { message: "Failed to create data" },
      { status: 500 }
    );
  }
}