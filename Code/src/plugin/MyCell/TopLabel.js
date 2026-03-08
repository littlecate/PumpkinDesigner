/**
 * 顶部标签组件
 * 负责渲染Excel表格顶部的列标签（A, B, C...）
 */
"use strict";

/**
 * 顶部标签构造函数
 * @param {Object} config - 配置对象
 * @param {Object} config.parentObj - 父对象
 * @param {HTMLElement} config.parentEl - 父元素
 * @param {string} config.parentId - 父元素ID
 * @param {number} config.parentElWidth - 父元素宽度
 * @param {number} config.parentElHeight - 父元素高度
 * @param {number} config.leftLabelWidth - 左侧标签宽度
 * @param {number} config.topLabelHeight - 顶部标签高度
 * @param {number} config.leftLabelPadding - 左侧标签内边距
 * @param {number} config.topLabelPadding - 顶部标签内边距
 * @param {number} config.toolbarHeight - 工具栏高度
 * @param {number} config.formulaBarHeight - 公式栏高度
 * @param {Object} config.labelThemeConfig - 标签主题配置
 */
function TopLabel(config) {
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
    var labelThemeConfig = config.labelThemeConfig;
    var parentOffSet = Comman.getNodePosition(parentEl);

    var id = "topLabel_" + parentId;
    var labelDivs = [];
    var splitorDivs = [];

    parentEl.style.top = topLabelHeight + "px";

    var contentEl = document.getElementById(id);
    var contentContentEl = null;

    if (!contentEl) {
        contentEl = document.createElement("div");
        parentEl.parentElement.appendChild(contentEl);
        contentContentEl = document.createElement("div");
        contentEl.appendChild(contentContentEl);
        drawBackground();
    }

    contentEl.setAttribute("id", id);
    contentEl.style.overflow = "hidden";

    var totalWidth = parentElWidth - leftLabelWidth - leftLabelPadding;
    parentEl.style.width = totalWidth + "px";
    var totalHeight = topLabelHeight;
    contentEl.style.width = totalWidth + "px";
    contentEl.style.height = totalHeight + "px";

    contentEl.style.userSelect = "none";
    contentEl.style.position = "absolute";
    contentEl.style.left = leftLabelWidth + leftLabelPadding + "px";
    contentEl.style.top = toolbarHeight + formulaBarHeight + "px";

    contentContentEl.style.position = "absolute";
    contentContentEl.style.left = "0px";
    contentContentEl.style.top = "0px";
    contentContentEl.style.height = "100%";
    contentContentEl.style.draggable = false;
    contentContentEl.style.userSelect = "none";
    contentContentEl.style.zIndex = 0;

    document.addEventListener("mouseup", function (e) {
        if (e.button != 0) {
            return;
        }
        if (topLabelIsMouseDown) {
            topLabelIsMouseDown = false;
            topLabelSelectStartCol = -1;
            topLabelSelectEndCol = -1;
        }
    });

    /**
     * 设置画布宽度
     * @param {number} width - 宽度值
     */
    function setCanvasWidth(width) {
        contentContentEl.style.width = width + "px";
    }

    /**
     * 绘制单个标签
     * @param {number} col - 列号
     * @param {string} str - 标签文本
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {number} width - 宽度
     * @param {number} height - 高度
     */
    function drawOneLabel(col, str, x, y, width, height) {
        var labelDiv = document.createElement("div");
        labelDiv.style.position = "absolute";
        labelDiv.style.left = x + "px";
        labelDiv.style.top = y + "px";
        labelDiv.style.width = width + "px";
        labelDiv.style.height = height + "px";
        labelDiv.style.textAlign = "center";
        labelDiv.style.display = "flex";
        labelDiv.style.justifyContent = "center";
        labelDiv.style.alignItems = "center";
        labelDiv.style.overflow = "hidden";
        labelDiv.style.zIndex = 1;
        labelDiv.style.draggable = false;
        labelDiv.style.userSelect = "none";
        labelDiv.style.color = "#575757";
        labelDiv.style.fontSize = '9pt';
        labelDiv.innerHTML = str;
        contentContentEl.appendChild(labelDiv);

        labelDivs.push({
            col: col,
            div: labelDiv,
            left: x,
        });

        new OperTopLabel(labelDiv, col, labelDivs, splitorDivs, parentObj);
        drawSplitor(x, y, width, height, col, labelDiv);
    }

    /**
     * 绘制分隔线
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {number} width - 宽度
     * @param {number} height - 高度
     * @param {number} col - 列号
     * @param {HTMLElement} forElement - 关联元素
     */
    function drawSplitor(x, y, width, height, col, forElement) {
        var splitorDiv = document.createElement("div");
        splitorDiv.style.position = "absolute";
        var left = x + width - 1;
        splitorDiv.style.left = left + "px";
        splitorDiv.style.top = "0px";
        splitorDiv.style.width = "4px";
        splitorDiv.style.height = height + "px";
        splitorDiv.style.textAlign = "center";
        splitorDiv.style.zIndex = 2;
        splitorDiv.style.cursor = "col-resize";

        var innerLine = document.createElement("div");
        innerLine.style.width = "1px";
        innerLine.style.height = "100%";
        innerLine.style.backgroundColor = "#DBDBDB";
        splitorDiv.appendChild(innerLine);
        contentContentEl.appendChild(splitorDiv);

        splitorDivs.push({
            col: col,
            div: splitorDiv,
            left: left,
        });

        new DragTopLabelSplitor(
            splitorDiv,
            contentEl,
            forElement,
            col,
            labelDivs,
            splitorDivs,
            parentObj
        );
    }

    /**
     * 重置内容
     */
    function resetContent() {
        labelDivs = [];
        splitorDivs = [];
        contentContentEl.innerHTML = "";
        drawBackground();
    }

    /**
     * 绘制背景
     */
    function drawBackground() {
        contentEl.style.backgroundColor = "#ffffff";
        contentEl.style.borderBottom = "1px solid #DBDBDB";
    }

    /**
     * 渲染标签
     */
    function render() {
        removeAllExpandImage();
        drawExpandImage();
        adjustSplitorZIndex();
        showExpandColImageX();
    }

    /**
     * 绘制所有展开图像
     */
    function drawExpandImage() {
        for (var i = 0; i < labelDivs.length; i++) {
            drawExpandImageOne(labelDivs[i]);
        }
    }

    /**
     * 移除所有展开图像
     */
    function removeAllExpandImage() {
        var expandElements = contentContentEl.querySelectorAll(".div_expand_col");
        expandElements.forEach(function (item) {
            item.parentElement.removeChild(item);
        });
    }

    /**
     * 绘制单个展开图像
     * @param {Object} labelDivInfo - 标签div信息对象
     */
    function drawExpandImageOne(labelDivInfo) {
        var expandDiv = document.createElement("div");
        expandDiv.setAttribute("class", "div_expand_col");
        expandDiv.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAICAYAAADN5B7xAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKOWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanZZ3VFTXFofPvXd6oc0wAlKG3rvAANJ7k15FYZgZYCgDDjM0sSGiAhFFRJoiSFDEgNFQJFZEsRAUVLAHJAgoMRhFVCxvRtaLrqy89/Ly++Osb+2z97n77L3PWhcAkqcvl5cGSwGQyhPwgzyc6RGRUXTsAIABHmCAKQBMVka6X7B7CBDJy82FniFyAl8EAfB6WLwCcNPQM4BOB/+fpFnpfIHomAARm7M5GSwRF4g4JUuQLrbPipgalyxmGCVmvihBEcuJOWGRDT77LLKjmNmpPLaIxTmns1PZYu4V8bZMIUfEiK+ICzO5nCwR3xKxRoowlSviN+LYVA4zAwAUSWwXcFiJIjYRMYkfEuQi4uUA4EgJX3HcVyzgZAvEl3JJS8/hcxMSBXQdli7d1NqaQffkZKVwBALDACYrmcln013SUtOZvBwAFu/8WTLi2tJFRbY0tba0NDQzMv2qUP91829K3NtFehn4uWcQrf+L7a/80hoAYMyJarPziy2uCoDOLQDI3fti0zgAgKSobx3Xv7oPTTwviQJBuo2xcVZWlhGXwzISF/QP/U+Hv6GvvmckPu6P8tBdOfFMYYqALq4bKy0lTcinZ6QzWRy64Z+H+B8H/nUeBkGceA6fwxNFhImmjMtLELWbx+YKuGk8Opf3n5r4D8P+pMW5FonS+BFQY4yA1HUqQH7tBygKESDR+8Vd/6NvvvgwIH554SqTi3P/7zf9Z8Gl4iWDm/A5ziUohM4S8jMX98TPEqABAUgCKpAHykAd6ABDYAasgC1wBG7AG/iDEBAJVgMWSASpgA+yQB7YBApBMdgJ9oBqUAcaQTNoBcdBJzgFzoNL4Bq4AW6D+2AUTIBnYBa8BgsQBGEhMkSB5CEVSBPSh8wgBmQPuUG+UBAUCcVCCRAPEkJ50GaoGCqDqqF6qBn6HjoJnYeuQIPQXWgMmoZ+h97BCEyCqbASrAUbwwzYCfaBQ+BVcAK8Bs6FC+AdcCXcAB+FO+Dz8DX4NjwKP4PnEIAQERqiihgiDMQF8UeikHiEj6xHipAKpAFpRbqRPuQmMorMIG9RGBQFRUcZomxRnqhQFAu1BrUeVYKqRh1GdaB6UTdRY6hZ1Ec0Ga2I1kfboL3QEegEdBa6EF2BbkK3oy+ib6Mn0K8xGAwNo42xwnhiIjFJmLWYEsw+TBvmHGYQM46Zw2Kx8lh9rB3WH8vECrCF2CrsUexZ7BB2AvsGR8Sp4Mxw7rgoHA+Xj6vAHcGdwQ3hJnELeCm8Jt4G749n43PwpfhGfDf+On4Cv0CQJmgT7AghhCTCJkIloZVwkfCA8JJIJKoRrYmBRC5xI7GSeIx4mThGfEuSIemRXEjRJCFpB+kQ6RzpLuklmUzWIjuSo8gC8g5yM/kC+RH5jQRFwkjCS4ItsUGiRqJDYkjiuSReUlPSSXK1ZK5kheQJyeuSM1J4KS0pFymm1HqpGqmTUiNSc9IUaVNpf+lU6RLpI9JXpKdksDJaMm4ybJkCmYMyF2TGKQhFneJCYVE2UxopFykTVAxVm+pFTaIWU7+jDlBnZWVkl8mGyWbL1sielh2lITQtmhcthVZKO04bpr1borTEaQlnyfYlrUuGlszLLZVzlOPIFcm1yd2WeydPl3eTT5bfJd8p/1ABpaCnEKiQpbBf4aLCzFLqUtulrKVFS48vvacIK+opBimuVTyo2K84p6Ss5KGUrlSldEFpRpmm7KicpFyufEZ5WoWiYq/CVSlXOavylC5Ld6Kn0CvpvfRZVUVVT1Whar3qgOqCmrZaqFq+WpvaQ3WCOkM9Xr1cvUd9VkNFw08jT6NF454mXpOhmai5V7NPc15LWytca6tWp9aUtpy2l3audov2Ax2yjoPOGp0GnVu6GF2GbrLuPt0berCehV6iXo3edX1Y31Kfq79Pf9AAbWBtwDNoMBgxJBk6GWYathiOGdGMfI3yjTqNnhtrGEcZ7zLuM/5oYmGSYtJoct9UxtTbNN+02/R3Mz0zllmN2S1zsrm7+QbzLvMXy/SXcZbtX3bHgmLhZ7HVosfig6WVJd+y1XLaSsMq1qrWaoRBZQQwShiXrdHWztYbrE9Zv7WxtBHYHLf5zdbQNtn2iO3Ucu3lnOWNy8ft1OyYdvV2o/Z0+1j7A/ajDqoOTIcGh8eO6o5sxybHSSddpySno07PnU2c+c7tzvMuNi7rXM65Iq4erkWuA24ybqFu1W6P3NXcE9xb3Gc9LDzWepzzRHv6eO7yHPFS8mJ5NXvNelt5r/Pu9SH5BPtU+zz21fPl+3b7wX7efrv9HqzQXMFb0ekP/L38d/s/DNAOWBPwYyAmMCCwJvBJkGlQXlBfMCU4JvhI8OsQ55DSkPuhOqHC0J4wybDosOaw+XDX8LLw0QjjiHUR1yIVIrmRXVHYqLCopqi5lW4r96yciLaILoweXqW9KnvVldUKq1NWn46RjGHGnIhFx4bHHol9z/RnNjDn4rziauNmWS6svaxnbEd2OXuaY8cp40zG28WXxU8l2CXsTphOdEisSJzhunCruS+SPJPqkuaT/ZMPJX9KCU9pS8Wlxqae5Mnwknm9acpp2WmD6frphemja2zW7Fkzy/fhN2VAGasyugRU0c9Uv1BHuEU4lmmfWZP5Jiss60S2dDYvuz9HL2d7zmSue+63a1FrWWt78lTzNuWNrXNaV78eWh+3vmeD+oaCDRMbPTYe3kTYlLzpp3yT/LL8V5vDN3cXKBVsLBjf4rGlpVCikF84stV2a9021DbutoHt5turtn8sYhddLTYprih+X8IqufqN6TeV33zaEb9joNSydP9OzE7ezuFdDrsOl0mX5ZaN7/bb3VFOLy8qf7UnZs+VimUVdXsJe4V7Ryt9K7uqNKp2Vr2vTqy+XeNc01arWLu9dn4fe9/Qfsf9rXVKdcV17w5wD9yp96jvaNBqqDiIOZh58EljWGPft4xvm5sUmoqbPhziHRo9HHS4t9mqufmI4pHSFrhF2DJ9NProje9cv+tqNWytb6O1FR8Dx4THnn4f+/3wcZ/jPScYJ1p/0Pyhtp3SXtQBdeR0zHYmdo52RXYNnvQ+2dNt293+o9GPh06pnqo5LXu69AzhTMGZT2dzz86dSz83cz7h/HhPTM/9CxEXbvUG9g5c9Ll4+ZL7pQt9Tn1nL9tdPnXF5srJq4yrndcsr3X0W/S3/2TxU/uA5UDHdavrXTesb3QPLh88M+QwdP6m681Lt7xuXbu94vbgcOjwnZHokdE77DtTd1PuvriXeW/h/sYH6AdFD6UeVjxSfNTws+7PbaOWo6fHXMf6Hwc/vj/OGn/2S8Yv7ycKnpCfVEyqTDZPmU2dmnafvvF05dOJZ+nPFmYKf5X+tfa5zvMffnP8rX82YnbiBf/Fp99LXsq/PPRq2aueuYC5R69TXy/MF72Rf3P4LeNt37vwd5MLWe+x7ys/6H7o/ujz8cGn1E+f/gUDmPP8kcBa2wAAAARnQU1BAACxjnz7UZMAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAARhJREFUeNpi/P//PwMMfP361RqIj7CysoL5v3//ZuDm5gbRsgICAk9AYgABxARVyPzr1y+ua9euHfn8+XMsOzs7BwiD2NevX2fg4uLq+/btWyFILUAAMQIZgm/fvuVcs2bN02fPnjG4urqeAWJTkOTu3btPA7GJlJQUQ2hoaL+goOBjgABi2bhx47vz588zIDsNHYAMmjRpUqGhoSEDQAAxiYiIMDAxMTEQAiA1wsLCDAABxGJlZSVsZGT0acWKFb8fPHiAVbGCggJDRESEKicnZx5AAIGdAvQc08+fP7nOnj37/86dOzHAQGAHYRAbJAaUu/3ly5dckFqAAGJED1agxBE2NjZ4sPLw8DAAQ1AVGKx3QGIAAQYAbLmMPyW6phIAAAAASUVORK5CYII=)";
        expandDiv.style.backgroundRepeat = "no-repeat";
        expandDiv.style.backgroundPosition = "center";
        expandDiv.style.position = "absolute";
        expandDiv.style.left = "-10px";
        expandDiv.style.top = "0px";
        expandDiv.style.width = "10px";
        expandDiv.style.height = "100%";
        expandDiv.style.zIndex = 9999;
        expandDiv.style.display = "none";
        expandDiv.style.cursor = "pointer";
        expandDiv.setAttribute("title", "展开隐藏列");
        contentContentEl.appendChild(expandDiv);
        labelDivInfo.expandColEl = expandDiv;
    }

    /**
     * 调整分隔线层级
     */
    function adjustSplitorZIndex() {
        var baseZIndex = splitorDivs.length + 2;
        for (var i = 0; i < splitorDivs.length; i++) {
            var splitorInfo = splitorDivs[i];
            splitorInfo.div.style.zIndex = baseZIndex - i;
        }
    }

    /**
     * 滚动
     * @param {number} deltaX - X方向滚动量
     */
    function scroll(deltaX) {
        contentContentEl.style.left = -deltaX + "px";
    }

    /**
     * 取消高亮顶部标签
     * @param {number} startCol - 起始列
     * @param {number} endCol - 结束列
     */
    function unHilightTopLabelX(startCol, endCol) {
        unHilightTopLabel(labelDivs, splitorDivs, startCol, endCol);
    }

    /**
     * 显示高亮单个顶部标签
     * @param {number} col - 列号
     */
    function showHilightTopLabelOneX(col) {
        showHilightTopLabelOne(labelDivs, splitorDivs, col);
    }

    /**
     * 显示展开列图像
     */
    function showExpandColImageX() {
        showExpandColImage(labelDivs, splitorDivs);
    }

    return {
        drawOneLabel: drawOneLabel,
        resetContent: resetContent,
        render: render,
        setCanvasWidth: setCanvasWidth,
        scroll: scroll,
        unHilightTopLabelX: unHilightTopLabelX,
        showHilightTopLabelOneX: showHilightTopLabelOneX,
        showExpandColImageX: showExpandColImageX,
    };
}
