/**
 * @fileoverview 复制信息模型 - 定义单元格复制操作的信息
 * @description 该模型用于存储单元格复制操作的信息，
 * 包括复制的属性列表、公式列表和合并区域列表。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 复制信息类
 * @class CopyInfo
 * @description 定义单元格复制操作的信息
 * @param {Object} config - 配置对象
 * @param {Array} config.copyPropList - 复制的属性列表
 * @param {Array} config.copyFormulaList - 复制的公式列表
 * @param {Array} config.copyMergeAreaList - 复制的合并区域列表
 */
function CopyInfo(config) {
    /**
     * 复制的属性列表
     * @type {Array}
     */
    this.copyPropList = config.copyPropList;

    /**
     * 复制的公式列表
     * @type {Array}
     */
    this.copyFormulaList = config.copyFormulaList;

    /**
     * 复制的合并区域列表
     * @type {Array}
     */
    this.copyMergeAreaList = config.copyMergeAreaList;
}
