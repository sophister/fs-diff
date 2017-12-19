/**
 * diff 两个目录，产出差异数据
 */

'use strict';

const fs = require('fs');
const path = require('path');

const readDir = require('./read_dir.js');
const fsp = require('./fs_promise.js');
const sign = require('./sign.js');
const DiffStatus = require('./diff_status.js');


//新增的文件
const STATUS_ADD = DiffStatus.ADD;
//被修改过的文件
const STATUS_UPDATE = DiffStatus.UPDATE;
//被删除的文件
const STATUS_DELETE = DiffStatus.DELETE;

/**
 * 计算某个目录下所有的文件md5，输出为 { fileRelativePath : md5Value, relative2 : value2 }
 * @param {array} fileList 某个目录下的所有的文件路径列表，相对于 relativeDir 的路径
 * @param {string} relativeDir 上述文件所属的目录
 */
async function calculateFilesMd5Map(fileList, relativeDir) {
    let out = {};
    for (let i = 0, len = fileList.length; i < len; i++) {
        let file = fileList[i];
        let absolutePath = file;
        if (relativeDir) {
            absolutePath = path.resolve(relativeDir, file);
        } else {
            absolutePath = path.normalize(file);
        }
        let md5 = await sign.fileMd5(absolutePath);
        out[file] = md5;
    }

    return out;
}

/**
 * 对比两个目录的差异
 * @param {string} toDir 新目录的绝对路径
 * @param {string} fromDir 旧目录的绝对路径
 */
async function diffDir(toDir, fromDir) {
    let isDir = await fsp.isDir(toDir);
    if (!isDir) {
        throw new Error(`toDir must be a directory!`);
    }
    isDir = await fsp.isDir(fromDir);
    if (!isDir) {
        throw new Error(`fromDir must be a directory!`);
    }

    let toFiles = await readDir.getFiles(toDir);
    let fromFiles = await readDir.getFiles(fromDir);

    let toFilesMd5Map = await calculateFilesMd5Map(toFiles, toDir);
    let fromFilesMd5Map = await calculateFilesMd5Map(fromFiles, fromDir);

    let out = {};

    //先将原来所有的文件都置为 删除 状态
    for (let file in fromFilesMd5Map) {
        out[file] = {
            status: STATUS_DELETE,
            md5: fromFilesMd5Map[file]
        };
    }

    //遍历新目录的文件，找出修改和新增的文件
    for (let file in toFilesMd5Map) {
        let value = toFilesMd5Map[file];
        let fromValue = fromFilesMd5Map[file];
        if (fromValue) {
            if (value === fromValue) {
                //相同的文件
                delete out[file];
            } else {
                //修改的文件
                out[file] = {
                    status: STATUS_UPDATE,
                    md5: value
                };
            }
        } else {
            //新增的文件
            out[file] = {
                status: STATUS_ADD,
                md5: value
            };
        }
    }

    return out;
}


module.exports = {
    diffDir
};