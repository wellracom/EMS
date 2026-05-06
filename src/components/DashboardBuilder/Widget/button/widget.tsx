"use client";

import { useState } from "react";
import RenderIcon from "../modalComponent/RenderIcon";

const hexToRgba = (hex: string, opacity: number) => {
  if (!hex || hex.length < 7) return `rgba(0,0,0,${opacity})`;

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r},${g},${b},${opacity})`;
};

export default function ButtonWidget({ widget }: any) {
  const [state, setState] = useState(
    widget.config?.state ?? false
  );

  const ui = widget.config?.ui || {};

  const label = state ? ui.label_on : ui.label_off;
  const color = state ? ui.color_on : ui.color_off;
  const bg = state ? ui.bg_on : ui.bg_off;
  const icon = state ? ui.icon_on : ui.icon_off;

  return (
    <div
      onClick={() => setState(!state)}
      className="w-full h-full flex flex-col items-center justify-center rounded cursor-pointer"
      style={{
        backgroundColor: hexToRgba(bg, ui.bg_opacity ?? 1),
      }}
    >
      <RenderIcon icon={icon} />

      <div style={{ color }} className="font-bold text-lg">
        {label}
      </div>
    </div>
  );
}