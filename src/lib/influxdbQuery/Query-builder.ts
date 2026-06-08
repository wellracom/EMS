/* ================= TYPES ================= */

type RangeInput = {
  start?: string
  stop?: string
  mode?: 'auto' | 'raw'
}

type TagInput = Record<string, string | number | (string | number)[]>

type FieldInput = string | string[]

type AggregateType = 'mean' | 'sum' | 'min' | 'max' | 'count' | 'last'

type BuildParams = {
  bucket?: string
  measurement: string
  range: RangeInput
  tags?: TagInput
  fields?: FieldInput
  aggregate?: {
    type: AggregateType
    every?: string
  }
}

/* ================= CLEAN ================= */

function cleanMeasurement(m: string): string {
  return m.replace(/_(raw|1h|3h|1d|7d)$/, '')
}

/* ================= ESCAPE ================= */

function escapeFluxString(val: string) {
  return val.replace(/"/g, '\\"')
}

/* ================= RANGE PARSER ================= */

function parseHours(start?: string): number {
  if (!start) return 0

  const match = start.match(/-(\d+)([smhd])/)
  if (!match) return 0

  const value = Number(match[1])
  const unit = match[2]

  switch (unit) {
    case 's':
      return value / 3600
    case 'm':
      return value / 60
    case 'h':
      return value
    case 'd':
      return value * 24
  }

  return 0
}

/* ================= RESOLUTION ================= */

function resolveMeasurement(base: string, start?: string, mode?: string) {
  const clean = cleanMeasurement(base)

  if (mode === 'raw') return `${clean}`
  if (base.endsWith('_raw')) return base

  const h = parseHours(start)

  if (h <= 2) return `${clean}`
  if (h <= 48) return `${clean}_1h`
  if (h <= 240) return `${clean}_3h`
  if (h <= 1440) return `${clean}_1d`
  return `${clean}_7d`
}

/* ================= BUILDER ================= */

export class InfluxQueryBuilder {
  static build(params: BuildParams) {
    const { bucket, measurement, range, tags, fields, aggregate } = params

    const finalBucket = bucket ?? process.env.INFLUX_BUCKET
    if (!finalBucket) throw new Error('INFLUX_BUCKET is not defined')

    const baseMeasurement = cleanMeasurement(measurement)

    const resolvedMeasurement = resolveMeasurement(
      baseMeasurement,
      range.start,
      range.mode ?? 'auto'
    )

    let flux = `from(bucket: "${finalBucket}")\n`

    /* ================= RANGE ================= */
    const start = range.start ?? '-24h'
    const stop = range.stop

    flux += `  |> range(start: ${start}`
    if (stop) flux += `, stop: ${stop}`
    flux += `)\n`

    /* ================= MEASUREMENT ================= */
    flux += `  |> filter(fn: (r) => r._measurement == "${escapeFluxString(resolvedMeasurement)}")\n`

    /* ================= TAGS ================= */
    if (tags) {
      Object.entries(tags).forEach(([key, value]) => {
        const k = escapeFluxString(key)

        if (Array.isArray(value)) {
          flux += `  |> filter(fn: (r) => contains(value: r["${k}"], set: ${JSON.stringify(value.map(String))}))\n`
        } else {
          flux += `  |> filter(fn: (r) => r["${k}"] == "${escapeFluxString(String(value))}")\n`
        }
      })
    }

    /* ================= FIELDS ================= */
    if (fields) {
      flux += `  |> filter(fn: (r) => contains(value: r._field, set: ${JSON.stringify(Array.isArray(fields) ? fields : [fields])}))\n`
    }

    /* ================= FIX TYPE COLLISION (IMPORTANT) ================= */
    flux += `
 |> map(fn: (r) => ({
  r with
  _value: if r._field == "value" then float(v: r._value) else 0.0
}))
`

    /* ================= AGGREGATE ================= */
    if (aggregate) {
      flux += `
  |> aggregateWindow(
    every: ${aggregate.every ?? '1m'},
    fn: ${aggregate.type},
    createEmpty: false
  )
`
    }

    console.log('🚀 FINAL FLUX:\n', flux)
    console.log(flux)
    return flux
  }
}
