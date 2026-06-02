import { NextRequest, NextResponse } from 'next/server'
import { wsSender } from '@/lib/ws/wsSender'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

// GET: ambil semua user
export async function GET() {
  const tags = await prisma.tag.findMany({
    select: {
      id: true,
      name: true,
      mtcpaddressId: true,
      mtcpaddress: {
        select: {
          mtcp: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  })

  return NextResponse.json(tags)
}
