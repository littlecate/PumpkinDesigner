/**
 * @fileoverview 填充单个模板模块 - 负责填充单个报表模板的数据
 * @description 该模块负责填充单个报表模板的数据，
 * 包括计算每页记录数、复制模板、填充数据等功能。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 填充单个模板类
 * @class FillOneTemplate
 * @description 负责填充单个报表模板的数据
 * @param {Object} rsAll - 所有结果集数据
 * @param {Object} cell - 单元格操作对象
 * @param {Object} printParam - 打印参数
 * @param {Object} fillReportSysInfo - 填充报表系统信息
 */
function FillOneTemplate(rsAll, cell, printParam, fillReportSysInfo) {
    /**
     * 所有结果集数据
     * @type {Object}
     */
    this.rsAll = rsAll;

    /**
     * 单元格操作对象
     * @type {Object}
     */
    this.cell = cell;

    /**
     * 打印参数
     * @type {Object}
     */
    this.printParam = printParam;

    /**
     * 报表主体新增行数
     * @type {number}
     */
    this.reportBodyAddRows = 0;

    /**
     * 总记录数
     * @type {number}
     */
    this.totalRecordCount = 0;

    /**
     * 填充报表系统信息
     * @type {Object}
     */
    this.fillReportSysInfo = fillReportSysInfo;

    /**
     * 填充模板输出信息
     * @type {Object}
     */
    this.fillOneTemplateOutInfo = {
        pageNoColRowInfoList: []
    };

    if (this.printParam.recordPerPage === -1) {
        this.printParam.recordPerPage = this.GetRecordPerPage();
    }
}

/**
 * 执行填充任务
 * @returns {Object} 填充模板输出信息
 */
FillOneTemplate.prototype.DoJob = function () {
    this.totalRecordCount = this.GetTotalRecordCount();
    var reportCopy = this.GetReportCopy();
    this.CopyAndPasteContentThenFill(reportCopy);
    return this.fillOneTemplateOutInfo;
};

/**
 * 获取每页记录数
 * @returns {number} 每页记录数
 */
FillOneTemplate.prototype.GetRecordPerPage = function () {
    if (this.printParam.reportBodyList.length > 0) {
        return this.GetRecordPerPageByReportBody();
    } else {
        return 1;
    }
};

/**
 * 通过报表主体获取每页记录数
 * @returns {number} 每页记录数
 */
FillOneTemplate.prototype.GetRecordPerPageByReportBody = function () {
    var maxRecordPerPage = 0;
    for (var i = 0; i < this.printParam.reportBodyList.length; i++) {
        var recordPerPage = this.GetRecordPerPageByReportBodyOne(this.printParam.reportBodyList[i]);
        if (recordPerPage > maxRecordPerPage) {
            maxRecordPerPage = recordPerPage;
        }
    }
    return maxRecordPerPage;
};

/**
 * 通过单个报表主体获取每页记录数
 * @param {Object} reportBody - 报表主体对象
 * @returns {number} 每页记录数
 */
FillOneTemplate.prototype.GetRecordPerPageByReportBodyOne = function (reportBody) {
    var maxRecNum = 0;
    var tableName = this.printParam.tablesUsedToRecordCount;

    for (var col = reportBody.startCol; col <= reportBody.endCol; col++) {
        for (var row = reportBody.startRow; row <= reportBody.endRow; row++) {
            var cellString = this.cell.GetCellString(col, row, 0);
            if (cellString.indexOf("[#") != -1 && cellString.indexOf("#]") != -1) {
                var refInfo = getCellRefTableNameAndColumnInfo(cellString);
                if (refInfo.tableName == tableName) {
                    var recNum = Number(refInfo.recNum);
                    if (recNum > maxRecNum) {
                        maxRecNum = recNum;
                    }
                }
            }
        }
    }
    return maxRecNum;

    /**
     * 获取单元格引用的表名和列信息
     * @param {string} cellString - 单元格字符串
     * @returns {Object} 包含tableName, columnName, bodyIndex, recNum, columnType的对象
     */
    function getCellRefTableNameAndColumnInfo(cellString) {
        var startPos = cellString.indexOf("[#");
        var endPos = cellString.indexOf("#]");
        var refStr = cellString.substring(startPos + 2, endPos);
        var parts = refStr.split(".");
        return {
            tableName: parts[0],
            columnName: parts[1],
            bodyIndex: parts[2],
            recNum: parts[3],
            columnType: parts[4]
        };
    }
};

