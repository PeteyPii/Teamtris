var game = new Phaser.Game(40*32, 704, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var cursors;
var socket;
var grid;

function preload() {
    game.load.image('block', 'assets/block.png');

    socket = io();
    var self = this;
    socket.on('board', function(game_state) {
        self.game.board = game_state['board'];
        var score = game_state['score'];
        update();
    });
    socket.on('message', function(data) {
        console.log(data);
    });

    var style = { font: "32px Arial", fill: "#BF5FFF", wordWrap: true, wordWrapWidth: 200, align: "center" };
    text = game.add.text(33*32, 0, "TeamTris", style);
}

function create() {
    this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

	cursors = game.input.keyboard.createCursorKeys();
	cursors.left.onDown.add(function() {
		socket.emit('keyDown', 'left');
	});
	cursors.left.onUp.add(function() {
		socket.emit('keyUp', 'left');
	});

	cursors.right.onDown.add(function() {
		socket.emit('keyDown', 'right');
	});
	cursors.right.onUp.add(function() {
		socket.emit('keyUp', 'right');
	});

	cursors.down.onDown.add(function() {
		socket.emit('keyDown', 'down');
	});
	cursors.down.onUp.add(function() {
		socket.emit('keyUp', 'down');
	});

    cursors.up.onDown.add(function() {
        socket.emit('keyDown', 'up');
    });
    cursors.up.onUp.add(function() {
        socket.emit('keyUp', 'up');
    });

    space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space.onDown.add(function() {
        socket.emit('keyDown', 'space');
    });
    space.onUp.add(function() {
        socket.emit('keyUp', 'space');
    });

    grid = [];
    for (var i = 0; i < 30; i++) {
        grid.push([]);
        for (var j = 0; j < 22; j++) {
            var block = new Block(game, i * 32, j * 32);
            grid[i].push(block);
        }
    }
}

function update() {
    drawLine();
    if (this.game.board) {
        for (var x = 0; x < this.game.board.width; x++) {
            for (var y = 0; y < this.game.board.height; y++) {
                if (this.game.board.grid[x][y] > 0) {
                    grid[x][y].show(this.game.board.grid[x][y]);
                } else {
                    grid[x][y].hide();
                }
            }
        }
    }
}

function drawLine()
{
    bmd = game.add.bitmapData(10*32,704);
    var color = 'white';

    // bmd.ctx.beginPath();
    // bmd.ctx.lineWidth = "4";
    // bmd.ctx.strokeStyle = color;
    // bmd.ctx.stroke();
      bmd.ctx.beginPath();
  bmd.ctx.moveTo(0, 0);
  bmd.ctx.lineTo(0 , 704);
  bmd.ctx.lineWidth = 4;
    bmd.ctx.strokeStyle = color;

  bmd.ctx.stroke();

    sprite = game.add.sprite(30*32, 0, bmd);


  // // bmd.clear();
  // bmd.ctx.beginPath();
  // bmd.ctx.moveTo(30*32, 0);
  // bmd.ctx.lineTo(30*32 , 704);
  // bmd.ctx.lineWidth = 4;
  // bmd.ctx.stroke();
  // bmd.render();


}

