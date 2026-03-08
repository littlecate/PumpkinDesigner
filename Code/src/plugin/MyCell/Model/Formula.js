/**
 * @fileoverview 公式模型 - 定义单元格公式的属性和引用关系
 * @description 该模型用于存储单元格公式的信息，
 * 包括公式ID、代码行、目标位置和引用关系。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 公式类
 * @class Formula
 * @description 定义单元格公式的属性和引用关系
 * @param {Object} config - 配置对象
 * @param {string} config.id - 公式ID
 * @param {string} config.codeLine - 代码行
 * @param {string} config.codeLineRaw - 原始代码行
 * @param {number} config.targetCol - 目标列
 * @param {number} config.targetRow - 目标行
 * @param {Array} config.refColRowList - 引用的行列列表
 */
function Formula(config) {
    /**
     * 公式ID
     * @type {string}
     */
    this.id = config.id;

    /**
     * 代码行
     * @type {string}
     */
    this.codeLine = config.codeLine;

    /**
     * 原始代码行
     * @type {string}
     */
    this.codeLineRaw = config.codeLineRaw;

    /**
     * 目标列
     * @type {number}
     */
    this.targetCol = config.targetCol;

    /**
     * 目标行
     * @type {number}
     */
    this.targetRow = config.targetRow;

    /**
     * 引用的行列列表
     * @type {Array}
     */
    this.refColRowList = config.refColRowList;
}
