import { useEffect, useState, useCallback } from 'react';
import { Box, Button, Text } from '@chakra-ui/core';
import { getSocket, eventTypes } from '../utils/WasmSocket';

export default function WSView() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('server connected ...');

  useEffect(() => {
    const socket = getSocket();
    socket.on(eventTypes.OPEN, () => setSocket(socket));
    socket.on(eventTypes.MESSAGE, message => setMessage(message));
  }, []);

  const onClick = useCallback(() => {
    socket.send({ message: 'ping', timestamp: Date.now() });
  }, [socket]);

  return (
    <Box padding="16px">
      <Text paddingBottom="16px">{JSON.stringify(message, null, 2)}</Text>
      <Button onClick={onClick} disabled={socket === null}>send</Button>
    </Box>
  )
}