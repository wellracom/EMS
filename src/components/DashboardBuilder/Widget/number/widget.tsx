"use client";

import { useEffect, useRef, useState } from "react";
import { useWS_V1 } from "@/hooks/WS/useWSNodered";

export default function ChartWidget({ widget }: any) {
  const ref = useRef<HTMLDivElement>(null);

  const [fontSize, setFontSize] = useState(20);

  const [displayValue, setDisplayValue] = useState(0); // animasi
  const [numericValue, setNumericValue] = useState(0); // angka asli
  const [rawValue, setRawValue] = useState<string>(""); // string asli

  const WS = useWS_V1("tags");

  // =========================
  // HEX → RGBA
  // =========================
  const hexToRgba = (hex: string, opacity: number) => {
    if (!hex) return `rgba(34,197,94,${opacity})`;

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // =========================
  // AUTO SCALE FONT
  // =========================
  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setFontSize(Math.min(width, height) * 0.4);
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // =========================
  // GET VALUE FROM WS
  // =========================
  useEffect(() => {
    if (!Array.isArray(WS.data)) return;

    const val =
      WS.data.find(
        (item: any) => item.id === widget.config?.data?.field
      )?.value ?? "-";

    setRawValue(String(val));

    const num = Number(val);
    setNumericValue(isNaN(num) ? 0 : num);
  }, [WS.data, widget.config?.data?.field]);

  // =========================
  // SMOOTH ANIMATION (ONLY NUMBER)
  // =========================
  useEffect(() => {
    let start = displayValue;
    let end = numericValue;

    if (isNaN(end)) return;

    const diff = end - start;
    const step = diff / 10;

    const interval = setInterval(() => {
      start += step;

      if (Math.abs(end - start) < 0.5) {
        setDisplayValue(end);
        clearInterval(interval);
      } else {
        setDisplayValue(start);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [numericValue]);

  // =========================
  // VALUE COLOR
  // =========================
  const getColor = () => {
    const thresholds = widget.config?.threshold || [];

    for (let t of thresholds) {
      if (numericValue > t.gt) return t.color;
    }

    return (
      widget.config?.ui?.color ||
      widget.config?.color ||
      "#22c55e"
    );
  };

  // =========================
  // BG COLOR + OPACITY
  // =========================
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

  // =========================
  // DISPLAY LOGIC
  // =========================
  const isNumber = !isNaN(Number(rawValue));

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: getColo_bg(),
      }}
      className="w-full h-full flex flex-col p-2 rounded"
    >
   
      {/* HEADER */}
      <div className="text-xl text-gray-700 text-center mb-1 uppercase tracking-wide">
        {widget.config?.ui?.label ||
          widget.config?.label ||
          ""}
      </div>

      {/* VALUE */}
      <div className="flex-1 flex items-center justify-center">
        <div
          style={{
            fontSize,
            color: getColor(),
          }}
          className="font-bold leading-none"
        >
          {isNumber
            ? Math.round(displayValue) // animasi angka
            : rawValue}               {/* string langsung */}
        </div>
      </div>
    </div>
  );
}