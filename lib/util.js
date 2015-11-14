Util = function() {};

/**
 * Find a random value from [min, max)
 */
Util.random = function(min, max) {
    return ((Math.random() * (max - min)) | 0) + min;
};


Util.randomColor = function() {
    var codes = [0, 1, 2];
    Util.shuffleArray(codes);

    var color = 0;
    for (var i = 0; i < codes.length; i++) {
        switch (codes[i]) {
            case 0:
                color <<= 8;
                color += 32;
                break;
            case 1:
                color <<= 8;
                color += 255;
                break;
            case 2:
                color <<= 8;
                color += Util.random(0, 256);
                break;
        }
    }

    return color;
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
