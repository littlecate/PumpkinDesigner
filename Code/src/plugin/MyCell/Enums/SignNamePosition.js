/**
 * @fileoverview 签名位置枚举模块 - 定义签名图片和名字的相对位置
 * @description 该模块定义了签名图片和名字的相对位置常量，
 * 包括上下左右排列以及仅显示签名图片或名字等六种布局方式。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 签名位置枚举对象
 * @namespace SignNamePosition
 * @description 定义签名图片和名字的相对位置常量
 */
const SignNamePosition = {
    /**
     * 签名图片居上名字居下
     * @type {number}
     */
    签名图片居上名字居下: 0,

    /**
     * 签名图片居下名字居上
     * @type {number}
     */
    签名图片居下名字居上: 1,

    /**
     * 签名图片居左名字居右
     * @type {number}
     */
    签名图片居左名字居右: 2,

    /**
     * 签名图片居右名字居左
     * @type {number}
     */
    签名图片居右名字居左: 3,

    /**
     * 仅签名图片
     * @type {number}
     */
    仅签名图片: 4,

    /**
     * 仅名字
     * @type {number}
     */
    仅名字: 5
};
