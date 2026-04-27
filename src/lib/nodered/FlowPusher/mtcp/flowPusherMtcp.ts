import { getAll } from "../../flowBulder/mtcp/getallmtcp"

import { mtcpGenerateFlow } from "../../flowBulder/mtcp/helperNodereFlowMtcp"

export async function FlowMtcpPush() {
     const FlowId = process.env.NodeRed_MTCP_FLOW || "mtcp_flow"
     const URL= process.env.NodeRed_URL || 'http://localhost'
     const port =process.env.NodeRed_PORT || '1880'
     const endpoint =`${URL}:${port}/flow/${FlowId}`
     const data =await getAll()
     const JsonGenerate = await mtcpGenerateFlow(data)
     console.log(JsonGenerate)
     const response = await fetch(`${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(JsonGenerate),
  })
console.log('respon nodered', response ,endpoint)
  const ResponesJson = await response.json()
  console.log('respon nodered', ResponesJson)


    
}