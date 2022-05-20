const express = require('express');
const expressWs = require('express-ws');
const pty = require('node-pty');
const app = express();
expressWs(app);
const termMap = new Map();
function nodeEnvBind() {
  const term = pty.spawn('/bin/zsh', ['--login'],{
    name: 'xterm-256color',
    cols: 80,
    rows: 24,
    cwd: process.env.PWD,
  });

  termMap.set(term.pid, term);
  return term;
}

//解决跨域问题
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

app.ws('/socket/', (ws, req) => {
  const term =
    termMap.size > 0 ? Array.from(termMap.values())[0] : nodeEnvBind();
  const pid = term.pid;
  term.on('data', function (data) {
    if (ws.readyState === 3) {
      ws.close();
    } else {
      ws.send(data);
    }
  });
  ws.on('message', (data) => {
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

app.listen(4000, () => console.log('Running…'));
