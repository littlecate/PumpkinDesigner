/**
 * @fileoverview 撤销重做内容模型 - 定义撤销重做操作的内容信息
 * @description 该模型用于存储撤销重做操作的内容信息，
 * 包括工作表索引、内容和操作对象。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 撤销重做内容类
 * @class UndoRedoContent
 * @description 定义撤销重做操作的内容信息
 * @param {Object} config - 配置对象
 * @param {number} config.sheetIndex - 工作表索引
 * @param {Object} config.content - 内容对象
 * @param {Object} config.operObj - 操作对象
 */
function UndoRedoContent(config) {
    /**
     * 工作表索引
     * @type {number}
     */
    this.sheetIndex = config.sheetIndex;

    /**
     * 内容对象
     * @type {Object}
     */
    this.content = config.content;

    /**
     * 操作对象
     * @type {Object}
     */
    this.operObj = config.operObj;
}