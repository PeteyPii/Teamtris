Board = function(width, height) {
    this.grid = [];
    this.width = width;
    this.height = height;
    for (var i = 0; i < width; i++) {
        this.grid.push([]);
        for (var j = 0; j < height; j++) {
            this.grid[i].push(Board.EMPTY);
        }
    }
}

Board.EMPTY = 0;

Board.prototype = {
    addPiece: function(piece) {
        for (var i = 0; i < piece.squares.length; i++) {
            var x = piece.x + piece.squares[i][0];
            var y = piece.y + piece.squares[i][1];
            this.grid[x][y] = piece.colour;
        }
    },

    /**
     * Add a piece if that position on the grid is available, or fail silently if it isn't.
     */
    addPieceIfAvailable: function(piece) {
        for (var i = 0; i < piece.squares.length; i++) {
            var x = piece.x + piece.squares[i][0];
            var y = piece.y + piece.squares[i][1];
            if (x > 0 && x < this.width && y > 0 && y < this.height) {
                this.grid[x][y] = piece.colour;
            }
        }
    },

    print: function() {
        for (var y = 0; y < this.height; y++) {
            var s = '';
            for (var x = 0; x < this.width; x++) {
                s += (this.grid[x][y] != 0 ? '1' : '0');
            }
            console.log(s);
        }
    },

    getRendered: function(pieces) {
        var board = new Board(this.width, this.height);
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                board.grid[x][y] = this.grid[x][y];
            }
        }

        for (var i = 0; i < pieces.length;  i++) {
            var piece = pieces[i];
            for (var j = 0; j < piece.squares.length; j++) {
                var x = piece.x + piece.squares[j][0];
                var y = piece.y + piece.squares[j][1];
                board.grid[x][y] = piece.colour;
            }
        }

        return board;
    },
}

module.exports = Board;
