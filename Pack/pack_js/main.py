import os
import argparse
from .js_merger import JsFileMerger
from .js_obfuscator import JsObfuscator
from .vue_generator import VueGenerator


class PackJs:
    
    def __init__(self, folder: str):
        self.folder = os.path.abspath(folder)
    
    def run(self) -> dict:
        print(f"开始处理目录: {self.folder}")
        
        print("步骤1: 合并JS文件...")
        merger = JsFileMerger(self.folder)
        merged_file = merger.merge_js_files()
        print(f"  合并完成: {merged_file}")
        
        print("步骤2: 混淆加密处理...")
        obfuscator = JsObfuscator(merged_file, self.folder)
        obfuscated_file = obfuscator.do_job()
        print(f"  混淆完成: {obfuscated_file}")
        
        print("步骤3: 生成Vue版本...")
        vue_gen = VueGenerator(self.folder)
        vue_gen.generate_vue_version()
        print("  Vue版本生成完成")
        
        print("处理完成!")
        
        return {
            'merged_file': merged_file,
            'obfuscated_file': obfuscated_file,
            'vue_files': [
                merged_file + '.vue.js',
                obfuscated_file + '.vue.js'
            ]
        }


def main():
    parser = argparse.ArgumentParser(description='打包并混淆JS文件')
    parser.add_argument('folder', nargs='?', default='.', help='要处理的文件夹路径')
    parser.add_argument('-v', '--verbose', action='store_true', help='显示详细输出')
    
    args = parser.parse_args()
    
    packer = PackJs(args.folder)
    result = packer.run()
    
    if args.verbose:
        print("\n输出文件:")
        for key, value in result.items():
            if isinstance(value, list):
                for v in value:
                    print(f"  {v}")
            else:
                print(f"  {value}")


if __name__ == '__main__':
    main()
