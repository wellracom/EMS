"use client";

import { useEffect, useRef, useState } from "react";
import { useWSChannelNodered } from "@/hooks/useWSChannelnodered";
export default function ChartWidget({ widget }: any) {
  const ref = useRef<HTMLDivElement>(null);

  const [fontSize, setFontSize] = useState(20);
  const [displayValue, setDisplayValue] = useState(0);

  const [value,setValue] =  useState(0)
 const WS =useWSChannelNodered('tags')
  // =========================
  // 🔥 AUTO SCALE FONT
  // =========================
  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;

      // 🔥 lebih stabil (tidak terlalu besar)
      const size = Math.min(width, height) * 0.4;

      setFontSize(size);
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

 useEffect(() => {
  if (!Array.isArray(WS.data)) return;

  const value_WS =
    WS.data.find(
      (item: any) => item.id === widget.config?.data?.field
    )?.value ?? 0;
    console.log(value_WS)
  setValue(Number(value_WS));
}, [WS.data, widget.config?.data?.id]);

  // =========================
  // 🔥 SMOOTH ANIMATION VALUE
  // =========================
  useEffect(() => {
    let start = displayValue;
    let end = value;

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
  }, [value]);

  // =========================
  // 🔥 COLOR (support future threshold)
  // =========================
  const getColor = () => {
    const thresholds = widget.config?.threshold || [];

    for (let t of thresholds) {
      if (value > t.gt) return t.color;
    }

    return widget.config?.ui?.color || widget.config?.color || "#22c55e";
  };

  return (
    <div
      ref={ref}
      className="w-full h-full flex flex-col items-center justify-center p-2"
    >
      {/* VALUE */}
      <div
        style={{
          fontSize,
          color: getColor(),
        }}
        className="font-bold leading-none text-center"
      >
        {Math.round(displayValue)}
      </div>

      {/* LABEL */}
      <div className="text-xs text-gray-500 mt-1 text-center">
        {widget.config?.ui?.label ||
          widget.config?.label ||
          "Value"}
      </div>
    </div>
  );
}