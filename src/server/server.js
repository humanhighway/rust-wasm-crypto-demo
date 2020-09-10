import WebSocket from 'ws';
import { encrypt, decrypt } from './../utils/crypto';
const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', ws => {
  console.log('server connect!');
  ws.on('message', data => {
    console.log('before decrypt: %s', data);
    console.log('after decrypt: %s', decrypt(data));
    ws.send(encrypt(JSON.stringify({ message: 'pong!', timestamp: `${Date.now()}` })));
  });
  const m = encrypt(JSON.stringify({ message: 'connected!, message from server', timestamp: `${Date.now()}` }));
  ws.send(m);
});