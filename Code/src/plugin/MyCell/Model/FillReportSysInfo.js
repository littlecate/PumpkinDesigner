/**
 * @fileoverview 填充报表系统信息模型 - 定义报表填充的系统配置信息
 * @description 该模型用于存储报表填充过程中的系统配置信息，
 * 包括签名信息、浮动印章、空白填充、日期格式等配置。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 填充报表系统信息类
 * @class FillReportSysInfo
 * @description 定义报表填充的系统配置信息
 * @param {Object} config - 配置对象
 * @param {Array} config.signNameInfoList - 签名信息列表
 * @param {Array} config.floatSealInfoList - 浮动印章信息列表
 * @param {string} config.blankFillStr - 空白填充字符串
 * @param {string} config.emptyFillStrH - 水平空值填充字符串
 * @param {string} config.emptyFillStrV - 垂直空值填充字符串
 * @param {string} config.fillBodyBlankType - 主体空白填充类型
 * @param {string} config.fillXuHaoType - 序号填充类型
 * @param {string} config.dateFormat - 日期格式
 * @param {string} config.dateTimeFormat - 日期时间格式
 * @param {string} config.timeFormat - 时间格式
 * @param {string} config.outFileFolder - 输出文件夹
 * @param {string} config.outFileType - 输出文件类型
 */
function FillReportSysInfo(config) {
    /**
     * 签名信息列表
     * @type {Array}
     */
    this.signNameInfoList = config.signNameInfoList;

    /**
     * 浮动印章信息列表
     * @type {Array}
     */
    this.floatSealInfoList = config.floatSealInfoList;

    /**
     * 空白填充字符串
     * @type {string}
     */
    this.blankFillStr = config.blankFillStr;

    /**
     * 水平空值填充字符串
     * @type {string}
     */
    this.emptyFillStrH = config.emptyFillStrH;

    /**
     * 垂直空值填充字符串
     * @type {string}
     */
    this.emptyFillStrV = config.emptyFillStrV;

    /**
     * 主体空白填充类型
     * @type {string}
     */
    this.fillBodyBlankType = config.fillBodyBlankType;

    /**
     * 序号填充类型
     * @type {string}
     */
    this.fillXuHaoType = config.fillXuHaoType;

    /**
     * 日期格式
     * @type {string}
     */
    this.dateFormat = config.dateFormat;

    /**
     * 日期时间格式
     * @type {string}
     */
    this.dateTimeFormat = config.dateTimeFormat;

    /**
     * 时间格式
     * @type {string}
     */
    this.timeFormat = config.timeFormat;

    /**
     * 输出文件夹
     * @type {string}
     */
    this.outFileFolder = config.outFileFolder;

    /**
     * 输出文件类型
     * @type {string}
     */
    this.outFileType = config.outFileType;
}