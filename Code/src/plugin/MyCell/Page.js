/**
 * 页面类
 * 管理单个打印页面的画布和图层
 */
'use strict';

/**
 * 页面构造函数
 * @param {Object} config - 配置对象
 * @param {number} config.width - 页面宽度
 * @param {number} config.height - 页面高度
 * @param {HTMLElement} config.parentEl - 父元素
 * @param {number} config.pageIndex - 页面索引
 */
function Page(config) {
    var width = config.width;
    var height = config.height;
    var parentEl = config.parentEl;
    var pageIndex = config.pageIndex;
    var canvasId = 'page' + pageIndex;
    var oldWidth = 0;
    var oldHeight = 0;

    var el = document.createElement("canvas");
    el.setAttribute("id", canvasId);
    el.setAttribute("width", width + "px");
    el.setAttribute("height", height + "px");
    el.style.backgroundColor = "white";
    el.style.marginBottom = "5px";
    el.style.marginRight = "5px";
    parentEl.appendChild(el);

    var cacheCanvasTextLayer = document.createElement("canvas");
    cacheCanvasTextLayer.setAttribute("width", width + "px");
    cacheCanvasTextLayer.setAttribute("height", height + "px");

    var cacheCanvasBackgroundLayer = document.createElement("canvas");
    cacheCanvasBackgroundLayer.setAttribute("width", width + "px");
    cacheCanvasBackgroundLayer.setAttribute("height", height + "px");

    var cacheCanvasImageLayer = document.createElement("canvas");
    cacheCanvasImageLayer.setAttribute("width", width + "px");
    cacheCanvasImageLayer.setAttribute("height", height + "px");

    var cacheCanvasGridLayer = document.createElement("canvas");
    cacheCanvasGridLayer.setAttribute("width", width + "px");
    cacheCanvasGridLayer.setAttribute("height", height + "px");

    var ctx = el.getContext("2d", { willReadFrequently: false });
    var cacheCtxTextLayer = cacheCanvasTextLayer.getContext("2d", { willReadFrequently: false });
    var cacheCtxBackgroundLayer = cacheCanvasBackgroundLayer.getContext("2d", { willReadFrequently: false });
    var cacheCtxImageLayer = cacheCanvasImageLayer.getContext("2d", { willReadFrequently: false });
    var cacheCtxGridLayer = cacheCanvasGridLayer.getContext("2d", { willReadFrequently: false });

    /**
     * 获取显示画布上下文
     * @returns {CanvasRenderingContext2D} 画布上下文
     */
    function getContext() {
        return ctx;
    }

    /**
     * 获取文本层缓存画布上下文
     * @returns {CanvasRenderingContext2D} 画布上下文
     */
    function getCacheContextTextLayer() {
        return cacheCtxTextLayer;
    }

    /**
     * 获取背景层缓存画布上下文
     * @returns {CanvasRenderingContext2D} 画布上下文
     */
    function getCacheContextBackgroundLayer() {
        return cacheCtxBackgroundLayer;
    }

    /**
     * 获取图像层缓存画布上下文
     * @returns {CanvasRenderingContext2D} 画布上下文
     */
    function getCacheContextImageLayer() {
        return cacheCtxImageLayer;
    }

    /**
     * 获取网格层缓存画布上下文
     * @returns {CanvasRenderingContext2D} 画布上下文
     */
    function getCacheContextGridLayer() {
        return cacheCtxGridLayer;
    }

    /**
     * 获取页面索引
     * @returns {number} 页面索引
     */
    function getPageIndex() {
        return pageIndex;
    }

    /**
     * 设置页面宽度
     * @param {number} newWidth - 新宽度
     */
    function setPageWidth(newWidth) {
        width = newWidth;
        if (width == oldWidth) {
            return;
        }
        oldWidth = width;
        el.setAttribute("width", width + "px");
        cacheCanvasTextLayer.setAttribute("width", width + "px");
        cacheCanvasBackgroundLayer.setAttribute("width", width + "px");
        cacheCanvasImageLayer.setAttribute("width", width + "px");
        cacheCanvasGridLayer.setAttribute("width", width + "px");
    }

    /**
     * 设置页面高度
     * @param {number} newHeight - 新高度
     */
    function setPageHeight(newHeight) {
        height = newHeight;
        if (height == oldHeight) {
            return;
        }
        oldHeight = height;
        el.setAttribute("height", height + "px");
        cacheCanvasTextLayer.setAttribute("height", height + "px");
        cacheCanvasBackgroundLayer.setAttribute("height", height + "px");
        cacheCanvasImageLayer.setAttribute("height", height + "px");
        cacheCanvasGridLayer.setAttribute("height", height + "px");
    }

    /**
     * 渲染页面（将所有图层合并到显示画布）
     */
    function render() {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(cacheCanvasBackgroundLayer, 0, 0);
        ctx.drawImage(cacheCanvasImageLayer, 0, 0);
        ctx.drawImage(cacheCanvasGridLayer, 0, 0);
        ctx.drawImage(cacheCanvasTextLayer, 0, 0);
    }

    return {
        getContext: getContext,
        getCacheContextTextLayer: getCacheContextTextLayer,
        getCacheContextBackgroundLayer: getCacheContextBackgroundLayer,
        getCacheContextImageLayer: getCacheContextImageLayer,
        getCacheContextGridLayer: getCacheContextGridLayer,
        getPageIndex: getPageIndex,
        setPageWidth: setPageWidth,
        setPageHeight: setPageHeight,
        render: render
    };
}
