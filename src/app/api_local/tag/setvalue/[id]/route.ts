import { NextResponse } from 'next/server'
import { SetValueTag } from '@/lib/tag/setValue/SetValueTag'

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const body = await request.json()

    const result = await SetValueTag(id, body?.value)

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    })
  } catch (error) {
    console.error('PUT ERROR:', error)

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update',
      },
      {
        status: 500,
      }
    )
  }
}
