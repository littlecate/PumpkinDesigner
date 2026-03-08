import sys
import os
sys.path.insert(0, r'f:\CodeSYS\myHtml5V2\PackMyHtml5V2')

from pack_js.js_lexer import JsLexer
from pack_js.js_obfuscator import JsObfuscator
from pack_js.replace_map import ReplaceMap

print("=" * 60)
print("测试1: 词法分析器")
print("=" * 60)

test_code = """
function GlobalV() {
    var Stage = 1;
    // This is a comment
    var Thing = "hello";
    /* Multi-line
       comment */
    return Stage + Thing;
}
"""

lexer = JsLexer()
tokens = lexer.split_source(test_code)
print(f"原始代码行数: {len(test_code.split(chr(10)))}")
print(f"Token数量: {len(tokens)}")
print(f"前20个tokens: {tokens[:20]}")

print("\n" + "=" * 60)
print("测试2: 注释移除")
print("=" * 60)

code_lines = tokens.copy()

def remove_comments(code_lines):
    i = 0
    while i < len(code_lines):
        if code_lines[i] == "//":
            end_pos = -1
            for j in range(i + 1, len(code_lines)):
                if code_lines[j] == "\n":
                    end_pos = j
                    break
            if end_pos != -1:
                del code_lines[i:end_pos + 1]
                if i > 0:
                    i -= 1
        elif code_lines[i] == "/*":
            end_pos = -1
            for j in range(i + 1, len(code_lines)):
                if code_lines[j] == "*/":
                    end_pos = j
                    break
            if end_pos != -1:
                del code_lines[i:end_pos + 1]
                if i > 0:
                    i -= 1
        else:
            i += 1
    return code_lines

code_lines_no_comments = remove_comments(code_lines.copy())
print(f"移除注释后Token数量: {len(code_lines_no_comments)}")
print(f"前30个tokens: {code_lines_no_comments[:30]}")

print("\n" + "=" * 60)
print("测试3: 替换映射")
print("=" * 60)

replace_map = ReplaceMap(r'f:\CodeSYS\myHtml5V2\PackMyHtml5V2')
maps = replace_map.get_replace_maps()
print(f"映射数量: {len(maps)}")
print(f"前10个映射:")
for m in maps[:10]:
    print(f"  {m.old_str} -> {m.new_str}")

print("\n" + "=" * 60)
print("测试4: 变量替换")
print("=" * 60)

replace_dict = {m.old_str: m.new_str for m in maps}
replaced_lines = code_lines_no_comments.copy()
for i in range(len(replaced_lines)):
    if replaced_lines[i] in replace_dict:
        if i >= 2 and replaced_lines[i - 2] == "ctx" and replaced_lines[i - 1] == ".":
            continue
        if i >= 2 and replaced_lines[i - 2] == "style" and replaced_lines[i - 1] == ".":
            continue
        replaced_lines[i] = replace_dict[replaced_lines[i]]

print(f"替换后代码片段: {''.join(replaced_lines[:50])}")

print("\n" + "=" * 60)
print("所有测试完成!")
print("=" * 60)
