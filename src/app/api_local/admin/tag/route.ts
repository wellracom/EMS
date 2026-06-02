import { NextRequest, NextResponse } from 'next/server'
import { wsSender } from '@/lib/ws/wsSender'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

// GET: ambil semua user
export async function GET() {
  const tag = await prisma.tag.findMany({})

  return NextResponse.json(tag)
}
