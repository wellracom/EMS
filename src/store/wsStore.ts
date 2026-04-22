import { create } from "zustand";
import { WSStatus, wsClient } from "@/lib/ws/client";

type WSStore = {
  status: WSStatus;
  data: any | null;
  endpoint: string | null;

  connect: (endpoint: string) => void;
  disconnect: () => void;
  clear: () => void;
};

export const useWSStore = create<WSStore>((set) => {
  wsClient.onStatus((status) => {
    set({ status });
  });

  wsClient.onMessage((data) => {
    set({
      data, // ✅ langsung replace, bukan array
    });
  });

  return {
    status: "idle",
    data: null, // ✅ bukan []
    endpoint: null,

    connect: (endpoint: string) => {
      set({ endpoint, data: null }); // reset
      wsClient.connect(endpoint);
    },

    disconnect: () => {
      wsClient.disconnect();
    },

    clear: () => {
      set({ data: null }); // ✅ konsisten
    },
  };
});