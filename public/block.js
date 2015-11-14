Block = function(game, x, y) {
    this.sprite = game.add.sprite(x, y, 'block');
}

Block.prototype = {
    show: function(color) {
        this.sprite.tint = color;
        this.sprite.visible = true;
    },

    hide: function() {
        this.sprite.visible = false;
    }
}
