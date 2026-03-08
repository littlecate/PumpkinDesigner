/**
 * @fileoverview 填充单个模板输出信息模型 - 定义单个模板填充后的输出信息
 * @description 该模型用于存储单个模板填充完成后的输出信息，
 * 包括单元格对象、单元格表格和页码行列信息列表。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 填充单个模板输出信息类
 * @class FillOneTemplateOutInfo
 * @description 定义单个模板填充后的输出信息
 * @param {Object} config - 配置对象
 * @param {Object} config.cell - 单元格操作对象
 * @param {Object} config.cellSheet - 单元格表格对象
 * @param {Array} config.pageNoColRowInfoList - 页码行列信息列表
 */
function FillOneTemplateOutInfo(config) {
    /**
     * 单元格操作对象
     * @type {Object}
     */
    this.cell = config.cell;

    /**
     * 单元格表格对象
     * @type {Object}
     */
    this.cellSheet = config.cellSheet;

    /**
     * 页码行列信息列表
     * @type {Array}
     */
    this.pageNoColRowInfoList = config.pageNoColRowInfoList;
}