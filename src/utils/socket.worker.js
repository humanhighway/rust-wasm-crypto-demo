self.onSocketOpen = message => self.postMessage({ type: 'OPEN', message });
self.onSocketMessage = message => self.postMessage({ type: 'MESSAGE', message });

let wasm;
console.log('worker execute');
import('./../../wasm/pkg/wasm').then(w => wasm = w);

export const send = async message => {
  return wasm.send(message);
};
