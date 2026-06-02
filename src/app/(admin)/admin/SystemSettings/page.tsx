'use client'

import { apiClient } from '@/lib/apiclient/apiClient'
import { useEffect, useState } from 'react'

type Config = {
  logger: {
    interval: number
  }
}

const defaultConfig: Config = {
  logger: {
    interval: 10,
  },
}

export default function SettingsPage() {
  const [data, setData] = useState<Config>(defaultConfig)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const res = await apiClient('/api_local/config')

      setData({
        logger: {
          interval: res?.logger?.interval ?? 10,
        },
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [])

  const handleSave = async () => {
    if (data.logger.interval < 1) {
      alert('Minimal interval 1 detik')
      return
    }

    setSaving(true)

    try {
      await apiClient('/api_local/config', {
        method: 'POST',
        body: data,
        toast: {
          loading: 'Saving...',
          success: 'Configuration updated',
          error: 'Failed to save',
        },
      })
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
      load()
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    )
  }

  return (
    <div className="w-full rounded-2xl border bg-white dark:bg-gray-800">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Logger Settings
        </h2>

        <hr className="my-4 border-gray-300 dark:border-gray-600" />

        <div className="space-y-2 p-2">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Interval Logger (Second)
          </label>

          <input
            type="number"
            min={1}
            value={data.logger.interval}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                logger: {
                  ...prev.logger,
                  interval: Number(e.target.value),
                },
              }))
            }
            className="w-32 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="flex flex-col border-t border-gray-300 p-4 sm:flex-row sm:justify-end dark:border-gray-600">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[100px]"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
