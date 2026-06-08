import { queryApi } from '@/lib/influx'
import { InfluxQueryBuilder } from './Query-builder'

type BuildParams = Parameters<typeof InfluxQueryBuilder.build>[0]

export class InfluxService {
  async query(params: BuildParams): Promise<any[]> {
    const flux = InfluxQueryBuilder.build(params)

    return new Promise((resolve, reject) => {
      const result: any[] = []

      queryApi.queryRows(flux, {
        next(row, meta) {
          result.push(meta.toObject(row))
        },
        error(err) {
          reject(err)
        },
        complete() {
          resolve(result)
        },
      })
    })
  }
}
