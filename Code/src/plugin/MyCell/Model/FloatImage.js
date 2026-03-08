/**
 * @fileoverview 浮动图像模型 - 定义浮动在单元格上方的图像信息
 * @description 该模型用于存储浮动图像的信息，
 * 包括图像索引、名称、位置、尺寸和页面索引。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 浮动图像类
 * @class FloatImage
 * @description 定义浮动在单元格上方的图像信息
 * @param {Object} config - 配置对象
 * @param {number} config.index - 图像索引
 * @param {string} config.name - 图像名称
 * @param {number} config.xpos - X坐标位置
 * @param {number} config.ypos - Y坐标位置
 * @param {number} config.width - 图像宽度
 * @param {number} config.height - 图像高度
 * @param {number} [config.pageIndex=-1] - 页面索引
 */
function FloatImage(config) {
    /**
     * 图像索引
     * @type {number}
     */
    this.index = config.index;

    /**
     * 图像名称
     * @type {string}
     */
    this.name = config.name;

    /**
     * X坐标位置
     * @type {number}
     */
    this.xpos = config.xpos;

    /**
     * Y坐标位置
     * @type {number}
     */
    this.ypos = config.ypos;

    /**
     * 图像宽度
     * @type {number}
     */
    this.width = config.width;

    /**
     * 图像高度
     * @type {number}
     */
    this.height = config.height;

    /**
     * 页面索引
     * @type {number}
     */
    this.pageIndex = config.pageIndex || -1;
}
