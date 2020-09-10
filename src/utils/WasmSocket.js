import Emitter from 'eventemitter3';
import worker from './socket.worker';

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
    this.worker = worker();
    this.onMessage = this.onMessage.bind(this);
    this.worker.addEventListener('message', this.onMessage);
  }

  send(message) {
    this.worker.send(JSON.stringify(message));
  }

  onMessage({ data }) {
    switch (data.type) {
      case eventTypes.OPEN:
        this.emit(eventTypes.OPEN);
        break;
      case eventTypes.MESSAGE:
        const { message } = data;
        this.emit(eventTypes.MESSAGE, JSON.parse(message));
        break;
    }
  }
}
