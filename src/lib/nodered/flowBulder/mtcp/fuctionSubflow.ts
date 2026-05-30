export function createSubflow(
  idflow: string,
  idSubflow:string,
  id: string,
  name:string,
  intervalPool:number,
  idmtcp:string,
  data:string,
  Posisiton?: Number | 160
) {
  const create = {
            "id": id,
            "type": `subflow:${idSubflow}`,
            "z": idflow,
            "name": name,
            "env": [
                {
                    "name": "server",
                    "value": idmtcp,
                    "type": "conf-type",
                    "ui": {
                        "type": "conf-types"
                    }
                },
                {
                    "name": "interval",
                    "value": `${intervalPool}`,
                    "type": "num"
                },
                {
                    "name": "data",
                    "value": `${data}`,
                    "type": "json"
                }
            ],
            "x": 520,
            "y": Posisiton,
            "wires": [],
            "subflow": idSubflow
        }

  return create
}