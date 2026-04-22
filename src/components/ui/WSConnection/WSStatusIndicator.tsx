"use client";

import { FaCircle } from "react-icons/fa";
import type { WSStatus } from "@/lib/ws/client";

export default function WSStatusIndicator({
  status,
  showLabel = true,
}: {
  status: WSStatus;
  showLabel?: boolean;
}) {
  const statusConfig = {
    idle: {
      color: "text-gray-400",
      label: "Idle",
    },
    connecting: {
      color: "text-blue-400",
      label: "Connecting",
    },
    connected: {
      color: "text-green-500",
      label: "Connected",
    },
    disconnected: {
      color: "text-red-500",
      label: "Disconnected",
    },
    error: {
      color: "text-red-600",
      label: "Error",
    },
  };

  const current = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <FaCircle
        className={`${current.color} ${
          status === "connecting" ? "animate-pulse" : ""
        }`}
        size={10}
        title={current.label}
      />

      {showLabel && (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {current.label}
        </span>
      )}
    </div>
  );
}