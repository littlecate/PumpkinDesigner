/**
 * @fileoverview 签名信息模型 - 定义签名图片和名字的配置信息
 * @description 该模型用于存储签名图片和名字的配置信息，
 * 包括图片路径、关联表名和列名、位置、是否需要拆分单元格等。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 签名信息类
 * @class SignNameInfo
 * @description 定义签名图片和名字的配置信息
 * @param {Object} config - 配置对象
 * @param {string} config.imagePath - 签名图片路径
 * @param {string} config.relTableNameAndColumn - 关联表名和列名
 * @param {string} config.position - 签名位置
 * @param {boolean} config.isNeedSplitCell - 是否需要拆分单元格
 */
function SignNameInfo(config) {
    /**
     * 签名图片路径
     * @type {string}
     */
    this.imagePath = config.imagePath;

    /**
     * 关联表名和列名
     * @type {string}
     */
    this.relTableNameAndColumn = config.relTableNameAndColumn;

    /**
     * 签名位置
     * @type {string}
     */
    this.position = config.position;

    /**
     * 是否需要拆分单元格
     * @type {boolean}
     */
    this.isNeedSplitCell = config.isNeedSplitCell;
}