/**
 * @fileoverview 报表模板条件模型 - 定义模板选择的条件
 * @description 该模型用于存储模板选择的条件信息，
 * 包括列名、列类型、操作符和比较值。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 报表模板条件类
 * @class ReportTemplateCondition
 * @description 定义模板选择的条件
 * @param {Object} config - 配置对象
 * @param {string} config.columnName - 列名
 * @param {string} config.columnType - 列类型（C:字符, N:数值, D:日期）
 * @param {string} config.operation - 操作符（=, <>, <, <=, >, >=, like）
 * @param {string} config.value - 比较值
 */
function ReportTemplateCondition(config) {
    /**
     * 列名
     * @type {string}
     */
    this.columnName = config.columnName;

    /**
     * 列类型（C:字符, N:数值, D:日期）
     * @type {string}
     */
    this.columnType = config.columnType;

    /**
     * 操作符（=, <>, <, <=, >, >=, like）
     * @type {string}
     */
    this.operation = config.operation;

    /**
     * 比较值
     * @type {string}
     */
    this.value = config.value;
}