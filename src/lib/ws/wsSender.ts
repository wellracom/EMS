import { apiClient } from "@/lib/apiclient/apiClient"

export type PayloadType = "reload" | "info" | "warning" | "success";

export type WSSendParams = {
  endpoint: string;
  type: PayloadType;
  message?: string;
  data?: any;
};

class WSSender {
  async send(params: WSSendParams) {
    if (typeof window !== "undefined") {
      throw new Error("wsSender hanya boleh dipakai di server");
    }

    const { endpoint, type, message, data } = params;

    const endpointAPIWS = process.env.WS_API;

    if (!endpointAPIWS) {
      throw new Error("WS_API env belum diset");
    }

    return apiClient(endpointAPIWS, {
      method: "POST",
      body: {
        endpoint,
        payload: {
          type,
          message: message ?? "",
          data: data ?? null,
        },
      },
    });
  }

  reload(endpoint: string, message?: string, data?: any) {
    return this.send({ endpoint, type: "reload", message, data });
  }

  info(endpoint: string, message?: string, data?: any) {
    return this.send({ endpoint, type: "info", message, data });
  }

  warning(endpoint: string, message?: string, data?: any) {
    return this.send({ endpoint, type: "warning", message, data });
  }

  success(endpoint: string, message?: string, data?: any) {
    return this.send({ endpoint, type: "success", message, data });
  }
}

export const wsSender = new WSSender();