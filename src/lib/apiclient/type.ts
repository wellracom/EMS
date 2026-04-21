// src/lib/api/types.ts

export type ToastType = "success" | "error" | "info";

export interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;

  toast?: {
    success?: string;
    error?: string;
    loading?: string;
  };

  confirm?: {
    message: string;
  };

  headers?: Record<string, string>;
}