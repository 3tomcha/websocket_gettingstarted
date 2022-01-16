const ws = new require("ws");
const wss = new ws.Server({noServer: true});
const http = require('http');

const clients = new Set();

const server = http.createServer((req, res) => {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
    // res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    // res.end('<h1>HelloWorld</h1>')
});

function onSocketConnect(ws) {
    clients.add(ws);

    ws.on("message", function(message) {
        console.log(`message received: ${message}`);
        message = message.slice(0, 50);

        for(let client of clients) {
            client.send(message);
        }  
    });

    ws.on("close", function() {
        clients.delete(ws);
    })
}

server.listen(8080)