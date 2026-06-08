import { NextResponse, NextRequest } from 'next/server'
import { InfluxService } from '@/lib/influxdbQuery/service'
import zlib from 'zlib'

const influx = new InfluxService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const measurement = searchParams.get('measurement')
    if (!measurement) {
      return NextResponse.json(
        { success: false, message: 'measurement is required' },
        { status: 400 }
      )
    }

    const start = searchParams.get('start') ?? '-24h'
    const stop = searchParams.get('stop') ?? undefined
    const mode = searchParams.get('mode') ?? 'auto'

    /* ================= TAGS ================= */
    let tags: any = undefined
    const tagsRaw = searchParams.get('tags')

    if (tagsRaw) {
      try {
        tags = JSON.parse(tagsRaw)
      } catch {
        return NextResponse.json(
          { success: false, message: 'Invalid tags JSON' },
          { status: 400 }
        )
      }
    }

    /* ================= FIELDS ================= */
    const fieldsRaw = searchParams.get('fields')
    const fields = fieldsRaw
      ? fieldsRaw.split(',').map((f) => f.trim())
      : undefined

    /* ================= AGGREGATE ================= */
    const aggregateType = searchParams.get('aggregateType')
    const aggregateEvery = searchParams.get('aggregateEvery')

    const data = toSeries(
      await influx.query({
        measurement,
        range: {
          start,
          stop,
          mode: mode as any,
        },
        tags,
        fields,
        aggregate: aggregateType
          ? {
              type: aggregateType as any,
              every: aggregateEvery ?? '1m',
            }
          : undefined,
      })
    )

    const json = JSON.stringify({
      success: true,
      mode,
      measurement,
      data,
    })

    /* ================= GZIP LARGE RESPONSE ================= */
    if (json.length > 500 * 1024) {
      const compressed = zlib.gzipSync(json)

      return new NextResponse(compressed, {
        headers: {
          'Content-Encoding': 'gzip',
          'Content-Type': 'application/json',
        },
      })
    }

    return NextResponse.json({
      success: true,
      mode,
      measurement,
      data,
    })
  } catch (err: any) {
    console.error('INFLUX ERROR:', err)

    return NextResponse.json(
      {
        success: false,
        message: 'Influx query failed',
        error: err?.message,
      },
      { status: 500 }
    )
  }
}

type InfluxRow = {
  _time: string
  _value: number
  _field: string
  id: string
}

export function toSeries(data: InfluxRow[]) {
  const map = new Map()

  for (const row of data) {
    const key = `${row.id}_${row._field}`

    if (!map.has(key)) {
      map.set(key, {
        id: row.id,
        field: row._field,
        data: [],
      })
    }

    map.get(key).data.push([new Date(row._time).getTime(), row._value])
  }

  return Array.from(map.values())
}
