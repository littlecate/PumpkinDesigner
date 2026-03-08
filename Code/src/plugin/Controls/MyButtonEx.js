/**
 * 扩展按钮控件
 * 提供带有悬停效果和点击状态的按钮组件
 */
'use strict';

/**
 * 扩展按钮构造函数
 * @param {Object} config - 配置对象
 * @param {HTMLElement} config.parentDiv - 父容器元素
 * @param {number} config.width - 按钮宽度
 * @param {number} config.height - 按钮高度
 * @param {string} [config.backgroundColor] - 背景颜色
 * @param {string} [config.backgroundImage] - 背景图片URL
 * @param {boolean} [config.isThreeStatus] - 是否启用三态模式
 * @param {boolean} [config.floatRightUp] - 是否浮动到右上角
 * @param {boolean} [config.floatRightBottom] - 是否浮动到右下角
 * @param {Function} config.onclick - 点击回调函数
 */
function MyButtonEx(config) {
    var containerDiv = document.createElement("div");
    containerDiv.style.width = config.width + "px";
    containerDiv.style.height = config.height + "px";

    if (config.floatRightUp) {
        containerDiv.style.position = "absolute";
        containerDiv.style.right = "0px";
        containerDiv.style.top = "0px";
    } else if (config.floatRightBottom) {
        containerDiv.style.position = "absolute";
        containerDiv.style.right = "0px";
        containerDiv.style.bottom = "0px";
    }
    config.parentDiv.appendChild(containerDiv);

    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", config.width + "px");
    canvas.setAttribute("height", config.height + "px");
    canvas.style.width = config.width + "px";
    canvas.style.height = config.height + "px";
    containerDiv.appendChild(canvas);
    var ctx = canvas.getContext("2d", { willReadFrequently: false });

    var image, normalImageData, hoverImageData, activeImageData;
    var isChecked = false;

    /**
     * 获取按钮是否被选中
     * @returns {boolean} 是否选中
     */
    this.getIsChecked = function () {
        return isChecked;
    };

    /**
     * 获取按钮元素
     * @returns {HTMLElement} 按钮容器元素
     */
    this.getEl = function () {
        return containerDiv;
    };

    if (config.backgroundImage) {
        image = new Image();
        image.onload = function () {
            drawNormal();
            normalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            hoverImageData = Comman.getBrightnessImageData(ctx, canvas, 1.2);
            if (config.isThreeStatus) {
                activeImageData = Comman.getBrightnessImageData(ctx, canvas, 1.5);
            }
        };
        image.src = config.backgroundImage;
    } else {
        ctx.fillStyle = config.backgroundColor || 'rgb(169, 169, 169)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        normalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        hoverImageData = Comman.getBrightnessImageData(ctx, canvas, 1.2);
        if (config.isThreeStatus) {
            activeImageData = Comman.getBrightnessImageData(ctx, canvas, 1.5);
        }
    }

    containerDiv.onmouseover = function () {
        if (!config.isThreeStatus || (config.isThreeStatus && !isChecked)) {
            drawHover();
        }
    };

    containerDiv.onmouseout = function () {
        if (!config.isThreeStatus || (config.isThreeStatus && !isChecked)) {
            drawNormalFromData();
        }
    };

    /**
     * 绘制正常状态（使用图片）
     */
    function drawNormal() {
        ctx.drawImage(image, 0, 0, config.width, config.height);
    }

    /**
     * 绘制正常状态（使用缓存数据）
     */
    function drawNormalFromData() {
        if (normalImageData) {
            ctx.putImageData(normalImageData, 0, 0);
        }
    }

    /**
     * 绘制悬停状态
     */
    function drawHover() {
        if (hoverImageData) {
            ctx.putImageData(hoverImageData, 0, 0);
        }
    }

    /**
     * 绘制激活状态
     */
    function drawActive() {
        if (activeImageData) {
            ctx.putImageData(activeImageData, 0, 0);
        }
    }

    containerDiv.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (config.isThreeStatus) {
            if (!isChecked) {
                isChecked = true;
                drawActive();
            } else {
                isChecked = false;
                drawNormalFromData();
            }
        }
        config.onclick();
    };
}
