/**
 * 跨度区域组件
 * 用于显示跨越多个单元格的区域，支持边框、背景色和文本
 */
'use strict';

/**
 * 跨度区域构造函数
 * @param {Object} config - 配置对象
 * @param {Object} events - 事件处理对象
 */
function MySpan(config, events) {
    Thing.call(this, config.left, config.top);

    /**
     * 组件ID
     * @type {string}
     */
    this.id = config.id;

    /**
     * X坐标
     * @type {number}
     */
    this.x = config.x;

    /**
     * Y坐标
     * @type {number}
     */
    this.y = config.y;

    /**
     * 宽度
     * @type {number}
     */
    this.width = config.width;

    /**
     * 高度
     * @type {number}
     */
    this.height = config.height;

    /**
     * 检测范围X坐标
     * @type {number}
     */
    this.scopeX = config.hasOwnProperty("scopeX") ? config.scopeX : this.x;

    /**
     * 检测范围Y坐标
     * @type {number}
     */
    this.scopeY = config.hasOwnProperty("scopeY") ? config.scopeY : this.y;

    /**
     * 检测范围宽度
     * @type {number}
     */
    this.scopeWidth = config.hasOwnProperty("scopeWidth") ? config.scopeWidth : this.width;

    /**
     * 检测范围高度
     * @type {number}
     */
    this.scopeHeight = config.hasOwnProperty("scopeHeight") ? config.scopeHeight : this.height;

    /**
     * 左边框颜色
     * @type {string}
     */
    this.leftBorderColor = config.leftBorderColor;

    /**
     * 右边框颜色
     * @type {string}
     */
    this.rightBorderColor = config.rightBorderColor;

    /**
     * 上边框颜色
     * @type {string}
     */
    this.topBorderColor = config.topBorderColor;

    /**
     * 下边框颜色
     * @type {string}
     */
    this.bottomBorderColor = config.bottomBorderColor;

    /**
     * 文本内容
     * @type {string}
     */
    this.text = config.text || "";

    /**
     * 字体配置
     * @type {Object}
     */
    this.font = config.font || Utils.getDefaultFont();

    /**
     * 垂直对齐方式
     * @type {string}
     */
    this.valign = config.valign || "middle";

    /**
     * 水平对齐方式
     * @type {string}
     */
    this.halign = config.halign || "left";

    /**
     * 行间距
     * @type {number}
     */
    this.lineSpace = config.lineSpace || 0;

    /**
     * 绘制字体字符串
     * @type {string}
     */
    this.drawFont = Utils.getDrawFont(this.font);

    /**
     * 背景颜色
     * @type {string}
     */
    this.backgroundColor = config.backgroundColor || "";

    /**
     * 是否准备好绘制
     * @type {boolean}
     */
    this._isReadyToDraw = true;

    /**
     * 是否已绘制
     * @type {boolean}
     */
    this._isDrawed = false;

    /**
     * 鼠标是否按下
     * @type {boolean}
     */
    this._isMouseDown = false;

    var me = this;

    /**
     * 绘制组件
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    this.draw = function (ctx) {
        ctx.save();

        var fontSize = this.font.fontSize;
        var x = this.x;
        var y = this.y;
        var width = this.width;
        var height = this.height;
        var rect = {
            X: x, Y: y, Width: width, Height: height,
            x: x, y: y, width: width, height: height
        };

        this.drawBackgroundColor(ctx);
        myDrawText.draw(ctx, this.text, this.font, this.halign, this.valign, rect, this.lineSpace);
        this.drawBorder(ctx);

        ctx.restore();
        this._isDrawed = true;
    };

    /**
     * 绘制边框
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    this.drawBorder = function (ctx) {
        if (this.leftBorderColor) {
            this.drawLeftBorder(ctx);
        }
        if (this.rightBorderColor) {
            this.drawRightBorder(ctx);
        }
        if (this.topBorderColor) {
            this.drawTopBorder(ctx);
        }
        if (this.bottomBorderColor) {
            this.drawBottomBorder(ctx);
        }
    };

    /**
     * 绘制左边框
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    this.drawLeftBorder = function (ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.leftBorderColor;
        ctx.lineWidth = 1;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    };

    /**
     * 绘制右边框
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    this.drawRightBorder = function (ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.rightBorderColor;
        ctx.lineWidth = 1;
        ctx.moveTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    };

    /**
     * 绘制上边框
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    this.drawTopBorder = function (ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.topBorderColor;
        ctx.lineWidth = 1;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    };

    /**
     * 绘制下边框
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    this.drawBottomBorder = function (ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.bottomBorderColor;
        ctx.lineWidth = 1;
        ctx.moveTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    };

    /**
     * 绘制背景颜色
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    this.drawBackgroundColor = function (ctx) {
        if (this.backgroundColor == "") {
            return;
        }
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.closePath();
        ctx.restore();
    };

    /**
     * 检查坐标是否在组件范围内
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @returns {boolean} 是否在范围内
     */
    this.isScope = function (x, y) {
        if (this.scopeWidth <= 0 || this.scopeHeight <= 0) {
            return false;
        }
        if (x < this.scopeX) {
            return false;
        }
        if (y < this.scopeY) {
            return false;
        }
        if (x > (this.scopeX + this.scopeWidth)) {
            return false;
        }
        if (y > (this.scopeY + this.scopeHeight)) {
            return false;
        }
        return true;
    };

    /**
     * 构建事件处理
     * @param {Object} eventHandlers - 事件处理对象
     */
    this.buildEvent = function (eventHandlers) {
        for (var eventType in eventHandlers) {
            this.addEvent(eventType, eventHandlers[eventType]);
        }
    };

    if (events) {
        this.buildEvent(events);
    }
}

extend(MySpan, Thing);
