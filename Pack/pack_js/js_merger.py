import os
from typing import List
from .file_encoding import FileEncoding


class JsFileMerger:
    
    def __init__(self, folder: str):
        self.folder = folder
    
    def merge_js_files(self) -> str:
        src_folder = os.path.join(self.folder, 'src')
        dist_folder = os.path.join(self.folder, 'dist')
        
        if not os.path.exists(dist_folder):
            os.makedirs(dist_folder)
        
        dest_file = os.path.join(dist_folder, 'PumpkinDesigner.js')
        
        js_files = []
        for root, dirs, files in os.walk(src_folder):
            for file in files:
                if file.endswith('.js'):
                    js_files.append(os.path.join(root, file))
        
        js_files.sort()
        
        with open(dest_file, 'w', encoding='utf-8') as f:
            f.write("'use strict';\r\nfunction PumpkinDesigner(config){")
        
        for js_file in js_files:
            self._append_file_content(dest_file, js_file)
        
        with open(dest_file, 'a', encoding='utf-8') as f:
            f.write(" return new MyCellDesigner(config);}")
        
        return dest_file
    
    def _append_file_content(self, dest_file: str, src_file: str):
        try:
            content = FileEncoding.read_file(src_file)
            lines = content.split('\n')
            
            with open(dest_file, 'a', encoding='utf-8') as f:
                for line in lines:
                    f.write(line + '\n')
        except Exception as e:
            print(f"Error reading file {src_file}: {e}")
