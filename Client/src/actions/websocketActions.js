import {
  WEBSOCKET_CONNECT,
  WEBSOCKET_CLOSE,
  WEBSOCKET_OPEN,
  WEBSOCKET_MESSAGE,
  WEBSOCKET_ERROR,
  WEBSOCKET_RECONNECTING,
  WEBSOCKET_RECONNECTED
} from "./types";

const WEBSOCKET_PORT = 2345;
const host = () => window.location.host || "localhost";

export function connect(roomId) {
  return {
    type: WEBSOCKET_CONNECT,
    payload: `ws://${host()}:${WEBSOCKET_PORT}/${roomId}`
  };
}

export function close() {
  return { type: WEBSOCKET_CLOSE };
}

export function open() {
  return { type: WEBSOCKET_OPEN };
}

export function message(data) {
  return { type: WEBSOCKET_MESSAGE, payload: data };
}

export function error(exception) {
  return { type: WEBSOCKET_ERROR, payload: exception };
}

export function reconnecting() {
  return { type: WEBSOCKET_RECONNECTING };
}

export function reconnected() {
  return { type: WEBSOCKET_RECONNECTED };
}
