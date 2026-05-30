'use client'

import { useState } from 'react'
import { FaTimes, FaSave } from 'react-icons/fa'
import { apiClient } from '@/lib/apiclient/apiClient'
import { useToast } from '@/components/ui/Provider/useToast'

const emptyForm = {
  name: '',
  ip: '',
  port: 502,
  unitId: 1,
  timeout: 1000,
}

export default function MtcpModal({
  open,
  setOpen,
  editId,
  form,
  setForm,
  refresh,
}: any) {
  const [errors, setErrors] = useState<any>({})
  const { toast } = useToast()
  if (!open) return null

  const handleChange = (e: any) => {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: value,
    })

    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validate = () => {
    const newErrors: any = {}

    if (!form.name?.trim()) newErrors.name = 'Name wajib diisi'
    if (!form.ip?.trim()) newErrors.ip = 'IP wajib diisi'
    if (!form.port) newErrors.port = 'Port wajib diisi'
    if (!form.unitId) newErrors.unitId = 'Unit ID wajib diisi'
    if (!form.timeout) newErrors.timeout = 'Timeout wajib diisi'

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      toast({
        type: 'error',
        message: 'Mohon lengkapi semua field',
      })

      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const isEdit = !!editId

    await apiClient(
      isEdit ? `/api_local/admin/mtcp/${editId}` : '/api_local/admin/mtcp',
      {
        method: isEdit ? 'PUT' : 'POST',
        body: {
          ...form,
          port: Number(form.port),
          unitId: Number(form.unitId),
          timeout: Number(form.timeout),
        },
        toast: {
          loading: isEdit ? 'Updating...' : 'Creating...',
          success: isEdit ? 'Updated successfully' : 'Created successfully',
          error: 'Operation failed',
        },
      }
    )

    refresh()
    setOpen(false)
    setForm(emptyForm)
    setErrors({})
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[420px] rounded-lg bg-white p-4 dark:bg-gray-800">
        {/* HEADER */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">{editId ? 'Edit MTCP' : 'Add MTCP'}</h2>

          <button onClick={() => setOpen(false)}>
            <FaTimes />
          </button>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-3">
          <div>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className={`w-full rounded border p-2 dark:bg-gray-700 ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              name="ip"
              value={form.ip}
              onChange={handleChange}
              placeholder="IP Address"
              className={`w-full rounded border p-2 dark:bg-gray-700 ${
                errors.ip ? 'border-red-500' : ''
              }`}
            />
            {errors.ip && (
              <p className="mt-1 text-sm text-red-500">{errors.ip}</p>
            )}
          </div>

          <div>
            <input
              name="port"
              type="number"
              value={form.port}
              onChange={handleChange}
              placeholder="Port"
              className={`w-full rounded border p-2 dark:bg-gray-700 ${
                errors.port ? 'border-red-500' : ''
              }`}
            />
            {errors.port && (
              <p className="mt-1 text-sm text-red-500">{errors.port}</p>
            )}
          </div>

          <div>
            <input
              name="unitId"
              type="number"
              value={form.unitId}
              onChange={handleChange}
              placeholder="Unit ID"
              className={`w-full rounded border p-2 dark:bg-gray-700 ${
                errors.unitId ? 'border-red-500' : ''
              }`}
            />
            {errors.unitId && (
              <p className="mt-1 text-sm text-red-500">{errors.unitId}</p>
            )}
          </div>

          <div>
            <input
              name="timeout"
              type="number"
              value={form.timeout}
              onChange={handleChange}
              placeholder="Timeout"
              className={`w-full rounded border p-2 dark:bg-gray-700 ${
                errors.timeout ? 'border-red-500' : ''
              }`}
            />
            {errors.timeout && (
              <p className="mt-1 text-sm text-red-500">{errors.timeout}</p>
            )}
          </div>
        </div>

        {/* ACTION */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setOpen(false)}
            className="rounded bg-gray-500 px-3 py-1 text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded bg-blue-600 px-3 py-1 text-white"
          >
            <FaSave />
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
