/**
 * 鼠标状态类
 * 跟踪和管理鼠标交互状态
 */
'use strict';

/**
 * 鼠标状态构造函数
 * @param {Object} config - 配置对象
 * @param {boolean} [config.isMouseDown=false] - 鼠标是否按下
 * @param {number} [config.isSelectObjNum=-1] - 选中的对象编号
 * @param {Object} [config.position=null] - 鼠标位置
 * @param {boolean} [config.isMouseDownIsGlobal=false] - 鼠标按下是否全局
 * @param {number} [config.row=-1] - 行号
 * @param {number} [config.col=-1] - 列号
 * @param {Function} [config.mouseMoveFunction=null] - 鼠标移动回调函数
 * @param {Object} [config.operObj=null] - 操作对象
 * @param {Object} [config.stage=null] - 舞台对象
 */
function MouseStatus(config) {
    /**
     * 鼠标是否按下
     * @type {boolean}
     */
    this.isMouseDown = config.isMouseDown || false;

    /**
     * 选中的对象编号
     * @type {number}
     */
    this.isSelectObjNum = config.isSelectObjNum || -1;

    /**
     * 鼠标位置
     * @type {Object|null}
     */
    this.position = config.position || null;

    /**
     * 鼠标按下是否全局
     * @type {boolean}
     */
    this.isMouseDownIsGlobal = config.isMouseDownIsGlobal || false;

    /**
     * 行号
     * @type {number}
     */
    this.row = config.row || -1;

    /**
     * 列号
     * @type {number}
     */
    this.col = config.col || -1;

    /**
     * 鼠标移动回调函数
     * @type {Function|null}
     */
    this.mouseMoveFunction = config.mouseMoveFunction || null;

    /**
     * 操作对象
     * @type {Object|null}
     */
    this.operObj = config.operObj || null;

    /**
     * 舞台对象
     * @type {Object|null}
     */
    this.stage = config.stage || null;
}

/**
 * 全局鼠标状态实例
 * @type {MouseStatus}
 */
var myMouseStatus = new MouseStatus({});
