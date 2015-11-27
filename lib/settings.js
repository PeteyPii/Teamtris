var _ = require('lodash');

var logger = require('./logger.js');

var settings = {};

try {
    var defaults = require('../defaults.json');
    _.assign(settings, defaults);
} catch (err) {
    // Silently ignore (in case the file is missing)
}

try {
    var userSettings = require('../settings.json');
    _.assign(settings, userSettings);
} catch (err) {
    // Silently ignore (in case the file is missing)
}

function validateSettings(settings) {
    var requiredSettings = [
        'server_port',
        'stage_width',
        'stage_height',
    ];

    for (var i = 0; i < requiredSettings.length; i++) {
        if (typeof settings[requiredSettings[i]] == 'undefined')
            throw new Error('Missing setting \'' + requiredSettings[i] + '\'');
    }

    function isValidPort(port) {
        return _.isNumber(port) &&
            port > 0 && port < 65536 &&
            port === port | 0;
    }

    if (!isValidPort(settings.server_port))
        throw new Error('Port for server must be valid');
    if (!_.isNumber(settings.stage_width) || (settings.stage_width !== settings.stage_width | 0) || settings.stage_width <= 0)
        throw new Error('Stage width should be a positive integer');
    if (!_.isNumber(settings.stage_height) || (settings.stage_height !== settings.stage_height | 0) || settings.stage_height <= 0)
        throw new Error('Stage height should be a positive integer');
}

try {
    validateSettings(settings);
} catch (err) {
    if (err.stack) {
        logger.error(err.stack);
    } else {
        logger.error('Error: ' + err);
    }

    // Just stop everything and tell the user they need to fix their settings
    process.kill(process.pid);
}

module.exports = settings;
