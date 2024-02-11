import http from 'http';

http.createServer((req, res) => {
res.write('I am alive');
res.end();
}).listen(8080);