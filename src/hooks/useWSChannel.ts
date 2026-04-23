"use client";

import { useEffect } from "react";
import { useWS } from "@/hooks/useWS";
import { useBrowserURLInfo } from "@/hooks/useBrowserURLInfo";
import { useEnvParam } from "@/hooks/useEnv";

export function useWSChannel(endpoint: string) {
  const WS = useWS();
  const info = useBrowserURLInfo();
  const { env: wsPort } = useEnvParam("WS_PORT");

  useEffect(() => {
    if (!info?.hostname || !wsPort || !endpoint) return;

    const url = `ws://${info.hostname}:${wsPort}/${endpoint}`;
    WS.connect(url);

    return () => {
      WS.disconnect();
    };
  }, [info?.hostname, wsPort, endpoint]);

  return WS;
}