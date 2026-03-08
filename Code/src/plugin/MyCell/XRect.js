/**
 * 矩形类
 * 定义矩形的坐标和尺寸
 */
'use strict';

/**
 * 矩形构造函数
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {number} width - 宽度
 * @param {number} height - 高度
 */
function XRect(x, y, width, height) {
    /**
     * X坐标
     * @type {number}
     */
    var X = x;

    /**
     * Y坐标
     * @type {number}
     */
    var Y = y;

    /**
     * 宽度
     * @type {number}
     */
    var Width = width;

    /**
     * 高度
     * @type {number}
     */
    var Height = height;

    /**
     * 获取X坐标
     * @returns {number} X坐标
     */
    function GetX() {
        return X;
    }

    /**
     * 获取Y坐标
     * @returns {number} Y坐标
     */
    function GetY() {
        return Y;
    }

    /**
     * 获取宽度
     * @returns {number} 宽度
     */
    function GetWidth() {
        return Width;
    }

    /**
     * 获取高度
     * @returns {number} 高度
     */
    function GetHeight() {
        return Height;
    }

    /**
     * 设置X坐标
     * @param {number} x - X坐标
     */
    function SetX(x) {
        X = x;
    }

    /**
     * 设置Y坐标
     * @param {number} y - Y坐标
     */
    function SetY(y) {
        Y = y;
    }

    /**
     * 设置宽度
     * @param {number} width - 宽度
     */
    function SetWidth(width) {
        Width = width;
    }

    /**
     * 设置高度
     * @param {number} height - 高度
     */
    function SetHeight(height) {
        Height = height;
    }

    return {
        GetX: GetX,
        GetY: GetY,
        GetWidth: GetWidth,
        GetHeight: GetHeight,
        SetX: SetX,
        SetY: SetY,
        SetWidth: SetWidth,
        SetHeight: SetHeight,
        X: X,
        Y: Y,
        Width: Width,
        Height: Height,
        x: X,
        y: Y,
        width: Width,
        height: Height
    };
}
