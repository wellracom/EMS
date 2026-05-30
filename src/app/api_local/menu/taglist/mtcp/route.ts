import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma' // ✅ pakai singleton

export async function GET(req: NextRequest) {
  try {
    const data = await prisma.mtcplist.findMany({
      include: {
        mtcpaddrs: {
          include: { tags: true },
        },
      },
    })

    return NextResponse.json({ data })
  } catch (err) {
    console.error('GET ERROR:', err)

    return NextResponse.json(
      { message: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}
