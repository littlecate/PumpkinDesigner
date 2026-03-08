/**
 * @fileoverview 报表信息模型 - 定义报表的基本信息
 * @description 该模型用于存储报表的基本信息，
 * 包括报表名称和文件键。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 报表信息类
 * @class ReportInfo
 * @description 定义报表的基本信息
 * @param {Object} config - 配置对象
 * @param {string} config.reportName - 报表名称
 * @param {string} config.fileKey - 文件键
 */
function ReportInfo(config) {
    /**
     * 报表名称
     * @type {string}
     */
    this.reportName = config.reportName;

    /**
     * 文件键
     * @type {string}
     */
    this.fileKey = config.fileKey;
}