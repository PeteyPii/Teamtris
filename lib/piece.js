var Util = require('./util.js');

Piece = function(x, y, shape, colour) {
    this.x = x
    this.y = y;
    this.progress = 0;
    this.shape = shape;
    this.colour = colour;
    this.squares = [];
    this.createShape();
    this.xVelocity = 0;
    this.yVelocity = 0;
}

Piece.getRandomPiece = function(xVelocity, yVelocity) {
    var shapes = [
        'l',
        'o',
        'L',
        'L2',
        's',
        'z',
        'T',
        // 'X',
        // 'O',
    ];

    var piece = new Piece(0, 0, shapes[Util.random(0, shapes.length)], Util.randomColour());
    piece.xVelocity = xVelocity;
    piece.yVelocity = yVelocity;
    return piece;
}

Piece.prototype = {
    createShape: function() {
        switch(this.shape) {
            case 'l':
                this.squares[0] = [0, 0]
                this.squares[1] = [0, -1]
                this.squares[2] = [0, 1]
                this.squares[3] = [0, 2]
                break;

            case 'o':
                this.squares[0] = [0, 0]
                this.squares[1] = [1, 1]
                this.squares[2] = [0, 1]
                this.squares[3] = [1, 0]
                break;

            case 'L':
                this.squares[0] = [0, -1]
                this.squares[1] = [0, 0]
                this.squares[2] = [0, 1]
                this.squares[3] = [1, 1]
                break;

            case 'L2':
                this.squares[0] = [0, -1]
                this.squares[1] = [0, 0]
                this.squares[2] = [0, 1]
                this.squares[3] = [-1, 1]
                break;

            case 'T':
                this.squares[0] = [0, -1]
                this.squares[1] = [0, 0]
                this.squares[2] = [1, 0]
                this.squares[3] = [-1, 0]
                break;

            case 's':
                this.squares[0] = [-1, 0]
                this.squares[1] = [0, 0]
                this.squares[2] = [0, 1]
                this.squares[3] = [1, 1]
                break;

            case 'z':
                this.squares[0] = [1, 0]
                this.squares[1] = [0, 0]
                this.squares[2] = [0, 1]
                this.squares[3] = [-1, 1]
                break;

            // case 'X':
            //     this.squares[0] = [1, 1]
            //     this.squares[1] = [0, 0]
            //     this.squares[2] = [-1, 1]
            //     this.squares[3] = [-1, -1]
            //     this.squares[4] = [1, -1]
            //     break;

            // case 'O':
            //     this.squares[0] = [1, 1]
            //     this.squares[1] = [0, 1]
            //     this.squares[2] = [-1, 1]
            //     this.squares[3] = [-1, 0]
            //     this.squares[4] = [-1, -1]
            //     this.squares[5] = [0, -1]
            //     this.squares[6] = [1, -1]
            //     this.squares[7] = [1, 0]
            //     break;
        }
    },

    rotateLeft: function() {
        for (var i = 0; i < this.squares.length; i++) {
            var x = this.squares[i][0];
            var y = this.squares[i][1];
            this.squares[i][0] = -y;
            this.squares[i][1] = x;
        }
    },

    rotateRight: function() {
        for (var i = 0; i < this.squares.length; i++) {
            var x = this.squares[i][0];
            var y = this.squares[i][1];
            this.squares[i][0] = y;
            this.squares[i][1] = -x;
        }
    },

    getWidthBounds: function() {
        var minWidth = 0;
        var maxWidth = 0;
        for (var i = 0; i < this.squares.length; i++) {
            var square = this.squares[i];
            minWidth = Math.min(minWidth, square[0]);
            maxWidth = Math.max(maxWidth, square[0]);
        }

        return [Math.abs(minWidth), Math.abs(maxWidth)];
    },

    getHeight: function() {
        var minHeight = 0;
        var maxHeight = 0;
        for (var i = 0; i < this.squares.length; i++) {
            var square = this.squares[i];
            minHeight = Math.min(minHeight, square[1]);
            maxHeight = Math.max(maxHeight, square[1]);
        }

        return maxHeight - minHeight + 1;
    },

    collidesWithBoard: function(board) {
        for (var i = 0; i < this.squares.length; i++) {
            var x = this.x + this.squares[i][0];
            var y = this.y + this.squares[i][1];

            if (x < 0 || x >= board.width) {
                return true;
            }
            if (y < 0 || y >= board.height) {
                return true;
            }
            if (board.grid[x][y] != 0) {
                return true;
            }
        }

        return false;
    },

    collidesWithPiece: function(otherPiece) {
        var occupiedX = [];
        var occupiedY = [];
        for (var i = 0; i < this.squares.length; i++) {
            var square = this.squares[i];
            occupiedX.push(this.x + square[0]);
            occupiedY.push(this.y + square[1]);
        }
        for (var i = 0; i < otherPiece.squares.length; i++) {
            var square = otherPiece.squares[i];
            var x = otherPiece.x + square[0];
            var y = otherPiece.y + square[1];
            for (var j = 0; j < occupiedX.length; j++) {
                if (x == occupiedX[j] && y == occupiedY[j]) return true;
            }
        }
        return false;
    }
}

module.exports = Piece;
