'use client'
import { useState, useEffect } from 'react'
import Tooltip from '@/components/ui/Tooltip/Tooltip'
import { useWS_V1Server } from '@/hooks/WS/useWSserver'
import WSStatusIndicator from '@/components/ui/WSConnection/WSStatusIndicator'
import { apiClient } from '@/lib/apiclient/apiClient'
import TagMtcpdevices from '@/components/ui/menu/taglist/mtcp/cardmtcp'
import { useWS_V1 } from '@/hooks/WS/useWSNodered'
export default function Page() {
  const WS = useWS_V1Server('mtcpsettings')
  const WS_tag = useWS_V1('tag')
  const WS_devices = useWS_V1('devices')
  const [data, setData] = useState<any[]>([])

  const Fatch = async () => {
    const res = await apiClient('/api_local/menu/taglist/mtcp')
    console.log(res)
    if (res) setData(res?.data ?? [])
  }
  useEffect(() => {
    Fatch()
  }, [])
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto w-full">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WSStatusIndicator status={WS.status} showLabel={false} />
            <h1 className="text-xl font-bold">MTCP Tag List</h1>
          </div>
        </div>
        {data?.map((item: any) => (
          <TagMtcpdevices
            key={item.id}
            MtcpDevice={item}
            WS_devices={WS_devices}
            WS_tag={WS_tag}
          />
        ))}
      </div>
    </div>
  )
}
