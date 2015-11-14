Player = function(socket) {
    this.id = -1;
    this.socket = socket;
    this.input = {
        'left': [],
        'right': [],
        'up': [],
        'down': [],
        'space': [],
    };

    socket.on('keyUp', this.onKeyUp.bind(this));
    socket.on('keyDown', this.onKeyDown.bind(this));
};

Player.prototype.getId = function() {
    return String(this.id);
}

Player.prototype.sendMessage = function(data) {
    this.socket.emit('message', data);
}

Player.prototype.onKeyDown = function(data) {
    this.input[data].push(true);
}

Player.prototype.onKeyUp = function(data) {
    this.input[data].push(false);
}

module.exports = Player;
