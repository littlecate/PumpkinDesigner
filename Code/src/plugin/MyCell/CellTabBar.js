'use strict';

/**
 * @fileoverview 单元格标签栏模块，用于管理工作表标签页的显示和交互
 * @module CellTabBar
 */

/**
 * 单元格标签栏类
 * @class
 * @param {Object} config - 配置对象
 * @param {Object} config.parentObj - 父对象
 * @param {Object} config.parentEl - 父元素
 * @param {string} config.parentId - 父元素ID
 * @param {number} config.parentElWidth - 父元素宽度
 * @param {number} config.parentElHeight - 父元素高度
 * @param {number} config.leftLabelWidth - 左侧标签宽度
 * @param {number} config.topLabelHeight - 顶部标签高度
 * @param {number} config.leftLabelPadding - 左侧标签内边距
 * @param {number} config.topLabelPadding - 顶部标签内边距
 * @param {number} config.toolbarHeight - 工具栏高度
 * @param {number} config.formulaBarHeight - 公式栏高度
 * @param {Object} config.tabBarThemeConfig - 标签栏主题配置
 */
function CellTabBar(config) {
    var parentObj = config.parentObj;
    var parentEl = config.parentEl;
    var parentId = config.parentId;
    var parentElWidth = config.parentElWidth;
    var parentElHeight = config.parentElHeight;
    var leftLabelWidth = config.leftLabelWidth;
    var topLabelHeight = config.topLabelHeight;
    var leftLabelPadding = config.leftLabelPadding;
    var topLabelPadding = config.topLabelPadding;
    var toolbarHeight = config.toolbarHeight;
    var formulaBarHeight = config.formulaBarHeight;
    var tabBarThemeConfig = config.tabBarThemeConfig;
    var parentOffSet = Comman.getNodePosition(parentEl);
    var id = "tabBar_" + parentId;
    var el = document.getElementById(id);
    var cacheCanvas = document.createElement("canvas");
    if (!el) {
        el = document.createElement("canvas");
        parentEl.parentElement.appendChild(el);
    }
    el.setAttribute("id", id);
    var totalWidth = parentElWidth;
    var totalHeight = 40;
    parentEl.style.height = (parentElHeight - totalHeight) + "px";
    el.setAttribute("width", totalWidth + "px");
    el.setAttribute("height", totalHeight + "px");

    cacheCanvas.setAttribute("width", totalWidth + "px");
    cacheCanvas.setAttribute("height", totalHeight + "px");

    el.style.position = "absolute";
    el.style.left = "0px";
    el.style.top = (parentOffSet.top + parentElHeight + toolbarHeight + formulaBarHeight) + "px";
    el.setAttribute("willReadFrequently", true);
    var ctx = el.getContext("2d");
    var cacheCtxTextLayer = cacheCanvas.getContext("2d");
    var stage = new Stage(cacheCtxTextLayer, ctx);

    drawBackground();

    /**
     * 绘制标签页列表
     * @function drawTabs
     * @param {Array} tabNames - 标签名称数组
     */
    function drawTabs(tabNames) {
        var x = leftLabelWidth + leftLabelPadding;
        var y = 0;
        var w = 80;
        var h = totalHeight;
        for (var i = 0; i < tabNames.length; i++) {
            var t = tabNames[i];
            drawOneTab(t);
            drawOneTab(x, y, w, h, t);
            x += w;
        }
    }

    /**
     * 绘制单个标签页
     * @function drawOneTab
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {number} w - 宽度
     * @param {number} h - 高度
     * @param {string} name - 标签名称
     */
    function drawOneTab(x, y, w, h, name) {
        ctx.beginPath();               
        var events = {};
        drawLabelText(name, x, y, w, h, events);
        ctx.closePath();
    }

    /**
     * 重置内容
     * @function resetContent
     */
    function resetContent() {
        ctx.clearRect(0, 0, totalWidth, totalHeight);
        drawBackground();
    }

    /**
     * 绘制背景
     * @function drawBackground
     */
    function drawBackground() {
        ctx.beginPath();
        ctx.fillStyle = tabBarThemeConfig.backgroundColor || "#EDF2FA";
        ctx.rect(0, 0, totalWidth, totalHeight);
        ctx.fill();
        ctx.closePath();
    }

    /**
     * 绘制标签文本
     * @function drawLabelText
     * @param {string} str - 文本内容
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {number} w - 宽度
     * @param {number} h - 高度
     * @param {Object} events - 事件配置
     */
    function drawLabelText(str, x, y, w, h, events) {
        var font = {
            "fontStyle": "normal", "fontWeight": "bold", "fontSize": 10, "fontFamily": "宋体",
            "color": tabBarThemeConfig.textColor || "#ff0000"
        };
        var o1 = new MySpan({
            id: "text_" + Comman.newGuid(),
            x: x,
            y: y,
            width: w,
            height: h,
            text: str,
            font: font,
            valign: "middle",
            halign: "center",
            borderColor: tabBarThemeConfig.textBorderColor,
            backgroundColor: tabBarThemeConfig.textBackgroundColor || "#EDEBFA"
        }, events);
        stage.add(o1);
    }

    /**
     * 渲染标签栏
     * @function render
     */
    function render() {
        ctx.drawImage(cacheCanvas, 0, 0);
    }

    return {
        drawTabs: drawTabs,
        resetContent: resetContent,
        render: render
    };
}