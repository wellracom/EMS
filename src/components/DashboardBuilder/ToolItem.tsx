"use client";

import { useDraggable } from "@dnd-kit/core";

export default function ToolItem({ tool }: any) {
  const { setNodeRef, listeners, attributes, transform } = useDraggable({
    id: tool.type,
  });

  const Icon = tool.icon;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="
        flex items-center gap-2 px-3 py-1
        bg-gray-100 dark:bg-gray-800
        hover:bg-gray-200 dark:hover:bg-gray-700
        rounded cursor-grab active:cursor-grabbing
        text-sm border border-gray-300 dark:border-gray-700
        transition
      "
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
    >
      {/* ICON */}
      {Icon && (
        <Icon
          size={14}
          className="text-gray-600 dark:text-gray-300"
        />
      )}

      {/* LABEL */}
      <span>{tool.label || tool.type}</span>
    </div>
  );
}