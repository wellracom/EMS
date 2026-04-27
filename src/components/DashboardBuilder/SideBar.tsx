"use client";

import ToolItem from "./ToolItem";
import { widgetTools } from "@/lib/DashboardBuilder/widgetTools";

import {
  FiPlus,
  FiFile,
  FiTool,
  FiCircle,
} from "react-icons/fi";

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

      <div className="flex items-center justify-between px-3 py-2 overflow-x-auto">

        {/* ===== LEFT: TOOLS ===== */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mr-2">
            <FiTool size={14} />
            <span className="text-xs">Tools</span>
          </div>

          {widgetTools.map((tool) => (
            <ToolItem key={tool.type} tool={tool} />
          ))}
        </div>

        {/* ===== RIGHT: PAGES ===== */}
        <div className="flex items-center gap-2 ml-auto">

          {safePages.length === 0 ? (
            <span className="text-xs text-gray-400">No pages</span>
          ) : (
            safePages.map((p: any) => (
              <button
                key={p.id}
                onClick={() => setActivePage?.(p.id)}
                className={`
                  flex items-center gap-1 px-3 py-1 rounded-md text-sm whitespace-nowrap transition
                  border
                  ${
                    p.id === activePage
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"
                  }
                `}
              >
                {p.id === activePage ? (
                  <FiCircle size={10} />
                ) : (
                  <FiFile size={14} />
                )}

                {p.name}
              </button>
            ))
          )}

          {/* ADD PAGE */}
          <button
            onClick={() => addPage?.()}
            className="
              flex items-center gap-1 px-3 py-1 rounded-md text-sm
              bg-gray-100 hover:bg-gray-200
              dark:bg-gray-800 dark:hover:bg-gray-700
              text-gray-800 dark:text-gray-200
              transition border border-gray-300 dark:border-gray-700
            "
          >
            <FiPlus size={14} />
            Add
          </button>

        </div>
      </div>
    </div>
  );
}