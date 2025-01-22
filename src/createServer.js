const http = require('http');
const fs = require('fs');
const url = require('url');
// const path = require('path');

function createServer() {
  const server = http.createServer((req, res) => {
    const userUrl = new url.URL(req.url, `http://${req.headers.host}`);
    const fileName = userUrl.pathname.slice(6);

    const normalizedPath = `http://${req.headers.host}` + req.url;

    if (normalizedPath.includes('..')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end();

      return;
    }

    if (!userUrl.pathname.startsWith('/file/')) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('The `pathname` does not start with `/file/`.');

      return;
    }

    if (userUrl.pathname.includes('//')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found.');

      return;
    }

    const filePath = `./public/${fileName}` || 'index.html';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('File not found.');
        }

        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(data);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
