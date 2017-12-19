#!/bin/bash

# 测试在 删除文件 的情况下，目录diff的结果

node -v

old_dir=./delete/old new_dir=./delete/new node test.js

