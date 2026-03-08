/**
 * @fileoverview 单元格属性模型 - 定义单元格的各种属性
 * @description 该模型用于存储单元格的所有属性信息，
 * 包括内容、样式、边框、字体、对齐方式、合并信息、公式等。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 单元格属性类
 * @class CellProp
 * @description 定义单元格的各种属性，包括内容、样式、边框、字体等
 * @param {Object} config - 配置对象
 */
function CellProp(config) {
    if (!config) {
        config = {};
    }

    /**
     * 单元格内容字符串
     * @type {string}
     */
    this.str = config.str;

    /**
     * 单元格背景颜色
     * @type {number}
     */
    this.backgroundColor = config.backgroundColor || 0;

    /**
     * 左边框样式
     * @type {number}
     */
    this.borderLeft = config.borderLeft || 0;

    /**
     * 上边框样式
     * @type {number}
     */
    this.borderTop = config.borderTop || 0;

    /**
     * 右边框样式
     * @type {number}
     */
    this.borderRight = config.borderRight || 0;

    /**
     * 下边框样式
     * @type {number}
     */
    this.borderBottom = config.borderBottom || 0;

    /**
     * 左边框颜色
     * @type {number}
     */
    this.borderLeftColor = config.borderLeftColor || 0;

    /**
     * 上边框颜色
     * @type {number}
     */
    this.borderTopColor = config.borderTopColor || 0;

    /**
     * 右边框颜色
     * @type {number}
     */
    this.borderRightColor = config.borderRightColor || 0;

    /**
     * 下边框颜色
     * @type {number}
     */
    this.borderBottomColor = config.borderBottomColor || 0;

    /**
     * 图片索引
     * @type {number}
     */
    this.imageIndex = config.imageIndex || -1;

    /**
     * 图片样式
     * @type {number}
     */
    this.imageStyle = config.imageStyle || -1;

    /**
     * 图片水平对齐方式
     * @type {number}
     */
    this.imageHAlign = config.imageHAlign || -1;

    /**
     * 图片垂直对齐方式
     * @type {number}
     */
    this.imageVAlign = config.imageVAlign || -1;

    /**
     * 字体家族
     * @type {string}
     */
    this.fontFamily = config.fontFamily || "宋体";

    /**
     * 字体大小
     * @type {number}
     */
    this.fontSize = config.fontSize || 11;

    /**
     * 字体样式
     * @type {number}
     */
    this.fontStyle = config.fontStyle || 0;

    /**
     * 字体颜色
     * @type {number}
     */
    this.fontColor = config.fontColor || 0;

    /**
     * 行间距
     * @type {number}
     */
    this.lineSpace = config.lineSpace || 0;

    /**
     * 单元格水平对齐方式
     * @type {number}
     */
    this.cellHAlign = config.cellHAlign || 0;

    /**
     * 单元格垂直对齐方式
     * @type {number}
     */
    this.cellVAlign = config.cellVAlign || 0;

    /**
     * 是否在合并区域内
     * @type {boolean}
     */
    this.isInMergeArea = config.isInMergeArea || false;

    /**
     * 合并区域ID
     * @type {string}
     */
    this.mergeAreaId = config.mergeAreaId || "";

    /**
     * 公式ID
     * @type {string}
     */
    this.formulaId = config.formulaId || "";

    /**
     * 图表数据
     * @type {string}
     */
    this.chartData = config.chartData || "";

    /**
     * 备注
     * @type {string}
     */
    this.note = config.note || "";

    /**
     * 数字格式类型
     * @type {number}
     */
    this.numType = config.numType || 0;

    /**
     * 小数位数
     * @type {number}
     */
    this.digital = config.digital || 2;

    /**
     * 原始值
     * @type {*}
     */
    this.rawValue = null;
}
