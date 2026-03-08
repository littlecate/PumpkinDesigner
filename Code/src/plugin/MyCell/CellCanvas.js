/**
 * 单元格画布类
 * 提供多图层画布管理和绑定操作
 */
'use strict';

/**
 * 单元格画布构造函数
 * @param {Object} page - 页面对象
 * @param {CanvasRenderingContext2D} ctx - 画布上下文（可选）
 */
function CellCanvas(page, ctx) {
    var context;

    if (ctx) {
        context = ctx;
    } else {
        context = page.getCacheContextTextLayer();
    }

    /**
     * 设置画布为文本层缓存画布
     */
    function SetCanvasToCacheCanvasTextLayer() {
        context = page.getCacheContextTextLayer();
    }

    /**
     * 设置画布为背景层缓存画布
     */
    function SetCanvasToCacheCanvasBackgroundLayer() {
        context = page.getCacheContextBackgroundLayer();
    }

    /**
     * 设置画布为图像层缓存画布
     */
    function SetCanvasToCacheCanvasImageLayer() {
        context = page.getCacheContextImageLayer();
    }

    /**
     * 设置画布为网格层缓存画布
     */
    function SetCanvasToCacheCanvasGridLayer() {
        context = page.getCacheContextGridLayer();
    }

    /**
     * 设置画布为显示画布
     */
    function SetCanvasToDisplayCanvas() {
        context = page.getContext();
    }

    /**
     * 根据画布类型设置上下文
     * @param {number} canvasType - 画布类型
     */
    function SetContextByCanvasType(canvasType) {
        if (canvasType == CanvasType.backgroundLayer) {
            SetCanvasToCacheCanvasBackgroundLayer();
        } else if (canvasType == CanvasType.imageLayer) {
            SetCanvasToCacheCanvasImageLayer();
        } else if (canvasType == CanvasType.gridLayer) {
            SetCanvasToCacheCanvasGridLayer();
        } else if (canvasType == CanvasType.textLayer) {
            SetCanvasToCacheCanvasTextLayer();
        } else if (canvasType == CanvasType.displayLayer) {
            SetCanvasToDisplayCanvas();
        } else {
            SetCanvasToCacheCanvasTextLayer();
        }
    }

    /**
     * 获取文本层缓存画布上下文
     * @returns {CanvasRenderingContext2D} 画布上下文
     */
    function GetCacheContextTextLayer() {
        return page.getCacheContextTextLayer();
    }

    /**
     * 获取背景层缓存画布上下文
     * @returns {CanvasRenderingContext2D} 画布上下文
     */
    function GetCacheContextBackgroundLayer() {
        return page.getCacheContextBackgroundLayer();
    }

    /**
     * 获取图像层缓存画布上下文
     * @returns {CanvasRenderingContext2D} 画布上下文
     */
    function GetCacheContextImageLayer() {
        return page.getCacheContextImageLayer();
    }

    /**
     * 获取网格层缓存画布上下文
     * @returns {CanvasRenderingContext2D} 画布上下文
     */
    function GetCacheContextGridLayer() {
        return page.getCacheContextGridLayer();
    }

    /**
     * 清除文本层画布
     */
    function ClearCanvasTextLayer() {
        var textCtx = page.getCacheContextTextLayer();
        textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
    }

    /**
     * 清除背景层画布
     */
    function ClearCanvasBackgroundLayer() {
        var bgCtx = page.getCacheContextBackgroundLayer();
        bgCtx.clearRect(0, 0, bgCtx.canvas.width, bgCtx.canvas.height);
    }

    /**
     * 清除图像层画布
     */
    function ClearCanvasImageLayer() {
        var imgCtx = page.getCacheContextImageLayer();
        imgCtx.clearRect(0, 0, imgCtx.canvas.width, imgCtx.canvas.height);
    }

    /**
     * 清除网格层画布
     */
    function ClearCanvasGridLayer() {
        var gridCtx = page.getCacheContextGridLayer();
        gridCtx.clearRect(0, 0, gridCtx.canvas.width, gridCtx.canvas.height);
    }

    /**
     * 获取显示画布上下文
     * @returns {CanvasRenderingContext2D} 画布上下文
     */
    function GetDisplayCanvasContext() {
        return page.getContext();
    }

    /**
     * 保存状态
     */
    function SaveState() {
        context.save();
    }

    /**
     * 裁剪
     */
    function Clip() {
        context.clip();
    }

    /**
     * 设置描边颜色
     * @param {string} color - 颜色值
     */
    function SetStrokeColor(color) {
        context.strokeStyle = color;
    }

    /**
     * 设置填充颜色
     * @param {string} color - 颜色值
     */
    function SetFillColor(color) {
        context.fillStyle = color;
    }

    /**
     * 绑制矩形
     * @param {Object} xRect - 矩形对象
     */
    function Rectangle(xRect) {
        context.rect(xRect.GetX(), xRect.GetY(), xRect.GetWidth(), xRect.GetHeight());
    }

    /**
     * 描边
     */
    function Stroke() {
        context.stroke();
    }

    /**
     * 填充
     */
    function Fill() {
        context.fill();
    }

    /**
     * 开始路径
     */
    function BeginPath() {
        context.beginPath();
    }

    /**
     * 结束路径
     */
    function EndPath() {
        context.closePath();
    }

    /**
     * 恢复状态
     */
    function RestoreState() {
        context.restore();
    }

    /**
     * 添加图像到矩形区域
     * @param {Object} image - 图像对象
     * @param {Object} rectangle - 矩形对象
     * @param {boolean} asInline - 是否内联
     */
    function AddImageFittedIntoRectangle(image, rectangle, asInline) {
        context.drawImage(image.GetImage(), rectangle.GetX(), rectangle.GetY(), rectangle.GetWidth(), rectangle.GetHeight());
    }

    /**
     * 绑制线条
     * @param {Object} xPen - 画笔对象
     * @param {Object} xPoint1 - 起点坐标
     * @param {Object} xPoint2 - 终点坐标
     */
    function DrawLine(xPen, xPoint1, xPoint2) {
        SetStrokeColor(xPen.GetColor());
        SetLineWidth(xPen.Width);
        var isSetDash = false;

        if (xPen.DashStyle == XDashStyle.Dash) {
            SetLineDash([5, 2]);
            isSetDash = true;
        } else if (xPen.DashStyle == XDashStyle.DashDot) {
            SetLineDash([5, 2, 2, 2]);
            isSetDash = true;
        } else if (xPen.DashStyle == XDashStyle.DashDotDot) {
            SetLineDash([5, 2, 2, 2, 2, 2]);
            isSetDash = true;
        } else if (xPen.DashStyle == XDashStyle.Dot) {
            SetLineDash([1, 1]);
            isSetDash = true;
        }

        context.beginPath();
        MoveTo(xPoint1.X, xPoint1.Y);
        LineTo(xPoint2.X, xPoint2.Y);
        Stroke();

        if (isSetDash) {
            SetLineDash([], 0);
        }
    }

    /**
     * 设置线条宽度
     * @param {number} width - 宽度
     */
    function SetLineWidth(width) {
        context.lineWidth = width;
    }

    /**
     * 设置虚线样式
     * @param {Array} segments - 虚线段数组
     */
    function SetLineDash(segments) {
        context.setLineDash(segments);
    }

    /**
     * 移动到指定点
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     */
    function MoveTo(x, y) {
        context.moveTo(x, y);
    }

    /**
     * 绑制直线到指定点
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     */
    function LineTo(x, y) {
        context.lineTo(x, y);
    }

    /**
     * 获取图像数据
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {number} width - 宽度
     * @param {number} height - 高度
     * @returns {ImageData} 图像数据
     */
    function GetImageData(x, y, width, height) {
        return context.getImageData(x, y, width, height);
    }

    /**
     * 放置图像数据
     * @param {ImageData} data - 图像数据
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     */
    function PutImageData(data, x, y) {
        context.putImageData(data, x, y);
    }

    /**
     * 清除矩形区域
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {number} width - 宽度
     * @param {number} height - 高度
     */
    function ClearRect(x, y, width, height) {
        context.clearRect(x, y, width, height);
    }

    /**
     * 获取当前上下文
     * @returns {CanvasRenderingContext2D} 画布上下文
     */
    function GetContext() {
        return context;
    }

    return {
        SetCanvasToCacheCanvasTextLayer: SetCanvasToCacheCanvasTextLayer,
        SetCanvasToCacheCanvasBackgroundLayer: SetCanvasToCacheCanvasBackgroundLayer,
        SetCanvasToCacheCanvasImageLayer: SetCanvasToCacheCanvasImageLayer,
        SetCanvasToCacheCanvasGridLayer: SetCanvasToCacheCanvasGridLayer,
        SetCanvasToDisplayCanvas: SetCanvasToDisplayCanvas,
        GetCacheContextTextLayer: GetCacheContextTextLayer,
        GetCacheContextBackgroundLayer: GetCacheContextBackgroundLayer,
        GetCacheContextImageLayer: GetCacheContextImageLayer,
        GetCacheContextGridLayer: GetCacheContextGridLayer,
        GetDisplayCanvasContext: GetDisplayCanvasContext,
        SetContextByCanvasType: SetContextByCanvasType,
        ClearCanvasTextLayer: ClearCanvasTextLayer,
        ClearCanvasBackgroundLayer: ClearCanvasBackgroundLayer,
        ClearCanvasImageLayer: ClearCanvasImageLayer,
        ClearCanvasGridLayer: ClearCanvasGridLayer,
        SaveState: SaveState,
        Clip: Clip,
        Rectangle: Rectangle,
        SetStrokeColor: SetStrokeColor,
        Stroke: Stroke,
        BeginPath: BeginPath,
        EndPath: EndPath,
        RestoreState: RestoreState,
        AddImageFittedIntoRectangle: AddImageFittedIntoRectangle,
        DrawLine: DrawLine,
        SetLineWidth: SetLineWidth,
        SetLineDash: SetLineDash,
        MoveTo: MoveTo,
        LineTo: LineTo,
        SetFillColor: SetFillColor,
        Fill: Fill,
        GetImageData: GetImageData,
        PutImageData: PutImageData,
        ClearRect: ClearRect,
        GetContext: GetContext
    };
}
