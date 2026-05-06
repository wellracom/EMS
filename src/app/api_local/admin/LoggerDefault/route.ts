import { readFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { FlowDefaultLoggerPush } from '@/lib/nodered/FlowPusher/DefaultLogger/flowPusherLoggerDefault'

// Optional: type untuk config kamu
type loggerConfig = {
  interval?: Number

}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'config', 'logger.json')

    const file = await readFile(filePath, 'utf-8')
    const data: loggerConfig = JSON.parse(file)

    return NextResponse.json(data)
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Unknown error'

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}


export async function POST(req: Request) {
  try {
    const body: loggerConfig = await req.json()

    const filePath = path.join(process.cwd(), 'config', 'logger.json')

    await writeFile(filePath, JSON.stringify(body, null, 2))
    await FlowDefaultLoggerPush()
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Unknown error'

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}