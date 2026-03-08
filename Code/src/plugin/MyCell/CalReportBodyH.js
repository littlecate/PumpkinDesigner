'use strict';

/**
 * @fileoverview 报表主体水平方向计算模块，用于计算水平方向的报表主体参数
 * @module CalReportBodyH
 */

/**
 * 报表主体水平方向计算类
 * @class
 * @param {Object} config - 配置对象
 * @param {Object} config.parentObj - 父对象
 * @param {Object} config.operCell - 操作单元格对象
 * @param {Object} config.cellSheet - 单元格工作表
 */
function CalReportBodyH(config) {
    var parentObj = config.parentObj;
    var operCell = config.operCell;
    var cellSheet = config.cellSheet;

    let autoO = new AutoFillColumns(config);

    let bodyIndex = 0;
    let recNum = 0;
    let recordPerPage = 10000;

    function getReportBodyParm() {                
        bodyIndex = 0;
        var L = [];
        var tAr = getOneReportBodyH(0, 0, cellSheet.colWidthList.length - 1, cellSheet.rowHeightList.length - 1);
        if (recNum < recordPerPage) {
            recordPerPage = recNum;
        }
        if (tAr)
            addToArray(L, tAr);
        while (tAr) {
            var t2 = tAr[tAr.length - 1];
            var startCol = 0;
            var startRow = t2.endRow + 1;
            var endCol = cellSheet.colWidthList.length - 1;
            var endRow = cellSheet.rowHeightList.length - 1;
            tAr = getOneReportBodyH(startCol, startRow, endCol, endRow);
            if (tAr) {
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
        var nextTopCell = autoO.getNextTopCell(col, row);
        if (nextTopCell == null) {
            return "";
        }
        L.push(getCellTrimBlankStr(nextTopCell.col, nextTopCell.row));
        while (true) {
            var nextRightCell = autoO.getNextRightCell(col, row);
            if (nextRightCell == null) {
                break;
            }
            if (nextRightCell.col > reportBody.endCol) {
                break;
            }
            var nextTopCell = autoO.getNextTopCell(nextRightCell.col, nextRightCell.row);
            if (nextTopCell == null) {
                break;
            }
            L.push(getCellTrimBlankStr(nextTopCell.col, nextTopCell.row));
            col = nextRightCell.col;
            row = nextRightCell.row;
        }
        return L.join("|");
    }

    function getCellTrimBlankStr(col, row) {
        var s = cellSheet.cells[col][row].str;
        return autoO.trimBlank(s);
    }

    function getOneReportBodyH(startCol, startRow, endCol, endRow) {
        var t1 = getReportBodyH(startCol, startRow, endCol, endRow);
        if (t1 == null) {
            return null;
        }
        var bodyStartRow = t1.bodyStartRow;
        var bodyEndRow = t1.bodyEndRow;
        var bodyStartCol = getBodyStartCol(t1);
        var bodyEndCol = getBodyEndCol(t1);
        var rowsOrColsPerSample = t1.rowsOrColsPerSample;
        var bodyStartColAr = [bodyStartCol];
        var t2Ar = getBodySplitColAr({ startCol: bodyStartCol, startRow: bodyStartRow, endCol: bodyEndCol, endRow: bodyEndRow });
        bodyStartColAr = bodyStartColAr.concat(t2Ar);
        if (bodyStartColAr.length > 1)
            adjustBodyStartColColumnName(bodyStartRow, bodyEndRow, bodyStartColAr);
        bodyStartColAr.push(bodyEndCol + 1);
        var tAr = [];
        for (var i = 0; i < bodyStartColAr.length - 1; i++) {
            tAr.push({
                orientation: "横向",
                startCol: bodyStartColAr[i],
                startRow: bodyStartRow,
                endCol: bodyStartColAr[i + 1] - 1,
                endRow: bodyEndRow,
                rowsOrColsPerSample: rowsOrColsPerSample
            });
        }
        // 过滤掉 endCol = -1 的项，特别是当有多个具有相同 startCol 的项时
        var filteredTAr = [];
        var startColMap = {};
        for (var i = 0; i < tAr.length; i++) {
            var item = tAr[i];
            if (item.endCol === -1) {
                continue;
            }
            var key = item.startCol;
            if (!startColMap[key] || item.endCol > startColMap[key].endCol) {
                startColMap[key] = item;
            }
        }
        for (var key in startColMap) {
            filteredTAr.push(startColMap[key]);
        }
        modifyReportBodyIndexAndRecNum(filteredTAr);
        return filteredTAr;
    }

    function adjustBodyStartColColumnName(bodyStartRow, bodyEndRow, bodyStartColAr) {
        return;
        for (var row = bodyStartRow; row <= bodyEndRow; row++) {
            var t1 = cellSheet.cells[bodyStartColAr[0]][row].str;
            for (var i = 1; i < bodyStartColAr.length; i++) {
                var col = bodyStartColAr[i];
                cellSheet.cells[col][row].str = t1;
            }
        }
    }

    function getBodySplitColAr(reportBody) {
        var col = reportBody.startCol;
        var row = reportBody.startRow;
        var L = [];
        var nextTopCell = autoO.getNextTopCell(col, row);
        if (nextTopCell == null) {
            return [];
        }
        var t1 = getCellTrimBlankStr(nextTopCell.col, nextTopCell.row);
        while (true) {
            var nextRightCell = autoO.getNextRightCell(col, row);
            if (nextRightCell == null) {
                break;
            }
            if (nextRightCell.col > reportBody.endCol) {
                break;
            }
            var nextTopCell = autoO.getNextTopCell(nextRightCell.col, nextRightCell.row);
            if (nextTopCell == null) {
                break;
            }
            var t2 = getCellTrimBlankStr(nextTopCell.col, nextTopCell.row);
            if (t2 == t1) {
                L.push(nextTopCell.col);
            }
            col = nextRightCell.col;
            row = nextRightCell.row;
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
        for (var row = p.startRow; row <= p.endRow; row++) {
            index++;
            if ((index - 1) % p.rowsOrColsPerSample == 0) {
                recNum++;
            }
            for (var col = p.startCol; col <= p.endCol; col++) {
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

    function getNextBodyStartCol(bodyStartCol, bodyStartRow, bodyEndCol, bodyEndRow) {
        var t = getFirstColumnCell(bodyStartCol, bodyStartRow, bodyEndCol, bodyEndRow);
        var deltaCol = t.col - bodyStartCol;
        var s = cellSheet.cells[t.col][t.row].str;
        var t1 = getCellRefTableNameAndColumnInfo(s);
        var nextRightCell = autoO.getNextRightCell(t.col, t.row);
        while (nextRightCell != null) {
            var s1 = cellSheet.cells[nextRightCell.col][nextRightCell.row].str;
            if (s1 && s1.indexOf("[#") != -1 && s1.indexOf("#]") != -1) {
                var t2 = getCellRefTableNameAndColumnInfo(s1);
                if (t2.tableName == t1.tableName && t2.columnName == t1.columnName) {
                    return nextRightCell.col - deltaCol;
                }
            }
            nextRightCell = autoO.getNextRightCell(nextRightCell.col, nextRightCell.row);
        }
        return -1;
    }

    function getFirstColumnCell(bodyStartCol, bodyStartRow, bodyEndCol, bodyEndRow) {
        var row = bodyStartRow;
        for (var col = bodyStartCol; col <= bodyEndCol; col++) {
            var s = cellSheet.cells[col][row].str;
            if (s && s.indexOf("[#") != -1 && s.indexOf("#]") != -1) {
                return {
                    col: col,
                    row: row
                }
            }
        }
        return null;
    }

    function getBodyStartCol(t1) {
        var bodyStartCol = t1.col;
        var col = t1.col;
        var row = t1.row;
        var nextLeftCell = autoO.getNextLeftCell(col, row);
        while (nextLeftCell != null) {
            if (nextLeftCell.row != t1.row) {
                break;
            }
            if (!isGoodCell(nextLeftCell, t1.rowsOrColsPerSample)) {
                break;
            }
            bodyStartCol = nextLeftCell.col;
            nextLeftCell = autoO.getNextLeftCell(nextLeftCell.col, nextLeftCell.row);
        }
        return bodyStartCol;
    }

    function isGoodCell(cell, rowsOrColsPerSample) {
        var col = cell.col;
        var row = cell.row;
        var s = cellSheet.cells[col][row].str;
        if (s == "") {
            return true;
        }
        var t1 = getCellRefTableNameAndColumnInfo(s);
        var nextBottomCell = autoO.getNextBottomCell(col, row);
        while (nextBottomCell != null) {
            var s1 = cellSheet.cells[nextBottomCell.col][nextBottomCell.row].str;
            if (s1 == s) {
                var t3 = nextBottomCell.row - row;
                if (t3 == rowsOrColsPerSample) {
                    return true;
                }
                else {
                    return false;
                }
            }
            var t2 = getCellRefTableNameAndColumnInfo(s1);
            if (t2.tableName == t1.tableName && t2.columnName == t1.columnName) {
                var t3 = nextBottomCell.row - row;
                if (t3 == rowsOrColsPerSample) {
                    return true;
                }
                else {
                    return false;
                }
            }
            nextBottomCell = autoO.getNextBottomCell(nextBottomCell.col, nextBottomCell.row);
        }
        return false;
    }

    function getBodyEndCol(t1) {
        var bodyEndCol = t1.col + autoO.getCellColSpan(t1.col, t1.row) - 1;
        var col = t1.col;
        var row = t1.row;
        var nextRightCell = autoO.getNextRightCell(col, row);
        while (nextRightCell != null) {
            if (nextRightCell.row != t1.row) {
                break;
            }
            if (!isGoodCell(nextRightCell, t1.rowsOrColsPerSample)) {
                break;
            }
            bodyEndCol = nextRightCell.col + autoO.getCellColSpan(nextRightCell.col, nextRightCell.row) - 1;
            nextRightCell = autoO.getNextRightCell(nextRightCell.col, nextRightCell.row);
        }
        return bodyEndCol;
    }

    function getReportBodyH(startCol, startRow, endCol, endRow) {
        var bodyStartRow = -1;
        var bodyEndRow = -1;
        var rowsOrColsPerSample = -1;
        for (var row = startRow; row <= endRow; row++) {
            for (var col = startCol; col <= endCol; col++) {
                var o = cellSheet.cells[col][row];
                var s = o.str;
                if (s && s.indexOf("[#") != -1 && s.indexOf("#]") != -1) {
                    var t1 = getCellRefTableNameAndColumnInfo(s);
                    var strip = 1;
                    while (strip < 20) {
                        var nextBottomCell = getNextSameTableNameAndColumnBottomCell(t1, col, row, strip);
                        if (nextBottomCell != null) {
                            break;
                        }
                        strip++;
                    }
                    if (nextBottomCell == null) {
                        continue;
                    }
                    var flag = false;
                    if (nextBottomCell != null) {
                        bodyStartRow = row;
                        rowsOrColsPerSample = nextBottomCell.row - row;
                        flag = true;
                    }
                    while (nextBottomCell != null) {
                        var rowSpan = autoO.getCellRowSpan(nextBottomCell.col, nextBottomCell.row);
                        bodyEndRow = nextBottomCell.row + rowSpan - 1 + (strip - 1) * rowSpan;
                        nextBottomCell = getNextSameTableNameAndColumnBottomCell(t1, nextBottomCell.col, nextBottomCell.row, strip);
                    }
                    if (flag) {
                        return {
                            col: col,
                            row: row,
                            bodyStartRow: bodyStartRow,
                            bodyEndRow: bodyEndRow,
                            rowsOrColsPerSample: rowsOrColsPerSample
                        }
                    }
                }
            }
        }
        return null;
    }

    function getNextSameTableNameAndColumnBottomCell(t1, col, row, strip) {
        var nextBottomCell = autoO.getNextBottomCell(col, row);
        if (nextBottomCell == null) {
            return null;
        }
        for (var i = 0; i < strip - 1; i++) {
            nextBottomCell = autoO.getNextBottomCell(nextBottomCell.col, nextBottomCell.row);
            if (nextBottomCell == null) {
                return null;
            }
        }
        var o1 = cellSheet.cells[nextBottomCell.col][nextBottomCell.row];
        if (o1.str && o1.str.indexOf("[#") != -1 && o1.str.indexOf("#]") != -1) {
            var t2 = getCellRefTableNameAndColumnInfo(o1.str);
            if (t2.tableName == t1.tableName && t2.columnName == t1.columnName) {
                var colSpan1 = autoO.getCellColSpan(col, row);
                var rowSpan1 = autoO.getCellRowSpan(col, row);
                var colSpan2 = autoO.getCellColSpan(nextBottomCell.col, nextBottomCell.row);
                var rowSpan2 = autoO.getCellRowSpan(nextBottomCell.col, nextBottomCell.row);
                if (colSpan1 == colSpan2 && rowSpan1 == rowSpan2) {
                    return nextBottomCell;
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