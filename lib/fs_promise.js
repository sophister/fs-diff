/**
 * promisify node.js 'fs' module
 */

'use strict';

const fs = require('fs');

let singleton = {

    readdir(path, options) {
        return new Promise(function(resolve, reject) {
            fs.readdir(path, options, function(err, files) {
                if (err) {
                    return reject(err);
                }
                resolve(files);
            });
        });
    },

    stat(path) {
        return new Promise(function(resolve, reject) {
            fs.stat(path, function(err, stats) {
                if (err) {
                    return reject(err);
                }
                resolve(stats);
            });
        });
    },

    /**
     * 判断某个路径是否为 目录
     * @param {string} path 路径
     */
    isDir(path) {
        return singleton.stat(path)
            .then((stats) => {
                return stats.isDirectory();
            });
    }
};


module.exports = singleton;