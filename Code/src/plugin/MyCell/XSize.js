/**
 * 尺寸类
 * 定义对象的宽度和高度
 */
'use strict';

/**
 * 尺寸构造函数
 * @param {Object} config - 配置对象
 * @param {number} config.Width - 宽度
 * @param {number} config.Height - 高度
 */
function XSize(config) {
    /**
     * 宽度
     * @type {number}
     */
    this.Width = config.Width;

    /**
     * 高度
     * @type {number}
     */
    this.Height = config.Height;
}
