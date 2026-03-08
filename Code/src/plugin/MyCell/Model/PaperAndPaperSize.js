/**
 * @fileoverview 纸张和纸张尺寸模型 - 定义打印纸张的规格信息
 * @description 该模型用于存储打印纸张的规格信息，
 * 包括纸张名称、说明、宽度和高度。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 纸张和纸张尺寸类
 * @class PaperAndPaperSize
 * @description 定义打印纸张的规格信息
 * @param {Object} config - 配置对象
 * @param {string} config.paper - 纸张名称
 * @param {string} config.explain - 说明
 * @param {number} config.width - 宽度
 * @param {number} config.height - 高度
 */
function PaperAndPaperSize(config) {
    /**
     * 纸张名称
     * @type {string}
     */
    this.paper = config.paper;

    /**
     * 说明
     * @type {string}
     */
    this.explain = config.explain;

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