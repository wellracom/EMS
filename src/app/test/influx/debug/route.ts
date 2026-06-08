import { NextResponse } from 'next/server'
import { queryApi } from '@/lib/influx'

export async function GET() {
  const flux = `
from(bucket: "logger")
  |> range(start: -1h)
  |> limit(n: 20)
`

  return new Promise((resolve, reject) => {
    const result: any[] = []

    queryApi.queryRows(flux, {
      next(row, tableMeta) {
        result.push(tableMeta.toObject(row))
      },
      error(err) {
        resolve(
          NextResponse.json({
            success: false,
            error: err.message,
          })
        )
      },
      complete() {
        resolve(
          NextResponse.json({
            success: true,
            count: result.length,
            data: result,
          })
        )
      },
    })
  })
}
