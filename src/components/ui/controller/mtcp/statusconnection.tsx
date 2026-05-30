'use client'

import { useWS_V1 } from '@/hooks/WS/useWSNodered'
import { MdWifi, MdWifiOff } from 'react-icons/md'

type Props = {
  iddevices: string
}

export default function StatusMTCP({ iddevices }: Props) {
  const WS = useWS_V1('devices')

  const status = WS.data?.find(
    (item: any) => item.id === iddevices
  )?.status

  const isConnected = status === 1

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <>
          <MdWifi className="text-green-500 text-xl" />
          <span className="text-green-500 font-semibold">
            Connected
          </span>
        </>
      ) : (
        <>
          <MdWifiOff className="text-red-500 text-xl" />
          <span className="text-red-500 font-semibold">
            Disconnected
          </span>
        </>
      )}
    </div>
  )
}