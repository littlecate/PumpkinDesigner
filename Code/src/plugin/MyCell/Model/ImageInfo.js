/**
 * @fileoverview 图像信息模型 - 定义单元格图像的位置信息
 * @description 该模型用于存储单元格中图像的位置信息，
 * 包括图像类型、行列位置和图像位置参数。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 图像信息类
 * @class ImageInfo
 * @description 定义单元格图像的位置信息
 * @param {Object} config - 配置对象
 * @param {number} config.imageType - 图像类型
 * @param {number} config.col - 列号
 * @param {number} config.row - 行号
 * @param {Object} config.imagePosition - 图像位置参数
 */
function ImageInfo(config) {
    /**
     * 图像类型
     * @type {number}
     */
    this.imageType = config.imageType;

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
     * 图像位置参数
     * @type {Object}
     */
    this.imagePosition = config.imagePosition;
}