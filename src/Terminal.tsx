import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { useCallback, useEffect, useRef } from 'react';
import { AttachAddon } from 'xterm-addon-attach';
import axios from 'axios';

const socketURL = 'ws://127.0.0.1:4000/socket/';
function WebTerminal() {
  //初始化当前系统环境，返回终端的 pid，标识当前终端的唯一性
  const initTerminal = async () =>
    await axios
      .post('http://127.0.0.1:4000/terminal')
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err);
      });

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
    // function connect(u:string) {
    //   var ws = new WebSocket(u);

    //   ws.onclose = function (e) {
    //     console.log(
    //       'Socket is closed. Reconnect will be attempted in 1 second.',
    //       e.reason
    //     );
    //     setTimeout(function () {
    //       connect(u);
    //     }, 1000);
    //   };

    //   ws.onerror = function (err) {
    //     ws.close();
    //   };
    //   return ws;
    // }

    async function asyncInitTerminal() {
      const pid = await initTerminal();
      const ws = new WebSocket(socketURL + pid);

      // connect();
      const attachAddon = new AttachAddon(ws);
      term.loadAddon(attachAddon);
    }

    asyncInitTerminal();
    return () => {
      //组件卸载，清除 Terminal 实例
      console.log(1);

      term.dispose();
    };
  }, []);

  return (
    <div id="main">
      <div className="Command">
        <button>安装Steamcmd</button>
        <button>安装CS:GO Server</button>
        <button>更新CS:GO Server</button>
        <button>安装Soucemod</button>
      </div>
      <div id="terminal"></div>
    </div>
  );
}

export default WebTerminal;
