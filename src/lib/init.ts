import { FlowDefaultLoggerPush } from './nodered/FlowPusher/DefaultLogger/flowPusherLoggerDefault'
import { FlowMtcpPush } from './nodered/FlowPusher/mtcp/flowPusherMtcp'
import { InfluxInit } from './influxdbQuery/init'
let initialized = false

export async function initApp() {
  if (initialized) return
  initialized = true

  console.log('🚀 INIT RUNNING...')

  console.log('🚀 INIT Influx DB Backet')
  await InfluxInit()

  console.log('🚀 INIT Logger Default...')

  await FlowDefaultLoggerPush()
  console.log('🚀 INIT Push Modbus TCP LOW...')
  await FlowMtcpPush()
  // contoh:
  // - generate Node-RED flow
  // - load config
  // - warm cache
}
