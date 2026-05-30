'use client'

import { apiClient } from '@/lib/apiclient/apiClient'
import Tooltip from '@/components/ui/Tooltip/Tooltip'
export default function MtcpAddressModal({
  mtcpid,
  open,
  setOpen,
  editId,
  form,
  setForm,
  refresh,
}: any) {
  if (!open) return null

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target

    let newForm: any = {
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    }

    // 🔥 FUNCTION CODE LOGIC
    if (name === 'functioncode') {
      if (value === 'FC1') {
        newForm.typedata = 'BOOLEAN'
        newForm.canread = false
        newForm.canwrite = false
      }

      if (value === 'FC2') {
        newForm.typedata = 'BOOLEAN'
        newForm.canread = true
        newForm.canwrite = false
      }

      if (value === 'FC3') {
        newForm.canread = true
        newForm.canwrite = false
      }

      if (value === 'FC4') {
        newForm.canread = true
        newForm.canwrite = false
      }
    }

    setForm(newForm)
  }

  const handleSubmit = async () => {
    const isEdit = !!editId

    await apiClient(
      isEdit
        ? `/api_local/admin/mtcp/mtcpaddress/${editId}`
        : '/api_local/admin/mtcp/mtcpaddress',
      {
        method: isEdit ? 'PUT' : 'POST',
        body: {
          // 🔹 mtcpaddress
          mtcpId: mtcpid,
          address: Number(form.address),
          functioncode: form.functioncode,
          typedata: form.typedata,
          canread: form.canread,
          canwrite: form.canwrite,

          // 🔹 TAG (nested)
          tag: {
            name: form.tagname,
            offset: Number(form.offset),
            gain: Number(form.gain),
            unit: form.unit,
            booltruestate: form.booltruestate,
            boolfalsestate: form.boolfalsestate,
            lowlow: Number(form.lowlow),
            low: Number(form.low),
            high: Number(form.high),
            highhigh: Number(form.highhigh),
          },
        },
        toast: {
          loading: 'Saving...',
          success: 'Saved',
          error: 'Failed',
        },
      }
    )

    refresh()
    setOpen(false)
  }

  const isBooleanFC = form.functioncode === 'FC1' || form.functioncode === 'FC2'

  const disableWrite =
    form.functioncode === 'FC2' || form.functioncode === 'FC4'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[550px] rounded-xl bg-white p-5 shadow-lg dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold">
          {editId ? 'Edit Address' : 'Add Address'}
        </h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-4 border-b pb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              MTCP Parameter
            </h3>
            {/* ================= Tag Name ================= */}
            <div className="grid grid-cols-[150px_1fr] items-center gap-0.5">
              <label className="text-sm font-medium text-blue-500">
                Tag Name
              </label>
              <Tooltip label="Tag Name">
                <input
                  name="tagname"
                  placeholder="Tag Name"
                  value={form.tagname || ''}
                  onChange={handleChange}
                  className="w-full rounded border p-2 text-sm dark:bg-gray-700"
                />
              </Tooltip>
            </div>
            {/* ================= Modbus address================= */}
            <div className="grid grid-cols-[150px_1fr] items-center gap-0.5">
              <label className="text-sm font-medium text-blue-500">
                Address Modbus
              </label>
              <div className="flex flex-col gap-3">
                <Tooltip label="Address Modbus">
                  <input
                    name="address"
                    placeholder="Address"
                    type="number"
                    value={form.address || ''}
                    onChange={handleChange}
                    className="mb-2 w-full rounded border p-2 dark:bg-gray-700"
                  />
                </Tooltip>
                <div className="grid grid-cols-2 gap-3">
                  <Tooltip label="Fuction Code">
                    <select
                      name="functioncode"
                      value={form.functioncode || ''}
                      onChange={handleChange}
                      className="rounded border p-2 dark:bg-gray-700"
                    >
                      <option value="">Select FC</option>
                      <option value="FC1">FC1 (Coil)</option>
                      <option value="FC2">FC2 (Discrete)</option>
                      <option value="FC3">FC3 (Holding)</option>
                      <option value="FC4">FC4 (Input)</option>
                    </select>
                  </Tooltip>
                  <Tooltip label="Type Data">
                    <select
                      name="typedata"
                      value={form.typedata || ''}
                      onChange={handleChange}
                      disabled={isBooleanFC}
                      className={`rounded border p-2 dark:bg-gray-700 ${
                        isBooleanFC ? 'opacity-50' : ''
                      }`}
                    >
                      <option value="">Select Type</option>
                      <option value="INT16_SIGNED">INT16_SIGNED</option>
                      <option value="INT16_UNSIGNED">INT16_UNSIGNED</option>
                      <option value="INT32_BIG_ENDIAN">INT32_BIG_ENDIAN</option>
                      <option value="INT32_LITTLE_ENDIAN">
                        INT32_LITTLE_ENDIAN
                      </option>
                      <option value="FLOAT32_ABCD">FLOAT32_ABCD</option>
                      <option value="FLOAT32_BADC">FLOAT32_BADC</option>
                      <option value="FLOAT32_DCBA">FLOAT32_DCBA</option>
                      <option value="DOUBLE64">DOUBLE64</option>
                      <option value="ASCII">ASCII</option>
                      <option value="BCD">BCD</option>
                    </select>
                  </Tooltip>
                </div>
                {(form.functioncode === 'FC1' ||
                  form.functioncode === 'FC2') && (
                  <div className="grid grid-cols-2 gap-3">
                    <Tooltip label="Bollean State">
                      <input
                        name="booltruestate"
                        placeholder="True State"
                        type="string"
                        value={form.booltruestate || ''}
                        onChange={handleChange}
                        className="mb-2 w-full rounded border p-2 dark:bg-gray-700"
                      />
                    </Tooltip>
                    <Tooltip label="Bollean State">
                      <input
                        name="boolfalsestate"
                        placeholder="false State"
                        type="string"
                        value={form.boolfalsestate || ''}
                        onChange={handleChange}
                        className="mb-2 w-full rounded border p-2 dark:bg-gray-700"
                      />
                    </Tooltip>
                  </div>
                )}
                {/* READ WRITE */}
                <div className="mt-2 flex justify-between text-sm">
                  <div>Read: {form.canread ? '✔️' : '❌'}</div>

                  <label
                    className={`flex items-center gap-2 ${
                      disableWrite ? 'opacity-50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="canwrite"
                      checked={form.canwrite || false}
                      onChange={handleChange}
                      disabled={disableWrite}
                    />
                    Write
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="border-b pb-3">
            {' '}
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Tag Paramter
            </h3>
            <div className="grid grid-cols-[150px_1fr] items-center gap-0.5">
              <label className="text-sm font-medium text-blue-500">
                Scaling
              </label>
              <div className="mb-2 grid grid-cols-2 gap-3">
                <Tooltip label="Scaling Offset">
                  <input
                    name="offset"
                    placeholder="Offset"
                    type="number"
                    value={form.offset || ''}
                    onChange={handleChange}
                    className="rounded border p-2 dark:bg-gray-700"
                  />
                </Tooltip>
                <Tooltip label="Scaling Gain">
                  <input
                    name="gain"
                    placeholder="Gain"
                    type="number"
                    value={form.gain || ''}
                    onChange={handleChange}
                    className="rounded border p-2 dark:bg-gray-700"
                  />
                </Tooltip>
              </div>
            </div>
            <div className="grid grid-cols-[150px_1fr] items-center gap-0.5">
              <label className="text-sm font-medium text-blue-500">
                Unit Name
              </label>
              <Tooltip label="Unit Name">
                <input
                  name="unit"
                  placeholder="Unit"
                  value={form.unit || ''}
                  onChange={handleChange}
                  className="mb-2 w-full rounded border p-2 dark:bg-gray-700"
                />
              </Tooltip>
            </div>
            {/* ALARM */}
            <div className="mt-2 border-t pt-2">
              <h4 className="mb-2 text-xs text-red-500">⚠️ ALARM</h4>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-[150px_1fr] items-center gap-0.5">
                  <label className="text-sm font-medium text-blue-500">
                    Low Alarm
                  </label>
                  <div className="mb-2 grid grid-cols-2 gap-3">
                    <Tooltip label="Low Low Alarm Value">
                      <input
                        name="lowlow"
                        placeholder="Low Low"
                        type="number"
                        value={form.lowlow || ''}
                        onChange={handleChange}
                        className="rounded border p-2 dark:bg-gray-700"
                      />
                    </Tooltip>
                    <Tooltip label="Low Alarm Value">
                      <input
                        name="low"
                        placeholder="Low"
                        type="number"
                        value={form.low || ''}
                        onChange={handleChange}
                        className="rounded border p-2 dark:bg-gray-700"
                      />
                    </Tooltip>
                  </div>
                </div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-0.5">
                  <label className="text-sm font-medium text-blue-500">
                    High Alarm
                  </label>
                  <div className="mb-2 grid grid-cols-2 gap-3">
                    <Tooltip label="High Alarm Value">
                      <input
                        name="high"
                        placeholder="High"
                        type="number"
                        value={form.high || ''}
                        onChange={handleChange}
                        className="rounded border p-2 dark:bg-gray-700"
                      />
                    </Tooltip>
                    <Tooltip label="High High Alarm Value">
                      <input
                        name="highhigh"
                        placeholder="High High"
                        type="number"
                        value={form.highhigh || ''}
                        onChange={handleChange}
                        className="rounded border p-2 dark:bg-gray-700"
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION */}
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={() => setOpen(false)}>Cancel</button>

          <button
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-4 py-1 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
