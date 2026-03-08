import re
from typing import List


class JsLexer:
    
    def __init__(self):
        pass
    
    def split_source(self, s: str) -> List[str]:
        result = []
        s1 = ""
        in_quote = 0
        in_quote2 = 0
        i = 0
        length = len(s)
        
        while i < length:
            if i + 1 < length and s[i] == '\\' and s[i + 1] == '\'':
                s1 += "\\'"
                i += 2
                continue
            elif i + 1 < length and s[i] == '\\' and s[i + 1] == '"':
                s1 += '\\"'
                i += 2
                continue
            elif s[i] == '\'':
                if in_quote2 % 2 == 0:
                    if i + 1 < length and s[i + 1] == '\'':
                        if s1.strip():
                            result.append(s1.strip())
                            s1 = ""
                        result.append("''")
                        i += 2
                        in_quote = 0
                        continue
                    else:
                        in_quote += 1
                        s1 += s[i]
                        if in_quote % 2 == 0:
                            if s1.strip():
                                result.append(s1.strip())
                                s1 = ""
                        i += 1
                        continue
                else:
                    s1 += s[i]
                    i += 1
                    continue
            elif s[i] == '\"':
                if in_quote % 2 == 0:
                    if i + 1 < length and s[i + 1] == '\"':
                        if s1.strip():
                            result.append(s1.strip())
                            s1 = ""
                        result.append('""')
                        i += 2
                        in_quote2 = 0
                        continue
                    else:
                        in_quote2 += 1
                        s1 += s[i]
                        if in_quote2 % 2 == 0:
                            if s1.strip():
                                result.append(s1.strip())
                                s1 = ""
                        i += 1
                        continue
                else:
                    s1 += s[i]
                    i += 1
                    continue
            elif in_quote % 2 == 0 and in_quote2 % 2 == 0:
                if i + 1 < length and s[i] == '\r' and s[i + 1] == '\n':
                    if s1.strip():
                        result.append(s1.strip())
                        s1 = ""
                    result.append("\r\n")
                    i += 2
                    continue
                elif s[i] == '\r':
                    if s1.strip():
                        result.append(s1.strip())
                        s1 = ""
                    result.append("\r")
                    i += 1
                    continue
                elif s[i] == '\n':
                    if s1.strip():
                        result.append(s1.strip())
                        s1 = ""
                    result.append("\n")
                    i += 1
                    continue
                elif re.match(r'\s', s[i]):
                    if s1.strip():
                        result.append(s1.strip())
                        s1 = ""
                    result.append(s[i])
                    i += 1
                    continue
                elif i + 1 < length and s[i] in '><+-%*/' and s[i + 1] == '=':
                    if s1.strip():
                        result.append(s1.strip())
                        s1 = ""
                    result.append(s[i] + "=")
                    i += 2
                    continue
                elif i + 1 < length and s[i] == '/' and s[i + 1] == '/':
                    if s1.strip():
                        result.append(s1.strip())
                        s1 = ""
                    result.append("//")
                    i += 2
                    continue
                elif i + 1 < length and s[i] == '/' and s[i + 1] == '*':
                    if s1.strip():
                        result.append(s1.strip())
                        s1 = ""
                    result.append("/*")
                    i += 2
                    continue
                elif i + 1 < length and s[i] == '*' and s[i + 1] == '/':
                    if s1.strip():
                        result.append(s1.strip())
                        s1 = ""
                    result.append("*/")
                    i += 2
                    continue
                elif i + 2 < length and s[i] == '!' and s[i + 1] == '=' and s[i + 2] == '=':
                    if s1.strip():
                        result.append(s1.strip())
                        s1 = ""
                    result.append("!==")
                    i += 3
                    continue
                elif i + 2 < length and s[i] == '=' and s[i + 1] == '=' and s[i + 2] == '=':
                    if s1.strip():
                        result.append(s1.strip())
                        s1 = ""
                    result.append("===")
                    i += 3
                    continue
                elif i + 1 < length and s[i] == '!' and s[i + 1] == '=':
                    if s1.strip():
                        result.append(s1.strip())
                        s1 = ""
                    result.append("!=")
                    i += 2
                    continue
                elif i + 1 < length and s[i] == '=' and s[i + 1] == '=':
                    if s1.strip():
                        result.append(s1.strip())
                        s1 = ""
                    result.append("==")
                    i += 2
                    continue
                elif i + 1 < length and s[i] == '+' and s[i + 1] == '+':
                    if s1.strip():
                        result.append(s1.strip())
                        s1 = ""
                    result.append("++")
                    i += 2
                    continue
                elif i + 1 < length and s[i] == '-' and s[i + 1] == '-':
                    if s1.strip():
                        result.append(s1.strip())
                        s1 = ""
                    result.append("--")
                    i += 2
                    continue
                elif i + 1 < length and s[i] == '(' and s[i + 1] == ')':
                    if s1.strip():
                        result.append(s1.strip())
                        s1 = ""
                    result.append("()")
                    i += 2
                    continue
                elif i + 1 < length and s[i] == '[' and s[i + 1] == ']':
                    if s1.strip():
                        result.append(s1.strip())
                        s1 = ""
                    result.append("[]")
                    i += 2
                    continue
                elif i + 1 < length and s[i] == '|' and s[i + 1] == '|':
                    if s1.strip():
                        result.append(s1.strip())
                        s1 = ""
                    result.append("||")
                    i += 2
                    continue
                elif i + 1 < length and s[i] == '&' and s[i + 1] == '&':
                    if s1.strip():
                        result.append(s1.strip())
                        s1 = ""
                    result.append("&&")
                    i += 2
                    continue
                elif s[i] in '(),=><;+-*/%{}[]!.:':
                    if s1.strip():
                        result.append(s1.strip())
                        s1 = ""
                    result.append(s[i])
                    i += 1
                    continue
                else:
                    s1 += s[i]
                    i += 1
                    continue
            else:
                s1 += s[i]
                i += 1
                continue
        
        if s1.strip():
            result.append(s1.strip())
        
        return result
