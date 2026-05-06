"use client";

import { useEffect, useState } from "react";
import ModalHeader from "@/components/DashboardBuilder/Widget/modalComponent/modalheader";
import ModalActions from "@/components/DashboardBuilder/Widget/modalComponent/modalAction";
import IconPicker from "../modalComponent/IconPicker";
import RenderIcon from "../modalComponent/RenderIcon";
import TagDataTab from "@/components/DashboardBuilder/Widget/modalComponent/TagDataTap";

const hexToRgba = (hex: string, opacity: number) => {
  if (!hex || hex.length < 7) return `rgba(0,0,0,${opacity})`;

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r},${g},${b},${opacity})`;
};

export default function ButtonModal({ widget, onSave, onClose }: any) {
  type Menu = "property" | "data";
const MENU_LIST: { key: Menu; label: string }[] = [
  { key: "property", label: "⚙️ Property" },
  { key: "data", label: "🔗 Data" },
];
  const defaultUI = {
    label_on: "ON",
    label_off: "OFF",

    color_on: "#22c55e",
    color_off: "#ef4444",

    bg_on: "#22c55e",
    bg_off: "#ef4444",

    icon_on: null,
    icon_off: null,

    bg_opacity: 1,
  };
 const [menu, setMenu] = useState<Menu>("property");

  const [local, setLocal] = useState<any>({
    ui: defaultUI,
    state: false,
  });

  useEffect(() => {
    if (!widget) return;

    setLocal({
      ui: { ...defaultUI, ...widget.config?.ui },
      state: widget.config?.state ?? false,
    });
  }, [widget]);

  const update = (patch: any) => {
    setLocal((prev: any) => ({ ...prev, ...patch }));
  };

  const upload = (key: "icon_on" | "icon_off", file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      update({
        ui: {
          ...local.ui,
          [key]: { type: "png", value: reader.result },
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const Preview = ({ state }: any) => {
    const ui = local.ui;

    const label = state ? ui.label_on : ui.label_off;
    const color = state ? ui.color_on : ui.color_off;
    const bg = state ? ui.bg_on : ui.bg_off;
    const icon = state ? ui.icon_on : ui.icon_off;

    return (
      <div
        className="p-4 rounded flex flex-col items-center"
        style={{
          backgroundColor: hexToRgba(bg, ui.bg_opacity),
        }}
      >
        <RenderIcon icon={icon} />

        <div style={{ color }} className="font-bold text-lg">
          {label}
        </div>
      </div>
    );
  };

  return (
    <div className="w-[600px] h-[650px] flex flex-col bg-white dark:bg-gray-900 rounded shadow-lg">

      <ModalHeader title="Button Widget" onClose={onClose} />
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
 {menu === "property" && (
      <div className="flex-1 overflow-auto p-4 space-y-4">

        {/* ON */}
        <div className="border p-3 rounded space-y-2">
          <b>ON STATE</b>

          <input
            className="border p-1 w-full"
            value={local.ui.label_on}
            onChange={(e) =>
              update({ ui: { ...local.ui, label_on: e.target.value } })
            }
          />

          <input
            type="color"
            value={local.ui.color_on}
            onChange={(e) =>
              update({ ui: { ...local.ui, color_on: e.target.value } })
            }
          />

          <input
            type="color"
            value={local.ui.bg_on}
            onChange={(e) =>
              update({ ui: { ...local.ui, bg_on: e.target.value } })
            }
          />

          <IconPicker
            value={local.ui.icon_on?.value || ""}
            onChange={(name: string) =>
              update({
                ui: {
                  ...local.ui,
                  icon_on: { type: "react", value: name },
                },
              })
            }
          />

          <input
            type="file"
            onChange={(e) =>
              e.target.files && upload("icon_on", e.target.files[0])
            }
          />

          <button
            onClick={() =>
              update({ ui: { ...local.ui, icon_on: null } })
            }
            className="text-xs text-red-500"
          >
            Remove Icon
          </button>
        </div>

        {/* OFF */}
        <div className="border p-3 rounded space-y-2">
          <b>OFF STATE</b>

          <input
            className="border p-1 w-full"
            value={local.ui.label_off}
            onChange={(e) =>
              update({ ui: { ...local.ui, label_off: e.target.value } })
            }
          />

          <input
            type="color"
            value={local.ui.color_off}
            onChange={(e) =>
              update({ ui: { ...local.ui, color_off: e.target.value } })
            }
          />

          <input
            type="color"
            value={local.ui.bg_off}
            onChange={(e) =>
              update({ ui: { ...local.ui, bg_off: e.target.value } })
            }
          />

          <IconPicker
            value={local.ui.icon_off?.value || ""}
            onChange={(name: string) =>
              update({
                ui: {
                  ...local.ui,
                  icon_off: { type: "react", value: name },
                },
              })
            }
          />

          <input
            type="file"
            onChange={(e) =>
              e.target.files && upload("icon_off", e.target.files[0])
            }
          />

          <button
            onClick={() =>
              update({ ui: { ...local.ui, icon_off: null } })
            }
            className="text-xs text-red-500"
          >
            Remove Icon
          </button>
        </div>

        {/* OPACITY */}
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
        />

        {/* 🔥 PREVIEW */}
        <div className="grid grid-cols-2 gap-2">
          <Preview state={true} />
          <Preview state={false} />
        </div>

{/* DATA */}
                

</div>

 )}
 {menu === "data" && (
  <div className="flex-1 overflow-auto p-4 space-y-4">
                  <TagDataTab
                    value={local.data}
                    onChange={(val) =>
                      update({
                        data: val,
                      })
                    }
                  />
                  </div>
                )}

              
      </div>

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