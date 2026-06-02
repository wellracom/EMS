import { prisma } from '@/lib/prisma'
import { SetValueMTCP } from './mtcp/setValueTagMTCP'

export async function SetValueTag(id: string, value: string | boolean) {
  try {
    const tag = await prisma.tag.findFirst({
      where: {
        id,
      },
    })

    if (!tag) {
      return {
        success: false,
        message: 'Tag not found',
      }
    }

    if (!tag.mtcpaddressId) {
      return {
        success: false,
        message: 'Tag is not configured for MTCP',
      }
    }

    const result = await SetValueMTCP(id, value)

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        data: result.data,
      }
    }

    return {
      success: true,
      message: result.message,
      data: result.data,
    }
  } catch (error) {
    console.error('SetValueTag Error:', error)

    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
