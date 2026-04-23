import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { wsSender } from "@/lib/ws/wsSender";
const prisma = new PrismaClient();

// 🔹 GET ALL
export async function GET() {
  try {
    const data = await prisma.mtcplist.findMany({
      include: {
        mtcpaddrs: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// 🔹 CREATE
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data = await prisma.mtcplist.create({
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
      { message: "Failed to create data" },
      { status: 500 }
    );
  }
}