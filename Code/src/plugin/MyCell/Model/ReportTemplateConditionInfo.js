/**
 * @fileoverview 报表模板条件信息模型 - 定义模板条件组信息
 * @description 该模型用于存储模板条件组信息，
 * 包括文件键和条件列表。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 报表模板条件信息类
 * @class ReportTemplateConditionInfo
 * @description 定义模板条件组信息
 * @param {Object} config - 配置对象
 * @param {string} config.fileKey - 文件键
 * @param {Array.<Array.<ReportTemplateCondition>>} config.reportTemplateConditionList - 条件列表（二维数组，每组条件之间是OR关系）
 */
function ReportTemplateConditionInfo(config) {
    /**
     * 文件键
     * @type {string}
     */
    this.fileKey = config.fileKey;

    /**
     * 条件列表（二维数组，每组条件之间是OR关系）
     * @type {Array.<Array.<ReportTemplateCondition>>}
     */
    this.reportTemplateConditionList = config.reportTemplateConditionList;
}