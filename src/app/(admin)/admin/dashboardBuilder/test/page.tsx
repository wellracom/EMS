"use client";

import { DndContext } from "@dnd-kit/core";
import { useMemo, useState, useRef } from "react";

import Sidebar from "@/components/DashboardBuilder/SideBar";
import Canvas from "@/components/DashboardBuilder/Canvas";
import { widgetRegistry } from "@/components/DashboardBuilder/widgetRegistry";

import type { Widget } from "@/components/DashboardBuilder/type/dashboardbuildet";
import { useDashboard } from "@/hooks/useDashboard";

const DEFAULT_SIZE = { w: 2, h: 2 };

export default function BuilderPage() {
  const { pages, setPages, addPage } = useDashboard();

  const [activePage, setActivePage] = useState<string>();
  const [preview, setPreview] = useState<any>(null);
  const [ghost, setGhost] = useState<any>(null);
  const [dragStart, setDragStart] = useState<any>(null);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);

  // 🔥 debounce storage
  const updateTimeout = useRef<Record<string, any>>({});
  const pendingChanges = useRef<Record<string, any>>({});

  const currentPage = useMemo(
    () => pages.find((p) => p.id === activePage),
    [pages, activePage]
  );

  // =========================
  // UPDATE WIDGET (DEBOUNCE)
  // =========================
  const updateWidget = (id: string, changes: Partial<Widget>) => {
    // ✅ update UI langsung
    setPages((prev) =>
      prev.map((p) =>
        p.id !== activePage
          ? p
          : {
              ...p,
              widgets: p.widgets.map((w: any) =>
                w.id === id ? { ...w, ...changes } : w
              ),
            }
      )
    );

    // 🔥 gabungkan perubahan
    pendingChanges.current[id] = {
      ...pendingChanges.current[id],
      ...changes,
    };

    // clear timer lama
    if (updateTimeout.current[id]) {
      clearTimeout(updateTimeout.current[id]);
    }

    // debounce kirim ke API
    updateTimeout.current[id] = setTimeout(async () => {
      try {
        await fetch(`/api_local/admin/dashboardBuilder/widget/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pendingChanges.current[id]),
        });

        // clear setelah sukses
        delete pendingChanges.current[id];
      } catch (err) {
        console.error("Update widget error:", err);
      }
    }, 500); // ⏱️ delay 500ms
  };

  // =========================
  // ADD WIDGET
  // =========================
  const addWidget = async (type: string, pos: any) => {
    const res = await fetch("/api_local/admin/dashboardBuilder/widget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dashboardId: activePage,
        type,
        ...pos,
        config: {},
      }),
    });

    const newWidget = await res.json();

    setPages((prev) =>
      prev.map((p) =>
        p.id !== activePage
          ? p
          : {
              ...p,
              widgets: [...p.widgets, newWidget],
            }
      )
    );
  };

  // =========================
  // DELETE WIDGET
  // =========================
  const deleteWidget = async (id: string) => {
    await fetch(`/api_local/admin/dashboardBuilder/widget/${id}`, {
      method: "DELETE",
    });

    setPages((prev) =>
      prev.map((p) =>
        p.id !== activePage
          ? p
          : {
              ...p,
              widgets: p.widgets.filter((w: any) => w.id !== id),
            }
      )
    );
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

  const Modal = selectedWidget
    ? widgetRegistry[selectedWidget.type]?.modal
    : null;

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
          if (e.over?.id === "canvas" && preview && activePage) {
            addWidget(String(e.active.id), preview);
          }

          setPreview(null);
          setGhost(null);
          setDragStart(null);
        }}
      >
        <div className="h-screen flex flex-col">

          {/* SIDEBAR */}
          <Sidebar
            pages={pages}
            activePage={activePage}
            setActivePage={setActivePage}
            addPage={async () => {
              const newPage = await addPage();
              setActivePage(newPage.id);
            }}
          />

          {/* CANVAS */}
          <div id="canvas-area" className="flex-1 relative overflow-hidden">

            <Canvas
              widgets={currentPage?.widgets || []}
              preview={preview}
              updateWidget={updateWidget}
              onOpenSetting={(w) => setSelectedWidget({ ...w })}
              onDelete={deleteWidget}
            />

            {/* GHOST */}
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
            onSave={(changes: any) => {
              updateWidget(selectedWidget.id, {
                config: {
                  ...selectedWidget.config,
                  ...changes,
                },
              });
            }}
          />
        </div>
      ) : null}
    </>
  );
}