var Util = require('./util.js');

Piece = function(x, y, shape, colour) {
    this.x = x
    this.y = y;
    this.progress = 0;
    this.shape = shape;
    this.colour = colour;
    this.squares = [];
    this.hasEvenWidth = false;
    this.createShape();
    this.xVelocity = 0;
    this.yVelocity = 0;
};

Piece.getRandomPiece = function(xVelocity, yVelocity) {
    var shapes = [
        'I',
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
};

Piece.prototype = {
    createShape: function() {
        switch(this.shape) {
            case 'I':
                this.squares[0] = [0, 1];
                this.squares[1] = [0, 0];
                this.squares[2] = [0, -1];
                this.squares[3] = [0, -2];
                this.hasEvenWidth = true;
                break;

            case 'o':
                this.squares[0] = [0, 0];
                this.squares[1] = [-1, 0];
                this.squares[2] = [0, -1];
                this.squares[3] = [-1, -1];
                this.hasEvenWidth = true;
                break;

            case 'L':
                this.squares[0] = [0, -1];
                this.squares[1] = [0, 0];
                this.squares[2] = [0, 1];
                this.squares[3] = [1, 1];
                this.hasEvenWidth = false;
                break;

            case 'L2':
                this.squares[0] = [0, -1];
                this.squares[1] = [0, 0];
                this.squares[2] = [0, 1];
                this.squares[3] = [-1, 1];
                this.hasEvenWidth = false;
                break;

            case 'T':
                this.squares[0] = [0, -1];
                this.squares[1] = [0, 0];
                this.squares[2] = [1, 0];
                this.squares[3] = [-1, 0];
                this.hasEvenWidth = false;
                break;

            case 's':
                this.squares[0] = [-1, 0];
                this.squares[1] = [0, 0];
                this.squares[2] = [0, 1];
                this.squares[3] = [1, 1];
                this.hasEvenWidth = false;
                break;

            case 'z':
                this.squares[0] = [1, 0];
                this.squares[1] = [0, 0];
                this.squares[2] = [0, 1];
                this.squares[3] = [-1, 1];
                this.hasEvenWidth = false;
                break;

            // case 'X':
            //     this.squares[0] = [1, 1];
            //     this.squares[1] = [0, 0];
            //     this.squares[2] = [-1, 1];
            //     this.squares[3] = [-1, -1];
            //     this.squares[4] = [1, -1];
            //     break;

            // case 'O':
            //     this.squares[0] = [1, 1];
            //     this.squares[1] = [0, 1];
            //     this.squares[2] = [-1, 1];
            //     this.squares[3] = [-1, 0];
            //     this.squares[4] = [-1, -1];
            //     this.squares[5] = [0, -1];
            //     this.squares[6] = [1, -1];
            //     this.squares[7] = [1, 0];
            //     break;
        }
    },

    rotateRight: function() {
        for (var i = 0; i < this.squares.length; i++) {
            var x = this.squares[i][0];
            var y = this.squares[i][1];
            this.squares[i][0] = -y + (this.hasEvenWidth ? -1 : 0);
            this.squares[i][1] = x;
        }
    },

    rotateLeft: function() {
        for (var i = 0; i < this.squares.length; i++) {
            var x = this.squares[i][0];
            var y = this.squares[i][1];
            this.squares[i][0] = y;
            this.squares[i][1] = -x + (this.hasEvenWidth ? -1 : 0);
        }
    },

    getWidthBounds: function() {
        if (this.squares.length < 1) {
            throw Error('bad piece');
        }

        var minWidth = this.squares[0][0];
        var maxWidth = this.squares[0][0];
        for (var i = 1; i < this.squares.length; i++) {
            var square = this.squares[i];
            minWidth = Math.min(minWidth, square[0]);
            maxWidth = Math.max(maxWidth, square[0]);
        }

        return [minWidth, maxWidth];
    },

    getHeightBounds: function() {
        if (this.squares.length < 1) {
            throw Error('bad piece');
        }

        var minHeight = this.squares[0][1];
        var maxHeight = this.squares[0][1];
        for (var i = 1; i < this.squares.length; i++) {
            var square = this.squares[i];
            minHeight = Math.min(minHeight, square[1]);
            maxHeight = Math.max(maxHeight, square[1]);
        }

        return [minHeight, maxHeight];
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
};

module.exports = Piece;
