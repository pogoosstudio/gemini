var http = require('http');
http.createServer((req, res) => {
res.write('I am alive');
res.end();
}).listen(8080);
