/**
 * @fileoverview 页码行列信息模型 - 定义页码单元格的位置信息
 * @description 该模型用于存储页码单元格的位置信息，
 * 包括列号和行号。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 页码行列信息类
 * @class PageNoColRowInfo
 * @description 定义页码单元格的位置信息
 * @param {Object} config - 配置对象
 * @param {number} config.col - 列号
 * @param {number} config.row - 行号
 */
function PageNoColRowInfo(config) {
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
}