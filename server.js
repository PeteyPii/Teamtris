var http = require('http');

var express = require('express');

var teamtris = require('./lib/app.js');

try {
    var app = express();
    httpServer = http.createServer(app);
    app.get('/', function(req, res) {
      res.redirect('/Teamtris');
    });
    app.use('/Teamtris', teamtris(httpServer));

    httpServer.listen(80, function() {
      var host = httpServer.address().address;
      var port = httpServer.address().port;

      console.log('Server listening at https://' + host + ':' + port);
    });
} catch (err) {
    if (err.stack) {
        console.error(err.stack);
    } else {
        console.error('Error: ' + err);
    }
}
