import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { wsSender } from "@/lib/ws/wsSender";
// UPDATE
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const body = await req.json();
  const { id } = await context.params; // ✅ WAJIB await

  const {
    name,
    interval,
    tags,
    devices,
    selectedTags = [],
    selectedDevices = [],
  } = body;

  // update logger
  await prisma.logger.update({
    where: { id },
    data: {
      name,
      interval,
      tags,
      devices,
    },
  });

  // clear old relations
  await prisma.loggerTagslist.deleteMany({
    where: { id_Logger: id },
  });

  await prisma.loggerDeviceslist.deleteMany({
    where: { id_Logger: id },
  });

  // insert new
  if (tags && selectedTags.length > 0) {
    await prisma.loggerTagslist.createMany({
      data: selectedTags.map((tid: string) => ({
        id_tags: tid,
        id_Logger: id,
      })),
    });
  }

  if (devices && selectedDevices.length > 0) {
    await prisma.loggerDeviceslist.createMany({
      data: selectedDevices.map((did: string) => ({
        id_Mtcp: did,
        id_Logger: id,
      })),
    });
  }
wsSender.reload("/LoggerSettings");
  return NextResponse.json({ success: true });
}

// DELETE
export async function DELETE(
  req: Request,
   context: { params: Promise<{ id: string }> }
) {
 const { id } = await context.params; // ✅ WAJIB await

  await prisma.logger.delete({
    where: { id },
  });
  wsSender.reload("/LoggerSettings");
  return NextResponse.json({ success: true });
}