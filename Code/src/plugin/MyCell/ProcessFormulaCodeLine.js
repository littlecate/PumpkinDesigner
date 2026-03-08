'use strict';

/**
 * @fileoverview 处理公式代码行模块，将单元格引用转换为函数调用
 * @module ProcessFormulaCodeLine
 */

/**
 * 处理公式代码行类
 * @class
 * @param {Array} _codeLine - 代码行数组
 */
function ProcessFormulaCodeLine(_codeLine) {
    var codeLine = Comman.DeepCopyObj(_codeLine);

    function DoJob() {        
        for (var i = 0; i < codeLine.length; i++) {
            var p = codeLine[i];            
            var mc = Regex.Match(p, /^([A-Za-z]{1,3})(\d{1,5})$/);
            if (mc.Success) {
                codeLine[i] = "GetCellValue";
                codeLine.InsertRange(i + 1, ["(", p.ToUpper(), ")"]);
                i += 3;
            }
        }
        return codeLine;
    }

    return {
        DoJob: DoJob
    }
}