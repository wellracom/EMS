'use client'
import Label from '@/components/form/Label'
import { useState, useEffect } from 'react'
import NumberFlow from '@number-flow/react'
import { PiWarningDiamondDuotone } from 'react-icons/pi'
import SetValueModal from '@/components/ui/modal/SetValue/setValueModal'
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
type Props = {
  MtcpTag: MtcpAddress

  WS_tag?: any
}
export default function CardTagMTcp({ MtcpTag, WS_tag }: Props) {
  const [open, setOpen] = useState(false)

  const tagId = MtcpTag?.tags?.[0]?.id

  //   const value = WS_tag?.data?.find((itemWS: any) => itemWS.id === tagId)?.value
  const wsData = WS_tag?.data?.find((itemWS: any) => itemWS.id === tagId)
  const { value, low, lowlow, high, highhigh } = wsData || {}

  return (
    <>
      <button
        disabled={!MtcpTag.canwrite}
        onClick={() => setOpen(true)}
        className="flex flex-col rounded-xl border shadow hover:bg-gray-200"
      >
        <div className="text-center text-2xl">{MtcpTag?.tags[0]?.name}</div>
        <div className="text-center text-xs text-gray-400">
          {MtcpTag?.functioncode}:{MtcpTag?.address}
        </div>
        <div className="text-center text-2xl">
          {typeof value === 'boolean' ? (
            <span
              className={`font-bold ${value ? 'text-green-500' : 'text-red-500'}`}
            >
              {value
                ? MtcpTag?.tags?.[0]?.booltruestate?.trim() || 'TRUE'
                : MtcpTag?.tags?.[0]?.boolfalsestate?.trim() || 'FALSE'}
            </span>
          ) : value !== undefined && value !== null ? (
            <>
              <NumberFlow value={Number(value)} className="font-mono" />
              {MtcpTag?.tags[0]?.unit}
            </>
          ) : (
            <span className="text-gray-400">--</span>
          )}
        </div>
        {/* <div className="h-[30px] p-2"> */}
        {low && (
          <div className="flex animate-pulse items-center justify-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-red-700">
            <PiWarningDiamondDuotone />
            <span>LOW</span>
          </div>
        )}
        {lowlow && (
          <div className="flex animate-pulse items-center justify-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-red-700">
            <PiWarningDiamondDuotone />
            <span>LOW LOW</span>
          </div>
        )}
        {high && (
          <div className="flex animate-pulse items-center justify-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-red-700">
            <PiWarningDiamondDuotone />
            <span>HIGH</span>
          </div>
        )}
        {highhigh && (
          <div className="flex animate-pulse items-center justify-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-red-700">
            <PiWarningDiamondDuotone />
            <span>HIGH HIGH</span>
          </div>
        )}
        {/* </div> */}
      </button>
      <SetValueModal
        open={open}
        tagid={MtcpTag?.tags[0]?.id}
        tagName={MtcpTag?.tags[0]?.name}
        dataTag={MtcpTag?.tags[0]}
        currentValue={value}
        onClose={() => setOpen(false)}
        onSubmit={(value) => {
          console.log('New Value:', value)
        }}
      />
    </>
  )
}
