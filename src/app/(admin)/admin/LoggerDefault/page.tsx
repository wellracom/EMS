'use client'

import { apiClient } from '@/lib/apiclient/apiClient'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const [interval, setIntervalValue] = useState(10)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api_local/admin/LoggerDefault')
      const data = await res.json()
      setIntervalValue(data.interval || 10)
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    if (interval < 1) {
      alert('Minimal interval 1 detik')
      return
    }

    setSaving(true)

    await apiClient('/api_local/admin/LoggerDefault', {
      method: 'POST',
  body: { interval: interval },
  toast: {
    loading: "Saving...",
    success: "Interval updated",
    error: "Failed to save",
  },
      
    })

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    )
  }

  return (
    <div className=" bg-transparent dark:bg-gray-900 flex items-center justify-center p-4">
      
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
        
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Logger Interval
        </h2>

        <div className="space-y-2">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Interval (Second)
          </label>

          <input
            type="number"
            value={interval}
            onChange={(e) => setIntervalValue(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-gray-50 dark:bg-gray-700 
                       text-gray-800 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 
                     text-white font-medium transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>

      </div>
    </div>
  )
}