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
  private isReconnecting = false;

  private subscribers = 0; // ✅ penting

  // =========================
  // CONNECT
  // =========================
  connect(endpoint: string) {
    this.subscribers++;

    // ✅ sudah connect → jangan buat baru
    if (
      this.socket &&
      this.socket.readyState === WebSocket.OPEN &&
      this.endpoint === endpoint
    ) {
      return;
    }

    // ✅ kalau beda endpoint → reset
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.endpoint = endpoint;
    this.shouldReconnect = true;

    this.clearReconnect();
    this.emitStatus("connecting");

    this.createSocket();
  }

  // =========================
  // CREATE SOCKET
  // =========================
  private createSocket() {
    if (this.socket) return; // ✅ cegah double

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
        this.socket = null;
        this.emitStatus("disconnected");
        this.tryReconnect();
      };

      this.socket.onerror = () => {
        this.socket = null;
        this.emitStatus("error");
        this.tryReconnect();
      };
    } catch {
      this.socket = null;
      this.emitStatus("error");
      this.tryReconnect();
    }
  }

  // =========================
  // RECONNECT
  // =========================
  private tryReconnect() {
    if (!this.shouldReconnect || this.isReconnecting) return;

    this.isReconnecting = true;

    this.clearReconnect();

    this.reconnectTimer = setTimeout(() => {
      this.emitStatus("connecting");
      this.createSocket();
      this.isReconnecting = false;
    }, 1000);
  }

  private clearReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  // =========================
  // DISCONNECT
  // =========================
  disconnect() {
    this.subscribers--;

    // ✅ masih ada yang pakai → jangan close
    if (this.subscribers > 0) return;

    this.shouldReconnect = false;
    this.clearReconnect();

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.emitStatus("disconnected");
  }

  // =========================
  // SEND
  // =========================
  send(data: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    this.socket.send(typeof data === "string" ? data : JSON.stringify(data));
  }

  // =========================
  // LISTENER (NO DUPLICATE)
  // =========================
  onMessage(cb: MessageHandler) {
    this.onMessageHandlers = [cb]; // ✅ hanya 1 handler global
  }

  onStatus(cb: StatusHandler) {
    this.onStatusHandlers = [cb]; // ✅ hanya 1 handler global
  }

  private emitStatus(status: WSStatus) {
    this.onStatusHandlers.forEach((h) => h(status));
  }
}

export const wsClient = new WSClient();