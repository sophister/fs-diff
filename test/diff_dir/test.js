/**
 * 测试 新增文件 情况下，目录diff结果
 */

'use strict';

const diffDir = require('../../lib/diff_dir.js');


const oldPath = process.env.old_dir;
const newPath = process.env.new_dir;


async function main() {
    console.log(`旧的目录为: ${oldPath}\n新的目录为：${newPath}`);
    try {
        let result = await diffDir.diffDir(newPath, oldPath);
        console.log(result);
    } catch (err) {
        console.error(err);
    }
}


main();