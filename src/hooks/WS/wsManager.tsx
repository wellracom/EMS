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

  retryCount: number;
  shouldReconnect: boolean;
};

const RECONNECT_DELAY = 2000;
const MAX_RETRY = 10;

class WSManager {
  private clients: Record<string, WSClientInstance> = {};

  // =========================
  // CONNECT
  // =========================
  connect(endpoint: string, cb: MessageHandler) {
    if (!endpoint) return;

    if (!this.clients[endpoint]) {
      this.clients[endpoint] = {
        socket: null,
        handlers: new Set(),
        statusHandlers: new Set(),
        subscribers: 0,
        status: "idle",
        isConnecting: false,

        retryCount: 0,
        shouldReconnect: true,
      };
    }

    const client = this.clients[endpoint];

    client.subscribers++;
    client.handlers.add(cb);
    client.shouldReconnect = true;

    if (
      client.socket &&
      client.socket.readyState === WebSocket.OPEN
    ) {
      return;
    }

    if (client.isConnecting) return;

    client.isConnecting = true;
    this.emitStatus(endpoint, "connecting");

    this.forceConnect(endpoint);
  }

  // =========================
  // FORCE CONNECT
  // =========================
  private forceConnect(endpoint: string) {
    const client = this.clients[endpoint];
    if (!client) return;

    try {
      const ws = new WebSocket(endpoint);
      client.socket = ws;

      ws.onopen = () => {
        client.isConnecting = false;
        client.retryCount = 0;

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

        if (client.subscribers > 0 && client.shouldReconnect) {
          this.reconnect(endpoint);
        } else {
          delete this.clients[endpoint];
        }
      };

      ws.onerror = () => {
        console.log("[WS ERROR]", endpoint);

        client.socket = null;
        client.isConnecting = false;
        this.emitStatus(endpoint, "error");

        this.reconnect(endpoint);
      };
    } catch (err) {
      console.log("[WS FAIL]", endpoint, err);

      client.isConnecting = false;
      this.emitStatus(endpoint, "error");

      this.reconnect(endpoint);
    }
  }

  // =========================
  // RECONNECT
  // =========================
  private reconnect(endpoint: string) {
    const client = this.clients[endpoint];
    if (!client) return;
    if (!client.shouldReconnect) return;

    if (client.retryCount >= MAX_RETRY) {
      this.emitStatus(endpoint, "error");
      return;
    }

    client.retryCount++;

    this.emitStatus(endpoint, "connecting");

    const delay = RECONNECT_DELAY * client.retryCount;

    setTimeout(() => {
      console.log(
        `[WS RECONNECT] attempt ${client.retryCount}`,
        endpoint
      );
      this.forceConnect(endpoint);
    }, delay);
  }

  // =========================
  // DISCONNECT
  // =========================
  disconnect(endpoint: string, cb: MessageHandler) {
    const client = this.clients[endpoint];
    if (!client) return;

    client.subscribers--;
    client.handlers.delete(cb);

    if (client.subscribers > 0) return;

    console.log("[WS DESTROY]", endpoint);

    client.shouldReconnect = false;
    client.socket?.close();

    delete this.clients[endpoint];
  }

  // =========================
  // STATUS
  // =========================
  subscribeStatus(endpoint: string, cb: StatusHandler) {
    const client = this.clients[endpoint];
    if (!client) return;

    client.statusHandlers.add(cb);
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
    if (!client?.socket) return;

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