/**
 * @fileoverview 开始执行模块 - 负责初始化报表生成流程
 * @description 该模块是报表生成的入口点，负责解析JSON数据、
 * 选择模板、合并报表主体、填充数据等整个报表生成流程的初始化。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 开始执行类
 * @class StartDo
 * @description 负责初始化报表生成流程
 * @param {string} jsonStr - JSON数据字符串
 * @param {Array} reportTemplateList - 报表模板列表
 * @param {Array} reportTemplateConditionInfoList - 报表模板条件信息列表
 * @param {Array} reportTemplatePrintParamList - 报表模板打印参数列表
 * @param {Object} fillReportSysInfo - 填充报表系统信息
 */
function StartDo(jsonStr, reportTemplateList, reportTemplateConditionInfoList, reportTemplatePrintParamList, fillReportSysInfo) {
    /**
     * 所有结果集数据
     * @type {Object}
     */
    this.rsAll = JSON.parse(jsonStr);
    fillDataJsonData = this.rsAll;

    /**
     * 报表模板列表
     * @type {Array}
     */
    this.reportTemplateList = reportTemplateList;

    /**
     * 报表模板条件信息列表
     * @type {Array}
     */
    this.reportTemplateConditionInfoList = reportTemplateConditionInfoList;

    /**
     * 报表模板打印参数列表
     * @type {Array}
     */
    this.reportTemplatePrintParamList = reportTemplatePrintParamList;

    /**
     * 填充报表系统信息
     * @type {Object}
     */
    this.fillReportSysInfo = fillReportSysInfo;

    /**
     * 生成报表
     * @returns {Array} 填充模板输出信息列表
     */
    this.GenReport = function () {
        var fileKeyList = SelectTemplate.CreateSelectTemplate(this.rsAll, this.reportTemplateConditionInfoList).GetFileKeyList();

        if (fileKeyList.length === 0) {
            fileKeyList.push(this.reportTemplateList[0].fileKey);
        }

        var fillOneTemplateOutInfoList = [];

        for (var i = 0; i < fileKeyList.length; i++) {
            var fileKey = fileKeyList[i];
            var cellSheet = this.GetCellSheet(fileKey);
            var printParams = this.GetTemplatePrintParams(fileKey);
            new MergeReportBodyListContent(printParams.reportBodyList, cellSheet).doJob();
            var cell = new OperCell();
            cell.Open(cellSheet);
            var fillOneTemplateOutInfo = new FillOneTemplate(this.rsAll, cell, printParams, this.fillReportSysInfo).DoJob();
            fillOneTemplateOutInfo.cell = cell;
            fillOneTemplateOutInfo.cellSheet = cellSheet;
            fillOneTemplateOutInfoList.push(fillOneTemplateOutInfo);
        }

        return fillOneTemplateOutInfoList;
    };

    /**
     * 获取模板打印参数
     * @param {string} fileKey - 文件键
     * @returns {Object} 打印参数对象
     * @throws {Error} 当找不到对应模板参数时抛出错误
     */
    this.GetTemplatePrintParams = function (fileKey) {
        for (var i = 0; i < this.reportTemplatePrintParamList.length; i++) {
            var param = this.reportTemplatePrintParamList[i];
            if (param.fileKey === fileKey) {
                return param;
            }
        }
        throw new Error("未找到" + fileKey + "对应的模板参数!");
    };

    /**
     * 获取单元格工作表
     * @param {string} fileKey - 文件键
     * @returns {Object} 单元格工作表对象
     * @throws {Error} 当找不到对应模板时抛出错误
     */
    this.GetCellSheet = function (fileKey) {
        for (var i = 0; i < this.reportTemplateList.length; i++) {
            var template = this.reportTemplateList[i];
            if (template.fileKey === fileKey) {
                return JSON.parse(template.jsonStr);
            }
        }
        throw new Error("未找到" + fileKey + "对应的模板!");
    };
}

/**
 * 创建开始执行实例的静态方法
 * @param {string} jsonStr - JSON数据字符串
 * @param {Array} reportTemplateList - 报表模板列表
 * @param {Array} reportTemplateConditionInfoList - 报表模板条件信息列表
 * @param {Array} reportTemplatePrintParamList - 报表模板打印参数列表
 * @param {Object} fillReportSysInfo - 填充报表系统信息
 * @returns {StartDo} 开始执行实例
 */
StartDo.CreateStartDo = function (jsonStr, reportTemplateList, reportTemplateConditionInfoList, reportTemplatePrintParamList, fillReportSysInfo) {
    return new StartDo(jsonStr, reportTemplateList, reportTemplateConditionInfoList, reportTemplatePrintParamList, fillReportSysInfo);
};
