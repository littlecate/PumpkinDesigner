/**
 * @fileoverview 单元格尺寸模型 - 定义单元格的宽度和高度
 * @description 该模型用于存储单元格的尺寸信息，
 * 包括宽度和高度两个属性。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 单元格尺寸类
 * @class CellSize
 * @description 定义单元格的宽度和高度
 * @param {Object} config - 配置对象
 * @param {number} config.width - 宽度
 * @param {number} config.height - 高度
 */
function CellSize(config) {
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
