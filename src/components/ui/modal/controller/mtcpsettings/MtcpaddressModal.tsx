"use client";

import { apiClient } from "@/lib/apiclient/apiClient";

export default function MtcpAddressModal({
  mtcpid,
  open,
  setOpen,
  editId,
  form,
  setForm,
  refresh,
}: any) {
  if (!open) return null;

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    let newForm: any = {
      ...form,
      [name]: type === "checkbox" ? checked : value,
    };

    // 🔥 FUNCTION CODE LOGIC
    if (name === "functioncode") {
      if (value === "FC1") {
        newForm.typedata = "BOOLEAN";
        newForm.canread = false;
        newForm.canwrite = false;
      }

      if (value === "FC2") {
        newForm.typedata = "BOOLEAN";
        newForm.canread = true;
        newForm.canwrite = false;
      }

      if (value === "FC3") {
        newForm.canread = true;
        newForm.canwrite = false;
      }

      if (value === "FC4") {
        newForm.canread = true;
        newForm.canwrite = false;
      }
    }

    setForm(newForm);
  };

  const handleSubmit = async () => {
    const isEdit = !!editId;

    await apiClient(
      isEdit ? `/api_local/admin/mtcp/mtcpaddress/${editId}` : "/api_local/admin/mtcp/mtcpaddress",
      {
        method: isEdit ? "PUT" : "POST",
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
            lowlow: Number(form.lowlow),
            low: Number(form.low),
            high: Number(form.high),
            highhigh: Number(form.highhigh),
          },
        },
        toast: {
          loading: "Saving...",
          success: "Saved",
          error: "Failed",
        },
      }
    );

    refresh();
    setOpen(false);
  };

  const isBooleanFC =
    form.functioncode === "FC1" || form.functioncode === "FC2";

  const disableWrite =
    form.functioncode === "FC2" || form.functioncode === "FC4";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-5 w-[550px] rounded-xl shadow-lg">

        <h2 className="mb-4 text-lg font-semibold">
          {editId ? "Edit Address" : "Add Address"}
        </h2>

        <div className="flex flex-col gap-3">

          {/* ================= MTCP ADDRESS ================= */}
          <div className="border-b pb-3">
            <h3 className="text-sm font-semibold mb-2 text-blue-500">
              🔌 MTCP CONFIG
            </h3>

            <input
              name="address"
              placeholder="Address"
              type="number"
              value={form.address || ""}
              onChange={handleChange}
              className="p-2 border rounded w-full mb-2 dark:bg-gray-700"
            />

            <div className="grid grid-cols-2 gap-3">
              <select
                name="functioncode"
                value={form.functioncode || ""}
                onChange={handleChange}
                className="p-2 border rounded dark:bg-gray-700"
              >
                <option value="">Select FC</option>
                <option value="FC1">FC1 (Coil)</option>
                <option value="FC2">FC2 (Discrete)</option>
                <option value="FC3">FC3 (Holding)</option>
                <option value="FC4">FC4 (Input)</option>
              </select>

              <select
                name="typedata"
                value={form.typedata || ""}
                onChange={handleChange}
                disabled={isBooleanFC}
                className={`p-2 border rounded dark:bg-gray-700 ${
                  isBooleanFC ? "opacity-50" : ""
                }`}
              >
                <option value="">Select Type</option>
                <option value="INT16_SIGNED">INT16_SIGNED</option>
                <option value="INT16_UNSIGNED">INT16_UNSIGNED</option>
                <option value="INT32_BIG_ENDIAN">INT32_BIG_ENDIAN</option>
                <option value="INT32_LITTLE_ENDIAN">INT32_LITTLE_ENDIAN</option>
                <option value="FLOAT32_ABCD">FLOAT32_ABCD</option>
                <option value="FLOAT32_BADC">FLOAT32_BADC</option>
                <option value="FLOAT32_DCBA">FLOAT32_DCBA</option>
                <option value="DOUBLE64">DOUBLE64</option>
                <option value="ASCII">ASCII</option>
                <option value="BCD">BCD</option>
              </select>
            </div>

            {/* READ WRITE */}
            <div className="flex justify-between mt-2 text-sm">
              <div>Read: {form.canread ? "✔️" : "❌"}</div>

              <label
                className={`flex items-center gap-2 ${
                  disableWrite ? "opacity-50" : ""
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

          {/* ================= TAG ================= */}
          <div>
            <h3 className="text-sm font-semibold mb-2 text-green-500">
              🏷️ TAG CONFIG
            </h3>

            <input
              name="tagname"
              placeholder="Tag Name"
              value={form.tagname || ""}
              onChange={handleChange}
              className="p-2 border rounded w-full mb-2 dark:bg-gray-700"
            />

            {/* SCALING */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              <input
                name="offset"
                placeholder="Offset"
                type="number"
                value={form.offset || ""}
                onChange={handleChange}
                className="p-2 border rounded dark:bg-gray-700"
              />

              <input
                name="gain"
                placeholder="Gain"
                type="number"
                value={form.gain || ""}
                onChange={handleChange}
                className="p-2 border rounded dark:bg-gray-700"
              />
            </div>

            <input
              name="unit"
              placeholder="Unit"
              value={form.unit || ""}
              onChange={handleChange}
              className="p-2 border rounded w-full mb-2 dark:bg-gray-700"
            />

            {/* ALARM */}
            <div className="mt-2 border-t pt-2">
              <h4 className="text-xs text-red-500 mb-2">
                ⚠️ ALARM
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <input name="lowlow" placeholder="Low Low" type="number" value={form.lowlow || ""} onChange={handleChange} className="p-2 border rounded dark:bg-gray-700"/>
                <input name="low" placeholder="Low" type="number" value={form.low || ""} onChange={handleChange} className="p-2 border rounded dark:bg-gray-700"/>
                <input name="high" placeholder="High" type="number" value={form.high || ""} onChange={handleChange} className="p-2 border rounded dark:bg-gray-700"/>
                <input name="highhigh" placeholder="High High" type="number" value={form.highhigh || ""} onChange={handleChange} className="p-2 border rounded dark:bg-gray-700"/>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION */}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setOpen(false)}>Cancel</button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}