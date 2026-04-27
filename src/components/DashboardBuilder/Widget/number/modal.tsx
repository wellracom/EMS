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

export default function StatusModal({ widget, onSave, onClose }: any) {
  const [menu, setMenu] = useState<Menu>("property");

  const [local, setLocal] = useState({
    ui: {
      label: "",
      color: "#22c55e",
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
      },
      data: {
        type: widget.config?.data?.type || "",
        field: widget.config?.data?.field || "",
        interval: widget.config?.data?.interval || 1000,
      },
    });
  }, [widget]);

  // =========================
  // UPDATE LOCAL
  // =========================
  const update = (changes: any) => {
    setLocal((prev) => ({ ...prev, ...changes }));
  };

  return (
    <div className="p-2 bg-white dark:bg-gray-900 rounded w-[600px] h-[400px] shadow-lg flex flex-col">

      {/* HEADER */}
      <ModalHeader title="Number Settings" onClose={onClose} />

      {/* =========================
          BODY
      ========================= */}
      <div className="flex flex-1 overflow-hidden">

        {/* 🔥 SIDEBAR KIRI */}
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

        {/* 🔥 CONTENT KANAN */}
        <div className="flex-1 p-4 overflow-y-auto">

          {/* =========================
              PROPERTY
          ========================= */}
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

              {/* COLOR */}
              <div className="mb-3">
                <label className="text-xs">Color</label>

                <div className="flex items-center gap-2">
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

                  <input
                    className="border p-1 w-full rounded"
                    value={local.ui.color}
                    onChange={(e) =>
                      update({
                        ui: { ...local.ui, color: e.target.value },
                      })
                    }
                  />
                </div>

                <div
                  className="mt-2 p-2 rounded text-center font-bold"
                  style={{
                    backgroundColor: local.ui.color,
                    color: "#fff",
                  }}
                >
                  Preview
                </div>
              </div>
            </>
          )}

          {/* =========================
              DATA
          ========================= */}
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