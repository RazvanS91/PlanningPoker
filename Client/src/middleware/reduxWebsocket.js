import { error, open, message } from "../actions/websocketActions";

class ReduxWebsocket {
  constructor() {
    this.websocket = null;
    this.lastUrl = null;
  }

  close() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  connect(url, dispatch) {
    if (this.websocket) {
      throw new Error("Websocket already connected");
    }
    this.lastUrl = url;
    this.websocket = new WebSocket(url);
    this.websocket.onopen = () => this.onOpen(dispatch);
    this.websocket.onmessage = e => dispatch(message(JSON.parse(e.data)));
    this.websocket.onerror = () => this.onError(dispatch);
  }

  onOpen(dispatch) {
    dispatch(open());
  }

  onError(dispatch) {
    dispatch(error(new Error("Web socket error")));
    this.reconnect(dispatch);
  }

  reconnect(dispatch) {
    this.websocket = null;
    this.connect(this.lastUrl, dispatch);
  }
}

export default ReduxWebsocket;
