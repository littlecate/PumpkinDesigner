/**
 * @fileoverview 填充单份报表输出信息模型 - 定义单份报表填充后的输出信息
 * @description 该模型用于存储单份报表填充完成后的输出信息，
 * 包括特殊列填充信息列表。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 填充单份报表输出信息类
 * @class FillOneReportOutInfo
 * @description 定义单份报表填充后的输出信息
 * @param {Object} config - 配置对象
 * @param {Array} config.specialColumnFillInfoList - 特殊列填充信息列表
 */
function FillOneReportOutInfo(config) {
    /**
     * 特殊列填充信息列表
     * @type {Array}
     */
    this.specialColumnFillInfoList = config.specialColumnFillInfoList;
}