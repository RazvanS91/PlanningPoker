const PING_INTERVAL = 7000;
const NORMAL_CLOSE = 1001;

module.exports = class connectedSocket {
  constructor(socket, roomId, server) {
    this.socket = socket;
    this.server = server;
    this.roomId = roomId;
    this.isAlive = true;

    socket.on("pong", () => this.pong());
    socket.on("message", message => {
      if (typeof message === "string") this.onmessage(message);
    });
    socket.on("close", event => this.onclose(event));
    socket.on("error", err => console.log(err));

    this.schedulePing();
  }

  onmessage(message) {
    this.broadcastMessage(JSON.parse(message));
  }

  terminate() {
    this.isAlive = false;
    this.clearPing();
    this.socket.terminate();
    this.server.disconnect(this.socket, this.roomId);
  }

  onclose(event) {
    if (event === NORMAL_CLOSE) {
      this.server.fetchNormalClosure(this.socket, this.roomId);
    }
    this.terminate();
  }

  schedulePing() {
    this.interval = setInterval(() => this.ping(), PING_INTERVAL);
  }

  clearPing() {
    clearInterval(this.interval);
  }

  send(payload) {
    if (this.socket.readyState === WebSocket.OPEN) this.socket.send(payload);
  }

  ping() {
    if (!this.isAlive) {
      this.terminate();
      return;
    }
    this.isAlive = false;
    this.socket.ping("ping");
  }

  pong() {
    this.isAlive = true;
  }

  broadcastMessage(message) {
    if (message === "ping") return;
    const { reason } = message;
    switch (reason) {
      case "USER_VOTED":
        this.server.broadcast(this.roomId, message);
        break;
      case "STORY_STARTED":
        this.server.broadcast(this.roomId, message);
        break;
      case "FLIP_CARDS":
        this.server.broadcast(this.roomId, message);
        break;
      case "CLEAR_VOTES":
        this.server.broadcast(this.roomId, message);
        break;
      case "NEW_STORY":
        this.server.broadcast(this.roomId, message);
        break;
      case "STORY_RENAMED":
        this.server.broadcast(this.roomId, message);
        break;
      default:
        break;
    }
  }
};
