import { NextResponse } from 'next/server'
import {
  readLoggerConfig,
  writeLoggerConfig,
  LoggerConfig,
} from '@/lib/helperfile/configdb'

import { FlowDefaultLoggerPush } from '@/lib/nodered/FlowPusher/DefaultLogger/flowPusherLoggerDefault'

export async function GET() {
  try {
    const config = await readLoggerConfig()
    console.log('config', config)
    return NextResponse.json(config)
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body: LoggerConfig = await req.json()

    if (!body.logger || typeof body.logger.interval !== 'number') {
      return NextResponse.json(
        {
          error: 'Invalid logger configuration',
        },
        { status: 400 }
      )
    }

    await writeLoggerConfig(body)

    await FlowDefaultLoggerPush()

    return NextResponse.json({
      success: true,
      data: body,
    })
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
