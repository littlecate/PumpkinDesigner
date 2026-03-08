'use strict';

/**
 * @fileoverview 报表主体垂直方向计算模块，用于计算垂直方向的报表主体参数
 * @module CalReportBodyV
 */

/**
 * 报表主体垂直方向计算类
 * @class
 * @param {Object} config - 配置对象
 * @param {Object} config.parentObj - 父对象
 * @param {Object} config.operCell - 操作单元格对象
 * @param {Object} config.cellSheet - 单元格工作表
 */
function CalReportBodyV(config) {
    var parentObj = config.parentObj;
    var operCell = config.operCell;
    var cellSheet = config.cellSheet;

    let autoO = new AutoFillColumns(config);

    let bodyIndex = 0;
    let recNum = 0;
    let recordPerPage = 10000;
    let reportBodyListH = [];

    function getReportBodyParm(_reportBodyListH) {        
        reportBodyListH = _reportBodyListH;
        bodyIndex = 0;
        var L = [];
        var tAr = null;
        var t = getOneReportBodyV(0, 0, cellSheet.colWidthList.length - 1, cellSheet.rowHeightList.length - 1);
        tAr = t.tAr;
        if (t.result == 3) {
            if (recNum < recordPerPage) {
                recordPerPage = recNum;
            }
        }
        if (tAr) {
            if (t.result == 3)
                addToArray(L, tAr);
        }
        while (tAr) {
            var t2 = tAr[tAr.length - 1];
            var startCol = 0;
            var startRow = t2.endRow + 1;
            var endCol = cellSheet.colWidthList.length - 1;
            var endRow = cellSheet.rowHeightList.length - 1;
            t = getOneReportBodyV(startCol, startRow, endCol, endRow);
            tAr = t.Ar;
            if (t.result == 3) {
                if (recNum < recordPerPage) {
                    recordPerPage = recNum;
                }
                addToArray(L, tAr);
            }
        }
        for (var i = 0; i < L.length; i++) {
            L[i].header = getHeader(L[i]);
        }
        for (var i = 0; i < L.length; i++) {
            var p = L[i];
            p.startCol += 1;
            p.startRow += 1;
            p.endCol += 1;
            p.endRow += 1;
        }
        return {
            reportBodyList: L,
            recordPerPage: recordPerPage
        };
    }

    function getHeader(reportBody) {
        var col = reportBody.startCol;
        var row = reportBody.startRow;
        var L = [];
        var nextLeftCell = autoO.getNextLeftCell(col, row);
        if (nextLeftCell == null) {
            return "";
        }
        L.push(getCellTrimBlankStr(nextLeftCell.col, nextLeftCell.row));
        while (true) {
            var nextBottomCell = autoO.getNextBottomCell(col, row);
            if (nextBottomCell == null) {
                break;
            }
            if (nextBottomCell.row > reportBody.endRow) {
                break;
            }
            var nextLeftCell = autoO.getNextLeftCell(nextBottomCell.col, nextBottomCell.row);
            if (nextLeftCell == null) {
                break;
            }
            L.push(getCellTrimBlankStr(nextLeftCell.col, nextLeftCell.row));
            col = nextBottomCell.col;
            row = nextBottomCell.row;
        }
        return L.join("|");
    }

    function getCellTrimBlankStr(col, row) {
        var s = cellSheet.cells[col][row].str;
        return autoO.trimBlank(s);
    }

    function getOneReportBodyV(startCol, startRow, endCol, endRow) {
        var t1 = getReportBodyV(startCol, startRow, endCol, endRow);
        if (t1 == null) {
            return {
                result: 1,
                tAr: null
            }
        }
        var bodyStartCol = t1.bodyStartCol;
        var bodyEndCol = t1.bodyEndCol;
        var bodyStartRow = getBodyStartRow(t1);
        var bodyEndRow = getBodyEndRow(t1);
        var rowsOrColsPerSample = t1.rowsOrColsPerSample;
        var tAr = [{
            orientation: "竖向",
            startCol: bodyStartCol,
            startRow: bodyStartRow,
            endCol: bodyEndCol,
            endRow: bodyEndRow,
            rowsOrColsPerSample: rowsOrColsPerSample
        }];
        if (isConflictWithReportBodyH(tAr[0])) {
            return {
                result: 2,
                tAr: tAr
            }
        }
        modifyReportBodyIndexAndRecNum(tAr);
        return {
            result: 3,
            tAr: tAr
        }
    }

    function isConflictWithReportBodyH(reportBody) {
        for (var i = 0; i < reportBodyListH.length; i++) {
            if (isConflictWithReportBodyHOne(reportBody, reportBodyListH[i])) {
                return true;
            }
        }
        return false;
    }

    function isConflictWithReportBodyHOne(reportBodyA, reportBodyB) {
        var L1 = getReportBodyCells(reportBodyA);
        var L2 = getReportBodyCells(reportBodyB);
        for (var i = 0; i < L1.length; i++) {
            var p1 = L1[i];
            for (var j = 0; j < L2.length; j++) {
                var p2 = L2[j];
                if (p1 == p2) {
                    return true;
                }
            }
        }
        return false;
    }

    function getReportBodyCells(reportBody) {
        var L = [];
        for (var col = reportBody.startCol; col <= reportBody.endCol; col++) {
            for (var row = reportBody.startRow; row <= reportBody.endRow; row++) {
                L.push(col + "_" + row);
            }
        }
        return L;
    }

    function modifyReportBodyIndexAndRecNum(L) {
        recNum = 0;
        for (var i = 0; i < L.length; i++) {
            bodyIndex += 1;
            modifyReportBodyIndexAndRecNumOneReportBody(L[i]);
        }
    }

    function modifyReportBodyIndexAndRecNumOneReportBody(p) {
        var index = 0;
        for (var col = p.startCol; col <= p.endCol; col++) {
            index++;
            if ((index - 1) % p.rowsOrColsPerSample == 0) {
                recNum++;
            }
            for (var row = p.startRow; row <= p.endRow; row++) {
                var o = cellSheet.cells[col][row];
                var s = o.str;
                if (s && s.indexOf("[#") != -1 && s.indexOf("#]") != -1) {
                    modifyOneReportCell(s, col, row);
                }
            }
        }
    }

    function modifyOneReportCell(s, col, row) {
        s = getAfterModifyValue(s);
        operCell.SetCellString(col + 1, row + 1, 0, s);
        parentObj.redrawOneCell(col, row);
    }

    function getAfterModifyValue(s) {
        var pos1 = s.indexOf("[#");
        var pos2 = s.indexOf("#]", pos1 + 1);
        while (pos1 != -1 && pos2 != -1) {
            var s1 = s.substring(pos1 - 2, pos2 + 2);
            var t1 = getCellRefTableNameAndColumnInfo(s1);
            var s2 = "[@" + t1.tableName + "." + t1.columnName + "." + bodyIndex + "." + recNum + "." + t1.columnType + "@]";
            s = s.replace(s1, s2);
            pos1 = s.indexOf("[#");
            if (pos1 == -1) {
                break;
            }
            pos2 = s.indexOf("#]", pos1 + 1);
        }
        s = s.replace(/\[@/g, "[#");
        s = s.replace(/\@]/g, "#]");
        return s;
    }

    function addToArray(L, tAr) {
        for (var i = 0; i < tAr.length; i++) {
            L.push(tAr[i]);
        }
    }

    function getBodyStartRow(t1) {
        var bodyStartRow = t1.row;
        var col = t1.col;
        var row = t1.row;
        var nextTopCell = autoO.getNextTopCell(col, row);
        while (nextTopCell != null) {
            if (nextTopCell.col != t1.col) {
                break;
            }
            if (!isGoodCell(nextTopCell, t1.rowsOrColsPerSample)) {
                break;
            }
            bodyStartRow = nextTopCell.row;
            nextTopCell = autoO.getNextLeftCell(nextTopCell.col, nextTopCell.row);
        }
        return bodyStartRow;
    }

    function isGoodCell(cell, rowsOrColsPerSample) {
        var col = cell.col;
        var row = cell.row;
        var s = cellSheet.cells[col][row].str;
        if (s == "") {
            return true;
        }
        var t1 = getCellRefTableNameAndColumnInfo(s);
        var nextRightCell = autoO.getNextRightCell(col, row);
        while (nextRightCell != null) {
            var s1 = cellSheet.cells[nextRightCell.col][nextRightCell.row].str;
            if (s1 == s) {
                var t3 = nextRightCell.col - col;
                if (t3 == rowsOrColsPerSample) {
                    return true;
                }
                else {
                    return false;
                }
            }
            var t2 = getCellRefTableNameAndColumnInfo(s1);
            if (t2.tableName == t1.tableName && t2.columnName == t1.columnName) {
                var t3 = nextRightCell.col - col;
                if (t3 == rowsOrColsPerSample) {
                    return true;
                }
                else {
                    return false;
                }
            }
            nextRightCell = autoO.getNextRightCell(nextRightCell.col, nextRightCell.row);
        }
        return false;
    }

    function getBodyEndRow(t1) {
        var bodyEndRow = t1.row + autoO.getCellRowSpan(t1.col, t1.row) - 1;
        var col = t1.col;
        var row = t1.row;
        var nextBottomCell = autoO.getNextBottomCell(col, row);
        while (nextBottomCell != null) {
            if (nextBottomCell.col != t1.col) {
                break;
            }
            if (!isGoodCell(nextBottomCell, t1.rowsOrColsPerSample)) {
                break;
            }
            bodyEndRow = nextBottomCell.row + autoO.getCellRowSpan(nextBottomCell.col, nextBottomCell.row) - 1;
            nextBottomCell = autoO.getNextBottomCell(nextBottomCell.col, nextBottomCell.row);
        }
        return bodyEndRow;
    }

    function getReportBodyV(startCol, startRow, endCol, endRow) {
        var bodyStartCol = -1;
        var bodyEndCol = -1;
        var rowsOrColsPerSample = -1;
        for (var col = startCol; col <= endCol; col++) {
            for (var row = startRow; row <= endRow; row++) {
                var o = cellSheet.cells[col][row];
                var s = o.str;
                if (s && s.indexOf("[#") != -1 && s.indexOf("#]") != -1) {
                    var t1 = getCellRefTableNameAndColumnInfo(s);
                    var strip = 1;
                    while (strip < 20) {
                        var nextRightCell = getNextSameTableNameAndColumnRightCell(t1, col, row, strip);
                        if (nextRightCell != null) {
                            break;
                        }
                        strip++;
                    }
                    if (nextRightCell == null) {
                        continue;
                    }
                    var flag = false;
                    if (nextRightCell != null) {
                        bodyStartCol = col;
                        rowsOrColsPerSample = nextRightCell.col - col;
                        flag = true;
                    }
                    while (nextRightCell != null) {
                        var colSpan = autoO.getCellColSpan(nextRightCell.col, nextRightCell.row);
                        bodyEndCol = nextRightCell.col + colSpan - 1 + (strip - 1) * colSpan;
                        nextRightCell = getNextSameTableNameAndColumnRightCell(t1, nextRightCell.col, nextRightCell.row, strip);
                    }
                    if (flag) {
                        if (bodyEndCol > cellSheet.colWidthList.length - 1) {
                            return null;
                        }
                        return {
                            col: col,
                            row: row,
                            bodyStartCol: bodyStartCol,
                            bodyEndCol: bodyEndCol,
                            rowsOrColsPerSample: rowsOrColsPerSample
                        }
                    }
                }
            }
        }
        return null;
    }

    function getNextSameTableNameAndColumnRightCell(t1, col, row, strip) {
        var nextRightCell = autoO.getNextRightCell(col, row);
        if (nextRightCell == null) {
            return null;
        }
        for (var i = 0; i < strip - 1; i++) {
            nextRightCell = autoO.getNextRightCell(nextRightCell.col, nextRightCell.row);
            if (nextRightCell == null) {
                return null;
            }
        }
        var o1 = cellSheet.cells[nextRightCell.col][nextRightCell.row];
        if (o1.str && o1.str.indexOf("[#") != -1 && o1.str.indexOf("#]") != -1) {
            var t2 = getCellRefTableNameAndColumnInfo(o1.str);
            if (t2.tableName == t1.tableName && t2.columnName == t1.columnName) {
                var colSpan1 = autoO.getCellColSpan(col, row);
                var rowSpan1 = autoO.getCellRowSpan(col, row);
                var colSpan2 = autoO.getCellColSpan(nextRightCell.col, nextRightCell.row);
                var rowSpan2 = autoO.getCellRowSpan(nextRightCell.col, nextRightCell.row);
                if (colSpan1 == colSpan2 && rowSpan1 == rowSpan2) {
                    return nextRightCell;
                }
            }
        }
        return null;
    }

    function getCellRefTableNameAndColumnInfo(s) {
        var pos1 = s.indexOf("[#");
        var pos2 = s.indexOf("#]");
        var t1 = s.substring(pos1 + 2, pos2);
        var tAr = t1.split(".");
        var tableName = tAr[0];
        var columnName = tAr[1];
        var bodyIndex = tAr[2];
        var recNum = tAr[3];
        var columnType = tAr[4];
        return {
            tableName: tableName,
            columnName: columnName,
            bodyIndex: bodyIndex,
            recNum: recNum,
            columnType: columnType
        }
    }

    return {
        getReportBodyParm: getReportBodyParm
    }
}