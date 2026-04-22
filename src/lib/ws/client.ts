export type WSStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

type MessageHandler = (data: any) => void;
type StatusHandler = (status: WSStatus) => void;

class WSClient {
  private socket: WebSocket | null = null;
  private endpoint: string = "";

  private onMessageHandlers: MessageHandler[] = [];
  private onStatusHandlers: StatusHandler[] = [];

  private shouldReconnect = true;
  private reconnectTimer: any = null;

  connect(endpoint: string) {
    this.endpoint = endpoint;
    this.shouldReconnect = true;

    this.clearReconnect();
    this.emitStatus("connecting");

    this.createSocket();
  }

  private createSocket() {
    try {
      this.socket = new WebSocket(this.endpoint);

      this.socket.onopen = () => {
        this.emitStatus("connected");
      };

      this.socket.onmessage = (event) => {
        let data: any = event.data;

        try {
          data = JSON.parse(event.data);
        } catch {}

        this.onMessageHandlers.forEach((h) => h(data));
      };

      this.socket.onclose = () => {
        this.emitStatus("disconnected");
        this.tryReconnect();
      };

      this.socket.onerror = () => {
        this.emitStatus("error");
        this.tryReconnect();
      };
    } catch {
      this.emitStatus("error");
      this.tryReconnect();
    }
  }

  private tryReconnect() {
    if (!this.shouldReconnect) return;

    this.clearReconnect();

    // langsung reconnect (tanpa delay/backoff)
    this.reconnectTimer = setTimeout(() => {
      this.emitStatus("connecting");
      this.createSocket();
    }, 1000); // kecil saja biar tidak spam loop terlalu cepat
  }

  private clearReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  disconnect() {
    this.shouldReconnect = false;
    this.clearReconnect();

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.emitStatus("disconnected");
  }

  send(data: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    this.socket.send(typeof data === "string" ? data : JSON.stringify(data));
  }

  onMessage(cb: MessageHandler) {
    this.onMessageHandlers.push(cb);
  }

  onStatus(cb: StatusHandler) {
    this.onStatusHandlers.push(cb);
  }

  private emitStatus(status: WSStatus) {
    this.onStatusHandlers.forEach((h) => h(status));
  }
}

export const wsClient = new WSClient();