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
    this.states = {
        'left': false,
        'right': false,
        'up': false,
        'down': false,
        'space': false,
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
    if (!this.states[data]) {
        this.input[data].push(true);
        this.states[data] = true;
    }
}

Player.prototype.onKeyUp = function(data) {
    if (this.states[data]) {
        this.input[data].push(false);
        this.states[data] = false;
    }
}

module.exports = Player;
