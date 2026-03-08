/**
 * @fileoverview 绘制文本对象模型 - 定义文本绘制所需的信息
 * @description 该模型用于存储文本绘制时所需的所有信息，
 * 包括文本内容、字体、颜色、位置、对齐方式等。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 绘制文本对象类
 * @class DrawTextObj
 * @description 定义文本绘制所需的信息
 * @param {string} t - 文本内容
 * @param {string} font - 字体样式
 * @param {string} normalFont - 常规字体
 * @param {string} color - 颜色
 * @param {Object} xrect - 矩形区域
 * @param {number} hAlign - 水平对齐方式
 * @param {number} vAlign - 垂直对齐方式
 * @param {number} height - 文本高度
 * @param {boolean} isSubSup - 是否为上下标
 */
function DrawTextObj(t, font, normalFont, color, xrect, hAlign, vAlign, height, isSubSup) {
    /**
     * 文本内容
     * @type {string}
     */
    this.Text = t;

    /**
     * 字体样式
     * @type {string}
     */
    this.Font = font;

    /**
     * 常规字体
     * @type {string}
     */
    this.NormalFont = normalFont;

    /**
     * 颜色
     * @type {string}
     */
    this.Color = color;

    /**
     * 矩形区域
     * @type {Object}
     */
    this.XRect = xrect;

    /**
     * 水平对齐方式
     * @type {number}
     */
    this.HAlign = hAlign;

    /**
     * 垂直对齐方式
     * @type {number}
     */
    this.VAlign = vAlign;

    /**
     * 文本高度
     * @type {number}
     */
    this.TextHeight = height;

    /**
     * 是否为上下标
     * @type {boolean}
     */
    this.isSubSup = isSubSup;
}