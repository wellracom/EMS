'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/apiclient/apiClient'
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
interface SetValueModalProps {
  dataTag?: Tag
  open: boolean
  tagid: string
  tagName: string
  currentValue: number | string | boolean
  onClose: () => void
  onSubmit: (value: number | boolean) => void
}

export default function SetValueModal({
  open,
  tagid,
  dataTag,
  tagName,
  currentValue,
  onClose,
  onSubmit,
}: SetValueModalProps) {
  const [value, setValue] = useState<string>('')

  const isBoolean = typeof currentValue === 'boolean'

  useEffect(() => {
    if (open) {
      setValue(String(currentValue ?? ''))
    }
  }, [open, currentValue])

  if (!open) return null

  const isValid = isBoolean
    ? value === 'true' || value === 'false'
    : value.trim() !== '' && !isNaN(Number(value))

  const handleSubmit = async () => {
    if (!isValid) return

    if (isBoolean) {
      const Req = await apiClient(`/api_local/tag/setvalue/${tagid}`, {
        method: 'PUT',
        body: {
          value: value,
        },
        toast: {
          loading: 'Set...',
          success: 'Berhasil Set Value',
          error: 'Failed',
        },
      })
      onSubmit(value === 'true')
    } else {
      const Req = await apiClient(`/api_local/tag/setvalue/${tagid}`, {
        method: 'PUT',
        body: {
          value: value,
        },
        toast: {
          loading: 'Set...',
          success: 'Berhasil Set Value',
          error: 'Failed',
        },
      })
      onSubmit(Number(value))
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Set Value</h2>
        </div>

        {/* Body */}
        <div className="space-y-4 p-6">
          <div>
            <label className="text-sm text-gray-500">Tag Name</label>
            <p className="font-medium">{tagName}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Current Value</label>
            <p className="font-medium">{String(currentValue)}</p>
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-500">
              New Value
            </label>

            {isBoolean ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setValue('true')}
                  className={`flex-1 rounded-lg border px-4 py-2 font-medium transition ${
                    value === 'true'
                      ? 'bg-green-600 text-white'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {dataTag?.booltruestate ?? 'ON'}
                </button>

                <button
                  type="button"
                  onClick={() => setValue('false')}
                  className={`flex-1 rounded-lg border px-4 py-2 font-medium transition ${
                    value === 'false'
                      ? 'bg-red-600 text-white'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {dataTag?.boolfalsestate ?? 'OFF'}
                </button>
              </div>
            ) : (
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            disabled={!isValid}
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Set Value
          </button>
        </div>
      </div>
    </div>
  )
}
