import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { wsSender } from "@/lib/ws/wsSender";
// GET ALL
export async function GET() {
  const data = await prisma.logger.findMany({
    include: {
      LoggerTagslist: true,
      LoggerDevices: true,
    },
  });

  // format ke frontend
  const result = data.map((l) => ({
    id: l.id,
    name: l.name,
    interval: l.interval,
    tags: l.tags,
    devices: l.devices,
    selectedTags: l.LoggerTagslist.map(t => t.id_tags),
    selectedDevices: l.LoggerDevices.map(d => d.id_Mtcp),
  }));

  return NextResponse.json(result);
}

// CREATE
export async function POST(req: Request) {
  const body = await req.json();

  const {
    name,
    interval,
    tags,
    devices,
    selectedTags = [],
    selectedDevices = [],
  } = body;

  const logger = await prisma.logger.create({
    data: {
      name,
      interval,
      tags,
      devices,
    },
  });

  // insert relasi
  if (tags && selectedTags.length > 0) {
    await prisma.loggerTagslist.createMany({
      data: selectedTags.map((id: string) => ({
        id_tags: id,
        id_Logger: logger.id,
      })),
    });
  }

  if (devices && selectedDevices.length > 0) {
    await prisma.loggerDeviceslist.createMany({
      data: selectedDevices.map((id: string) => ({
        id_Mtcp: id,
        id_Logger: logger.id,
      })),
    });
  }
  wsSender.reload("/LoggerSettings");
  return NextResponse.json({ success: true });
}