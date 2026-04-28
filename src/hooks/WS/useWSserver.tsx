"use client";
import { useMemo } from "react";
import { useEffect, useState } from "react";
import { wsManager, WSStatus } from "@/hooks/WS/wsManager";
import { useBrowserURLInfo } from "@/hooks/useBrowserURLInfo";
import { useEnvParam } from "@/hooks/useEnv";
export function useWS_V1Server(endpoint: string | null) {
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<WSStatus>("idle");
const info = useBrowserURLInfo();
  const { env: wsPort } = useEnvParam("WS_PORT");
  const url = useMemo(() => {
    if (!info?.hostname || !wsPort || !endpoint) return '';
    return `ws://${info.hostname}:${wsPort}/${endpoint}`;
  }, [info?.hostname, wsPort, endpoint]);
  useEffect(() => {
    if (!endpoint) return;

    const handleMessage = (msg: any) => {
      setData(msg);
    };

    const handleStatus = (s: WSStatus) => {
      setStatus(s);
    };

    wsManager.connect(url, handleMessage);
    wsManager.subscribeStatus(url, handleStatus);

    return () => {
      wsManager.disconnect(url, handleMessage);
      wsManager.unsubscribeStatus(url, handleStatus);
    };
  }, [url]);

  return {
    data,
    status,
    isConnected: status === "connected",
  };
}