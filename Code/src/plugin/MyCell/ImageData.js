'use strict';

/**
 * @fileoverview 图片数据模块，管理图片的加载和绘制
 * @module ImageData
 */

/**
 * 图片数据工厂对象
 * @namespace ImageDataFactory
 */
var ImageDataFactory = {};

/**
 * 创建图片数据对象
 * @function Create
 * @param {Object} o - 图片配置对象
 * @returns {ImageData} 图片数据对象
 */
ImageDataFactory.Create = function (o) {
    var o1 = new ImageData(o);
    return o1;
};

/**
 * 图片数据类
 * @class
 * @param {Object} o - 图片配置对象
 * @param {number} o.imageIndex - 图片索引
 * @param {string} o.imageType - 图片类型
 * @param {string} o.imageData - 图片Base64数据
 * @param {Function} callback - 加载完成回调函数
 */
function ImageData(o, callback) {
    this.img = new Image();
    this.imageIndex = o.imageIndex;
    var me = this;
    this.isLoaded = false;
    this.isLoadError = false;

    this.loadImg = function () {
        var src = "data:image/" + o.imageType + ";base64," + o.imageData;
        me.img.src = src;
    }

    this.img.onload = function () {
        me.isLoaded = true;
        if (callback)
            callback(me);
    }

    this.img.onerror = function () {
        me.isLoadError = true;
    }

    this.GetWidth = function () {
        return this.img.width;
    }

    this.GetHeight = function () {
        return this.img.height;
    }

    this.GetImage = function () {
        return this.img;
    }

    this.drawBackImage = function (doc, style, xRect, pageIndex, canvasType) {
        if (style == 0) //平铺
        {            
            CellHelper.DrawImage_Tile(doc, me, xRect, pageIndex, canvasType);
        }
        else if (style == 1) //居中
        {
            CellHelper.DrawImage_Center(doc, me, xRect, 2, 2, pageIndex, canvasType);
        }
        else if (style == 2) //拉伸
        {
            CellHelper.DrawImage_Stretch(doc, me, xRect, pageIndex, canvasType);
        }
        else {
            CellHelper.DrawImage_Center(doc, me, xRect, 2, 2, pageIndex, canvasType);
        }
    }

    this.drawCellImage = function (doc, style, xRect, pageIndex, halign, valign, canvasType) {
        if (style == 1) //表示自动调整图片大小 ，图片的高度等于单元格的高度，图片的宽度等于单元格的宽度。设置了此显示风格后，halign 和 valign 这两个参数无效。
        {
            CellHelper.DrawImage_Stretch(doc, me, xRect, pageIndex, canvasType);
        }
        else if (style == 2 + 1) //此显示风格只有在设置了“自动调整图片大小”显示风格后才有效。图片尽量充满整个单元格，但是要保证图片的长度和宽度比例不变，这样图片不会变形。
        {
            CellHelper.DrawImage_Center(doc, me, xRect, halign, valign, pageIndex, canvasType);
        }
        else if (style == 4 + 1) //图片平铺填满整个单元格。该显示风格只有在没有设置“自动调整图片大小”显示风格后才有效。设置了此显示风格后，halign 和 valign 这两个参数无效。
        {
            CellHelper.DrawImage_Tile(doc, me, xRect, pageIndex, canvasType);
        }
        else {
            CellHelper.DrawImage_Center(doc, me, xRect, halign, valign, pageIndex, canvasType);
        }
    }
}