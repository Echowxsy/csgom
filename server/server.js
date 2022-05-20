const express = require('express');
const expressWs = require('express-ws');
const pty = require('node-pty');
const os = require('os');

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
const app = express();
expressWs(app);
const termMap = new Map();
function initTmuxSession() {
  const term = pty.spawn(shell, ['--login'], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.env.PWD,
    env: process.env,
  });
  term.write('tmux new -s csgo\n');
  term.write('source server/init.sh\n');
  term.write('^B D\n');
  term.kill();
}
function nodeEnvBind() {
  //绑定当前系统 node 环境
  const term = pty.spawn(shell, ['--login'], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.env.PWD,
    env: process.env,
  });
  termMap.set(term.pid, term);
  term.write('tmux new -s csgo || tmux a -t csgo\n');
  return term;
}
initTmuxSession();
//解决跨域问题
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});
//服务端初始化
app.post('/terminal', (req, res) => {
  const term = nodeEnvBind(req);
  res.send(term.pid.toString());
  res.end();
});

app.ws('/socket/:pid', (ws, req) => {
  const pid = parseInt(req.params.pid);
  console.log(pid, termMap.keys());
  const term = termMap.get(pid);
  term.on('data', function (data) {
    if (ws.readyState === 3) {
      ws.close();
    } else {
      ws.send(data);
    }
  });

  ws.on('message', (data) => {
    console.log(typeof data === 'string');
    term.write(data);
  });
  ws.on('close', function () {
    term.kill();
    termMap.delete(pid);
  });
  ws.on('error', function () {
    ws.close();
  });
});
app.listen(4000, '127.0.0.1');
