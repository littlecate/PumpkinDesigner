/**
 * @fileoverview 复制属性模型 - 定义单个单元格的复制属性
 * @description 该模型用于存储单个单元格的复制属性，
 * 包括单元格对象、位置和尺寸信息。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 复制属性类
 * @class CopyProp
 * @description 定义单个单元格的复制属性
 * @param {Object} config - 配置对象
 * @param {Object} config.cell - 单元格对象
 * @param {number} config.col - 列号
 * @param {number} config.row - 行号
 * @param {number} config.width - 宽度
 * @param {number} config.height - 高度
 */
function CopyProp(config) {
    /**
     * 单元格对象
     * @type {Object}
     */
    this.cell = config.cell;

    /**
     * 列号
     * @type {number}
     */
    this.col = config.col;

    /**
     * 行号
     * @type {number}
     */
    this.row = config.row;

    /**
     * 宽度
     * @type {number}
     */
    this.width = config.width;

    /**
     * 高度
     * @type {number}
     */
    this.height = config.height;
}