/**
 * 复制并粘贴内容后填充
 * @param {number} reportCopy - 报表份数
 */
FillOneTemplate.prototype.CopyAndPasteContentThenFill = function (reportCopy) {
    if (reportCopy > 1) {
        var addRows = this.cell.GetRows(0) - 1 - this.printParam.coverLines;
        var copyContent = this.GetCopyContent1();

        for (var i = 0; i < reportCopy; i++) {
            var fillStartRow = 1;

            if (i === 0) {
                this.FillReportCopy(0, fillStartRow, this.printParam.reportBodyList);
                continue;
            }

            fillStartRow = this.cell.GetRows(0);
            this.cell.SetCopyContent(copyContent);
            this.InsertAndPasteContent();
            this.reportBodyAddRows += addRows;

            var reportBodyList = this.GetReportBodyList();
            this.FillReportCopy(i, fillStartRow, reportBodyList);
        }
    } else {
        var reportBodyList = this.GetReportBodyList();
        this.FillReportCopy(0, 1, reportBodyList);
    }
};

/**
 * 获取报表主体列表
 * @returns {Array} 报表主体列表
 */
FillOneTemplate.prototype.GetReportBodyList = function () {
    var reportBodyList = JSON.parse(JSON.stringify(this.printParam.reportBodyList));

    for (var i = 0; i < reportBodyList.length; i++) {
        reportBodyList[i].startRow += this.reportBodyAddRows;
        reportBodyList[i].endRow += this.reportBodyAddRows;
    }

    return reportBodyList;
};

/**
 * 填充报表副本
 * @param {number} copyNum - 副本编号
 * @param {number} fillStartRow - 填充起始行
 * @param {Array} reportBodyList - 报表主体列表
 */
FillOneTemplate.prototype.FillReportCopy = function (copyNum, fillStartRow, reportBodyList) {
    var fillOneReportCopy = new FillOneReportCopy(
        this.cell,
        this.rsAll,
        this.printParam,
        copyNum,
        fillStartRow,
        reportBodyList,
        this.totalRecordCount,
        this.fillReportSysInfo
    );
    this.fillOneTemplateOutInfo.pageNoColRowInfoList = this.fillOneTemplateOutInfo.pageNoColRowInfoList.concat(fillOneReportCopy.DoJob());
};

/**
 * 获取报表份数
 * @returns {number} 报表份数
 */
FillOneTemplate.prototype.GetReportCopy = function () {
    return Math.ceil((this.totalRecordCount - this.printParam.coverUseBodyRecordCount) / this.printParam.recordPerPage);
};

/**
 * 插入并粘贴内容
 */
FillOneTemplate.prototype.InsertAndPasteContent = function () {
    this.cell.InsertCleanRow(this.cell.GetRows(0), 1, 0);
    this.cell.mfPaste(1, this.cell.GetRows(0) - 1, 0, 1, 0);
};

/**
 * 获取复制内容
 * @returns {Object} 复制内容对象
 */
FillOneTemplate.prototype.GetCopyContent1 = function () {
    var copyStartRow = this.printParam.coverLines + 1;
    var copyEndRow = this.cell.GetRows(0) - 1;

    this.cell.mfCopyRange(1, copyStartRow, this.cell.GetCols(0) - 1, copyEndRow);

    return this.cell.GetCopyContent();
};

/**
 * 获取总记录数
 * @returns {number} 总记录数
 * @throws {Error} 当找不到对应表时抛出错误
 */
FillOneTemplate.prototype.GetTotalRecordCount = function () {
    var tableName = this.printParam.tablesUsedToRecordCount;
    var tableData = this.rsAll[tableName];
    if (tableData) {
        return tableData.length;
    }
    throw new Error("未找到模板参数中所定义的表" + this.printParam.tablesUsedToRecordCount + "的相关记录!");
};
