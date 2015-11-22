var Board = require('./board.js');
var Piece = require('./piece.js');
var Player = require('./player.js');
var Util = require('./util.js');
var logger = require('./logger.js');

var BOARD_WIDTH = 30;
var BOARD_HEIGHT = 22;

Game = function(socketio) {
    this.players = {};
    this.socketio = socketio;
    this.playerIdCounter = 1;
    this.newGame();

    var self = this;
    socketio.on('connection', function(socket) {
        var player = new Player(socket);
        self.addPlayer(player);
        socket.emit('init', {
            width: BOARD_WIDTH,
            height: BOARD_HEIGHT,
        });

        logger.log('Connected player ' + player.id);

        socket.on('disconnect', function() {
            logger.log('Disconnected player ' + player.id);
            self.removePlayer(player.id);
        });
    });
};

Game.prototype.givePiece = function(player) {
    // Give player a new piece
    var xVel = player.piece.xVelocity;
    var yVel = player.piece.yVelocity;
    player.piece = player.nextPiece;
    player.nextPiece = Piece.getRandomPiece(0, 0);

    var piece = player.piece;
    piece.xVelocity = xVel;
    piece.yVelocity = yVel;

    var widthBounds = piece.getWidthBounds();
    var heightBounds = piece.getHeightBounds();

    // Calculate all the free spaces by creating a smaller board with all the other pieces
    var tempBoard = new Board(BOARD_WIDTH, heightBounds[1] - heightBounds[0] + 1);
    for (var x = 0; x < BOARD_WIDTH; x++) {
        for (var y = 0; y < heightBounds[1] - heightBounds[0] + 1; y++) {
            tempBoard.grid[x][y] = this.board.grid[x][y];
        }
    }
    for (var id in this.players) {
        if (id == player.id) {
            continue;
        }
        tempBoard.addPieceIfAvailable(this.players[id].piece);
    }

    // Calculate which x positions can be spawned on
    piece.y = -heightBounds[0];
    var emptyX = []; // An array of BOARD_WIDTH length with 0/1 if that x is free or not
    for (var x = -widthBounds[0]; x < BOARD_WIDTH - widthBounds[1]; x++) {
        piece.x = x;
        if (piece.collidesWithBoard(tempBoard)) {
            emptyX.push(0);
        } else {
            emptyX.push(1);
        }
    }
    var freeX = []; // All x values where we can place them
    for (var i = 0; i < emptyX.length; i++) {
        if (emptyX[i] == 1) {
            freeX.push(i);
        }
    }
    if (freeX.length == 0) {
        this.newGame();
    } else {
        piece.x = freeX[Util.random(0, freeX.length)] - widthBounds[0];
    }
}

Game.prototype.getNumPlayers = function() {
    var num = 0;
    for (var key in this.players) {
        if (this.players.hasOwnProperty(key)) num++;
    }
    return num;
}

Game.prototype.addPlayer = function(player) {
    this.givePiece(player)
    player.id = this.playerIdCounter;
    this.players[player.id] = player;
    this.playerIdCounter++;
};

Game.prototype.removePlayer = function(playerId) {
    delete this.players[playerId];

    // Restart game if there are no players left
    if (this.getNumPlayers() == 0) {
        this.newGame();
    }
}

Game.prototype.newGame = function() {
    this.board = new Board(BOARD_WIDTH, BOARD_HEIGHT);
    this.score = 0;
    for (var id in this.players) {
        var player = this.players[id];
        this.givePiece(player);
    }
}

Game.prototype.clearLines = function() {
    var linesToRemove = [];
    var linesRemoved = 0;

    // Calculate removeable lines
    for (var y = 0; y < this.board.height; y++) {
        var remove = true;
        for (var x = 0; x < this.board.width; x++) {
            if (this.board.grid[x][y] == Board.EMPTY) {
                remove = false;
                break;
            }
        }
        if (remove) {
            linesToRemove.push(y);
            linesRemoved++;
        }
    }

    // Remove the lines
    for (var x = 0; x < this.board.width; x++) {
        for (var i = 0; i < linesToRemove.length; i++) {
            line = linesToRemove[i];
            for (var y = line; y > 0; y--) {
                this.board.grid[x][y] = this.board.grid[x][y-1];
            }
            this.board.grid[x][0] = Board.EMPTY;
        }
    }
    this.score += (linesRemoved * (linesRemoved + 1)) / 2;
}

