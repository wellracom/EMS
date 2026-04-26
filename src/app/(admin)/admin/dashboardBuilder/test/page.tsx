"use client";

import { DndContext } from "@dnd-kit/core";
import { useMemo, useState } from "react";

import Sidebar from "@/components/DashboardBuilder/SideBar";
import Canvas from "@/components/DashboardBuilder/Canvas";
import WidgetSettingModal from "@/components/DashboardBuilder/WidgetSettingModal";

import { widgetRegistry } from "@/components/DashboardBuilder/widgetRegistry";
import type { Widget, Page } from "@/components/DashboardBuilder/type/dashboardbuildet";

const DEFAULT_SIZE = { w: 2, h: 2 };

export default function BuilderPage() {
  const [pages, setPages] = useState<Page[]>([
    {
      id: "p1",
      name: "Page 1",
      widgets: [],
    },
  ]);

  const [activePage, setActivePage] = useState("p1");
  const [preview, setPreview] = useState<any>(null);
  const [ghost, setGhost] = useState<any>(null);
  const [dragStart, setDragStart] = useState<any>(null);

  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);

  const currentPage = useMemo(
    () => pages.find((p) => p.id === activePage),
    [pages, activePage]
  );

  // =========================
  // UPDATE WIDGET
  // =========================
  const updateWidget = (id: string, changes: Partial<Widget>) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id !== activePage
          ? p
          : {
              ...p,
              widgets: p.widgets.map((w) =>
                w.id === id ? { ...w, ...changes } : w
              ),
            }
      )
    );
  };

  // =========================
  // SAVE CONFIG
  // =========================
  const saveConfig = (changes: any) => {
    if (!selectedWidget) return;

    updateWidget(selectedWidget.id, {
      config: {
        ...selectedWidget.config,
        ...changes,
      },
    });
  };

  // =========================
  // GRID CALC
  // =========================
  const getGrid = (e: any) => {
    const rect = document
      .getElementById("canvas-area")
      ?.getBoundingClientRect();

    if (!rect || !dragStart) return null;

    const colWidth = rect.width / 12;

    const x = dragStart.x + e.delta.x;
    const y = dragStart.y + e.delta.y;

    return {
      x: Math.max(0, Math.floor((x - rect.left) / colWidth)),
      y: Math.max(0, Math.floor((y - rect.top) / 80)),
      ...DEFAULT_SIZE,
    };
  };

  // =========================
  // ADD WIDGET (DYNAMIC STRING)
  // =========================
  const addWidget = (type: string, pos: any) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id !== activePage
          ? p
          : {
              ...p,
              widgets: [
                ...p.widgets,
                {
                  id: Date.now().toString(),
                  type, // 🔥 STRING PLUGIN SYSTEM
                  x: pos.x,
                  y: pos.y,
                  w: pos.w,
                  h: pos.h,
                  config: {},
                },
              ],
            }
      )
    );
  };
const deleteWidget = (id: string) => {
  setPages((prev) =>
    prev.map((p) =>
      p.id !== activePage
        ? p
        : {
            ...p,
            widgets: p.widgets.filter((w) => w.id !== id),
          }
    )
  );
};
  // =========================
  // MODAL RESOLVE
  // =========================
const Modal = selectedWidget
  ? widgetRegistry[selectedWidget.type]?.modal
  : null;
 const openSetting = (w: Widget) => {
  console.log("🔥 OPEN MODAL TRIGGERED:", w.type, w.id);
  setSelectedWidget({ ...w }); // force re-render
};

  return (
    <>
      <DndContext
        onDragStart={(e) => {
          if (!(e.activatorEvent instanceof MouseEvent)) return;

          setDragStart({
            x: e.activatorEvent.clientX,
            y: e.activatorEvent.clientY,
          });

          setGhost({
            type: e.active.id,
            x: e.activatorEvent.clientX,
            y: e.activatorEvent.clientY,
          });
        }}
        onDragMove={(e) => {
          const rect = document
            .getElementById("canvas-area")
            ?.getBoundingClientRect();

          if (!rect || !dragStart) return;

          setGhost({
            type: e.active.id,
            x: dragStart.x + e.delta.x,
            y: dragStart.y + e.delta.y,
          });

          const pos = getGrid(e);
          if (pos) setPreview(pos);
        }}
        onDragEnd={(e) => {
          if (e.over?.id === "canvas" && preview) {
            addWidget(String(e.active.id), preview);
          }

          setPreview(null);
          setGhost(null);
          setDragStart(null);
        }}
      >
      <div className="h-screen flex flex-col">

  {/* 🔥 TOP TOOLBAR */}
  <Sidebar
    pages={pages}
    activePage={activePage}
    setActivePage={setActivePage}
    addPage={() => {
      const newPage: Page = {
        id: Date.now().toString(),
        name: `Page ${pages.length + 1}`,
        widgets: [],
      };

      setPages([...pages, newPage]);
      setActivePage(newPage.id);
    }}
  />

  {/* 🔥 CANVAS AREA */}
  <div id="canvas-area" className="flex-1 relative overflow-hidden">

    <Canvas
      widgets={currentPage?.widgets || []}
      preview={preview}
      updateWidget={updateWidget}
      onOpenSetting={openSetting}
      onDelete={deleteWidget}
    />

    {/* 🔥 GHOST PREVIEW */}
    {ghost && (
      <div className="fixed pointer-events-none bg-blue-500 text-white px-2 py-1 rounded opacity-80">
        {ghost.type}
      </div>
    )}

  </div>
</div>
      </DndContext>

      {/* MODAL */}
      {selectedWidget && Modal ? (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
    <Modal
      widget={selectedWidget}
      onClose={() => setSelectedWidget(null)}
      onSave={saveConfig}

    
    />
  </div>
) : null}
    </>
  );
}