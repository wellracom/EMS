import { InfluxDB } from '@influxdata/influxdb-client'
import { BucketsAPI, TasksAPI } from '@influxdata/influxdb-client-apis'

/* ================= CONFIG ================= */

const url = `http://${process.env.INFLUX_IP}:${process.env.INFLUX_PORT}`
const token = process.env.INFLUX_TOKEN!

const BUCKET = process.env.INFLUX_BUCKET!
const ORG_NAME = process.env.INFLUX_ORG!

const influx = new InfluxDB({ url, token })

const bucketsAPI = new BucketsAPI(influx)
const tasksAPI = new TasksAPI(influx)

/* ================= GET ORG ID ================= */

async function getOrgID(): Promise<string> {
  const res = await fetch(`${url}/api/v2/orgs`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  const data = await res.json()

  const org = data.orgs?.find((o: any) => o.name === ORG_NAME)

  if (!org) {
    throw new Error(`ORG not found: ${ORG_NAME}`)
  }

  return org.id
}

/* ================= BUCKET ================= */

async function ensureBucket(name: string, orgID: string) {
  const res = await bucketsAPI.getBuckets({ name })

  const exists = res.buckets?.find((b) => b.name === name)

  if (exists) {
    console.log(`✓ bucket exists: ${name}`)
    return exists
  }

  console.log(`➕ creating bucket: ${name}`)

  try {
    return await bucketsAPI.postBuckets({
      body: {
        name,
        orgID,
      },
    })
  } catch (err: any) {
    console.log(`⚠ bucket create error ignored: ${name}`)
    return
  }
}

/* ================= TASK ================= */

function extractTaskName(flux: string): string {
  const match = flux.match(/name:\s*"([^"]+)"/)
  if (!match?.[1]) {
    throw new Error('Task name not found in flux')
  }
  return match[1]
}

async function ensureTask(orgID: string, flux: string) {
  const taskName = extractTaskName(flux)

  const res = await tasksAPI.getTasks({ orgID })

  const exists = res.tasks?.find((t) => t.name === taskName)

  if (exists) {
    console.log(`✓ task exists: ${taskName}`)
    return exists
  }

  console.log(`➕ creating task: ${taskName}`)

  try {
    return await tasksAPI.postTasks({
      body: {
        orgID,
        flux,
      },
    })
  } catch (err: any) {
    console.log(`⚠ task create ignored (maybe exists): ${taskName}`)
    return
  }
}

/* ================= FLUX TASKS ================= */

const TASK_RAW_TO_1H = (b: string) => `
option task = {name: "${b}_raw_to_1h", every: 1m}

from(bucket: "${b}")
  |> range(start: -task.every)
  |> filter(fn: (r) => r._measurement == "${b}_raw")
  |> aggregateWindow(every: 1m, fn: mean)
  |> set(key: "_measurement", value: "${b}_1h")
  |> to(bucket: "${b}")
`

const TASK_1H_TO_3H = (b: string) => `
option task = {name: "${b}_1h_to_3h", every: 1h}

from(bucket: "${b}")
  |> range(start: -task.every)
  |> filter(fn: (r) => r._measurement == "${b}_1h")
  |> aggregateWindow(every: 3h, fn: mean)
  |> set(key: "_measurement", value: "${b}_3h")
  |> to(bucket: "${b}")
`

const TASK_3H_TO_1D = (b: string) => `
option task = {name: "${b}_3h_to_1d", every: 3h}

from(bucket: "${b}")
  |> range(start: -task.every)
  |> filter(fn: (r) => r._measurement == "${b}_3h")
  |> aggregateWindow(every: 1d, fn: mean)
  |> set(key: "_measurement", value: "${b}_1d")
  |> to(bucket: "${b}")
`

const TASK_1D_TO_7D = (b: string) => `
option task = {name: "${b}_1d_to_7d", every: 1d}

from(bucket: "${b}")
  |> range(start: -task.every)
  |> filter(fn: (r) => r._measurement == "${b}_1d")
  |> aggregateWindow(every: 7d, fn: mean)
  |> set(key: "_measurement", value: "${b}_7d")
  |> to(bucket: "${b}")
`

/* ================= MAIN INIT ================= */

export async function InfluxInit() {
  console.log('🚀 INFLUX INIT START')

  const orgID = await getOrgID()

  /* ========== BUCKET ========== */
  await ensureBucket(BUCKET, orgID)

  /* ========== TASKS ========== */
  await Promise.all([
    ensureTask(orgID, TASK_RAW_TO_1H(BUCKET)),
    ensureTask(orgID, TASK_1H_TO_3H(BUCKET)),
    ensureTask(orgID, TASK_3H_TO_1D(BUCKET)),
    ensureTask(orgID, TASK_1D_TO_7D(BUCKET)),
  ])

  console.log('✅ INFLUX INIT DONE')
}
