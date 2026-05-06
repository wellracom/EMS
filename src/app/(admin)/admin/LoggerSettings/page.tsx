'use client'

import { useEffect, useState } from 'react'
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import WSStatusIndicator from "@/components/ui/WSConnection/WSStatusIndicator";
import { useWS_V1Server } from "@/hooks/WS/useWSserver";
import LoggerModal from '@/components/ui/modal/admin/LoggerSettings/LoggerSettingModal';
import { apiClient } from "@/lib/apiclient/apiClient";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
export default function LoggerTable() {
  const [rows, setRows] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    interval: 5,
    tags: false,
    devices: false,
    selectedTags: [],
    selectedDevices: [],
  })

  const WS = useWS_V1Server('LoggerSettings')

  const fetchData = async () => {
     try {
    const res = await apiClient('/api_local/admin/LoggerSettings')
     if (res) setRows(res);
 } catch (err) {
      console.error("Fetch address error:", err);
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // optional: auto refresh dari WS


  // OPEN CREATE
  const handleAdd = () => {
    setEditId(null)
    setForm({
      name: '',
      interval: 5,
      tags: false,
      devices: false,
      selectedTags: [],
      selectedDevices: [],
    })
    setOpen(true)
  }

  // OPEN EDIT
  const handleEdit = (row: any) => {
    setEditId(row.id)

    setForm({
      name: row.name,
      interval: row.interval,
      tags: row.tags,
      devices: row.devices,
      selectedTags: row.selectedTags || [],
      selectedDevices: row.selectedDevices || [],
    })

    setOpen(true)
  }

  // DELETE
  const handleDelete = async (id: string) => {
    await apiClient(`/api_local/admin/LoggerSettings/${id}`, { method: 'DELETE' })
    fetchData()
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
      <div className="w-full mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <WSStatusIndicator status={WS.status} showLabel={false}/>
            Logger Settings
          </h1>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            <FaPlus /> Add Logger
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2">Name</th>
                <th>Interval</th>
                <th>Tags</th>
                <th>Devices</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b dark:border-gray-700">
                  <td className="p-2">{row.name}</td>
                  <td>{row.interval}</td>

                  <td>
                    {row.tags ? (
                      <span className="text-green-500">
                        {row.selectedTags?.length || 0} Tags
                      </span>
                    ) : (
                      <span className="text-gray-400">OFF</span>
                    )}
                  </td>

                  <td>
                    {row.devices ? (
                      <span className="text-blue-500">
                        {row.selectedDevices?.length || 0} Devices
                      </span>
                    ) : (
                      <span className="text-gray-400">OFF</span>
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="space-x-2">
                    <Tooltip label="Edit Logger">
                    <button
                      onClick={() => handleEdit(row)}
                      className="text-yellow-400 hover:text-yellow-500 transition"
                    >
                      <FaEdit />
                    </button>
                    </Tooltip>
<Tooltip label="Delete">
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <FaTrash />
                    </button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        <LoggerModal
          open={open}
          setOpen={setOpen}
          editId={editId}
          form={form}
          setForm={setForm}
          refresh={fetchData}
        />
      </div>
    </div>
  )
}