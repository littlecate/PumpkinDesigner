/**
 * @fileoverview 填充数据模块 - 负责将数据填充到报表模板中
 * @description 该模块是报表数据填充的核心模块，负责将JSON数据填充到报表模板中，
 * 支持多种数据类型转换、签名图片插入、浮动印章等功能。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 填充数据映射（列行 -> 表名.列名.记录号）
 * @type {Object}
 * @description 存储单元格位置到数据字段的映射关系
 */
let fillDataMaps1 = {};

/**
 * 填充数据映射（表名.列名.记录号 -> 列行集合）
 * @type {Object}
 * @description 存储数据字段到单元格位置的映射关系
 */
let fillDataMaps2 = {};

/**
 * 填充数据JSON数据
 * @type {Array}
 * @description 存储待填充的JSON数据
 */
let fillDataJsonData = [];

/**
 * 是否需要记录填充数据映射
 * @type {boolean}
 * @description 控制是否记录填充数据映射关系
 */
let isNeedRecordRecordFillDataMaps = false;

/**
 * 是否正在填充数据
 * @type {boolean}
 * @description 标记当前是否处于填充数据过程中
 */
let isInFillDataing = false;

/**
 * 需要设置的复选框信息列表
 * @type {Array}
 * @description 存储需要设置为复选框的单元格信息
 */
let needSetCheckBoxInfoList = [];

/**
 * 填充数据类
 * @class FillData
 * @description 负责将数据填充到报表模板中
 * @param {Object} parentObj - 父对象，用于回调绘制方法
 * @returns {Object} 包含DoJob方法的对象
 */
function FillData(parentObj) {
    var isFirstTime = true;

    /**
     * 执行填充数据任务
     * @param {Object} config - 配置对象
     * @param {string} config.jsonDataStr - JSON数据字符串
     * @param {Array} config.reportTemplateList - 报表模板列表
     * @param {Array} config.reportTemplateConditionInfoList - 报表模板条件信息列表
     * @param {Array} config.reportTemplatePrintParamList - 报表模板打印参数列表
     * @param {Object} config.fillReportSysInfo - 填充报表系统信息
     * @param {boolean} config.isOnlyNeedRedrawText - 是否只需要重绘文本
     */
    function DoJob(config) {
        fillDataMaps1 = {};
        fillDataMaps2 = {};
        isInFillDataing = true;
        var result = fillData(config);
        isInFillDataing = false;

        if (isFirstTime) {
            isFirstTime = false;
            parentObj.drawCellDataFirstTime(result);
        } else {
            parentObj.resetCellData(result, config.isOnlyNeedRedrawText, true);
        }
    }

    /**
     * 执行填充数据
     * @param {Object} config - 配置对象
     * @returns {Object} 生成的报表输出信息
     */
    function fillData(config) {
        var jsonDataStr = config.jsonDataStr;
        var reportTemplateList = config.reportTemplateList;
        var reportTemplateConditionInfoList = config.reportTemplateConditionInfoList;
        var reportTemplatePrintParamList = config.reportTemplatePrintParamList;
        var fillReportSysInfo = config.fillReportSysInfo;

        var fillOneTemplateOutInfoListAll = [];

        var startDo = StartDo.CreateStartDo(
            jsonDataStr,
            reportTemplateList,
            reportTemplateConditionInfoList,
            reportTemplatePrintParamList,
            fillReportSysInfo
        );
        var fillOneTemplateOutInfoList1 = startDo.GenReport();
        fillOneTemplateOutInfoListAll = fillOneTemplateOutInfoListAll.concat(fillOneTemplateOutInfoList1);

        var endDo = new EndDo();
        var genReportOutInfo = endDo.GetGenReportOutInfo(fillOneTemplateOutInfoListAll, fillReportSysInfo);
        var result = genReportOutInfo.outFileList[0];

        return result;
    }

    return {
        DoJob: DoJob
    };
}
