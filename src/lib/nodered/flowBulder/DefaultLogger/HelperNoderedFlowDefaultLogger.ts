import { NodeRedEnv, NodeRedFlow, NodeRedNode } from '../../type/nodeflow'
import path from 'path'
import { readFile } from 'fs/promises'

type LoggerConfig = {
  interval?: number
}

// helper untuk env (biar tidak ulang-ulang)
const createEnv = (
  name: string,
  value: string | number,
  type: 'str' | 'num' = 'str'
): NodeRedEnv => ({
  name,
  value,
  type,
})

// helper untuk baca config
async function loadConfig(): Promise<LoggerConfig> {
  try {
    const filePath = path.join(process.cwd(), 'config', 'logger.json')
    const file = await readFile(filePath, 'utf-8')
    return JSON.parse(file)
  } catch {
    // fallback default
    return { interval: 5 }
  }
}

export async function generateLoggerDefault(): Promise<NodeRedFlow> {
  const FlowId = process.env.NodeRed_LoggerDefaullt_Flow || 'flow'
  const subflow = process.env.NodeRed_LoggerDefault_SUBFLOW || 'subflow'

  const config = await loadConfig()
  console.log(config)
  // env dari process.env
  const envList: NodeRedEnv[] = [
    createEnv('Org', process.env.INFLUX_ORG || 'INFLUX_ORG', 'str'),
    createEnv('Backet', process.env.INFLUX_BUCKET || 'INFLUX_BUCKET', 'str'),
    createEnv('Token', process.env.INFLUX_TOKEN || 'INFLUX_TOKEN', 'str'),
    createEnv('IP', process.env.INFLUX_IP || 'INFLUX IP', 'str'),
    createEnv('PORT', process.env.INFLUX_PORT || 'INFLUX_PORT', 'num'),
    createEnv('interval', config.interval ?? 5, 'num'),
  ]
  console.log(envList)
  const node: NodeRedNode = {
    id: 'defaultLoggerInterval',
    type: `subflow:${subflow}`,
    name: 'DefaultLogger',
    env: envList,
    x: 300,
    y: 60,
    wires: [],
    subflow: `${subflow}`,
  }

  const flow: NodeRedFlow = {
    id: FlowId,
    label: 'Logger DB Default',
    disabled: false,
    info: 'logger Default Save Interval',
    env: [],
    nodes: [node],
  }

  return flow
}
