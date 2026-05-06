import { FlowDefaultLoggerPush } from "./nodered/FlowPusher/DefaultLogger/flowPusherLoggerDefault"

let initialized = false

export async function initApp() {
  if (initialized) return
  initialized = true

  console.log("🚀 INIT RUNNING...")
  console.log('🚀 INIT Logger Default...')
  await FlowDefaultLoggerPush()
  // contoh:
  // - generate Node-RED flow
  // - load config
  // - warm cache
}