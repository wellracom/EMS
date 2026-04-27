import { NodeRedFlow } from "../../type/nodeflow"
import { createPLCClient } from "./fuctionMTCPclient"
import { createSubflow } from "./fuctionSubflow"
import { createHTTPIn } from "./fuctionHTTP_in"

export function mtcpGenerateFlow(data: any) {
    const FlowId = process.env.NodeRed_MTCP_FLOW || "mtcp_flow"
    const subflowMtcpid = process.env.NodeRed_MTCP_SUBFLOW || "mtcp_subflow"

    const flow: NodeRedFlow = {
        id: FlowId,
        label: "MTCP Flow",
        disabled: false,
        info: "Auto generated MTCP flow",
        env: [],
        nodes: []
    }

    const devices = data?.device ?? []

    const httpConnections: string[] = []
    let position = 160

    for (const device of devices) {
        flow.nodes.push(
            createPLCClient(
                FlowId,
                device.ip,
                device.ip,
                device.ip,
                Number(device.port)
            )
        )
       const Data: any[] = []
        const tag = device?.data.map((item:any)=>{
            Data.push( {
        "deviceId": item?.mtcpId ?? '',
        "tagId": item?.id ?? '',
        "unitid": item?.unitId ?? "",
        "FC": item?.functioncode ?? "",
        "timeout": item?.timeout ?? "",
        "startaddres": item?.address ?? "",
        "typedata": item?.typedata ?? "",
        "scaling": {
            "offsite": Number(item?.tags[0]?.offset) ?? "?",
            "gain": Number(item?.tags[0]?.gain) ?? "?"
        },
        "alram": {
            "lowlow": Number(item?.tags[0]?.lowlow) ?? "?",
            "low": Number(item?.tags[0]?.low) ?? "?",
            "high": Number(item?.tags[0]?.high) ?? "?",
            "highhigh": Number(item?.tags[0]?.highhigh) ?? "?"
        }
    })
        })
        flow.nodes.push(
            createSubflow(
                FlowId,
                subflowMtcpid,
                `subflow${device.ip}`,
                device.ip,
                1000,
                `PLC${device.ip}`,
                JSON.stringify(Data),
                position
            )
        )

        httpConnections.push(`subflow${device.ip}`)
        position += 60
    }

    flow.nodes.push(createHTTPIn(FlowId, httpConnections))

    return flow
}