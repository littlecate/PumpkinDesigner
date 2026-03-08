/**
 * @fileoverview 画布类型枚举模块 - 定义不同画布层的类型
 * @description 该模块定义了画布的分层类型，包括背景层、图像层、网格层、文本层、标记层和显示层。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 画布类型枚举对象
 * @namespace CanvasType
 * @description 定义不同画布层的类型常量
 */
const CanvasType = {
    /**
     * 背景层
     * @type {number}
     */
    backgroundLayer: 1,

    /**
     * 图像层
     * @type {number}
     */
    imageLayer: 2,

    /**
     * 网格层
     * @type {number}
     */
    gridLayer: 3,

    /**
     * 文本层
     * @type {number}
     */
    textLayer: 4,

    /**
     * 标记层
     * @type {number}
     */
    markLayer: 5,

    /**
     * 显示层
     * @type {number}
     */
    displayLayer: 6
};
