import { NextResponse ,NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
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