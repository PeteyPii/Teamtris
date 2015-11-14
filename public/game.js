var ctx = null;

var blockImage = new Image();
blockImage.src = '/assets/block.png';

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
                ctx.fillStyle = '#' + c.toString(16);
                ctx.fillRect(x * 32, y * 32, 32, 32);
            }
        }
    }

    ctx.globalCompositeOperation = 'multiply';
    for (var x = 0; x < board.grid.length; x++) {
        for (var y = 0; y < board.grid[x].length; y++) {
            c = board.grid[x][y];
            if (c > 0) {
                ctx.drawImage(blockImage, x * 32, y * 32);
            }
        }
    }
    ctx.globalCompositeOperation = 'normal';
});

socket.on('message', function(data) {
    console.log(data);
});

socket.on('init', function(data) {
    ctx = document.getElementById('game').getContext('2d');

    ctx.canvas.width = 32 * data.width;
    ctx.canvas.height = 32 * data.height;
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
