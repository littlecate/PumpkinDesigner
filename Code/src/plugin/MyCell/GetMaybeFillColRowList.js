'use strict';

/**
 * @fileoverview 获取可能填充的行列列表模块，用于智能识别可填充的单元格区域
 * @module GetMaybeFillColRowList
 */

/**
 * 获取可能填充的行列列表类
 * @class
 * @param {Object} config - 配置对象
 * @param {Object} config.parentObj - 父对象
 * @param {Object} config.cellSheet - 单元格工作表
 * @param {Object} config.operCell - 操作单元格对象
 * @param {number} config.currentCol - 当前列号
 * @param {number} config.currentRow - 当前行号
 */
function GetMaybeFillColRowList(config) {
    let parentObj = config.parentObj;
    let cellSheet = config.cellSheet;
    let operCell = config.operCell;
    let currentCol = config.currentCol;
    let currentRow = config.currentRow;
    let autoO = new AutoFillColumns(config);

    function doJob() {
        let col = currentCol;
        let row = currentRow;
        var nextTopCell = autoO.getNextTopCell3(col, row);
        if (nextTopCell != null) {
            return doJobA(nextTopCell.col, nextTopCell.row);
        }
        else {
            return doJobB(col, row);
        }
    }

    function doJobA(col, row) {
        var startCol = col;
        var endCol = col + autoO.getCellColSpan(col, row) - 1;
        var L = doJobB(col, row);
        if (L.length == 0) {
            return [];
        }
        var L2 = [];
        for (var i = 0; i < L.length; i++) {
            col = L[i].col;
            row = L[i].row;
            L2.push(L[i]);
            var L1 = doJobC(col, row, endCol);
            L2 = L2.concat(L1);
        }
        return L2;
    }

    function doJobC(col, row, endCol) {
        var L = [];
        while (true) {
            var nextRightCell = autoO.getNextRightCell(col, row);
            if (nextRightCell == null) {
                break;
            }
            if (nextRightCell.col + autoO.getCellColSpan(nextRightCell.col, nextRightCell.row) - 1 > endCol) {
                break;
            }
            var s = autoO.getCellStringWithoutBlankAndUnit(nextRightCell);
            if (s != "") {
                break;
            }
            L.push(nextRightCell);
            col = nextRightCell.col;
            row = nextRightCell.row;
        }
        return L;
    }

    function doJobB(col, row) {
        var L = [];
        while (true) {
            var nextBottomCell = autoO.getNextBottomCell(col, row);
            if (nextBottomCell == null) {
                break;
            }
            var s = autoO.getCellStringWithoutBlankAndUnit(nextBottomCell);
            if (s != "") {
                break;
            }
            L.push(nextBottomCell);
            col = nextBottomCell.col;
            row = nextBottomCell.row;
        }
        return L;
    }

    return {
        doJob: doJob
    }
}