export function createPLCClient(
  idflow: string,
  id: string,
  PLC_Name: string,
  IP: string,
  port:number
) {
  const create = {
    id: `PLC${id}`,
    type: 'modbus-client',
    z: `${idflow}`,
    name: PLC_Name,
    clienttype: 'tcp',
    bufferCommands: true,
    stateLogEnabled: false,
    queueLogEnabled: false,
    failureLogEnabled: true,
    tcpHost: IP,
    tcpPort: port,
    tcpType: 'DEFAULT',
    serialPort: '/dev/ttyUSB',
    serialType: 'RTU-BUFFERD',
    serialBaudrate: 9600,
    serialDatabits: 8,
    serialStopbits: 1,
    serialParity: 'none',
    serialConnectionDelay: 100,
    serialAsciiResponseStartDelimiter: '0x3A',
    unit_id: 1,
    commandDelay: 1,
    clientTimeout: 1000,
    reconnectOnTimeout: true,
    reconnectTimeout: 2000,
    parallelUnitIdsAllowed: true,
    showErrors: false,
    showWarnings: true,
    showLogs: true,
  }

  return create
}