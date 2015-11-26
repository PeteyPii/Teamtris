var http = require('http');

var express = require('express');

var teamtrisApp = require('./lib/app.js');
var logger = require('./lib/logger.js');

try {
    var app = express();
    httpServer = http.createServer(app);
    app.get('/', function(req, res) {
        res.redirect('/Teamtris');
    });
    app.use('/Teamtris', teamtrisApp(httpServer));

    httpServer.listen(80, function() {
        var host = httpServer.address().address;
        var port = httpServer.address().port;

        logger.log('Server listening at https://' + host + ':' + port);
    });
} catch (err) {
    if (err.stack) {
        logger.error(err.stack);
    } else {
        logger.error('Error: ' + err);
    }
}
