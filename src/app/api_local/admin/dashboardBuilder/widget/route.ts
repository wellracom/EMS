import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const widget = await prisma.widget.create({
    data: body,
  });

  return Response.json(widget);
}