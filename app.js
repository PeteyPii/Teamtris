var http = require('http');

var express = require('express');
var socketio = require('socket.io');


var Game = require('./lib/game.js');

var game;

app = express();

app.use(express.static('public'));

var webServer = http.createServer(app);
webServer.listen(80, function () {
    var host = webServer.address().address;
    var port = webServer.address().port;

    console.log('Teamtris server listening at http://' + host + ':' + port);
});

game = new Game(socketio(webServer));
game.run();
