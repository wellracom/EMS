"use client";

import { useEffect, useState } from "react";

export default function StatusModal({ widget, onSave, onClose }: any) {
  const [local, setLocal] = useState({
    label: "",
    color: "green",
  });

  useEffect(() => {
    if (!widget) return;

    setLocal({
      label: widget.config?.label || "",
      color: widget.config?.color || "green",
    });
  }, [widget]);

  const update = (changes: any) => {
    const next = { ...local, ...changes };
    setLocal(next);
    onSave(next);
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded w-[300px] shadow-lg">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold">Status Settings</h2>

        <button
          onClick={onClose}
          className="text-red-500 text-sm"
        >
          ✕
        </button>
      </div>

      {/* LABEL */}
      <div className="mb-3">
        <label className="text-xs">Label</label>
        <input
          className="border p-1 w-full rounded"
          value={local.label}
          onChange={(e) => update({ label: e.target.value })}
        />
      </div>

      {/* COLOR */}
      <div className="mb-3">
        <label className="text-xs">Color</label>
        <select
          className="border p-1 w-full rounded"
          value={local.color}
          onChange={(e) => update({ color: e.target.value })}
        >
          <option value="green">Green</option>
          <option value="red">Red</option>
        </select>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onClose}
          className="px-3 py-1 text-sm border rounded"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            onSave(local);
            onClose();
          }}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}