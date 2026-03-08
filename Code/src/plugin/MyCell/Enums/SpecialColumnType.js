/**
 * @fileoverview 特殊列类型枚举模块 - 定义特殊列的类型常量
 * @description 该模块定义了表格中特殊列的类型，包括序号列和以下空白列。
 * 这些特殊列在报表生成和数据处理时具有特定的行为。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 特殊列类型枚举对象
 * @namespace SpecialColumnType
 * @description 定义表格中特殊列的类型常量
 */
const SpecialColumnType = {
    /**
     * 序号列
     * @type {number}
     */
    序号: 0,

    /**
     * 以下空白列
     * @type {number}
     */
    以下空白: 1
};
