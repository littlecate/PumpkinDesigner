'use strict';

/**
 * @fileoverview 单元格辅助工具模块，提供绘图、图片处理等辅助功能
 * @module CellHelper
 */

/**
 * 单元格辅助工具对象
 * @namespace CellHelper
 */
var CellHelper = {};

/**
 * 图片绘制间隔对象
 * @type {Object}
 */
var myDrawImageIntervalObj = {};

/**
 * 绘制字符串（空实现）
 * @function DrawString
 * @param {Object} cellCanvas - 单元格画布
 * @param {string} text - 文本内容
 * @param {Object} font - 字体配置
 * @param {Object} xBrush - 画刷对象
 * @param {Object} rectangle - 矩形区域
 * @param {string} align - 对齐方式
 */
CellHelper.DrawString = function (cellCanvas, text, font, xBrush, rectangle, align) {

}

/**
 * 设置字体样式（空实现）
 * @function SetFontStyle
 * @param {Object} o - 对象
 * @param {Object} font - 字体配置
 */
CellHelper.SetFontStyle = function (o, font) {

}

/**
 * 设置文本对齐（空实现）
 * @function SetTextAligned
 * @param {Object} o - 对象
 * @param {string} text - 文本内容
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {Object} rectangle - 矩形区域
 * @param {string} align - 对齐方式
 */
CellHelper.SetTextAligned = function (o, text, x, y, rectangle, align) {

}

/**
 * 测量字符串（空实现）
 * @function MeasureString
 * @param {string} text - 文本内容
 * @param {Object} font - 字体配置
 */
CellHelper.MeasureString = function (text, font) {

}

/**
 * 绘制图片
 * @function DrawImage
 * @param {Object} cellCanvas - 单元格画布
 * @param {Object} image - 图片对象
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {number} canvasType - 画布类型
 */
CellHelper.DrawImage = function (cellCanvas, image, x, y, width, height, canvasType) {
    cellCanvas.SetContextByCanvasType(canvasType);
    cellCanvas.AddImageFittedIntoRectangle(image, new XRect(x, y, width, height));
}

/**
 * 平铺绘制图片
 * @function DrawImage_Tile
 * @param {Object} doc - 文档对象
 * @param {Object} image - 图片对象
 * @param {Object} xRect - 矩形区域
 * @param {number} pageIndex - 页面索引
 * @param {number} canvasType - 画布类型
 */
CellHelper.DrawImage_Tile = function (doc, image, xRect, pageIndex, canvasType) {
    var cellCanvas = doc.getCellCanvasByIndex(pageIndex, canvasType);
    cellCanvas.SetContextByCanvasType(canvasType);
    var x = xRect.GetX();
    var y = xRect.GetY();
    var w = image.GetWidth();
    var h = image.GetHeight();
    var w1 = 0;
    var h1 = 0;
    var clipRect = new XRect(xRect.GetX(), xRect.GetY(), xRect.GetWidth(), xRect.GetHeight());
    //clipRect.SetY(pageHeight - clipRect.GetY() - clipRect.GetHeight());
    cellCanvas.SaveState();
    cellCanvas.Clip();
    //cellCanvas.SetStrokeColor(iText.Kernel.Colors.ColorConstants.PINK);
    cellCanvas.Rectangle(clipRect);
    //cellCanvas.Stroke();
    cellCanvas.EndPath();
    while (w1 < xRect.GetWidth()) {
        CellHelper.DrawImage_Stretch(doc, image, new XRect(x, y, w, h), pageIndex, canvasType);
        y = xRect.GetY() + h;
        h1 = h;
        while (h1 < xRect.GetHeight()) {
            CellHelper.DrawImage_Stretch(doc, image, new XRect(x, y, w, h), pageIndex, canvasType);
            y += h;
            h1 += h;
        }
        x += w;
        y = xRect.GetY();
        w1 += w;
    }
    cellCanvas.RestoreState();
}

/**
 * 拉伸绘制图片
 * @function DrawImage_Stretch
 * @param {Object} doc - 文档对象
 * @param {Object} image - 图片对象
 * @param {Object} xRect - 矩形区域
 * @param {number} pageIndex - 页面索引
 * @param {number} canvasType - 画布类型
 */
CellHelper.DrawImage_Stretch = function (doc, image, xRect, pageIndex, canvasType) {
    var x = xRect.GetX();
    var y = xRect.GetY();
    var width = xRect.GetWidth();
    var height = xRect.GetHeight();
    var cellCanvas = doc.getCellCanvasByIndex(pageIndex);
    cellCanvas.SetContextByCanvasType(canvasType);
    CellHelper.DrawImage(cellCanvas, image, x, y, width, height, canvasType);
}

/**
 * 居中绘制图片
 * @function DrawImage_Center
 * @param {Object} doc - 文档对象
 * @param {Object} image - 图片对象
 * @param {Object} xRect - 矩形区域
 * @param {number} halign - 水平对齐方式（0-左，1-左，2-中，3-右）
 * @param {number} valign - 垂直对齐方式（0-上，1-上，2-中，3-下）
 * @param {number} pageIndex - 页面索引
 * @param {number} canvasType - 画布类型
 */
CellHelper.DrawImage_Center = function (doc, /*ImageData*/ image, /*iText.Kernel.Geom.Rectangle*/ xRect, /*int*/ halign, /*int*/ valign
    , pageIndex, canvasType) {
    var w = image.GetWidth();
    var h = image.GetHeight();
    var r1 = xRect.GetWidth() / w;
    var r2 = xRect.GetHeight() / h;
    var r = Math.min(r1, r2);
    var w1 = w * r;
    var h1 = h * r;
    var x = xRect.GetX();
    var y = xRect.GetY();
    if (halign == 0 || halign == 1) {
        //
    }
    else if (halign == 2) {
        x += (xRect.GetWidth() - w1) / 2;
    }
    else if (halign == 3) {
        x += xRect.GetWidth() - w1;
    }
    if (valign == 0 || valign == 1) {
        //
    }
    else if (valign == 2) {
        y += (xRect.GetHeight() - h1) / 2;
    }
    else if (valign == 3) {
        y += xRect.GetHeight() - h1;
    }
    CellHelper.DrawImage_Stretch(doc, image, new XRect(x, y, w1, h1), pageIndex, canvasType);
}
