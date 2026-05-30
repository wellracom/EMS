export function createHTTPIn(
  idflow: string,
 
  
  listconnection : string[]
) {
  const create = [ {
            "id": "44afe06a27d93935",
            "type": "http in",
            "z": idflow,
            "name": "",
            "url": "/mtcp",
            "method": "post",
            "upload": false,
            "swaggerDoc": "",
            "x": 110,
            "y": 160,
            "wires": [
                [
                    "6f24b93778ad4c6c"
                ]
            ]
        },   {
            "id": "6f24b93778ad4c6c",
            "type": "function",
            "z": idflow,
            "name": "function 4",
            "func": "let tagId = String(msg.payload.tagId);\n\nlet tags = global.get(\"tag\") || [];\n\n// cek ada ga\nlet exists = tags.some(\n    x => String(x.id) === tagId\n);\n\nif (!exists) {\n\n    msg.statusCode = 404;\n\n    msg.payload = {\n        success: false,\n        message: `Tag ${tagId} not found`\n    };\n\n    return [msg, null];\n}\n\n// lanjut ke subflow\n\nreturn [null, msg];",
            "outputs": 2,
            "timeout": 0,
            "noerr": 0,
            "initialize": "",
            "finalize": "",
            "libs": [],
            "x": 260,
            "y": 160,
            "wires": [
                [
                    "48044be809e481b2"
                ],
                
                    listconnection
               
            ]
        },
        {
            "id": "48044be809e481b2",
            "type": "http response",
            "z": idflow,
            "name": "",
            "statusCode": "",
            "headers": {},
            "x": 530,
            "y": 120,
            "wires": []
        }
      ]
  return create
}