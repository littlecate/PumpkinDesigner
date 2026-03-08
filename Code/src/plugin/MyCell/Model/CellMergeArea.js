/**
 * @fileoverview 单元格合并区域模型 - 定义单元格合并的区域范围
 * @description 该模型用于存储单元格合并区域的信息，
 * 包括合并区域的起始和结束行列位置以及绘制状态。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 单元格合并区域类
 * @class CellMergeArea
 * @description 定义单元格合并的区域范围
 * @param {Object} config - 配置对象
 * @param {string} config.id - 合并区域ID
 * @param {number} config.startCol - 起始列
 * @param {number} config.startRow - 起始行
 * @param {number} config.endCol - 结束列
 * @param {number} config.endRow - 结束行
 * @param {boolean} config.isDrawed - 是否已绘制
 */
function CellMergeArea(config) {
    /**
     * 合并区域ID
     * @type {string}
     */
    this.id = config.id;

    /**
     * 起始列
     * @type {number}
     */
    this.startCol = config.startCol;

    /**
     * 起始行
     * @type {number}
     */
    this.startRow = config.startRow;

    /**
     * 结束列
     * @type {number}
     */
    this.endCol = config.endCol;

    /**
     * 结束行
     * @type {number}
     */
    this.endRow = config.endRow;

    /**
     * 是否已绘制
     * @type {boolean}
     */
    this.isDrawed = config.isDrawed;
}
