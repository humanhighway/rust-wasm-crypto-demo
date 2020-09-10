import Emitter from 'eventemitter3';

let onSocketMessage;
let onSocketOpen;
window.onSocketOpen = message => onSocketOpen(message);
window.onSocketMessage = message => onSocketMessage(message);

let socket;
export function getSocket() {
  if (!socket) socket = new WasmSocket();
  return socket;
}

export const eventTypes = {
  OPEN: 'OPEN',
  MESSAGE: 'MESSAGE',
};

class WasmSocket extends Emitter {
  constructor() {
    super();
    this.onOpen = this.onOpen.bind(this);
    this.onMessage = this.onMessage.bind(this);
    onSocketMessage = this.onMessage;
    onSocketOpen = this.onOpen;
    import('./../../wasm/pkg/wasm').then(wasm => {
      this.wasm = wasm;
    });
  }

  send(message) {
    this.wasm.send(JSON.stringify(message));
  }

  onOpen() {
    this.emit(eventTypes.OPEN);
  }

  onMessage(message) {
    this.emit(eventTypes.MESSAGE, JSON.parse(message));
  }
}
