import { generateLoggerDefault } from '../../flowBulder/DefaultLogger/HelperNoderedFlowDefaultLogger'
export async function FlowDefaultLoggerPush() {
  const FlowId = process.env.NodeRed_LoggerDefaullt_Flow || 'flow'
  const URL = process.env.NodeRed_URL || 'http://localhost'
  const port = process.env.NodeRed_PORT || '1880'
  const endpoint = `${URL}:${port}/flow/${FlowId}`
  console.log('endpoint', endpoint)
  const data = await generateLoggerDefault()
  const JsonGenerate = data
  console.log(JsonGenerate)
  const response = await fetch(`${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(JsonGenerate),
  })
  console.log('respon nodered', response, endpoint)
  const ResponesJson = await response.json()
  console.log('respon nodered', ResponesJson)
}
