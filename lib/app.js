var express = require('express');
var socketio = require('socket.io');

var Game = require('./game.js');

module.exports = function getTeamtrisApp(server) {
    var app = express();
    app.use(express.static('public'));

    var game = new Game(socketio(server));
    game.run();

    return app;
}