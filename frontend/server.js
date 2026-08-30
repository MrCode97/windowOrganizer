import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

// Dynamische Konfiguration zur Laufzeit über Umgebungsvariablen
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:7007';
const DIST_DIR = join(process.cwd(), 'dist');

// Mime-Types für die statischen Frontend-Dateien
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
    // 1. DYNAMISCHER PROXY: Alle Anfragen an /api/... weiterleiten
    if (req.url.startsWith('/api/')) {
        try {
            const targetUrl = `${BACKEND_URL}${req.url}`;

            // Node 24 natives fetch() spiegelt die Anfrage zum Backend
            const proxyResponse = await fetch(targetUrl, {
                method: req.method,
                headers: req.headers,
                body: ['GET', 'HEAD'].includes(req.method) ? undefined : req
            });

            // Headers zurück an den Client senden
            res.writeHead(proxyResponse.status, Object.fromEntries(proxyResponse.headers.entries()));

            // Stream direkt an den Client durchreichen (hohe Performance)
            const bodyNode = ReadableStream.from(proxyResponse.body);
            for await (const chunk of bodyNode) {
                res.write(chunk);
            }
            return res.end();
        } catch (error) {
            res.writeHead(502, { 'Content-Type': 'text/plain' });
            return res.end(`Bad Gateway: Backend nicht erreichbar (${error.message})`);
        }
    }

    // 2. STATISCHER FILE SERVER: Frontend-Dateien ausliefern (SPA-freundlich)
    let filePath = join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
    let ext = extname(filePath);

    try {
        const content = await readFile(filePath);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(content);
    } catch {
        // SPA Fallback: Wenn Datei nicht existiert (z.B. bei React Router), index.html ausliefern
        try {
            const indexContent = await readFile(join(DIST_DIR, 'index.html'));
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(indexContent);
        } catch (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
    console.log(`API-Proxy leitet /api weiter an: ${BACKEND_URL}`);
});
