// Liefert werkzeug/stempeltest.html ins WLAN aus und schreibt jede Messung vom iPhone mit.
// Start: node werkzeug/stempeltest-server.mjs  →  am iPhone http://<IP des Macs>:8792/
// Messungen: /tmp/stempeltest.log (eine JSON-Zeile je Tipp).
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const SEITE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'stempeltest.html');
const LOG = '/tmp/stempeltest.log';
const PORT = Number(process.env.PORT || 8792);
http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/messung') {
    let roh = ''; req.on('data', c => roh += c);
    req.on('end', () => { fs.appendFileSync(LOG, roh.replace(/\n/g, ' ') + '\n'); res.writeHead(204); res.end(); });
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(fs.readFileSync(SEITE));
}).listen(PORT, '0.0.0.0', () => console.log('Stempeltest auf Port ' + PORT));
