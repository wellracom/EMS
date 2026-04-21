// src/lib/api/apiClient.ts

import { ApiOptions, ToastType } from "./type"

type ToastFn = (type: ToastType, message: string) => void;
type ConfirmFn = (message: string) => Promise<boolean>;

let toastHandler: ToastFn = () => {};
let confirmHandler: ConfirmFn = async () => true;

// inject UI handler dari React
export function setApiUIHandlers(handlers: {
  toast?: ToastFn;
  confirm?: ConfirmFn;
}) {
  if (handlers.toast) toastHandler = handlers.toast;
  if (handlers.confirm) confirmHandler = handlers.confirm;
}

export async function apiClient<T = any>(
  url: string,
  options: ApiOptions = {}
): Promise<T | null> {
  const { method = "GET", body, toast, confirm, headers } = options;

  try {
    // 🔐 CONFIRM
    if (confirm?.message) {
      const ok = await confirmHandler(confirm.message);
      if (!ok) return null;
    }

    // ⏳ loading toast
    if (toast?.loading) {
      toastHandler("info", toast.loading);
    }

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
      if (toast?.error) {
        toastHandler("error", toast.error);
      }
      throw new Error(data?.message || "Request failed");
    }

    // ✅ success toast
    if (toast?.success) {
      toastHandler("success", toast.success);
    }

    return data;
  } catch (err) {
    if (toast?.error) {
      toastHandler("error", toast.error);
    }

    console.error("API Error:", err);
    return null;
  }
}