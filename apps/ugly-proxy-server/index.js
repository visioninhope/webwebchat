import http from 'http';
import https from 'https';

const PORT = 3348;
const allowedOrigins = [
    "http://localhost:4000",
    "https://webwebchat.com",
    "https://www.webwebchat.com",
];

const server = http.createServer((req, res) => {
    const origin = req.headers.origin;
    if (!allowedOrigins.includes(origin)) {
        res.writeHead(403);
        res.end('Forbidden: Origin not allowed.');
        return;
    }
    // if (req.method === 'GET') {
    //     res.setHeader('Access-Control-Allow-Origin', origin);
    //     res.setHeader('Access-Control-Allow-Methods', '*');
    //     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, *');
    //     res.setHeader('Content-Type', 'text/plain');
    //     res.writeHead(200);
    //     res.end('hello');
    //     return;
    // }
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, *');
        res.writeHead(200);
        res.end();
        return;
    }
    const revproxyhost = req.headers['revproxyhost'];
    if (!revproxyhost) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, *');
        res.writeHead(400);
        res.end('Bad Request: Missing host header.');
        return;
    }
    req.headers['host'] = revproxyhost;
    const options = {
        hostname: revproxyhost,
        // port: parsedUrl.query['proxy_port'] || (parsedUrl.query['proxy_protocol'] === 'https' ? 443 : 80),
        port: 443,
        path: req.url,
        method: req.method,
        headers: req.headers,
        rejectUnauthorized: false
    };

    // const proxy = (parsedUrl.query['proxy_protocol'] === 'https' ? https : http).request(options, (targetRes) => {
    const proxy = https.request(options, (targetRes) => {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, *');
        res.writeHead(targetRes.statusCode, targetRes.headers);
        targetRes.pipe(res, { end: true });
    });

    proxy.on('error', (err) => {
        console.error('Error occurred:', err);
        res.writeHead(500);
        res.end('An error occurred while processing your request.');
    });
    req.pipe(proxy, { end: true });
});

server.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});