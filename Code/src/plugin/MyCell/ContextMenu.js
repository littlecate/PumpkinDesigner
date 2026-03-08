'use strict';

/**
 * @fileoverview 右键菜单模块，用于管理右键菜单的操作对象和舞台
 * @module ContextMenu
 */

/**
 * 右键菜单类
 * @class
 * @param {Object} config - 配置对象
 * @param {Object} config.operObj - 操作对象
 * @param {Object} config.stage - 舞台对象
 */
function ContextMenu(config) {
    this.operObj = config.operObj || null;
    this.stage = config.stage || null;
}

/**
 * 右键菜单全局实例
 * @type {ContextMenu}
 */
let myContextMenu = new ContextMenu({});