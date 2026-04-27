import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const dashboards = await prisma.dashboard.findMany({
    include: { widgets: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(dashboards);
}

export async function POST(req: Request) {
  const body = await req.json();

  const newDashboard = await prisma.dashboard.create({
    data: {
      name: body.name || "New Page",
    },
  });

  return NextResponse.json({
    ...newDashboard,
    widgets: [],
  });
}