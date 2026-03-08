import os
import shutil


class VueGenerator:
    
    def __init__(self, folder: str):
        self.folder = folder
    
    def generate_vue_version(self):
        dist_folder = os.path.join(self.folder, 'dist')
        
        js_file = os.path.join(dist_folder, 'PumpkinDesigner.js')
        min_js_file = js_file + '.min.js'
        
        if os.path.exists(js_file):
            self._convert_to_vue(js_file, js_file + '.vue.js')
        
        if os.path.exists(min_js_file):
            self._convert_to_vue(min_js_file, min_js_file + '.vue.js')
    
    def _convert_to_vue(self, src_file: str, dest_file: str):
        with open(src_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        content = content.replace('function PumpkinDesigner(', 'export function PumpkinDesigner(')
        
        with open(dest_file, 'w', encoding='utf-8') as f:
            f.write(content)
