const PING_INTERVAL = 7000;

module.exports = class connectedSocket {
  constructor(socket, roomId, server) {
    this.socket = socket;
    this.server = server;
    this.roomId = roomId;
    this.isAlive = true;

    socket.on("pong", () => this.pong());
    socket.on("message", message => {
      if (message === "string") 
        this.onmessage(message);
    });
    socket.on("close", () => this.onclose());
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

  onclose() {
    this.terminate();
  }

  schedulePing() {
    this.interval = setTimeout(() => this.ping(), PING_INTERVAL);
  }

  clearPing() {
    clearInterval(this.interval);
  }

  send(payload) {
    if (this.socket.readyState === 1)
      this.socket.send(payload);
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
    const { action, data } = message;
    switch (action) {
      case "USER_VOTED":
        this.server.broadcast(this.roomId, data);
        break;
      default:
        break;
    }
  }
};
