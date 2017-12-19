/**
 * 测试产出目录diff之后的结果
 */

'use strict';

const diffDir = require('../../lib/diff_dir.js');


const oldPath = process.env.old_dir;
const newPath = process.env.new_dir;
const outputPath = process.env.output_dir;


async function main() {
    console.log(`旧的目录为: ${oldPath}\n新的目录为：${newPath}\n产出目录为：${outputPath}`);
    try {
        await diffDir.diffDirResult(newPath, oldPath, outputPath);
        console.log('end');
    } catch (err) {
        console.error(err);
    }
}


main();