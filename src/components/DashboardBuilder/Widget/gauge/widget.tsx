"use client";

import GaugeComponent from "react-gauge-component";
import { useEffect, useState ,useRef } from "react";
import { useWS_V1 } from "@/hooks/WS/useWSNodered";

export default function GaugeWidget({ widget }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  const WS = useWS_V1("tags");
  const [numericValue, setNumericValue] = useState(0); // angka asli
  const config = widget.config || {};

  const min = config.min ?? 0;
  const max = config.max ?? 100;
  const unit = config.unit || "";
  const showUnit = config.showUnit ?? true;

  const zones = config.zones || {
    low: { limit: 0.5, color: "#22c55e" },
    mid: { limit: 0.8, color: "#f59e0b" },
    high: { limit: 1, color: "#ef4444" },
  };
const hexToRgba = (hex: string, opacity: number) => {
    if (!hex) return `rgba(34,197,94,${opacity})`;

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
   const getColo_bg = () => {
    const thresholds = widget.config?.threshold || [];

    for (let t of thresholds) {
      if (numericValue > t.gt) {
        return hexToRgba(
          t.bg_color || "#22c55e",
          t.bg_opacity ?? 1
        );
      }
    }

    const color =
      widget.config?.ui?.bg_color ||
      widget.config?.bg_color ||
      "#22c55e";

    const opacity =
      widget.config?.ui?.bg_opacity ?? 1;

    return hexToRgba(color, opacity);
  };
  const degree = config.degree ?? 220;
  const minAngle = config.minAngle ?? -110;

  useEffect(() => {
    if (!Array.isArray(WS.data)) return;

    const val =
      WS.data.find(
        (item: any) => item.id === config?.data?.field
      )?.value ?? 0;

    const num = Number(val);
    setValue(isNaN(num) ? 0 : num);
  }, [WS.data, config?.data?.field]);

  return (
   <div
      ref={ref}
      style={{
        backgroundColor: getColo_bg(),
      }}
      className="w-full h-full flex flex-col p-2 rounded"
    >
       
      {/* LABEL */}
      <div
        className="text-sm mb-1 uppercase"
        style={{ color: config.ui?.labelColor || "#6b7280" }}
      >
        {config.ui?.label || ""}
      </div>

      <GaugeComponent
        value={value}
        minValue={min}
        maxValue={max}
        type="grafana"
       arc={
  {
    startAngle: minAngle,
    endAngle: minAngle + degree,
    subArcs: [
      { limit: zones.low.limit * max, color: zones.low.color },
      { limit: zones.mid.limit * max, color: zones.mid.color },
      { limit: zones.high.limit * max, color: zones.high.color },
    ],
    padding: 0.02,
    width: (config.thickness ?? 10) / 50,
  } as any
}
        pointer={{
          type: "needle",
          elastic: true,
        }}
        labels={{
          valueLabel: {
            style: {
              fill: config.ui?.valueColor || "#000",
            },
            formatTextValue: (val: number) =>
              showUnit
                ? `${Math.round(val)} ${unit}`
                : `${Math.round(val)}`,
          },
        }}
      />
    </div>
  );
}