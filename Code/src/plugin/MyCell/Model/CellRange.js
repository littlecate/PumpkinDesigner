/**
 * @fileoverview 单元格范围模型 - 定义单元格的行列范围
 * @description 该模型用于存储单元格的选择范围信息，
 * 包括起始和结束的行列位置。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 单元格范围类
 * @class CellRange
 * @description 定义单元格的行列范围
 * @param {Object} config - 配置对象
 * @param {number} config.startCol - 起始列
 * @param {number} config.startRow - 起始行
 * @param {number} config.endCol - 结束列
 * @param {number} config.endRow - 结束行
 */
function CellRange(config) {
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
}
