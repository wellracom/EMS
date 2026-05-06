"use client";

import { useEffect, useState } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import { apiClient } from "@/lib/apiclient/apiClient";

const emptyForm = {
  name: "",
  interval: 5,
  tags: false,
  devices: false,
};

export default function LoggerModal({
  open,
  setOpen,
  editId,
  form,
  setForm,
  refresh,
}: any) {
  const [tagsList, setTagsList] = useState<any[]>([]);
  const [devicesList, setDevicesList] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  // ✅ load master (optional: hanya saat modal open)
  useEffect(() => {
    if (!open) return;

    fetch("/api_local/admin/tag").then(res => res.json()).then(setTagsList);
    fetch("/api_local/admin/Devices").then(res => res.json()).then(setDevicesList);
  }, [open]);

  // ✅ sync edit data
  useEffect(() => {
    if (!open) return;

    if (form) {
      setSelectedTags(form.selectedTags || []);
      setSelectedDevices(form.selectedDevices || []);
    }
  }, [form, open]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    // auto clear
    if (name === "tags" && !checked) setSelectedTags([]);
    if (name === "devices" && !checked) setSelectedDevices([]);
  };

  const handleSubmit = async () => {
    const isEdit = !!editId;

    await apiClient(
      isEdit
        ? `/api_local/admin/LoggerSettings/${editId}`
        : "/api_local/admin/LoggerSettings",
      {
        method: isEdit ? "PUT" : "POST",
        body: {
          ...form,
          interval: Number(form.interval),
          selectedTags,
          selectedDevices,
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
    setSelectedTags([]);
    setSelectedDevices([]);
  };

  // ✅ CONDITIONAL DI SINI (AMAN)
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-[420px] bg-white dark:bg-gray-800 rounded-lg p-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold">
            {editId ? "Edit Logger" : "Add Logger"}
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
            name="interval"
            type="number"
            value={form.interval}
            onChange={handleChange}
            placeholder="Interval"
            className="p-2 border rounded dark:bg-gray-700"
          />

          {/* TAGS */}
          <label className="flex gap-2 text-sm">
            <input
              type="checkbox"
              name="tags"
              checked={form.tags}
              onChange={handleChange}
            />
            Enable Tags
          </label>

          {form.tags && (
            <div className="border rounded p-2 max-h-28 overflow-auto dark:bg-gray-700">
              {tagsList.map((t) => (
                <label key={t.id} className="block text-sm">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(t.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTags([...selectedTags, t.id]);
                      } else {
                        setSelectedTags(
                          selectedTags.filter((id) => id !== t.id)
                        );
                      }
                    }}
                  />
                  {" "}{t.name}
                </label>
              ))}
            </div>
          )}

          {/* DEVICES */}
          <label className="flex gap-2 text-sm">
            <input
              type="checkbox"
              name="devices"
              checked={form.devices}
              onChange={handleChange}
            />
            Enable Devices
          </label>

          {form.devices && (
            <div className="border rounded p-2 max-h-28 overflow-auto dark:bg-gray-700">
              {devicesList.map((d) => (
                <label key={d.id} className="block text-sm">
                  <input
                    type="checkbox"
                    checked={selectedDevices.includes(d.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDevices([...selectedDevices, d.id]);
                      } else {
                        setSelectedDevices(
                          selectedDevices.filter((id) => id !== d.id)
                        );
                      }
                    }}
                  />
                  {" "}{d.name}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* ACTION */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setOpen(false)}
            className="px-3 py-1 bg-gray-500 rounded text-white"
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