var ctx = null;
var numBlocksX;
var numBlocksY;
var screenWidth;
var screenHeight;
var paneX;
var version;

var blockImage = new Image();
blockImage.src = 'assets/block.png';

var BLOCK_SIZE = 32;
var SIDE_PANE_WIDTH = 300;

function getHexColour(c) {
    var s = c.toString(16);
    while (s.length < 6) {
        s = '0' + s;
    }
    return '#' + s;
}

var socket = io();

socket.on('update', function(data) {
    var board = data.board;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    var c;
    for (var x = 0; x < board.grid.length; x++) {
        for (var y = 0; y < board.grid[x].length; y++) {
            c = board.grid[x][y];
            if (c > 0) {
                ctx.fillStyle = getHexColour(c);
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }

    ctx.globalCompositeOperation = 'multiply';
    for (var x = 0; x < board.grid.length; x++) {
        for (var y = 0; y < board.grid[x].length; y++) {
            c = board.grid[x][y];
            if (c > 0) {
                ctx.drawImage(blockImage, x * BLOCK_SIZE, y * BLOCK_SIZE);
            }
        }
    }
    ctx.globalCompositeOperation = 'normal';

    ctx.beginPath();
    ctx.moveTo(BLOCK_SIZE * numBlocksX + 2.5, 0);
    ctx.lineTo(BLOCK_SIZE * numBlocksX + 2.5, BLOCK_SIZE * numBlocksY);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.font = '32px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('SCORE: ' + data.score, BLOCK_SIZE * numBlocksX + 24, 50);

    var squares = data.nextPiece;
    for (var i = 0; i < squares.length; i++) {
        ctx.fillRect(paneX + 120 + BLOCK_SIZE * squares[i][0], 150 + BLOCK_SIZE * squares[i][1], BLOCK_SIZE, BLOCK_SIZE);
    }

    ctx.globalCompositeOperation = 'multiply';
    for (var i = 0; i < squares.length; i++) {
        ctx.drawImage(blockImage, paneX + 120 + BLOCK_SIZE * squares[i][0], 150 + BLOCK_SIZE * squares[i][1]);
    }
    ctx.globalCompositeOperation = 'normal';

    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';

    ctx.fillText(version, screenWidth, screenHeight);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'hanging';
});

socket.on('message', function(data) {
    console.log(data);
});

socket.on('init', function(data) {
    ctx = document.getElementById('game').getContext('2d');

    version = data.version;
    numBlocksX = data.width;
    numBlocksY = data.height;
    screenWidth = BLOCK_SIZE * numBlocksX + SIDE_PANE_WIDTH;
    screenHeight = BLOCK_SIZE * numBlocksY;
    paneX = BLOCK_SIZE * numBlocksX;

    ctx.canvas.width = screenWidth;
    ctx.canvas.height = screenHeight;
});

var ENTER_CODE = 13;
var SPACE_CODE = 32;
var LEFT_CODE = 37;
var UP_CODE = 38;
var RIGHT_CODE = 39;
var DOWN_CODE = 40;

var inputs = {};
inputs[ENTER_CODE] = false;
inputs[SPACE_CODE] = false;
inputs[LEFT_CODE] = false;
inputs[UP_CODE] = false;
inputs[RIGHT_CODE] = false;
inputs[DOWN_CODE] = false;

window.onkeydown = function(e) {
    if (inputs[e.which]) {
        return;
    }

    switch (e.which) {
        case SPACE_CODE:
            inputs[e.which] = true;
            socket.emit('keyDown', 'space');
            break;
        case LEFT_CODE:
            inputs[e.which] = true;
            socket.emit('keyDown', 'left');
            break;
        case UP_CODE:
            inputs[e.which] = true;
            socket.emit('keyDown', 'up');
            break;
        case RIGHT_CODE:
            inputs[e.which] = true;
            socket.emit('keyDown', 'right');
            break;
        case DOWN_CODE:
            inputs[e.which] = true;
            socket.emit('keyDown', 'down');
            break;
    }
}

window.onkeyup = function(e) {
    switch (e.which) {
        case SPACE_CODE:
            inputs[e.which] = false;
            socket.emit('keyUp', 'space');
            break;
        case LEFT_CODE:
            inputs[e.which] = false;
            socket.emit('keyUp', 'left');
            break;
        case UP_CODE:
            inputs[e.which] = false;
            socket.emit('keyUp', 'up');
            break;
        case RIGHT_CODE:
            inputs[e.which] = false;
            socket.emit('keyUp', 'right');
            break;
        case DOWN_CODE:
            inputs[e.which] = false;
            socket.emit('keyUp', 'down');
            break;
    }
}
