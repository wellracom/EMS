export type SetValueResponse<T = any> = {
  success: boolean
  message: string
  data?: T
}

export async function SetValueMTCP(
  id: string,
  value: string | boolean
): Promise<SetValueResponse> {
  if (!id?.trim()) {
    return {
      success: false,
      message: 'Tag ID is required',
    }
  }

  const url = process.env.NodeRed_URL || 'http://localhost'
  const port = process.env.NodeRed_PORT || '1880'
  const endpoint = `${url}:${port}/mtcp`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tagId: id,
        value,
      }),
      signal: controller.signal,
    })

    const text = await response.text()

    let data: any = null

    try {
      data = text ? JSON.parse(text) : null
    } catch {
      data = text
    }

    // console.log('MTCP Response:', {
    //   status: response.status,
    //   ok: response.ok,
    //   body: data,
    // })

    if (!response.ok) {
      return {
        success: false,
        message:
          data?.message ||
          data ||
          `Request failed with status ${response.status}`,
        data,
      }
    }

    return {
      success: true,
      message: data?.message || 'Value written successfully',
      data,
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'Request timeout. Node-RED did not respond.',
        }
      }

      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: false,
      message: 'Unknown error occurred',
    }
  } finally {
    clearTimeout(timeout)
  }
}
