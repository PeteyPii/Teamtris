var http = require('http');

var express = require('express');

var teamtrisApp = require('./lib/app.js');
var logger = require('./lib/logger.js');
var settings = require('./lib/settings.js');

try {
    var app = express();

    // Log every request
    app.use(function logRequests(req, res, next) {
        logger.logRequest(req);
        next();
    });

    httpServer = http.createServer(app);
    app.get('/', function(req, res) {
        res.redirect('/Teamtris');
    });
    app.use('/Teamtris', teamtrisApp(httpServer));

    httpServer.listen(settings.server_port, function() {
        var host = httpServer.address().address;
        var port = httpServer.address().port;

        logger.log('Server listening at http://' + host + ':' + port);
    });
} catch (err) {
    if (err.stack) {
        logger.error(err.stack);
    } else {
        logger.error('Error: ' + err);
    }
}
