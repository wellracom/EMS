"use client";

import { toast } from "sonner";

export type ToastType = "success" | "error" | "info";

export function useToast() {
  const showToast = ({
    type,
    message,
  }: {
    type: ToastType;
    message: string;
  }) => {
    toast[type](message);
  };

  return { toast: showToast };
}