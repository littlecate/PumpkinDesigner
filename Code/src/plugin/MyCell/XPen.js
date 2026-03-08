/**
 * 画笔类
 * 定义绑制线条的颜色、宽度和样式
 */
'use strict';

/**
 * 画笔构造函数
 * @param {string} xColor - 颜色值
 */
function XPen(xColor) {
    /**
     * 颜色
     * @type {string}
     */
    this.xColor = xColor;

    /**
     * 虚线样式
     * @type {number}
     */
    this.DashStyle = XDashStyle.Solid;

    /**
     * 线条宽度
     * @type {number}
     */
    this.Width = GlobalV.lineWidth1;

    /**
     * 获取颜色
     * @returns {string} 颜色值
     */
    this.GetColor = function () {
        return this.xColor;
    };
}
