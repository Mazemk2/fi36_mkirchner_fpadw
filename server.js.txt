const http = require('http');
 
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('I am Here');
});
 
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
//
// server.mjs
// import { createServer } from 'node:http';
// const server = createServer((req, res) => {
//  res.writeHead(418, { 'Content-Type': 'text/plain' });
//  res.end('Hello World!\n');
//});

// starts a simple http server locally on port 3000
// server.listen(3000, '127.0.0.1', () => {
//    console.log('Listening on 127.0.0.1:3000');
// });
  // run with `node server.mjs`