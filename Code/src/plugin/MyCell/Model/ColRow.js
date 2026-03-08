/**
 * @fileoverview 行列坐标模型 - 定义单元格的行列位置
 * @description 该模型用于存储单元格在表格中的位置信息，
 * 包括列号和行号两个属性。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 行列坐标类
 * @class ColRow
 * @description 定义单元格的行列位置
 * @param {Object} config - 配置对象
 * @param {number} config.col - 列号
 * @param {number} config.row - 行号
 */
function ColRow(config) {
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
