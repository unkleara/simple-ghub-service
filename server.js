var http = require('http');
var githubService = require('./lib/api');

function establishHTTPServer(req, res) {
  if (req.url === '/favicon.ico') {
      res.writeHead(200, { 'Content-Type': 'image/x-icon' });
      res.end();
      console.log('favicon requested');
      return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  if (!(/^\/events/.test(req.url))) {
      res.writeHead(403);
      var error = {
       message: 'Incorrect Request, please check correct format: ' + req.url
       };
      res.end(JSON.stringify(error));
  } else {
      githubService(req, function onRequest(err, response) {
        if (err) {
          console.log(err);
        }
        res.end(JSON.stringify({ result: response }));
      });
      //res.end(JSON.stringify({result: 'Web Service Ready'}));
  }
}


var server = http.createServer(establishHTTPServer);
server.listen(3030, '127.0.0.1');

console.log('Server running at http://127.0.0.1:3030/');
