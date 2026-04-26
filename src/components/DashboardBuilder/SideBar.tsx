"use client";

import ToolItem from "./ToolItem";
import { widgetTools } from "@/lib/DashboardBuilder/widgetTools";

type SidebarProps = {
  pages?: any[];
  activePage?: string;
  setActivePage?: (id: string) => void;
  addPage?: () => void;
};

export default function Sidebar({
  pages = [],
  activePage,
  setActivePage,
  addPage,
}: SidebarProps) {
  const safePages = Array.isArray(pages) ? pages : [];

  return (
    <div className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">

      {/* ===== TOP TOOLBAR WRAPPER ===== */}
      <div className="flex items-center gap-4 px-3 py-2 overflow-x-auto">

        {/* ===== WIDGET TOOLS ===== */}
        <div className="flex items-center gap-2">
          {widgetTools.map((tool) => (
            <ToolItem key={tool.type} tool={tool} />
          ))}
        </div>

        {/* DIVIDER */}
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />

        {/* ===== PAGES ===== */}
        <div className="flex items-center gap-2">
          {safePages.length === 0 ? (
            <span className="text-xs text-gray-400">No pages</span>
          ) : (
            safePages.map((p: any) => (
              <button
                key={p.id}
                onClick={() => setActivePage?.(p.id)}
                className={`
                  px-3 py-1 rounded text-sm whitespace-nowrap transition
                  ${
                    p.id === activePage
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }
                `}
              >
                {p.name}
              </button>
            ))
          )}
        </div>

        {/* ADD PAGE */}
        <button
          onClick={() => addPage?.()}
          className="
            px-3 py-1 rounded text-sm
            bg-gray-100 hover:bg-gray-200
            dark:bg-gray-800 dark:hover:bg-gray-700
            text-gray-800 dark:text-gray-200
            transition
          "
        >
          + Add Page
        </button>
      </div>
    </div>
  );
}