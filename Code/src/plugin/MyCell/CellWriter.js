'use strict';

/**
 * @fileoverview 单元格写入器模块，用于在画布上绘制单元格内容
 * @module CellWriter
 */

/**
 * 单元格写入器类
 * @class
 * @param {Object} config - 配置对象
 * @param {CanvasRenderingContext2D} config.ctx - 画布上下文
 */
function CellWriter(config) {
    this.ctx = config.ctx;
}