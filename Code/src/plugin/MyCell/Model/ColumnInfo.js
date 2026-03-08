/**
 * @fileoverview 列信息模型 - 定义数据库列的映射信息
 * @description 该模型用于存储数据库列与表格单元格的映射关系，
 * 包括表名、列名、主体索引、记录号和数据类型。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 列信息类
 * @class ColumnInfo
 * @description 定义数据库列的映射信息
 * @param {Object} config - 配置对象
 * @param {string} config.tableName - 表名
 * @param {string} config.columnName - 列名
 * @param {number} config.bodyIndex - 主体索引
 * @param {number} config.recNum - 记录号
 * @param {string} config.dataType - 数据类型
 */
function ColumnInfo(config) {
    /**
     * 表名
     * @type {string}
     */
    this.tableName = config.tableName;

    /**
     * 列名
     * @type {string}
     */
    this.columnName = config.columnName;

    /**
     * 主体索引
     * @type {number}
     */
    this.bodyIndex = config.bodyIndex;

    /**
     * 记录号
     * @type {number}
     */
    this.recNum = config.recNum;

    /**
     * 数据类型
     * @type {string}
     */
    this.dataType = config.dataType;
}