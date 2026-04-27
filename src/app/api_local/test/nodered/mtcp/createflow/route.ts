import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma"; // ✅ pakai singleton
import { wsSender } from "@/lib/ws/wsSender";
import { getAll } from "@/lib/nodered/flowBulder/mtcp/getallmtcp";
import { mtcpGenerateFlow } from "@/lib/nodered/flowBulder/mtcp/helperNodereFlowMtcp";

/* =========================
   GET (ALL / BY ID)
========================= */
export async function GET(req: NextRequest) {
  try {
    const data= await getAll()
    const flowData =await mtcpGenerateFlow(data)
    if (!flowData) {
        return NextResponse.json(
          { message: "Data not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({flowData,data}
      );
    

  } catch (err) {
    console.error("GET ERROR:", err);

    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
