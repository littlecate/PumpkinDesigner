'use strict';

/**
 * @fileoverview 文本对齐枚举模块，定义单元格水平对齐方式
 * @module TextAlignment
 */

/**
 * 文本对齐枚举对象
 * @namespace TextAlignment
 */
var TextAlignment = {};

/**
 * 左对齐
 * @type {number}
 */
TextAlignment.LEFT = 0;

/**
 * 居中对齐
 * @type {number}
 */
TextAlignment.CENTER = 1;

/**
 * 右对齐
 * @type {number}
 */
TextAlignment.RIGHT = 2;

/**
 * 两端对齐
 * @type {number}
 */
TextAlignment.JUSTIFIED = 3;

/**
 * 全部两端对齐
 * @type {number}
 */
TextAlignment.JUSTIFIED_ALL = 4;