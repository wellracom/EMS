import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
   const { id } = await context.params; // ✅ WAJIB await
    const body = await req.json();

  const widget = await prisma.widget.update({
    where: { id: id },
    data: body,
  });

  return Response.json(widget);
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
   const { id } = await context.params; // ✅ WAJIB await
    await prisma.widget.delete({
    where: { id: id },
  });

  return Response.json({ success: true });
}