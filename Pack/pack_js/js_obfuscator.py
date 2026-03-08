import os
import base64
from typing import List
from .js_lexer import JsLexer
from .replace_map import ReplaceMap


class JsObfuscator:
    
    def __init__(self, dest_file: str, folder: str = None):
        self.dest_file = dest_file
        self.folder = folder or os.path.dirname(dest_file)
        self.code_lines = []
        self.lexer = JsLexer()
    
    def do_job(self) -> str:
        with open(self.dest_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        content = content.replace("'use strict';", "")
        
        self.code_lines = self.lexer.split_source(content)
        
        self._remove_comments()
        self._remove_duplicate_newlines()
        self._replace_identifiers()
        self._replace_images_with_base64()
        
        copyright_str = self._get_copyright_str()
        result = copyright_str + "\r\n" + "".join(self.code_lines)
        
        output_file = self.dest_file + ".min.js"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(result)
        
        self._remove_empty_lines(output_file)
        
        return output_file
    
    def _remove_comments(self):
        i = 0
        while i < len(self.code_lines):
            if self.code_lines[i] == "//":
                end_pos = self._find_end_pos(i + 1, "\n")
                if end_pos != -1:
                    del self.code_lines[i:end_pos + 1]
                    if i > 0:
                        i -= 1
            elif self.code_lines[i] == "/*":
                end_pos = self._find_end_pos(i + 1, "*/")
                if end_pos != -1:
                    del self.code_lines[i:end_pos + 1]
                    if i > 0:
                        i -= 1
            else:
                i += 1
    
    def _find_end_pos(self, start_index: int, target: str) -> int:
        for i in range(start_index, len(self.code_lines)):
            if self.code_lines[i] == target:
                return i
        return -1
    
    def _remove_duplicate_newlines(self):
        i = 0
        while i < len(self.code_lines):
            if self.code_lines[i] == "\n" and i + 1 < len(self.code_lines) and self.code_lines[i + 1] == "\n":
                del self.code_lines[i + 1]
                if i > 0:
                    i -= 1
            else:
                i += 1
    
    def _replace_identifiers(self):
        replace_maps = ReplaceMap(self.folder).get_replace_maps()
        replace_dict = {map_item.old_str: map_item.new_str for map_item in replace_maps}
        
        for i in range(len(self.code_lines)):
            if self.code_lines[i] in replace_dict:
                if i >= 2 and self.code_lines[i - 2] == "ctx" and self.code_lines[i - 1] == ".":
                    continue
                if i >= 2 and self.code_lines[i - 2] == "style" and self.code_lines[i - 1] == ".":
                    continue
                self.code_lines[i] = replace_dict[self.code_lines[i]]
    
    def _replace_images_with_base64(self):
        for i in range(len(self.code_lines)):
            token = self.code_lines[i]
            if (token.startswith('"') and (token.endswith('.gif"') or token.endswith('.png"') or token.endswith('.svg"'))) or (token.startswith("'") and (token.endswith(".gif'") or token.endswith(".png'") or token.endswith(".svg'"))):
                image_filename = self._get_image_filename(token)
                image_path = os.path.join(self.folder, image_filename)
                
                if os.path.exists(image_path):
                    image_type = self._get_image_type(token)
                    with open(image_path, 'rb') as img_file:
                        base64_data = base64.b64encode(img_file.read()).decode('utf-8')
                    
                    data_url = f'data:image/{image_type};base64,{base64_data}'
                    self.code_lines[i] = f'"{data_url}"'
    
    def _get_image_type(self, token: str) -> str:
        token = token.strip('"').strip("'")
        if token.endswith('.gif'):
            return 'gif'
        if token.endswith('.png'):
            return 'png'
        if token.endswith('.svg'):
            return 'svg+xml'
        raise Exception(f"Unknown image extension: {token}")
    
    def _get_image_filename(self, token: str) -> str:
        return token.strip('"').strip("'")
    
    def _get_copyright_str(self) -> str:
        return "/******************************************************************************************************\r\n" \
               "**本代码由广州无量小南瓜软件科技有限公司提供开源版本,官网www.pumpkindev.com**\r\n" \
               "*******************************************************************************************************/\r\n"
    
    def _remove_empty_lines(self, file_path: str):
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        with open(file_path, 'w', encoding='utf-8') as f:
            for line in lines:
                trimmed = line.strip()
                if trimmed:
                    if trimmed.endswith('{'):
                        f.write(trimmed + '\n')
                    else:
                        f.write(trimmed + '\n')
