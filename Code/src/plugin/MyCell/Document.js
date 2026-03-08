'use strict';

/**
 * @fileoverview 文档模块，用于管理页面、舞台和画布的集合
 * @module Document
 */

/**
 * 文档类
 * @class
 * @param {Object} config - 配置对象
 * @param {Object} config.parentEl - 父元素
 */
function Document(config) {
    var pages = [];
    var stages = [];
    var cellCanvasAr = [];
    var parentEl = config.parentEl;

    /**
     * 添加新页面
     * @function AddNewPage
     * @param {number} width - 页面宽度
     * @param {number} height - 页面高度
     * @returns {Page} 新创建的页面对象
     */
    function AddNewPage(width, height) {
        var page = new Page({ width: width, height: height, pageIndex: pages.length, parentEl: parentEl });
        pages.push(page);
        var stage = new Stage(page.getCacheContextTextLayer(), page.getContext(), false);
        stages.push(stage);
        var cellCanvas = new CellCanvas(page);       
        cellCanvasAr.push(cellCanvas);
        return page;
    }

    /**
     * 关闭文档
     * @function Close
     */
    function Close() {

    }

    /**
     * 根据索引获取页面
     * @function getPageByIndex
     * @param {number} pageIndex - 页面索引
     * @returns {Page} 页面对象
     */
    function getPageByIndex(pageIndex){
        return pages[pageIndex];
    }

    /**
     * 根据索引获取舞台
     * @function getStageByIndex
     * @param {number} pageIndex - 页面索引
     * @returns {Stage} 舞台对象
     */
    function getStageByIndex(pageIndex){
        return stages[pageIndex];
    }

    /**
     * 根据索引获取单元格画布
     * @function getCellCanvasByIndex
     * @param {number} pageIndex - 页面索引
     * @returns {CellCanvas} 单元格画布对象
     */
    function getCellCanvasByIndex(pageIndex){
        return cellCanvasAr[pageIndex];
    }

    return {
        AddNewPage: AddNewPage,
        Close: Close,
        getPageByIndex:getPageByIndex,
        getStageByIndex:getStageByIndex,
        getCellCanvasByIndex:getCellCanvasByIndex
    };
}