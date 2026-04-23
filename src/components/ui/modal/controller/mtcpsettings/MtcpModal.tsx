"use client";

import { FaTimes, FaSave } from "react-icons/fa";
import { apiClient } from "@/lib/apiclient/apiClient";

const emptyForm = {
  name: "",
  ip: "",
  port: 502,
  unitId: 1,
  timeout: 1000,
};

export default function MtcpModal({
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
      isEdit ? `/api_local/admin/mtcp/${editId}` : "/api_local/admin/mtcp",
      {
        method: isEdit ? "PUT" : "POST",
        body: {
          ...form,
          port: Number(form.port),
          unitId: Number(form.unitId),
          timeout: Number(form.timeout),
        },
        toast: {
          loading: isEdit ? "Updating..." : "Creating...",
          success: isEdit
            ? "Updated successfully"
            : "Created successfully",
          error: "Operation failed",
        },
      }
    );

    refresh();
    setOpen(false);
    setForm(emptyForm);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[420px] bg-white dark:bg-gray-800 rounded-lg p-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold">
            {editId ? "Edit MTCP" : "Add MTCP"}
          </h2>

          <button onClick={() => setOpen(false)}>
            <FaTimes />
          </button>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="p-2 border rounded dark:bg-gray-700"
          />

          <input
            name="ip"
            value={form.ip}
            onChange={handleChange}
            placeholder="IP"
            className="p-2 border rounded dark:bg-gray-700"
          />

          <input
            name="port"
            type="number"
            value={form.port}
            onChange={handleChange}
            placeholder="Port"
            className="p-2 border rounded dark:bg-gray-700"
          />

          <input
            name="unitId"
            type="number"
            value={form.unitId}
            onChange={handleChange}
            placeholder="Unit ID"
            className="p-2 border rounded dark:bg-gray-700"
          />

          <input
            name="timeout"
            type="number"
            value={form.timeout}
            onChange={handleChange}
            placeholder="Timeout"
            className="p-2 border rounded dark:bg-gray-700"
          />
        </div>

        {/* ACTION */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setOpen(false)}
            className="px-3 py-1 bg-gray-500 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded"
          >
            <FaSave /> Save
          </button>
        </div>
      </div>
    </div>
  );
}