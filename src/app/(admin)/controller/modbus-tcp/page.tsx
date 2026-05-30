'use client'

import { useEffect, useState } from 'react'
import { FaPlus, FaEdit, FaTrash, FaWhmcs, FaCopy } from 'react-icons/fa'
import MtcpModal from '@/components/ui/modal/controller/mtcpsettings/MtcpModal'
import { apiClient } from '@/lib/apiclient/apiClient'
import Tooltip from '@/components/ui/Tooltip/Tooltip'
import WSStatusIndicator from '@/components/ui/WSConnection/WSStatusIndicator'
import { useWS_V1Server } from '@/hooks/WS/useWSserver'
import StatusMTCP from '@/components/ui/controller/mtcp/statusconnection'
import Link from 'next/link'
type Mtcplist = {
  id: string
  name: string
  ip: string
  port: number
  unitId: number
  timeout: number
}

const emptyForm = {
  name: '',
  ip: '',
  port: 502,
  unitId: 1,
  timeout: 1000,
}

export default function MtcpListPage() {
  const [data, setData] = useState<Mtcplist[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<any>(emptyForm)
  const WS = useWS_V1Server('mtcpsettings')

  useEffect(() => {
    if (WS.data?.type === 'reload') {
      fetchData()
    }
  }, [WS.data])
  // 🔹 GET ALL (pakai apiClient)
  const fetchData = async () => {
    const res = await apiClient<Mtcplist[]>('/api_local/admin/mtcp')
    if (res) setData(res)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 🔹 CREATE
  const handleCreate = () => {
    setForm(emptyForm)
    setEditId(null)
    setOpen(true)
  }

  // 🔹 EDIT
  const handleEdit = (item: Mtcplist) => {
    console.log(item)
    setForm(item)
    setEditId(item.id)
    setOpen(true)
  }

  // 🔹 DELETE (pakai confirm + toast dari apiClient)
  const handleDelete = async (id: string) => {
    await apiClient(`/api_local/admin/mtcp/${id}`, {
      method: 'DELETE',
      confirm: {
        message: 'Delete this MTCP device?',
      },
      toast: {
        loading: 'Deleting...',
        success: 'Deleted successfully',
        error: 'Delete failed',
      },
    })

    fetchData()
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto w-full">
        {/* HEADER */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WSStatusIndicator status={WS.status} showLabel={false} />
            <h1 className="text-xl font-bold">MTCP List</h1>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <FaPlus /> Add Device
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl bg-white shadow dark:bg-gray-800">
          <table className="w-full text-left">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th>IP</th>
                <th>Port</th>
                <th>Unit</th>
                <th>Timeout</th>
                <th>Action</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b dark:border-gray-700">
                  <td className="p-2">{item.name}</td>
                  <td>{item.ip}</td>
                  <td>{item.port}</td>
                  <td>{item.unitId}</td>
                  <td>{item.timeout}</td>

                  <td className="p-2">
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip label="Copy Address">
                        <Link
                          href={`/controller/modbus-tcp/address/${item.id}`}
                        >
                          <button
                            type="button"
                            className="rounded p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                          >
                            <FaCopy size={14} />
                          </button>
                        </Link>
                      </Tooltip>

                      <Tooltip label="Config Address Modbus">
                        <Link
                          href={`/controller/modbus-tcp/address/${item.id}`}
                        >
                          <button
                            type="button"
                            className="rounded p-2 text-blue-400 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <FaWhmcs size={14} />
                          </button>
                        </Link>
                      </Tooltip>

                      <Tooltip label="Edit Config">
                        <button
                          onClick={() => handleEdit(item)}
                          type="button"
                          className="rounded p-2 text-yellow-400 transition hover:bg-yellow-50 hover:text-yellow-600"
                        >
                          <FaEdit size={14} />
                        </button>
                      </Tooltip>

                      <Tooltip label="Delete">
                        <button
                          onClick={() => handleDelete(item.id)}
                          type="button"
                          className="rounded p-2 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <FaTrash size={14} />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                  <td>
                    {' '}
                    <StatusMTCP iddevices={item.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        <MtcpModal
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
