/**
 * @fileoverview 生成报表输出信息模型 - 定义报表生成后的输出信息
 * @description 该模型用于存储报表生成完成后的输出信息，
 * 包括输出文件列表和填充模板输出信息列表。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 生成报表输出信息类
 * @class GenReportOutInfo
 * @description 定义报表生成后的输出信息
 * @param {Object} config - 配置对象
 * @param {Array} config.outFileList - 输出文件列表
 * @param {Array} config.fillOneTemplateOutInfoList - 填充模板输出信息列表
 */
function GenReportOutInfo(config) {
    /**
     * 输出文件列表
     * @type {Array}
     */
    this.outFileList = config.outFileList;

    /**
     * 填充模板输出信息列表
     * @type {Array}
     */
    this.fillOneTemplateOutInfoList = config.fillOneTemplateOutInfoList;
}