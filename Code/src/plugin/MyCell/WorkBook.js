/**
 * 工作簿类
 * 管理Excel工作簿的工作表集合，提供工作表选择、添加等功能
 */
'use strict';

/**
 * 工作簿构造函数
 * @param {Object} config - 配置对象
 * @param {Object} config.wookbook - 工作簿数据对象
 * @param {Object} config.designer - 设计器对象
 */
function WorkBook(config) {
    var workbook = config.wookbook;
    var designer = config.designer;
    var activeSheet = null;

    /**
     * 获取当前活动的工作表
     * @returns {Object} 当前活动的工作表
     */
    function getActiveSheet() {
        return activeSheet;
    }

    /**
     * 选择指定索引的工作表
     * @param {number} index - 工作表索引
     * @returns {Object} 选中的工作表
     */
    function selectSheet(index) {
        activeSheet = workbook["sheets"][index];
        return activeSheet;
    }

    /**
     * 添加一个新的工作表
     * @returns {Object} 新添加的工作表
     */
    function addSheet() {
        var emptySheet = getEmptySheet();
        workbook["sheets"].push(emptySheet);
        activeSheet = emptySheet;
        drawActiveSheet();
        drawActiveTab();
        return activeSheet;
    }

    /**
     * 绘制活动的工作表（待实现）
     */
    function drawActiveSheet() {
    }

    /**
     * 绘制活动的工作表标签（待实现）
     */
    function drawActiveTab() {
    }

    /**
     * 获取一个空的工作表模板
     * @returns {Object} 空工作表对象
     */
    function getEmptySheet() {
        return Comman.DeepCopyObj(emptySheetContent);
    }

    return {
        getActiveSheet: getActiveSheet,
        selectSheet: selectSheet,
        addSheet: addSheet
    };
}
