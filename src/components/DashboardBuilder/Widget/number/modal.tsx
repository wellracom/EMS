"use client";

import { useEffect, useState } from "react";
import ModalHeader from "@/components/DashboardBuilder/Widget/modalComponent/modalheader";
import ModalActions from "@/components/DashboardBuilder/Widget/modalComponent/modalAction";
import TagDataTab from "@/components/DashboardBuilder/Widget/modalComponent/TagDataTap";

type Menu = "property" | "data";

const MENU_LIST: { key: Menu; label: string }[] = [
  { key: "property", label: "⚙️ Property" },
  { key: "data", label: "🔗 Data" },
];

// 🔥 helper HEX → RGBA
const hexToRgba = (hex: string, opacity: number) => {
  if (!hex) return `rgba(34,197,94,${opacity})`;

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default function StatusModal({ widget, onSave, onClose }: any) {
  const [menu, setMenu] = useState<Menu>("property");

  const [local, setLocal] = useState({
    ui: {
      label: "",
      color: "#22c55e",
      bg_color: "#22c55e",
      bg_opacity: 1,
    },
    data: {
      type: "",
      field: "",
      interval: 1000,
    },
  });

  // =========================
  // SYNC DATA
  // =========================
  useEffect(() => {
    if (!widget) return;

    setLocal({
      ui: {
        label: widget.config?.ui?.label || "",
        color: widget.config?.ui?.color || "#22c55e",
        bg_color: widget.config?.ui?.bg_color || "#22c55e",
        bg_opacity: widget.config?.ui?.bg_opacity ?? 1,
      },
      data: {
        type: widget.config?.data?.type || "",
        field: widget.config?.data?.field || "",
        interval: widget.config?.data?.interval || 1000,
      },
    });
  }, [widget]);

  const update = (changes: any) => {
    setLocal((prev) => ({ ...prev, ...changes }));
  };

  return (
    <div className="p-2 bg-white dark:bg-gray-900 rounded w-[600px] h-[500px] shadow-lg flex flex-col">

      {/* HEADER */}
      <ModalHeader title="Number Settings" onClose={onClose} />

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <div className="w-[160px] border-r bg-gray-50 dark:bg-gray-800 p-2">
          {MENU_LIST.map((m) => (
            <button
              key={m.key}
              onClick={() => setMenu(m.key)}
              className={`w-full text-left px-3 py-2 rounded text-sm mb-1 transition ${
                menu === m.key
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-4 overflow-y-auto">

          {/* PROPERTY */}
          {menu === "property" && (
            <>
              {/* LABEL */}
              <div className="mb-3">
                <label className="text-xs">Label</label>
                <input
                  className="border p-1 w-full rounded"
                  value={local.ui.label}
                  onChange={(e) =>
                    update({
                      ui: { ...local.ui, label: e.target.value },
                    })
                  }
                />
              </div>

              {/* VALUE COLOR */}
              <div className="mb-3 flex items-center  gap-2">
                
                <input
                  type="color"
                  value={local.ui.color}
                  onChange={(e) =>
                    update({
                      ui: { ...local.ui, color: e.target.value },
                    })
                  }
                  className="w-10 h-10 border rounded"
                />
                <label className="text-xs">Value Color</label>
              </div>

              {/* BACKGROUND COLOR */}
              <div className="mb-3 flex items-center  gap-2">
                
                <input
                  type="color"
                  value={local.ui.bg_color}
                  onChange={(e) =>
                    update({
                      ui: { ...local.ui, bg_color: e.target.value },
                    })
                  }
                  className="w-10 h-10 border rounded"
                />
                <label className="text-xs">Background Color</label>
              </div>

              {/* TRANSPARENCY */}
              <div className="mb-3">
                <label className="text-xs">
                  Transparency ({Math.round(local.ui.bg_opacity * 100)}%)
                </label>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={local.ui.bg_opacity}
                  onChange={(e) =>
                    update({
                      ui: {
                        ...local.ui,
                        bg_opacity: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full"
                />
              </div>

              {/* 🔥 PREVIEW WIDGET */}
              <div className="mt-4">
                <label className="text-xs mb-1 block">Preview</label>

                <div
                  className="rounded p-4 flex flex-col items-center justify-center"
                  style={{
                    backgroundColor: hexToRgba(
                      local.ui.bg_color,
                      local.ui.bg_opacity
                    ),
                  }}
                >
                  <div className="text-sm text-gray-500 mb-1 uppercase">
                    {local.ui.label || "LABEL"}
                  </div>

                  <div
                    className="font-bold text-3xl"
                    style={{ color: local.ui.color }}
                  >
                    123
                  </div>
                </div>
              </div>
            </>
          )}

          {/* DATA */}
          {menu === "data" && (
            <TagDataTab
              value={local.data}
              onChange={(val) =>
                update({
                  data: val,
                })
              }
            />
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t p-3">
        <ModalActions
          onCancel={onClose}
          onSave={() => {
            onSave(local);
            onClose();
          }}
        />
      </div>
    </div>
  );
}