"use client";

import { apiClient } from "@/lib/apiclient/apiClient";

export default function MtcpAddressModal({
  open,
  setOpen,
  editId,
  form,
  setForm,
  refresh,
}: any) {
  if (!open) return null;

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const isEdit = !!editId;

    await apiClient(
      isEdit ? `/api/mtcpaddress/${editId}` : "/api/mtcpaddress",
      {
        method: isEdit ? "PUT" : "POST",
        body: {
          ...form,
          address: Number(form.address),
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

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-4 w-[400px] rounded">

        <h2 className="mb-3 font-bold">
          {editId ? "Edit Address" : "Add Address"}
        </h2>

        <div className="flex flex-col gap-2">
          <input
            name="nickname"
            placeholder="Nickname"
            value={form.nickname || ""}
            onChange={handleChange}
            className="p-2 border rounded dark:bg-gray-700"
          />

          <input
            name="address"
            placeholder="Address"
            type="number"
            value={form.address || ""}
            onChange={handleChange}
            className="p-2 border rounded dark:bg-gray-700"
          />

          <select
            name="functioncode"
            value={form.functioncode || ""}
            onChange={handleChange}
            className="p-2 border rounded dark:bg-gray-700"
          >
            <option value="">Select FC</option>
            <option value="FC1">FC1</option>
            <option value="FC2">FC2</option>
            <option value="FC3">FC3</option>
            <option value="FC4">FC4</option>
          </select>

          <select
            name="typedata"
            value={form.typedata || ""}
            onChange={handleChange}
            className="p-2 border rounded dark:bg-gray-700"
          >
            <option value="">Select Type</option>
            <option value="INT16_SIGNED">INT16_SIGNED</option>
            <option value="FLOAT32_ABCD">FLOAT32_ABCD</option>
            <option value="DOUBLE64">DOUBLE64</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => setOpen(false)}>Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}