#!/usr/bin/env python3

import json

# 读取definedMap.txt文件，解析替换规则
def load_replace_rules(map_file):
    rules = {}
    with open(map_file, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or '|' not in line:
                continue
            # 跳过行号部分，直接获取键值对
            parts = line.split('|')
            if len(parts) >= 2:
                # 提取原始字符串和替换字符串
                original = parts[0].split('→')[-1] if '→' in parts[0] else parts[0]
                replacement = parts[1]
                rules[original] = replacement
    return rules

# 读取test1.js文件内容
def load_test_file(test_file):
    with open(test_file, 'r', encoding='utf-8') as f:
        content = f.read()
    return content

# 执行替换操作
def perform_replacements(content, rules):
    # 按照键的长度降序排序，确保长键先被替换
    sorted_rules = sorted(rules.items(), key=lambda x: len(x[0]), reverse=True)
    for original, replacement in sorted_rules:
        content = content.replace(original, replacement)
    return content

# 保存结果到新文件
def save_result(content, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    # 文件路径
    map_file = 'definedMap.txt'
    test_file = 'testData/test1.js'
    output_file = 'testData/test1.min.js'
    
    # 加载替换规则
    rules = load_replace_rules(map_file)
    print(f"加载了 {len(rules)} 条替换规则")
    
    # 加载测试文件
    content = load_test_file(test_file)
    print(f"加载了测试文件，大小: {len(content)} 字符")
    
    # 执行替换
    modified_content = perform_replacements(content, rules)
    print(f"替换完成，新文件大小: {len(modified_content)} 字符")
    
    # 保存结果
    save_result(modified_content, output_file)
    print(f"结果已保存到 {output_file}")
