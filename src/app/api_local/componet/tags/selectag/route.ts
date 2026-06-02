import { NextRequest, NextResponse } from 'next/server'
import { wsSender } from '@/lib/ws/wsSender'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
type TreeNode = {
  id: string
  label: string
  checked?: boolean
  children?: TreeNode[]
}
// GET: ambil semua user
export async function GET() {
  const result = await prisma.$transaction(async (tx) => {
    const mtcp_row = await tx.mtcplist.findMany({
      select: {
        id: true,
        name: true,
        mtcpaddrs: {
          select: {
            id: true,
            tags: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    const MTCP: TreeNode[] = mtcp_row.map((mtcp) => ({
      id: mtcp.id,
      key: mtcp.id,
      label: mtcp.name,
      checked: false,
      children: mtcp.mtcpaddrs.flatMap((addr) =>
        addr.tags.map((tag) => ({
          id: tag.id,
          key: tag.id,
          label: tag.name,
          checked: false,
        }))
      ),
    }))

    const hasil: TreeNode[] = [
      { id: 'MTCP', label: 'MTCP', checked: false, children: MTCP },
    ]

    return hasil
  })

  return NextResponse.json(result)
}
