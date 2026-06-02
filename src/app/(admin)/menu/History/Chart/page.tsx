'use client'

import { useState } from 'react'
import { FaBars, FaHistory } from 'react-icons/fa'
import TreeCheckbox from '@/components/ui/menu/TagSelect/TagSelect'

export default function HistoryPage() {
  const [showSidebar, setShowSidebar] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  return (
    <div className="h-[calc(100vh-80px)] w-full">
      <div className="flex h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {/* Sidebar */}
        <div
          className={`overflow-hidden border-r border-gray-200 bg-gray-50 transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 ${
            showSidebar ? 'w-80' : 'w-0'
          }`}
        >
          <div className="h-full w-80">
            <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                Tag Selection
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Select tags to view historical data
              </p>
            </div>

            <div className="overflow-y-auto p-3">
              <TreeCheckbox onChangeSelected={setSelectedIds} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FaBars />
              </button>

              <div className="flex items-center gap-2">
                <FaHistory className="text-lg text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  History
                </h2>
              </div>
            </div>

            <div className="text-sm text-gray-500">Historical Data Viewer</div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto bg-gray-50 p-4 dark:bg-gray-950">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                Historical Trend
              </h3>

              <p className="text-sm text-gray-500">
                Select one or more tags from the left panel to display
                historical data.
              </p>

              <div className="mt-6 flex h-[500px] items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                <span className="text-gray-400">Chart Area</span>
              </div>
              <pre className="mt-4 overflow-auto rounded bg-gray-100 p-2 text-xs">
                {JSON.stringify(selectedIds, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
