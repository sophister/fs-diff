/**
 * 递归的阅读某个目录下所有的文件和子目录
 */

const fs = require('fs');
const path = require('path');

const util = require('./util.js');
const fsp = require('./fs_promise.js');

const sep = path.sep;
const isString = util.isString;


async function getFiles(dir, prefix, filter) {
    dir = path.normalize(dir);
    if (!fs.existsSync(dir)) {
        return [];
    }
    if (!isString(prefix)) {
        filter = prefix;
        prefix = '';
    }
    prefix = prefix || '';
    let files = await fsp.readdir(dir);
    let result = [];
    for (let i = 0, len = files.length; i < len; i++) {
        let item = files[i];
        let stat = await fsp.stat(dir + sep + item);
        if (stat.isFile()) {
            if (!filter || filter(item)) {
                result.push(prefix + item);
            }
        } else if (stat.isDirectory()) {
            if (!filter || filter(item, true)) {
                let cFiles = await getFiles(dir + sep + item, prefix + item + sep, filter);
                result = result.concat(cFiles);
            }
        }
    }

    return result;
}

/**
 * 同步的递归读取某个目录下所有的文件和子目录
 * @param {string} dir 目录路径
 * @param {string} prefix 返回的文件路径中，添加的前缀
 * @param {function} filter 过滤函数，如果返回 false，则对应的文件、目录会忽略掉
 */
function getFilesSync(dir, prefix, filter) {
    dir = path.normalize(dir);
    if (!fs.existsSync(dir)) {
        return [];
    }
    if (!isString(prefix)) {
        filter = prefix;
        prefix = '';
    }
    prefix = prefix || '';
    let files = fs.readdirSync(dir);
    let result = [];
    files.forEach(item => {
        let stat = fs.statSync(dir + sep + item);
        if (stat.isFile()) {
            if (!filter || filter(item)) {
                result.push(prefix + item);
            }
        } else if (stat.isDirectory()) {
            if (!filter || filter(item, true)) {
                let cFiles = getFilesSync(dir + sep + item, prefix + item + sep, filter);
                result = result.concat(cFiles);
            }
        }
    });
    return result;
}



module.exports = {
    getFiles,
    getFilesSync
};