Game.prototype.checkPlayerCollision = function(player) {
    for (var otherId in this.players) {
        if (player.id == otherId) {
            continue; // Don't check against self
        }

        var otherPlayer = this.players[otherId];
        if (player.piece.collidesWithPiece(otherPlayer.piece)) {
            return true;
        }
    }

    return false;
}

Game.prototype.update = function() {
    for (var key in this.players) {
        var player = this.players[key];
        var piece = player.piece;

        // Move the piece
        var oldX = piece.x;
        var newX = piece.x;

        while (player.input['left'].length > 0) {
            if (player.input['left'].shift()) {
                newX -= 1;
                piece.xVelocity -= 1;
            } else {
                piece.xVelocity += 1;
            }
        }

        while (player.input['right'].length > 0) {
            if (player.input['right'].shift()) {
                newX += 1;
                piece.xVelocity += 1;
            } else {
                piece.xVelocity -= 1;
            }
        }

        var xMoved = false;
        if (newX > oldX) {
            xMoved = true;
            while (piece.x !== newX) {
                piece.x += 1;
                if (piece.collidesWithBoard(this.board) || this.checkPlayerCollision(player)) {
                    piece.x -= 1;
                    break;
                }
            }
        } else if (newX < oldX) {
            xMoved = true;
            while (piece.x !== newX) {
                piece.x -= 1;
                if (piece.collidesWithBoard(this.board) || this.checkPlayerCollision(player)) {
                    piece.x += 1;
                    break;
                }
            }
        }

        if (!xMoved) {
            piece.x += piece.xVelocity;
            if (piece.collidesWithBoard(this.board) || this.checkPlayerCollision(player)) {
                piece.x = oldX;
            }
        }

        while (player.input['up'].length > 0) {
            if (player.input['up'].shift()) {
                piece.rotateRight();
                if (piece.collidesWithBoard(this.board) || this.checkPlayerCollision(player)) {
                    piece.rotateLeft();
                }
            }
        }

        while (player.input['down'].length > 0) {
            if (player.input['down'].shift()) {
                piece.yVelocity = 1;
            } else {
                piece.yVelocity = 0;
            }
        }

        while (player.input['space'].length > 0) {
            if (player.input['space'].shift()) {
                piece.progress = BOARD_HEIGHT;
            }
        }

        if (piece.yVelocity > 0) {
            piece.progress += 1;
        } else {
            piece.progress += 0.1;
        }

        if (piece.progress >= 1) {
            piece.progress = piece.progress | 0;
        }

        while (piece.progress >= 1) {
            piece.y += 1;
            piece.progress -= 1;

            if (piece.collidesWithBoard(this.board)) {
                piece.y -= 1;
                piece.progress = 0;
                this.board.addPiece(piece);

                // Check if a line can be removed
                this.clearLines();

                // Give player a new piece
                this.givePiece(player);
            } else if (this.checkPlayerCollision(player)) {
                piece.y -= 1;
                piece.progress = 1;
                break;
            }
        }
    }

    var pieces = [];
    for (var key in this.players) {
        var player = this.players[key];
        pieces.push(player.piece);
    }

    for (var id in this.players) {
        var player = this.players[id];
        var temp = player.piece.colour;
        player.piece.colour = 0xffffff;
        player.socket.emit('update', {
            score: this.score,
            board: this.board.getRendered(pieces),
            nextPiece: player.nextPiece.squares,
        });
        player.piece.colour = temp;
    }
};

Game.prototype.run = function() {
    setInterval(this.update.bind(this), 100);
};

module.exports = Game;
