#!/bin/bash

# 测试在 修改文件 的情况下，目录diff的结果

node -v

old_dir=./update/old new_dir=./update/new node test.js

