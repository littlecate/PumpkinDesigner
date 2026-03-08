/**
 * @fileoverview 报表模板模型 - 定义报表模板的基本信息
 * @description 该模型用于存储报表模板的基本信息，
 * 包括文件键和JSON字符串。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 报表模板类
 * @class ReportTemplate
 * @description 定义报表模板的基本信息
 * @param {Object} config - 配置对象
 * @param {string} config.fileKey - 文件键
 * @param {string} config.jsonStr - JSON字符串
 */
function ReportTemplate(config) {
    /**
     * 文件键
     * @type {string}
     */
    this.fileKey = config.fileKey;

    /**
     * JSON字符串
     * @type {string}
     */
    this.jsonStr = config.jsonStr;
}