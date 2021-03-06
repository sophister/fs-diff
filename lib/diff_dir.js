/**
 * diff 两个目录，产出差异数据
 */

'use strict';

const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

const readDir = require('./read_dir.js');
const fsp = require('./fs_promise.js');
const sign = require('./sign.js');
const DiffStatus = require('./diff_status.js');


//相同的文件
const STATUS_SAME = DiffStatus.SAME;
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
 * @returns {object} JSON文件，包含diff的结果描述
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
                //将相同的文件，也返回给调用者
                // delete out[file];
                out[file] = {
                    status: STATUS_SAME,
                    md5: value
                };
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

/**
 * diff两个目录，并且把差异的部分存储到 resultDir 目录中
 * @param {string} toDir 新的目录路径
 * @param {string} fromDir 旧的目录路径
 * @param {string} resultDir 产出的目标目录路径
 * @returns {object} JSON文件，包含diff的结果描述
 */
async function diffDirResult(toDir, fromDir, resultDir) {
    let result = await diffDir(toDir, fromDir);
    let files = Object.keys(result);
    for (let i = 0, len = files.length; i < len; i++) {
        let fileKey = files[i];
        let desc = result[fileKey];
        let status = desc.status;
        if (status === STATUS_ADD || status === STATUS_UPDATE) {
            //需要把文件从 toDir 中，拷贝到 resultDir 中
            let finalPath = path.resolve(resultDir, fileKey);
            let finalDir = path.dirname(finalPath);
            //先确保最终目录里，已经创建了对应的目录结果
            await fse.ensureDir(finalDir);
            //拷贝文件
            let tempFile = path.resolve(toDir, fileKey);
            await fse.copy(tempFile, finalPath);
        }
    }

    return result;
}


module.exports = {
    diffDir,
    diffDirResult,
    DiffStatus
};