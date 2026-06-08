import { InfluxDB } from '@influxdata/influxdb-client'

const token = process.env.INFLUX_TOKEN!
const org = process.env.INFLUX_ORG!
const IP = process.env.INFLUX_IP!
const PORT = process.env.INFLUX_PORT!
const url = `http://${IP}:${PORT}`

const influxDB = new InfluxDB({
  url,
  token,
})

export const queryApi = influxDB.getQueryApi(org)
