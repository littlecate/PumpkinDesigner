/**
 * @fileoverview 报表主体模型 - 定义报表主体的区域信息
 * @description 该模型用于存储报表主体的区域信息，
 * 包括方向、起始和结束行列、每份样本的行列数等。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 报表主体类
 * @class ReportBody
 * @description 定义报表主体的区域信息
 * @param {Object} config - 配置对象
 * @param {string} config.orientation - 方向（横向/纵向）
 * @param {number} config.startRow - 起始行
 * @param {number} config.endRow - 结束行
 * @param {number} config.startCol - 起始列
 * @param {number} config.endCol - 结束列
 * @param {number} config.rowsOrColsPerSample - 每份样本的行/列数
 * @param {boolean} config.isEveryCopyIsSame - 每份副本是否相同
 */
function ReportBody(config) {
    /**
     * 方向（横向/纵向）
     * @type {string}
     */
    this.orientation = config.orientation;

    /**
     * 起始行
     * @type {number}
     */
    this.startRow = config.startRow;

    /**
     * 结束行
     * @type {number}
     */
    this.endRow = config.endRow;

    /**
     * 起始列
     * @type {number}
     */
    this.startCol = config.startCol;

    /**
     * 结束列
     * @type {number}
     */
    this.endCol = config.endCol;

    /**
     * 每份样本的行/列数
     * @type {number}
     */
    this.rowsOrColsPerSample = config.rowsOrColsPerSample;

    /**
     * 每份副本是否相同
     * @type {boolean}
     */
    this.isEveryCopyIsSame = config.isEveryCopyIsSame;
}