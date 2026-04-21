"use client";

import React, { createContext, useContext, useState } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

type AlertType = "success" | "error" | "info";

type AlertItem = {
  id: number;
  type: AlertType;
  message: string;
};

type AlertContextType = {
  showAlert: (type: AlertType, message: string) => void;
};

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const showAlert = (type: AlertType, message: string) => {
    const id = Date.now();

    setAlerts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 3000);
  };

  const getStyle = (type: AlertType) => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  const getIcon = (type: AlertType) => {
    switch (type) {
      case "success":
        return <FiCheckCircle size={18} />;
      case "error":
        return <FiAlertCircle size={18} />;
      default:
        return <FiInfo size={18} />;
    }
  };

  const remove = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* ALERT STACK */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
        {alerts.map((a) => (
          <div
            key={a.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[250px]
              animate-[slideIn_.3s_ease] ${getStyle(a.type)}
              dark:shadow-black/50`}
          >
            {getIcon(a.type)}

            <span className="text-sm flex-1">{a.message}</span>

            <button
              onClick={() => remove(a.id)}
              className="opacity-70 hover:opacity-100"
            >
              <FiX size={16} />
            </button>
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error("useAlert must be used inside AlertProvider");
  }
  return ctx;
}