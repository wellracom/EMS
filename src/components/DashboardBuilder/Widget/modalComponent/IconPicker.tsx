"use client";

import { useMemo, useState } from "react";
import { icons } from "lucide-react";

type Props = {
  value?: string;
  onChange: (name: string) => void;
};

export default function IconPicker({ value, onChange }: Props) {
  const [search, setSearch] = useState("");

  const safeValue = typeof value === "string" ? value : "";

  const iconNames = useMemo(() => {
    return (Object.keys(icons) as Array<keyof typeof icons>)
      .filter((name) =>
        name.toLowerCase().includes(search.toLowerCase())
      );
  }, [search]);

  return (
    <div className="border rounded p-2 space-y-2">

      <input
        className="border p-1 w-full text-sm"
        placeholder="Search icon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-auto">
        {iconNames.slice(0, 120).map((name) => {
          const Icon = icons[name];

          if (!Icon) return null;

          return (
            <div
              key={name}
              onClick={() => onChange(name)}
              className={`p-2 border rounded cursor-pointer hover:bg-gray-100 ${
                safeValue === name
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
          );
        })}
      </div>
    </div>
  );
}