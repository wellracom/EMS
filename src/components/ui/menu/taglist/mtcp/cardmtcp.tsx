'use client'

import StatusMTCP from '@/components/ui/controller/mtcp/statusconnection'
import { FaNetworkWired, FaPlug, FaServer } from 'react-icons/fa'
import CardTagMTcp from './cardTagmtcp'
type Tag = {
  id: string
  mtcpaddressId: string
  name: string
  offset?: number | null
  gain?: number | null
  unit?: string | null
  lowlow?: number | null
  low?: number | null
  high?: number | null
  highhigh?: number | null
  booltruestate: string
  boolfalsestate: string
  createdAt: string
  updatedAt: string
}

type MtcpAddress = {
  id: string
  mtcpId: string
  address: number
  functioncode: string
  typedata: string
  canread: boolean
  canwrite: boolean
  createdAt: string
  updatedAt: string
  tags: Tag[]
}

type MtcpDevice = {
  id: string
  name: string
  ip: string
  port: number
  unitId: number
  timeout: number
  createdAt: string
  updatedAt: string
  isActive?: boolean

  mtcpaddrs: MtcpAddress[]

  _count?: {
    mtcpaddrs: number
  }
}

type Props = {
  MtcpDevice: MtcpDevice
  WS_devices?: any
  WS_tag?: any
}

export default function TagMtcpdevices({
  MtcpDevice,
  WS_devices,
  WS_tag,
}: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between border-b pb-3">
        <div>
          <p className="text-xs tracking-wider text-gray-500 uppercase">
            Modbus TCP Device
          </p>

          <h2 className="text-xl font-bold text-blue-600">{MtcpDevice.name}</h2>
        </div>

        <StatusMTCP iddevices={MtcpDevice.id} />
      </div>
      {/* Device Information */}
      <div className="mb-3">
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
          Device Information
        </h3>

        <div className="grid gap-3 md:grid-cols-3">
          {/* IP */}
          <div className="rounded-lg border bg-gray-50 p-3 dark:bg-gray-900">
            <div className="mb-1 flex items-center gap-2 text-gray-500">
              <FaNetworkWired />
              <span className="text-xs uppercase">IP Address</span>
            </div>

            <div className="font-mono text-lg font-semibold">
              {MtcpDevice.ip}
            </div>
          </div>

          {/* Port */}
          <div className="rounded-lg border bg-gray-50 p-3 dark:bg-gray-900">
            <div className="mb-1 flex items-center gap-2 text-gray-500">
              <FaPlug />
              <span className="text-xs uppercase">Port</span>
            </div>

            <div className="text-lg font-semibold">{MtcpDevice.port}</div>
          </div>

          {/* Unit ID */}
          <div className="rounded-lg border bg-gray-50 p-3 dark:bg-gray-900">
            <div className="mb-1 flex items-center gap-2 text-gray-500">
              <FaServer />
              <span className="text-xs uppercase">Unit ID</span>
            </div>

            <div className="text-lg font-semibold">{MtcpDevice.unitId}</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {MtcpDevice?.mtcpaddrs.map((items: MtcpAddress) => {
          return <CardTagMTcp key={items.id} MtcpTag={items} WS_tag={WS_tag} />
        })}
      </div>
      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t pt-3 text-sm text-gray-500">
        <span>Timeout: {MtcpDevice.timeout} ms</span>

        <span>
          Address Count: <strong>{MtcpDevice?.mtcpaddrs.length ?? 0}</strong>
        </span>
      </div>
    </div>
  )
}
