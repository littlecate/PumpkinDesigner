'use strict';

/**
 * @fileoverview 合并报表主体列表内容（垂直方向）模块
 * @description 用于合并垂直方向上具有相同表头的报表主体，并调整记录编号
 * @module MergeReportBodyListContentV
 */

/**
 * 合并报表主体列表内容（垂直方向）类
 * @class
 * @param {Array} reportBodyList - 报表主体列表
 * @param {Object} cellSheet - 单元格工作表
 */
function MergeReportBodyListContentV(reportBodyList, cellSheet) {
    var operCell = new OperCell();
    operCell.Open(cellSheet);

    function doJob() {
        if(readOnlyText){
            return;
        }
        var L = [];
        for (var i = 0; i < reportBodyList.length; i++) {
            var p = reportBodyList[i];
            var t1 = p.header;
            if (L.indexOf(t1) != -1) {
                continue;
            }
            L.push(t1);
            var tAr = getReportBodyHasSameHeader(t1);
            if (tAr.length > 1) {
                var L1 = mergeSameStartColEndColReportBodys(tAr);
                modifyRecNum(L1);
            }
        }
    }

    function mergeSameStartColEndColReportBodys(tAr) {
        var index = 0;
        var L = [];
        while (true) {
            var t1 = getOneSameStartColEndColReportBodys(tAr, index);
            if (t1) {
                L.push(t1);
            }
            else {
                L.push(tAr[index]);
            }
            index++;
            if (t1 && t1.reportBodyIndexList.indexOf(index) != -1) {
                index++;
            }
            if (index >= tAr.length - 1) {
                break;
            }
        }
        return L;
    }

    function getOneSameStartColEndColReportBodys(tAr, index) {
        var t1 = tAr[index];
        var tt = getSameStartColEndColReportBodys(t1, tAr, index + 1);
        if (tt) {
            var t2 = tt.reportBodyList[tt.reportBodyList.length - 1];
            var L1 = [index].concat(tt.reportBodyIndexList);
            return {
                reportBodyIndexList: L1,
                startCol: t1.startCol,
                startRow: t1.startRow,
                endCol: t2.endCol,
                endRow: t2.endRow
            }
        }
        return null;
    }

    function getSameStartColEndColReportBodys(t1, tAr, startIndex) {
        var L = [];
        var L1 = [];
        for (var i = startIndex; i < tAr.length; i++) {
            var t2 = tAr[i];
            if (t2.startCol == t1.startCol && t2.endCol == t1.endCol) {
                L.push(t2);
                L1.push(i);
            }
        }
        if (L.length > 0) {
            return {
                reportBodyList: L,
                reportBodyIndexList: L1
            };
        }
        return null;
    }

    function getReportBodyHasSameHeader(t1) {
        var L = [];
        for (var i = 0; i < reportBodyList.length; i++) {
            var p = reportBodyList[i];
            if (p.header == t1) {
                L.push(p);
            }
        }
        return L;
    }

    var addRecNum = 0;
    function modifyRecNum(L) {
        for (var i = 1; i < L.length; i++) {
            addRecNum = getMaxRecNum(L[i - 1]);
            if (addRecNum == -1) {
                break;
            }
            modifyRecNumOneReportBody(L[i]);
        }
    }

    function getMaxRecNum(o) {
        for (var col = o.endCol; col >= o.startCol; col--) {
            for (var row = o.endRow; row >= o.startRow; row--) {
                var t = getRealColRowObj(col, row);
                var s = cellSheet.cells[t.col][t.row].str;
                if (s.indexOf("[#") != -1 && s.indexOf("#]") != -1) {
                    var t1 = getCellRefTableNameAndColumnInfo(s);
                    return Number(t1.recNum);
                }
            }
        }
        return -1;
    }

    function getRealColRowObj(col1, row1) {
        var o = operCell.GetMergeRange(col1, row1);
        if (o != null && cellSheet.cells[col1 - 1][row1 - 1].isInMergeArea) {
            return {
                col: o.startCol - 1,
                row: o.startRow - 1
            }
        }
        else {
            return {
                col: col1 - 1,
                row: row1 - 1
            }
        }
    }

    function modifyRecNumOneReportBody(p) {
        for (var row = p.startRow - 1; row <= p.endRow - 1; row++) {
            for (var col = p.startCol - 1; col <= p.endCol - 1; col++) {
                var o = cellSheet.cells[col][row];
                var s = o.str;
                if (s.indexOf("[#") != -1 && s.indexOf("#]") != -1) {
                    modifyOneReportCell(s, col, row);
                }
            }
        }
    }

    function modifyOneReportCell(s, col, row) {
        s = getAfterModifyValue(s);
        cellSheet.cells[col][row].str = s;
    }

    function getAfterModifyValue(s) {
        var pos1 = s.indexOf("[#");
        var pos2 = s.indexOf("#]", pos1 + 1);
        while (pos1 != -1 && pos2 != -1) {
            var s1 = s.substring(pos1 - 2, pos2 + 2);
            var t1 = getCellRefTableNameAndColumnInfo(s1);
            var s2 = "[@" + t1.tableName + "." + t1.columnName + "." + t1.bodyIndex + "." + (Number(t1.recNum) + addRecNum) + "." + t1.columnType + "@]";
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
        doJob: doJob
    }
}