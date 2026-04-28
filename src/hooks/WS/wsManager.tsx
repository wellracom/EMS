export type WSStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

type MessageHandler = (data: any) => void;
type StatusHandler = (status: WSStatus) => void;

type WSClientInstance = {
  socket: WebSocket | null;
  handlers: Set<MessageHandler>;
  statusHandlers: Set<StatusHandler>;
  subscribers: number;
  status: WSStatus;
  isConnecting: boolean;
};

class WSManager {
  private clients: Record<string, WSClientInstance> = {};

  // =========================
  // CONNECT
  // =========================
  connect(endpoint: string, cb: MessageHandler) {
    if (!endpoint) return;

    // buat instance kalau belum ada
    if (!this.clients[endpoint]) {
      this.clients[endpoint] = {
        socket: null,
        handlers: new Set(),
        statusHandlers: new Set(),
        subscribers: 0,
        status: "idle",
        isConnecting: false,
      };
    }

    const client = this.clients[endpoint];

    client.subscribers++;
    client.handlers.add(cb);

    // kalau sudah connect → skip
    if (
      client.socket &&
      client.socket.readyState === WebSocket.OPEN
    ) {
      return;
    }

    // kalau sedang connecting → skip
    if (client.isConnecting) return;

    client.isConnecting = true;
    this.emitStatus(endpoint, "connecting");

    try {
      const ws = new WebSocket(endpoint);
      client.socket = ws;

      ws.onopen = () => {
        client.isConnecting = false;
        this.emitStatus(endpoint, "connected");
        console.log("[WS CONNECTED]", endpoint);
      };

      ws.onmessage = (event) => {
        let data: any = event.data;

        try {
          data = JSON.parse(event.data);
        } catch {}

        client.handlers.forEach((h) => h(data));
      };

      ws.onclose = () => {
        console.log("[WS CLOSED]", endpoint);
        client.socket = null;
        client.isConnecting = false;
        this.emitStatus(endpoint, "disconnected");

        // auto cleanup kalau tidak ada subscriber
        if (client.subscribers <= 0) {
          delete this.clients[endpoint];
        }
      };

      ws.onerror = () => {
        console.log("[WS ERROR]", endpoint);
        client.socket = null;
        client.isConnecting = false;
        this.emitStatus(endpoint, "error");
      };
    } catch (err) {
      console.log("[WS FAIL]", endpoint, err);
      client.isConnecting = false;
      this.emitStatus(endpoint, "error");
    }
  }

  // =========================
  // DISCONNECT
  // =========================
  disconnect(endpoint: string, cb: MessageHandler) {
    const client = this.clients[endpoint];
    if (!client) return;

    client.subscribers--;
    client.handlers.delete(cb);

    // masih ada subscriber → jangan close
    if (client.subscribers > 0) return;

    console.log("[WS DESTROY]", endpoint);

    client.socket?.close();
    delete this.clients[endpoint];
  }

  // =========================
  // STATUS SUBSCRIBE
  // =========================
  subscribeStatus(endpoint: string, cb: StatusHandler) {
    const client = this.clients[endpoint];
    if (!client) return;

    client.statusHandlers.add(cb);

    // kirim status terakhir langsung
    cb(client.status);
  }

  unsubscribeStatus(endpoint: string, cb: StatusHandler) {
    const client = this.clients[endpoint];
    if (!client) return;

    client.statusHandlers.delete(cb);
  }

  private emitStatus(endpoint: string, status: WSStatus) {
    const client = this.clients[endpoint];
    if (!client) return;

    client.status = status;
    client.statusHandlers.forEach((h) => h(status));
  }

  // =========================
  // SEND
  // =========================
  send(endpoint: string, data: any) {
    const client = this.clients[endpoint];
    if (!client || !client.socket) return;

    if (client.socket.readyState !== WebSocket.OPEN) return;

    client.socket.send(
      typeof data === "string" ? data : JSON.stringify(data)
    );
  }

  // =========================
  // DEBUG
  // =========================
  getConnections() {
    return Object.keys(this.clients);
  }
}

export const wsManager = new WSManager();