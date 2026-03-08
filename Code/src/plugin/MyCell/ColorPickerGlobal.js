'use strict';

/**
 * @fileoverview 颜色选择器全局对象模块，用于存储颜色选择器的操作对象
 * @module ColorPickerGlobal
 */

/**
 * 颜色选择器全局类
 * @class
 * @param {Object} config - 配置对象
 * @param {Object} config.operObj - 操作对象
 */
function ColorPickerGlobal(config) {
    this.operObj = config.operObj || null;    
}

/**
 * 颜色选择器全局实例
 * @type {ColorPickerGlobal}
 */
let colorPickerGlobal = new ColorPickerGlobal({});