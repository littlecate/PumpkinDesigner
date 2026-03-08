/**
 * 单元格类
 * 负责单元格的绘制和交互
 */
'use strict';

/**
 * 创建单元格实例
 * @param {Object} options - 配置选项
 * @param {number} options.x - 单元格x坐标
 * @param {number} options.y - 单元格y坐标
 * @param {number} options.width - 单元格宽度
 * @param {number} options.height - 单元格高度
 * @param {string} options.id - 单元格ID
 * @param {Object} options.data - 单元格数据
 * @param {Object} events - 事件回调对象
 */
function MyCell(options, events) {
    this.$supClass(options.x, options.y);
    
    // 基本属性
    this.width = options.width;
    this.height = options.height;
    this.id = options.id;
    this.data = options.data;
    
    // 滚动相关属性
    this.bodyScrollHeight = 0;
    this.bodyScrollWidth = 0;
    this.bodyTotalHeight = null;
    this.bodyTotalWidth = null;
    this.isVScrollDraw = false;
    this.isHScrollDraw = false;
    
    // 样式相关
    this.font = Utils.getDefaultFont();
    
    // 滚动条配置
    this.scrollbarWidth = 20;
    this.scrollbarHeight = 20;
    this.scrollButtonSize = { width: 20, height: 20 };
    
    // 状态标志
    this._isReadyToDraw = true;
    this._isDrawed = false;
    this._isMouseDown = false;
    
    // 构建事件
    this.buildEvent(events);
}

MyCell.prototype = {
    /**
     * 绘制单元格
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    draw: function(ctx) {
        this.drawBody(ctx);
        // 绘制滚动条
        this.drawVScrollBar(ctx);
        this.drawHScrollBar(ctx);
        this._isDrawed = true;
    },
    
    /**
     * 绘制单元格主体内容
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    drawBody: function (ctx) {
        // 子类实现
    },
    
    /**
     * 绘制垂直滚动条
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    drawVScrollBar: function(ctx) {
        const x = this.x + this.width - this.scrollbarWidth;
        const y = this.y;
        const width = this.scrollbarWidth;
        const height = this.height;
        
        // 绘制滚动条背景
        const rect = {
            x: x,
            y: y,
            width: width,
            height: height,
            X: x,
            Y: y,
            Width: width,
            Height: height
        };
        
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "red";
        ctx.rect(rect.x, rect.y, rect.width, rect.height);
        ctx.stroke();
        ctx.restore();
        
        // 创建或更新滚动条按钮
        const scrollBarId = this.id + "_vscrollbar";
        let scrollBar = this.stage.getThingById(scrollBarId);
        
        if (!scrollBar) {
            scrollBar = new MyVScrollBarButton({
                x: x,
                y: y,
                width: this.scrollButtonSize.width,
                height: this.scrollButtonSize.height,
                parentThingId: this.id,
                scrollbarHeight: height - this.scrollButtonSize.height
            });
            this.stage.add(scrollBar);
        } else {
            this.stage.redrawOneThing2(scrollBar);
        }
    },
    
    /**
     * 绘制水平滚动条
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    drawHScrollBar: function(ctx) {
        const width = this.width - this.scrollbarWidth;
        const x = this.x;
        const y = this.y + this.height - this.scrollbarHeight;
        const height = this.scrollbarHeight;
        
        // 绘制滚动条背景
        const rect = { 
            x: x, 
            y: y, 
            width: width, 
            height: height, 
            X: x, 
            Y: y, 
            Width: width, 
            Height: height 
        };
        
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "red";
        ctx.rect(rect.x, rect.y, rect.width, rect.height);
        ctx.stroke();
        ctx.restore();
        
        // 创建或更新滚动条按钮
        const scrollBarId = this.id + "_hscrollbar";
        let scrollBar = this.stage.getThingById(scrollBarId);
        
        if (!scrollBar) {
            scrollBar = new MyHScrollBarButton({
                x: x,
                y: y,
                width: this.scrollButtonSize.width,
                height: this.scrollButtonSize.height,
                parentThingId: this.id,
                scrollbarWidth: width - this.scrollButtonSize.width
            });
            this.stage.add(scrollBar);
        } else {
            this.stage.redrawOneThing2(scrollBar);
        }
    },
    
    /**
     * 检查坐标是否在单元格范围内
     * @param {number} x - 检查点x坐标
     * @param {number} y - 检查点y坐标
     * @returns {boolean} 是否在范围内
     */
    isScope: function(x, y) {
        if (x < this.x) return false;
        if (y < this.y) return false;
        if (x > (this.x + this.width)) return false;
        if (y > (this.y + this.height)) return false;
        return true;
    },
    
    /**
     * 构建事件
     * @param {Object} events - 事件回调对象
     */
    buildEvent: function(events) {
        if (events) {
            for (const eventName in events) {
                if (events.hasOwnProperty(eventName)) {
                    this.addEvent(eventName, events[eventName]);
                }
            }
        }
    }
};

extend(MyCell, Thing);