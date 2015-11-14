var http = require('http');

var express = require('express');
var socketio = require('socket.io');

var Player = require('./lib/player.js');
var Session = require('./lib/session.js');

var session;

app = express();

app.use(express.static('public'));

var webServer = http.createServer(app);
webServer.listen(80, function () {
    var host = webServer.address().address;
    var port = webServer.address().port;

    console.log('Teamtris server listening at http://' + host + ':' + port);
});

var io = socketio(webServer);
io.on('connection', function(socket) {
    var player = new Player(socket);
    session.addPlayer(player);
    console.log('Connected player ' + player.id);

    socket.on('disconnect', function() {
        console.log('Disconnected player ' + player.id);
        session.removePlayer(player.id);
    });
});

session = new Session(io);
session.run();
