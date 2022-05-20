import { createContext, ReactChild } from 'react';

const ws = new WebSocket('ws://127.0.0.1:4000/socket/');

export const SocketContext = createContext(ws);

interface ISocketProvider {
  children: ReactChild;
}

export const SocketProvider = (props: ISocketProvider) => (
  <SocketContext.Provider value={ws}>{props.children}</SocketContext.Provider>
);
