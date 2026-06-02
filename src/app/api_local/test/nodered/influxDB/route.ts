import { NextResponse, NextRequest } from 'next/server'
import { generateLoggerDefault } from '@/lib/nodered/flowBulder/DefaultLogger/HelperNoderedFlowDefaultLogger'
import { FlowDefaultLoggerPush } from '@/lib/nodered/FlowPusher/DefaultLogger/flowPusherLoggerDefault'
import { Database } from 'lucide-react'

/* =========================
   GET (ALL / BY ID)
========================= */
export async function GET(req: NextRequest) {
  try {
    const data = await generateLoggerDefault()
    const data1 = await FlowDefaultLoggerPush()
    if (!data) {
      return NextResponse.json({ message: 'Data not found' }, { status: 404 })
    }

    return NextResponse.json({ data1 })
  } catch (err) {
    console.error('GET ERROR:', err)

    return NextResponse.json(
      { message: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}
