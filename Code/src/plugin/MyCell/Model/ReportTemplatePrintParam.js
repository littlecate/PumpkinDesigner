/**
 * @fileoverview 报表模板打印参数模型 - 定义报表打印的参数配置
 * @description 该模型用于存储报表打印的参数配置，
 * 包括文件键、报表主体列表、封面行数、记录数等。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 报表模板打印参数类
 * @class ReportTemplatePrintParam
 * @description 定义报表打印的参数配置
 * @param {Object} config - 配置对象
 * @param {string} config.fileKey - 文件键
 * @param {Array.<ReportBody>} config.reportBodyList - 报表主体列表
 * @param {number} config.coverLines - 封面行数
 * @param {boolean} config.coverUseBodyRecordCount - 封面是否使用主体记录数
 * @param {boolean} config.isPrintBodyContinious - 是否连续打印主体
 * @param {boolean} config.needCombinColumns - 是否需要合并列
 * @param {Array} config.tablesUsedToRecordCount - 用于记录计数的表列表
 * @param {number} config.recordPerPage - 每页记录数
 */
function ReportTemplatePrintParam(config) {
    /**
     * 文件键
     * @type {string}
     */
    this.fileKey = config.fileKey;

    /**
     * 报表主体列表
     * @type {Array.<ReportBody>}
     */
    this.reportBodyList = config.reportBodyList;

    /**
     * 封面行数
     * @type {number}
     */
    this.coverLines = config.coverLines;

    /**
     * 封面是否使用主体记录数
     * @type {boolean}
     */
    this.coverUseBodyRecordCount = config.coverUseBodyRecordCount;

    /**
     * 是否连续打印主体
     * @type {boolean}
     */
    this.isPrintBodyContinious = config.isPrintBodyContinious;

    /**
     * 是否需要合并列
     * @type {boolean}
     */
    this.needCombinColumns = config.needCombinColumns;

    /**
     * 用于记录计数的表列表
     * @type {Array}
     */
    this.tablesUsedToRecordCount = config.tablesUsedToRecordCount;

    /**
     * 每页记录数
     * @type {number}
     */
    this.recordPerPage = config.recordPerPage;
}