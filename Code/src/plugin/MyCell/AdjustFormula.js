'use strict';

/**
 * @fileoverview 公式调整模块，用于在行列增删时自动调整公式中的单元格引用
 * @module AdjustFormula
 */

/**
 * 公式调整类
 * @class
 * @param {Formula} formula - 公式对象
 */
function AdjustFormula(/*Formula */formula) {

    /**
     * 添加行时调整公式
     * @function AddRow
     * @param {number} startRow - 起始行号
     * @param {number} addCount - 添加行数
     */
    function AddRow(/*int */startRow, /*int */addCount) {
        DoWithCodeLineAddRow(formula.codeLine, startRow, addCount);
        DoWithCodeLineAddRow(formula.codeLineRaw, startRow, addCount);
        AdjustRefColRowList();
    }

    /**
     * 调整引用的行列列表
     * @function AdjustRefColRowList
     */
    function AdjustRefColRowList() {
        var refColRowList = new GetRefColRowList(formula.codeLine).DoJob();
        formula.refColRowList = refColRowList;
    }

    /**
     * 删除行时调整公式
     * @function DeleteRow
     * @param {number} startRow - 起始行号
     * @param {number} deleteCount - 删除行数
     */
    function DeleteRow(/*int */startRow, /*int */deleteCount) {
        DoWithCodeLineAddRow(formula.codeLine, startRow, -deleteCount);
        DoWithCodeLineAddRow(formula.codeLineRaw, startRow, -deleteCount);
        AdjustRefColRowList();
    }

    /**
     * 添加列时调整公式
     * @function AddCol
     * @param {number} startCol - 起始列号
     * @param {number} addCount - 添加列数
     */
    function AddCol(/*int */startCol, /*int */addCount) {
        DoWithCodeLineAddCol(formula.codeLine, startCol, addCount);
        DoWithCodeLineAddCol(formula.codeLineRaw, startCol, addCount);
        AdjustRefColRowList();
    }

    /**
     * 删除列时调整公式
     * @function DeleteCol
     * @param {number} startCol - 起始列号
     * @param {number} deleteCount - 删除列数
     */
    function DeleteCol(/*int */startCol, /*int */deleteCount) {
        DoWithCodeLineAddCol(formula.codeLine, startCol, -deleteCount);
        DoWithCodeLineAddCol(formula.codeLineRaw, startCol, -deleteCount);
        AdjustRefColRowList();
    }

    /**
     * 处理代码行中的列引用调整
     * @function DoWithCodeLineAddCol
     * @param {Array} L - 代码行列表
     * @param {number} startCol - 起始列号
     * @param {number} addCount - 添加列数（负数表示删除）
     */
    function DoWithCodeLineAddCol(/*List <string > */L, /*int */startCol, /*int */addCount) {
        if (!L) {
            return;
        }
        var reg1 = /^([A-Za-z]{1,3})(\d{1,5})$/;
        var reg2 = /^([A-Za-z]{1,3})(\d{1,5}):([A-Za-z]{1,3})(\d{1,5})$/;
        for (var i = 0; i < L.Count(); i++) {
            var p = L[i];
            var mc = Regex.Match(p, reg1);
            if (mc.Success) {
                var colRow = Comman.GetColRow2(p);
                if (colRow.col >= startCol) {
                    colRow.col += addCount;
                }
                p = Comman.GetColRowStr(colRow);
                L[i] = p;
            }
            else {
                mc = Regex.Match(p, reg2);
                if (mc.Success) {
                    var ar = p.split(':');
                    var colRow1 = Comman.GetColRow2(ar[0]);
                    if (colRow1.col >= startCol) {
                        colRow1.col += addCount;
                    }
                    var colRow2 = Comman.GetColRow2(ar[1]);
                    if (colRow2.col >= startCol) {
                        colRow2.col += addCount;
                    }
                    p = Comman.GetColRowStr(colRow1) + ":" + Comman.GetColRowStr(colRow2);
                    L[i] = p;
                }
            }
        }
    }

    /**
     * 处理代码行中的行引用调整
     * @function DoWithCodeLineAddRow
     * @param {Array} L - 代码行列表
     * @param {number} startRow - 起始行号
     * @param {number} addCount - 添加行数（负数表示删除）
     */
    function DoWithCodeLineAddRow(/*List <string > */L, /*int */startRow, /*int */addCount) {
        var reg1 = /^([A-Za-z]{1,3})(\d{1,5})$/;
        var reg2 = /^([A-Za-z]{1,3})(\d{1,5}):([A-Za-z]{1,3})(\d{1,5})$/;
        for (var i = 0; i < L.Count(); i++) {
            var p = L[i];
            var mc = Regex.Match(p, reg1);
            if (mc.Success) {
                var colRow = Comman.GetColRow2(p);
                if (colRow.row >= startRow) {
                    colRow.row += addCount;
                }
                p = Comman.GetColRowStr(colRow);
                L[i] = p;
            }
            else {
                mc = Regex.Match(p, reg2);
                if (mc.Success) {
                    var ar = p.split(':');
                    var colRow1 = Comman.GetColRow2(ar[0]);
                    if (colRow1.row >= startRow) {
                        colRow1.row += addCount;
                    }
                    var colRow2 = Comman.GetColRow2(ar[1]);
                    if (colRow2.row >= startRow) {
                        colRow2.row += addCount;
                    }
                    p = Comman.GetColRowStr(colRow1) + ":" + Comman.GetColRowStr(colRow2);
                    L[i] = p;
                }
            }
        }
    }

    return {
        AddRow: AddRow,
        AdjustRefColRowList: AdjustRefColRowList,
        DeleteRow: DeleteRow,
        AddCol: AddCol,
        DeleteCol: DeleteCol,
        DoWithCodeLineAddCol: DoWithCodeLineAddCol,
        DoWithCodeLineAddRow: DoWithCodeLineAddRow
    }
}