'use strict';

/**
 * @fileoverview 获取公共列映射模块 - 提供列映射关系提取功能
 * @description 该模块用于从表格中提取数据库字段与表格位置的映射关系，
 * 生成公共列映射表和主表列映射表。
 * @author MyCell Designer
 * @version 1.0.0
 */

/**
 * 获取公共列映射类
 * @class GetCommanColumnMaps
 * @description 遍历表格中的数据库引用标记，建立字段与表格位置的映射关系
 * @param {Object} config - 配置对象
 * @param {Object} config.parentObj - 父对象（MyCellDesigner实例）
 * @param {Object} config.cellSheet - 单元格表格数据
 * @param {Object} config.operCell - 操作单元格对象
 */
function GetCommanColumnMaps(config) {
    var parentObj = config.parentObj;
    var cellSheet = config.cellSheet;
    var operCell = config.operCell;
    var autoO = new AutoFillColumns(config);

    /**
     * 执行映射提取
     * @function doJob
     * @description 遍历所有单元格，提取数据库引用标记并建立映射关系
     * @returns {Object} 包含commanColumnMaps和commanColumnMapsMainTable的对象
     */
    function doJob() {
        for (var col = 0; col < cellSheet.colWidthList.length; col++) {
            for (var row = 0; row < cellSheet.rowHeightList.length; row++) {
                var s = autoO.getCellStringWithoutBlankAndUnit({ col: col, row: row });
                if (s.indexOf(leftMark) != -1) {
                    var ttt1 = getCellRefTableNameAndColumnInfo(s);
                    var tt1 = autoO.getTopStrObj({ col: col, row: row });
                    var tt2 = autoO.getLeftStrObj({ col: col, row: row });
                    var t3 = "";
                    var t4 = "";
                    if (tt1.cell) {
                        t3 = autoO.getTopStr2(tt1.cell);
                    }
                    if (tt2.cell) {
                        t4 = autoO.getLeftStr2(tt2.cell);
                    }
                    var t1 = t3 + tt1.str;
                    var t2 = t4 + tt2.str;
                    if (ttt1.tableName != customDataTableName) {
                        var t = commanColumnMapsMainTable[t1 + "_" + t2];
                        if (!t) {
                            commanColumnMapsMainTable[t1 + "_" + t2] = [];
                            t = commanColumnMapsMainTable[t1 + "_" + t2];
                        }
                        if (t.indexOf(s) == -1)
                            t.push(s);

                    } else {
                        var t = commanColumnMaps[t1 + "_" + t2];
                        if (!t) {
                            commanColumnMaps[t1 + "_" + t2] = [];
                            t = commanColumnMaps[t1 + "_" + t2];
                        }
                        if (t.indexOf(s) == -1)
                            t.push(s);
                    }
                }
            }
        }
        return {
            commanColumnMaps: commanColumnMaps,
            commanColumnMapsMainTable: commanColumnMapsMainTable
        }
    }

    /**
     * 获取单元格引用的表名和列信息
     * @function getCellRefTableNameAndColumnInfo
     * @description 解析数据库引用字符串，提取表名、列名等信息
     * @param {string} s - 包含数据库引用标记的字符串
     * @returns {Object} 包含tableName、columnName、bodyIndex、recNum、columnType的对象
     */
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

    /**
     * 返回公共接口
     * @returns {Object} 包含doJob方法的对象
     */
    return {
        doJob: doJob
    }
}