/**
 * 测试 read_dir.js 基础功能
 */

'use strict';

const path = require('path');

const readDir = require('../../lib/read_dir.js');


let target = process.env.dir;


async function main() {
    console.log(`递归读取的目录为： ${target}`);
    try {
        let files = await readDir.getFiles(target);
        console.log(`所有文件列表：\n`);
        console.log(files.join('\n'));
    } catch (err) {
        console.error(err);
    }
}


main();