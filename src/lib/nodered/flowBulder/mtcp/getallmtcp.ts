import { prisma } from "@/lib/prisma";

export async function getAll() {

  const data = await prisma.mtcplist.findMany({
    include: {
      mtcpaddrs: {
        include: {
          tags: true
        }
      }
    }
  });
console.log(data)
  // ===============================
  // TYPE SAFE GROUPING
  // ===============================
  const grouped: Record<string, any> = data.reduce((acc, item) => {

    const key = `${item.ip}:${item.port}`;

    if (!acc[key]) {
      acc[key] = {
        ip: item.ip,
        port: item.port,
      
        data: []
      };
    }

acc[key].data.push(
  ...(item.mtcpaddrs ?? []).map((addr: any) => ({
    ...addr,
    unitId: item.unitId,
    timeout: item.timeout
  }))
);

    return acc;

  }, {} as Record<string, any>);

  // ===============================
  // FINAL RESULT
  // ===============================
  return {
    device: Object.values(grouped)
  };
}