/**
 * @fileoverview 单元格图像模型 - 定义单元格中的图像信息
 * @description 该模型用于存储单元格中嵌入的图像信息，
 * 包括图像索引、类型和Base64编码的图像数据。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 单元格图像类
 * @class CellImage
 * @description 定义单元格中的图像信息
 * @param {Object} config - 配置对象
 * @param {number} config.imageIndex - 图像索引
 * @param {number} config.imageType - 图像类型
 * @param {string} config.imageData - 图像数据（Base64）
 */
function CellImage(config) {
    /**
     * 图像索引
     * @type {number}
     */
    this.imageIndex = config.imageIndex;

    /**
     * 图像类型
     * @type {number}
     */
    this.imageType = config.imageType;

    /**
     * 图像数据（Base64编码）
     * @type {string}
     */
    this.imageData = config.imageData;
}
