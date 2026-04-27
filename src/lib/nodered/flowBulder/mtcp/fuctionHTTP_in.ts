export function createHTTPIn(
  idflow: string,
 
  
  listconnection : string[]
) {
  const create = {
            "id": "e5bad3ce89328f16",
            "type": "http in",
            "z": idflow,
            "name": 'HTTPIN',
            "url": "/mtcp",
            "method": "post",
            "upload": false,
            "skipBodyParsing": false,
            "swaggerDoc": "",
            "x": 110,
            "y": 160,
            "wires": [
                listconnection
            ]
        }

  return create
}