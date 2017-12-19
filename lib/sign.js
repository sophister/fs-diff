/**
 * 包含各种计算签名的方法
 */

'use strict';

const fs = require('fs');
const crypto = require('crypto');


const singleton = {

    /**
     * 计算某个文件的MD5
     * @param {string} fileAbsolutePath 文件的绝对路径
     */
    fileMd5(fileAbsolutePath) {
        return new Promise(function(resolve, reject) {
            try {
                var stream = fs.ReadStream(fileAbsolutePath);
                var hash = crypto.createHash('md5');
                var res;
                stream.on('data', function(data) {
                    hash.update(data);
                });
                stream.on('end', function() {
                    res = hash.digest('hex');
                    resolve(res);
                });
            } catch (err) {
                reject(err);
            }
        });
    }
};


module.exports = singleton;