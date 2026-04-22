"use client";

import { useWSStore } from "@/store/wsStore";

export function useWS() {
  const status = useWSStore((s) => s.status);
  const data = useWSStore((s) => s.data);
  const endpoint = useWSStore((s) => s.endpoint);

  const connect = useWSStore((s) => s.connect);
  const disconnect = useWSStore((s) => s.disconnect);
  const clear = useWSStore((s) => s.clear);

  return {
    status,
    data,
    endpoint,
    connect,
    disconnect,
    clear,
    isConnected: status === "connected",
  };
}