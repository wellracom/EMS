"use client";

import React, { createContext, useContext, useState } from "react";
import { Check, X, AlertTriangle } from "lucide-react";

type ConfirmState = {
  message: string;
  resolve?: (value: boolean) => void;
};

type ConfirmContextType = {
  confirm: (message: string) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConfirmState | null>(null);

  const confirm = (message: string) => {
    return new Promise<boolean>((resolve) => {
      setState({ message, resolve });
    });
  };

  const handleResponse = (result: boolean) => {
    state?.resolve?.(result);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {state && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[90%] max-w-md rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl p-6 animate-in fade-in zoom-in">

            {/* ICON */}
            <div className="flex justify-center mb-3">
              <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-full">
                <AlertTriangle size={26} />
              </div>
            </div>

            {/* MESSAGE */}
            <p className="text-center text-gray-800 dark:text-gray-200 text-sm">
              {state.message}
            </p>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleResponse(false)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <X size={18} />
                Cancel
              </button>

              <button
                onClick={() => handleResponse(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition"
              >
                <Check size={18} />
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside ConfirmProvider");
  return ctx;
}