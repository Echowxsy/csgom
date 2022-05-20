import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { useEffect } from 'react';
import { AttachAddon } from 'xterm-addon-attach';
import { useSocket } from './useSocket';
function WebTerminal() {
  const ws = useSocket();

  function sendCmd(cmd: string) {
    ws.send(cmd + '\n');
  }
  useEffect(() => {
    var term = new Terminal({
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontWeight: 400,
      fontSize: 14,
      rows: 24,
    });

    //@ts-ignore
    term.open(document.getElementById('terminal'));
    term.focus();

    const attachAddon = new AttachAddon(ws);
    term.loadAddon(attachAddon);

    return () => {
      //组件卸载，清除 Terminal 实例
      term.dispose();
    };
  }, [ws]);

  return (
    <div id="main">
      <div className="Command">
        <button
          onClick={(e) => {
            sendCmd('install_steamcmd');
          }}
        >
          安装Steamcmd
        </button>
        <button
          onClick={(e) => {
            sendCmd('install_csgo');
          }}
        >
          安装CS:GO Server
        </button>
        <button
          onClick={(e) => {
            sendCmd('update_csgo');
          }}
        >
          更新CS:GO Server
        </button>
        <button
          onClick={(e) => {
            sendCmd('start_csgo');
          }}
        >
          启动CS:GO Server
        </button>
        <button
          onClick={(e) => {
            sendCmd('install_sourcemod');
          }}
        >
          安装Soucemod
        </button>
      </div>
      <div id="terminal"></div>
    </div>
  );
}

export default WebTerminal;
