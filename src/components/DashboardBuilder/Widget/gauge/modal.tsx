"use client";

import { useEffect, useState } from "react";
import GaugeComponent from "react-gauge-component";
import ModalHeader from "@/components/DashboardBuilder/Widget/modalComponent/modalheader";
import ModalActions from "@/components/DashboardBuilder/Widget/modalComponent/modalAction";
import TagDataTab from "@/components/DashboardBuilder/Widget/modalComponent/TagDataTap";

type Menu = "property" | "data";

export default function GaugeModal({ widget, onSave, onClose }: any) {
  const [menu, setMenu] = useState<Menu>("property");

  const MENU_LIST: { key: Menu; label: string }[] = [
    { key: "property", label: "⚙️ Property" },
    { key: "data", label: "🔗 Data" },
  ];

  const [local, setLocal] = useState<any>({
    ui: {
      label: "",
      labelColor: "#6b7280",
      valueColor: "#000",
      bg_color: "#ffffff",
      bg_opacity: 1,
    },
    gauge: {
      min: 0,
      max: 100,
      unit: "",
      showUnit: true,
      thickness: 10,
      degree: 220,
      minAngle: -110,
    },
    zones: {
      low: { limit: 0.5, color: "#22c55e" },
      mid: { limit: 0.8, color: "#f59e0b" },
      high: { limit: 1, color: "#ef4444" },
    },
    data: {
      type: "",
      field: "",
      interval: 1000,
    },
  });

  useEffect(() => {
    if (!widget) return;

    setLocal({
      ui: {
        label: widget.config?.ui?.label || "",
        labelColor: widget.config?.ui?.labelColor || "#6b7280",
        valueColor: widget.config?.ui?.valueColor || "#000",
        bg_color: widget.config?.ui?.bg_color || "#ffffff",
        bg_opacity: widget.config?.ui?.bg_opacity ?? 1
      },
      gauge: {
        min: widget.config?.min ?? 0,
        max: widget.config?.max ?? 100,
        unit: widget.config?.unit || "",
        showUnit: widget.config?.showUnit ?? true,
        thickness: widget.config?.thickness ?? 10,
        degree: widget.config?.degree ?? 220,
        minAngle: widget.config?.minAngle ?? -110,
      },
      zones: widget.config?.zones || {
        low: { limit: 0.5, color: "#22c55e" },
        mid: { limit: 0.8, color: "#f59e0b" },
        high: { limit: 1, color: "#ef4444" },
      },
      data: widget.config?.data || {
        type: "",
        field: "",
        interval: 1000,
      },
    });
  }, [widget]);

  const update = (section: string, changes: any) => {
    setLocal((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...changes,
      },
    }));
  };

  // 🔥 SAFETY
  const safeDegree = Math.max(10, local.gauge.degree);
  const safeWidth = Math.max(0.1, local.gauge.thickness / 50);

  return (
    <div className="p-2 bg-white dark:bg-gray-900 rounded w-[700px] h-[620px] flex flex-col">

      <ModalHeader title="Gauge Settings" onClose={onClose} />

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
        <div className="flex-1 p-3 overflow-y-auto">

          {menu === "property" && (
            <>
              {/* LABEL */}
              <label className="text-xs">Label</label>
              <input
                className="border p-1 w-full mb-3"
                value={local.ui.label}
                onChange={(e) =>
                  update("ui", { label: e.target.value })
                }
              />

              {/* COLORS */}
              <div className="flex gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={local.ui.labelColor}
                    onChange={(e) =>
                      update("ui", { labelColor: e.target.value })
                    }
                  />
                  <label className="text-xs">Label</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={local.ui.valueColor}
                    onChange={(e) =>
                      update("ui", { valueColor: e.target.value })
                    }
                  />
                  <label className="text-xs">Value</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={local.ui.bg_color}
                    onChange={(e) =>
                      update("ui", { bg_color: e.target.value })
                    }
                  />
                  <label className="text-xs">BG</label>
                </div>
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
                    update("ui", { bg_opacity: e.target.value })
                  }
                  className="w-full"
                />
              </div>
              {/* MIN MAX */}
               <label >MIN Value</label>
              <input
                type="number"
                value={local.gauge.min}
                onChange={(e) =>
                  update("gauge", { min: Number(e.target.value) })
                }
                className="border p-1 w-full mb-2"
                placeholder="Min"
              />
<label >MAX Value</label>
              <input
                type="number"
                value={local.gauge.max}
                onChange={(e) =>
                  update("gauge", { max: Number(e.target.value) })
                }
                className="border p-1 w-full mb-3"
                placeholder="Max"
              />

              {/* UNIT */}
              <label >Unit</label>
              <input
                value={local.gauge.unit}
                onChange={(e) =>
                  update("gauge", { unit: e.target.value })
                }
                className="border p-1 w-full mb-2"
                placeholder="Unit"
              />

              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={local.gauge.showUnit}
                  onChange={(e) =>
                    update("gauge", { showUnit: e.target.checked })
                  }
                />
                Show Unit
              </label>

              {/* DEGREE */}
                <label >Min Degree</label>
              <input
                type="number"
                value={local.gauge.degree}
                onChange={(e) =>
                  update("gauge", { degree: Number(e.target.value) })
                }
                className="border p-1 w-full mb-2"
                placeholder="Degree"
              />
<label >Max Degree</label>
              <input
                type="number"
                value={local.gauge.minAngle}
                onChange={(e) =>
                  update("gauge", { minAngle: Number(e.target.value) })
                }
                className="border p-1 w-full mb-3"
                placeholder="Min Angle"
              />

              {/* THICKNESS */}
              <label className="text-xs">
                Thickness ({local.gauge.thickness})
              </label>
              <input
                type="range"
                min="5"
                max="30"
                value={local.gauge.thickness}
                onChange={(e) =>
                  update("gauge", {
                    thickness: Number(e.target.value),
                  })
                }
                className="w-full mb-3"
              />

              {/* ZONES */}
              <div className="mt-2">
                <p className="text-xs mb-1">Zones</p>

                {["low", "mid", "high"].map((z) => (
                  <div key={z} className="flex gap-2 mb-2 items-center">
                    <input
                      type="number"
                      step="0.1"
                      value={local.zones[z].limit}
                      onChange={(e) =>
                        setLocal((prev: any) => ({
                          ...prev,
                          zones: {
                            ...prev.zones,
                            [z]: {
                              ...prev.zones[z],
                              limit: Number(e.target.value),
                            },
                          },
                        }))
                      }
                      className="border p-1 w-[80px]"
                    />
                    <input
                      type="color"
                      value={local.zones[z].color}
                      onChange={(e) =>
                        setLocal((prev: any) => ({
                          ...prev,
                          zones: {
                            ...prev.zones,
                            [z]: {
                              ...prev.zones[z],
                              color: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                    <span className="text-xs uppercase w-[40px]">{z}</span>
                  </div>
                ))}
              </div>

              {/* 🔥 PREVIEW FIXED */}
              <div
                className="mt-4 p-3 rounded flex flex-col items-center"
                style={{
                  background: local.ui.bg_color,
                  height: "260px",
                }}
              >
                <div
                  className="text-sm mb-2"
                  style={{ color: local.ui.labelColor }}
                >
                  {local.ui.label || "Preview"}
                </div>

                <div className="w-full h-[180px]">
                  <GaugeComponent
                    value={70}
                    minValue={local.gauge.min}
                    maxValue={local.gauge.max}
                    arc={
                      ({
                        startAngle: local.gauge.minAngle,
                        endAngle:
                          local.gauge.minAngle + safeDegree,
                        subArcs: [
                          {
                            limit:
                              local.zones.low.limit *
                              local.gauge.max,
                            color: local.zones.low.color,
                          },
                          {
                            limit:
                              local.zones.mid.limit *
                              local.gauge.max,
                            color: local.zones.mid.color,
                          },
                          {
                            limit:
                              local.zones.high.limit *
                              local.gauge.max,
                            color: local.zones.high.color,
                          },
                        ],
                        width: safeWidth,
                      } as any)
                    }
                    labels={{
                      valueLabel: {
                        style: {
                          fill: local.ui.valueColor,
                        },
                        formatTextValue: (val: number) =>
                          local.gauge.showUnit
                            ? `${Math.round(val)} ${local.gauge.unit}`
                            : `${Math.round(val)}`,
                      },
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {menu === "data" && (
            <TagDataTab
              value={local.data}
              onChange={(val) => update("data", val)}
            />
          )}
        </div>
      </div>

      <div className="border-t p-2">
        <ModalActions
          onCancel={onClose}
          onSave={() => {
            onSave({
              ui: local.ui,
              data: local.data,
              min: local.gauge.min,
              max: local.gauge.max,
              unit: local.gauge.unit,
              showUnit: local.gauge.showUnit,
              thickness: local.gauge.thickness,
              degree: local.gauge.degree,
              minAngle: local.gauge.minAngle,
              zones: local.zones,
            });
            onClose();
          }}
        />
      </div>
    </div>
  );
}