/**
 * 
 */

'use strict';

const readDir = require('./lib/read_dir.js');
const diffDir = require('./lib/diff_dir.js');
const sign = require('./lib/sign.js');

module.exports = {
    read: readDir,
    diff: diffDir,
    sign : sign
};