/**
 * @fileoverview 绘制对象类型枚举模块 - 定义不同绘制对象的类型
 * @description 该模块定义了绘制对象的类型常量，包括背景图像、单元格图像、网格、文本、浮动图像、左侧标签和顶部标签。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 绘制对象类型枚举对象
 * @namespace DrawObjType
 * @description 定义不同绘制对象的类型常量
 */
const DrawObjType = {
    /**
     * 背景图像
     * @type {number}
     */
    backgroundImage: 1,

    /**
     * 单元格图像
     * @type {number}
     */
    cellImage: 2,

    /**
     * 网格
     * @type {number}
     */
    grid: 3,

    /**
     * 文本
     * @type {number}
     */
    text: 4,

    /**
     * 浮动图像
     * @type {number}
     */
    floatImage: 5,

    /**
     * 左侧标签
     * @type {number}
     */
    leftLabel: 6,

    /**
     * 顶部标签
     * @type {number}
     */
    topLabel: 7
};
