'use strict';
function AdjustAutoFillColumnV(config) {
    var parentObj = config.parentObj;
    var operCell = config.operCell;
    var cellSheet = config.cellSheet;

    var autoO = new AutoFillColumns(config);
    var bodyIndex = 1;

    function doJob() {
        if(readOnlyText){
            return;
        }
        var t1 = findOne(0, 0, cellSheet.colWidthList.length - 1, cellSheet.rowHeightList.length - 1);
        while (t1 != null) {
            bodyIndex++;
            t1 = findOne(t1.endCol + 1, 0, cellSheet.colWidthList.length - 1, cellSheet.rowHeightList.length - 1);
        }
    }

    function findOne(startCol, startRow, endCol, endRow) {
        var t1 = findReportBodyStartInfo(startCol, startRow, endCol, endRow);
        if (t1 == null) {
            return null;
        }
        var L = [t1];
        while (true) {
            t1 = findNextReportBodyInfo(t1);
            if (t1 == null) {
                break;
            }
            L.push(t1);
        }
        return mergeReportBodyInfos(L);
    }

    function mergeReportBodyInfos(L) {        
        var maxColSpan = getMaxColSpan(L);
        var startCol = L[0].startCol;
        var startRow = L[0].startRow;
        var endCol = getMaxEndCol(L);
        var endRow = getMaxEndRow(L);
        for (var row = startRow; row <= endRow; row++) {
            var index = 0;
            var columnOrder = 1;
            var recNum = 0;
            for (var col = startCol; col <= endCol; col++) {
                if (index % maxColSpan == 0) {
                    recNum++;
                    columnOrder = 1;
                }
                index++;
                var s = cellSheet.cells[col][row].str;
                if (s && s.indexOf(leftMark) != -1 && s.indexOf(rightMark) != -1) {
                    var t1 = getCellRefTableNameAndColumnInfo(s);
                    var t2 = getColumnPartObj(t1.columnName);
                    if (t2 != null) {
                        var columnName = t2.part1 + "$" + columnOrder;
                        columnOrder++;
                        columnName = columnName.replace(/\$/g, "");
                        var s1 = leftMark + t1.tableName + "." + columnName + "." + bodyIndex + "." + recNum + "." + t1.columnType + rightMark;
                        cellSheet.cells[col][row].str = s1;
                    }
                }
            }
        }
        return {
            startCol: startCol,
            startRow: startRow,
            endCol: endCol,
            endRow: endRow
        }
    }

    function getMaxEndRow(L) {
        var t = 0;
        for (var i = 0; i < L.length; i++) {
            var p = L[i];
            if (p.endRow > t) {
                t = p.endRow;
            }
        }
        return t;
    }

    function getMaxEndCol(L) {
        var t = 0;
        for (var i = 0; i < L.length; i++) {
            var p = L[i];
            if (p.endCol > t) {
                t = p.endCol;
            }
        }
        return t;
    }

    function getMaxColSpan(L) {
        var t = 0;
        for (var i = 0; i < L.length; i++) {
            var p = L[i];
            if (p.colSpan > t) {
                t = p.colSpan;
            }
        }
        return t;
    }

    function findNextReportBodyInfo(t1) {
        var nextBottomCell = autoO.getNextBottomCell(t1.col, t1.row);
        if (nextBottomCell == null) {
            return null;
        }
        return getBodyInfo(nextBottomCell.col, nextBottomCell.row);
    }

    function findReportBodyStartInfo(startCol, startRow, endCol, endRow) {
        for (var row = startRow; row <= endRow; row++) {
            for (var col = startCol; col <= endCol; col++) {
                var t = getBodyInfo(col, row);
                if (t != null) {
                    return t;
                }
            }
        }
        return null;
    }

    function getBodyInfo(col, row) {
        var s = cellSheet.cells[col][row].str;
        if (s == "") {
            return null;
        }
        if (s && s.indexOf(leftMark) != -1 && s.indexOf(rightMark) != -1) {
            return getBodyInfoA(col, row, s);
        }
        else {
            return null;
        }
    }

    function getBodyColRowInfoObj(col, row, L) {
        var t3 = L[L.length - 1];
        var colSpan = autoO.getCellColSpan(t3.col, t3.row);
        var endCol = t3.col + colSpan - 1;
        var rowSpan = autoO.getCellRowSpan(t3.col, t3.row);
        var endRow = t3.row + rowSpan - 1;
        return {
            col: col,
            row: row,
            startCol: col,
            startRow: row,
            endCol: endCol,
            endRow: endRow,
            colSpan: colSpan,
            rowSpan: rowSpan
        }
    }

    function getBodyInfoA(col, row, s) {
        if (!s) {
            return null;
        }
        var t1 = getCellRefTableNameAndColumnInfo(s);
        var tt1 = getColumnPartObj(t1.columnName);
        var nextRightCell = autoO.getNextRightCell(col, row);
        var L = [];
        while (nextRightCell != null) {
            var s1 = cellSheet.cells[nextRightCell.col][nextRightCell.row].str;   
            if (!s1) {
                break;
            }
            var t2 = getCellRefTableNameAndColumnInfo(s1);
            if (!isGoodNextRightCell(t1, t2, tt1)) {
                break;
            }
            L.push(nextRightCell);
            t1 = t2;
            tt1 = getColumnPartObj(t1.columnName);
            nextRightCell = autoO.getNextRightCell(nextRightCell.col, nextRightCell.row);
        }
        if (L.length > 0) {
            return getBodyColRowInfoObj(col, row, L);
        }
        return null;
    }

    function isGoodNextRightCell(t1, t2, tt1) {
        if (t2.tableName != t1.tableName) {
            return false;
        }
        var tt2 = getColumnPartObj(t2.columnName);
        if (tt1 != null && tt2 != null) {
            if (tt1.part2 + 1 == tt2.part2) {
                return true;
            }
        }
        return false;
    }

    function getColumnPartObj(str) {
        if(!str){
            return null;
        }
        var tAr = str.split("$");
        if (tAr.length < 2) {
            return null;
        }
        var t1 = tAr.splice(tAr.length - 1, 1);
        if (t1 == "") {
            return null;
        }
        var t2 = tAr.join("$");
        return {
            part1: t2,
            part2: Number(t1)
        }
    }

    function getCellRefTableNameAndColumnInfo(s) {
        var pos1 = s.indexOf(leftMark);
        var pos2 = s.indexOf(rightMark);
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
        doJob: doJob
    }
}