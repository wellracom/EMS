"use client";

import { useDroppable } from "@dnd-kit/core";
import { useRef } from "react";
import { FiSettings } from "react-icons/fi";
import { TbArrowsDiagonal } from "react-icons/tb";

import { widgetRegistry } from "@/components/DashboardBuilder/widgetRegistry";
import type { Widget } from "./type/dashboardbuildet";

type Props = {
  widgets: Widget[];
  preview: any;
  updateWidget: (id: string, changes: Partial<Widget>) => void;
  onOpenSetting: (w: Widget) => void;
  onDelete?: (id: string) => void;
};

export default function Canvas({
  widgets,
  preview,
  updateWidget,
  onOpenSetting,
  onDelete,
}: Props) {
  const { setNodeRef } = useDroppable({ id: "canvas" });

  const drag = useRef<any>(null);

  // =========================
  // GRID REFERENCE
  // =========================
  const getRect = () => {
    const el = document.getElementById("canvas-area");
    if (!el) return null;
    return el.getBoundingClientRect();
  };

  // =========================
  // COLLISION DETECTOR
  // =========================
  const isOverlap = (a: any, b: any) => {
    return !(
      a.x + a.w <= b.x ||
      a.x >= b.x + b.w ||
      a.y + a.h <= b.y ||
      a.y >= b.y + b.h
    );
  };

  const hasCollision = (target: any, ignoreId?: string) => {
    return widgets.some((w) => {
      if (w.id === ignoreId) return false;
      return isOverlap(w, target);
    });
  };

  // =========================
  // DRAG START
  // =========================
  const startDrag = (type: string, w: Widget, e: any) => {
    const rect = getRect();
    if (!rect) return;

    drag.current = {
      type,
      id: w.id,
      sx: e.clientX,
      sy: e.clientY,
      x: w.x,
      y: w.y,
      w: w.w,
      h: w.h,
      cw: rect.width / 12,
      rh: 80,
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
  };

  // =========================
  // MOVE / RESIZE (ANTI OVERLAP)
  // =========================
  const move = (e: MouseEvent) => {
    const d = drag.current;
    if (!d) return;

    const dx = Math.round((e.clientX - d.sx) / d.cw);
    const dy = Math.round((e.clientY - d.sy) / d.rh);

    // ================= MOVE =================
    if (d.type === "move") {
      const next = {
        id: d.id,
        x: Math.max(0, d.x + dx),
        y: Math.max(0, d.y + dy),
        w: d.w,
        h: d.h,
      };

      if (!hasCollision(next, d.id)) {
        updateWidget(d.id, {
          x: next.x,
          y: next.y,
        });
      }
    }

    // ================= RESIZE =================
    if (d.type === "resize") {
      const next = {
        id: d.id,
        x: d.x,
        y: d.y,
        w: Math.max(1, d.w + dx),
        h: Math.max(1, d.h + dy),
      };

      if (!hasCollision(next, d.id)) {
        updateWidget(d.id, {
          w: next.w,
          h: next.h,
        });
      }
    }
  };

  // =========================
  // STOP DRAG
  // =========================
  const stop = () => {
    drag.current = null;
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", stop);
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div
      ref={setNodeRef}
      className="grid grid-cols-12 auto-rows-[80px] gap-2 p-3 h-full"
    >
      {widgets.map((w: Widget) => {
        const Comp = widgetRegistry[w.type]?.view;

        if (!Comp) {
          return (
            <div
              key={w.id}
              className="bg-red-100 text-red-600 p-2 rounded"
            >
              Unknown widget: {w.type}
            </div>
          );
        }

        return (
          <div
            key={w.id}
            className="relative bg-white dark:bg-gray-800 border rounded group overflow-hidden"
            style={{
              gridColumn: `${w.x + 1} / span ${w.w}`,
              gridRow: `${w.y + 1} / span ${w.h}`,
            }}
          >
            {/* ================= TOOLBAR ================= */}
            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 z-20">

              {/* SETTINGS */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSetting(w);
                }}
                className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                <FiSettings size={14} />
              </button>

              {/* DELETE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(w.id);
                }}
                className="p-1 bg-red-600 text-white rounded hover:bg-red-500"
              >
                🗑
              </button>

              {/* MOVE */}
              <button
                onMouseDown={(e) => {
                  e.stopPropagation();
                  startDrag("move", w, e);
                }}
                className="p-1 bg-blue-600 text-white rounded cursor-move"
              >
                ⠿
              </button>

            </div>

            {/* ================= CONTENT ================= */}
            <div className="w-full h-full p-2">
              <Comp widget={w} />
            </div>

            {/* ================= RESIZE ================= */}
            <div
              className="absolute bottom-1 right-1 cursor-se-resize text-gray-400 hover:text-blue-500"
              onMouseDown={(e) => startDrag("resize", w, e)}
            >
              <TbArrowsDiagonal />
            </div>
          </div>
        );
      })}

      {/* ================= PREVIEW ================= */}
      {preview && (
        <div
          className="border-2 border-dashed border-blue-400 bg-blue-200/30"
          style={{
            gridColumn: `${preview.x + 1} / span ${preview.w}`,
            gridRow: `${preview.y + 1} / span ${preview.h}`,
          }}
        />
      )}
    </div>
  );
}