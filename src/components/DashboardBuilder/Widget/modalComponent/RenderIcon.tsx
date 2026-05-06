"use client";

import * as Icons from "lucide-react";

export default function RenderIcon({ icon }: any) {
  if (!icon) return null;

  // PNG
  if (icon.type === "png" && typeof icon.value === "string") {
    return (
      <img
        src={icon.value}
        className="w-full h-full object-fill"
        alt="icon"
      />
    );
  }

  // React icon
  if (icon.type === "react" && typeof icon.value === "string") {
    const IconComp = (Icons as any)[icon.value];

    if (typeof IconComp === "function") {
      return <IconComp className="w-6 h-6" />;
    }
  }

  // fallback → kosong
  return null;
}