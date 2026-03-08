'use strict';

/**
 * @fileoverview 报表主体计算模块，用于计算报表的水平方向和垂直方向参数
 * @module CalReportBody
 */

/**
 * 报表主体计算类
 * @class
 * @param {Object} config - 配置对象
 * @param {Object} config.parentObj - 父对象
 * @param {Object} config.operCell - 操作单元格对象
 * @param {Object} config.cellSheet - 单元格工作表
 */
function CalReportBody(config) {
    var parentObj = config.parentObj;
    var operCell = config.operCell;
    var cellSheet = config.cellSheet;

    var t1 = new CalReportBodyH(config);
    var t2 = new CalReportBodyV(config);

    /**
     * 执行计算任务
     * @function doJob
     * @returns {Object} 计算结果对象
     */
    function doJob() {
        var tt1 = doJobA();
        //new MergeReportBodyListContent(tt1.reportBodyList, cellSheet).doJob();
        return tt1;
    }

    /**
     * 执行计算任务A
     * @function doJobA
     * @returns {Object} 计算结果对象，包含reportBodyList、recordPerPage、tablesUsedToRecordCount
     */
    function doJobA() {
        var tt1 = t1.getReportBodyParm();
        var tt2 = t2.getReportBodyParm(tt1.reportBodyList);
        var L1 = tt2.reportBodyList;
        if (L1.length > 0) {
            return {
                reportBodyList: tt1.reportBodyList.concat(L1),
                recordPerPage: Math.min(tt1.recordPerPage, tt2.recordPerPage),
                tablesUsedToRecordCount: getTablesUsedToRecordCount(tt1.reportBodyList.concat(L1))
            }
        }
        else {
            tt1.tablesUsedToRecordCount = getTablesUsedToRecordCount(tt1.reportBodyList);
            return tt1;
        }
    }

    /**
     * 获取用于记录计数的表列表
     * @function getTablesUsedToRecordCount
     * @param {Array} reportBodyList - 报表主体列表
     * @returns {string} 表名列表，以逗号分隔
     */
    function getTablesUsedToRecordCount(reportBodyList) {
        var L = [];
        for (var i = 0; i < reportBodyList.length; i++) {
            var tAr = getTablesUsedToRecordCountOne(reportBodyList[i]);
            for (var j = 0; j < tAr.length; j++) {
                if (L.indexOf(tAr[j]) == -1) {
                    L.push(tAr[j]);
                }
            }
        }
        return L.join(",");
    }

    /**
     * 获取单个报表主体中用于记录计数的表列表
     * @function getTablesUsedToRecordCountOne
     * @param {Object} reportBody - 报表主体对象
     * @returns {Array} 表名数组
     */
    function getTablesUsedToRecordCountOne(reportBody) {
        var L = [];
        for (var col = reportBody.startCol; col <= reportBody.endCol; col++) {
            for (var row = reportBody.startRow; row <= reportBody.endRow; row++) {
                var s = operCell.GetCellString(col, row, 0);
                if (s && s.indexOf("[#") != -1 && s.indexOf("#]") != -1) {
                    var t = getCellRefTableNameAndColumnInfo(s);
                    if (L.indexOf(t.tableName) == -1) {
                        L.push(t.tableName);
                    }
                }
            }
        }
        return L;
    }

    /**
     * 获取单元格引用的表名和列信息
     * @function getCellRefTableNameAndColumnInfo
     * @param {string} s - 单元格字符串
     * @returns {Object} 包含tableName、columnName、bodyIndex、recNum、columnType的对象
     */
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