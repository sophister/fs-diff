#!/bin/bash

# 测试在 新增文件 的情况下，目录diff的结果

node -v

old_dir=./add/old new_dir=./add/new node test.js

