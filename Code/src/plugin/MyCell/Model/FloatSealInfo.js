/**
 * @fileoverview 浮动印章信息模型 - 定义浮动印章的配置信息
 * @description 该模型用于存储浮动印章的配置信息，
 * 包括印章图片路径、条件词列表、关联表名和列名、位置等。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 浮动印章信息类
 * @class FloatSealInfo
 * @description 定义浮动印章的配置信息
 * @param {Object} config - 配置对象
 * @param {string} config.imagePath - 印章图片路径
 * @param {Array} config.conditionWordList - 条件词列表
 * @param {string} config.relTableNameAndColumn - 关联表名和列名
 * @param {string} config.position - 位置
 */
function FloatSealInfo(config) {
    /**
     * 印章图片路径
     * @type {string}
     */
    this.imagePath = config.imagePath;

    /**
     * 条件词列表
     * @type {Array}
     */
    this.conditionWordList = config.conditionWordList;

    /**
     * 关联表名和列名
     * @type {string}
     */
    this.relTableNameAndColumn = config.relTableNameAndColumn;

    /**
     * 位置
     * @type {string}
     */
    this.position = config.position;
}