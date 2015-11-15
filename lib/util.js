Util = function() {};

/**
 * Find a random value from [min, max)
 */
Util.random = function(min, max) {
    return ((Math.random() * (max - min)) | 0) + min;
};


Util.randomColour = function() {
    var codes = [0, 1, 2];
    Util.shuffleArray(codes);

    var colour = 0;
    for (var i = 0; i < codes.length; i++) {
        switch (codes[i]) {
            case 0:
                colour <<= 8;
                colour += 32;
                break;
            case 1:
                colour <<= 8;
                colour += 255;
                break;
            case 2:
                colour <<= 8;
                colour += Util.random(0, 256);
                break;
        }
    }

    return colour;
}

Util.shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

module.exports = Util;
