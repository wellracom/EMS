"use client";

import { useDraggable } from "@dnd-kit/core";

export default function ToolItem({ tool }: any) {
  const { setNodeRef, listeners, attributes, transform } = useDraggable({
    id: tool.type,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded cursor-grab text-sm"
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
    >
      {tool.label || tool.type}
    </div>
  );
}