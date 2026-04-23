import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔹 GET (filter by mtcpId)
export async function GET(req: Request,
     context: { params: Promise<{ id: string }> }
) {
  try {
    
    const { searchParams } = new URL(req.url);
    const mtcpId = searchParams.get("mtcpId");

    const data = await prisma.mtcpaddress.findMany({
      where: {
        mtcpId: mtcpId || undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch address" },
      { status: 500 }
    );
  }
}

// 🔹 CREATE
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data = await prisma.mtcpaddress.create({
      data: {
        mtcpId: body.mtcpId, // 🔥 wajib dari frontend
        address: body.address,
        functioncode: body.functioncode,
        typedata: body.typedata,
        canread: body.canread ?? true,
        canwrite: body.canwrite ?? false,
        nickname: body.nickname,
      },
    });

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Failed to create" },
      { status: 500 }
    );
  }
}