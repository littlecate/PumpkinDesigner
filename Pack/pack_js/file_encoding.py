import os
from typing import Optional


class FileEncoding:
    
    @staticmethod
    def get_type(file_path: str) -> str:
        with open(file_path, 'rb') as f:
            data = f.read()
        return FileEncoding._detect_encoding(data)
    
    @staticmethod
    def _detect_encoding(data: bytes) -> str:
        if len(data) < 3:
            return 'utf-8'
        
        if data[0] == 0xEF and data[1] == 0xBB and data[2] == 0xBF:
            return 'utf-8-sig'
        
        if data[0] == 0xFE and data[1] == 0xFF and (len(data) < 3 or data[2] == 0x00):
            return 'utf-16-be'
        
        if data[0] == 0xFF and data[1] == 0xFE:
            return 'utf-16-le'
        
        if FileEncoding._is_utf8_bytes(data):
            return 'utf-8'
        
        return 'utf-8'
    
    @staticmethod
    def _is_utf8_bytes(data: bytes) -> bool:
        char_byte_counter = 1
        for i in range(len(data)):
            cur_byte = data[i]
            if char_byte_counter == 1:
                if cur_byte >= 0x80:
                    temp = cur_byte
                    while ((temp << 1) & 0x80) != 0:
                        char_byte_counter += 1
                        temp = temp << 1
                    if char_byte_counter == 1 or char_byte_counter > 6:
                        return False
            else:
                if (cur_byte & 0xC0) != 0x80:
                    return False
                char_byte_counter -= 1
        
        return char_byte_counter <= 1
    
    @staticmethod
    def read_file(file_path: str) -> str:
        encoding = FileEncoding.get_type(file_path)
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return f.read()
        except UnicodeDecodeError:
            with open(file_path, 'r', encoding='gbk') as f:
                return f.read()
    
    @staticmethod
    def read_lines(file_path: str) -> list:
        encoding = FileEncoding.get_type(file_path)
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return f.readlines()
        except UnicodeDecodeError:
            with open(file_path, 'r', encoding='gbk') as f:
                return f.readlines()
