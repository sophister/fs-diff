#!/bin/bash

# 测试在 各种case 的情况下，产出目录diff的结果

node -v

mkdir -p ./output

rm -rf ./output/*

old_dir=./all/old new_dir=./all/new output_dir=./output node output.js

