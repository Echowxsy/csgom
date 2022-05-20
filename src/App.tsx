import React from 'react';
import WebTerminal from './Terminal';
import './App.css';
import { SocketProvider } from './SocketProvider';

function App() {
  return (
    <SocketProvider>
      <div className="App">
        <WebTerminal />
      </div>
    </SocketProvider>
  );
}

export default App;
