"use client";

import { useEffect, useState } from "react";
import { useWS } from "@/hooks/useWS";
import { useBrowserURLInfo } from "@/hooks/useBrowserURLInfo";
import { useEnvParam } from "@/hooks/useEnv";
import WSStatusIndicator from "@/components/ui/WSConnection/WSStatusIndicator";
export default function WSTestPage() {
  const info = useBrowserURLInfo();
   const { env: wsPort, loading } = useEnvParam("WS_PORT");
  const { status, data, connect, disconnect, clear, isConnected } = useWS();

  const port = Number(process.env.NEXT_PUBLIC_WS_PORT || 3000);

  const [endpoint, setEndpoint] = useState("");

  // 🔥 sync setelah info ready
  useEffect(() => {
    if (!info?.hostname) return;

    setEndpoint(`ws://${info.hostname}:${wsPort}`);
  }, [info, wsPort]);

  return (
    <div style={{ padding: 20 }}>
      <h2>WebSocket Test</h2>

      <div style={{ marginBottom: 10 }}>
        <input
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="ws://localhost:xxxx"
          style={{ padding: 8, width: 300 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <button onClick={() => connect(endpoint)}>Connect</button>
        <button onClick={disconnect} style={{ marginLeft: 10 }}>
          Disconnect
        </button>
        <button onClick={clear} style={{ marginLeft: 10 }}>
          Clear Data
        </button>
      </div>

      <div>
       <WSStatusIndicator status={status} showLabel={false}/>
      </div>

      <hr />

      <h3>Incoming Data</h3>
      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: 10,
          height: 400,
          overflow: "auto",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}