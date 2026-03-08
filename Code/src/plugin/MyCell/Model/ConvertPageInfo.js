/**
 * @fileoverview 转换页面信息模型 - 定义打印转换时的页面信息
 * @description 该模型用于存储打印转换过程中的页面信息，
 * 包括内容尺寸、行列范围、页面索引等。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 转换页面信息类
 * @class ConvertPageInfo
 * @description 定义打印转换时的页面信息
 * @param {Object} config - 配置对象
 * @param {number} [config.contentWidth=-1] - 内容宽度
 * @param {number} [config.contentHeight=-1] - 内容高度
 * @param {number} [config.startCol=-1] - 起始列
 * @param {number} [config.endCol=-1] - 结束列
 * @param {number} [config.startRow=-1] - 起始行
 * @param {number} [config.endRow=-1] - 结束行
 * @param {number} [config.preDrawPageHeight=-1] - 之前绘制页面高度
 * @param {number} [config.preDrawPageWidth=-1] - 之前绘制页面宽度
 * @param {number} [config.pageIndex=-1] - 页面索引
 */
function ConvertPageInfo(config) {
    /**
     * 内容宽度
     * @type {number}
     */
    this.contentWidth = config.contentWidth || -1;

    /**
     * 内容高度
     * @type {number}
     */
    this.contentHeight = config.contentHeight || -1;

    /**
     * 起始列
     * @type {number}
     */
    this.startCol = config.startCol || -1;

    /**
     * 结束列
     * @type {number}
     */
    this.endCol = config.endCol || -1;

    /**
     * 起始行
     * @type {number}
     */
    this.startRow = config.startRow || -1;

    /**
     * 结束行
     * @type {number}
     */
    this.endRow = config.endRow || -1;

    /**
     * 之前绘制页面高度
     * @type {number}
     */
    this.preDrawPageHeight = config.preDrawPageHeight || -1;

    /**
     * 之前绘制页面宽度
     * @type {number}
     */
    this.preDrawPageWidth = config.preDrawPageWidth || -1;

    /**
     * 页面索引
     * @type {number}
     */
    this.pageIndex = config.pageIndex || -1;
}
