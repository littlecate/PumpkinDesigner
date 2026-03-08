'use strict';

/**
 * @fileoverview 绘制线条模块，提供各种样式的线条绘制功能
 * @module DrawLine
 */

/**
 * 绘制线条工具对象
 * @namespace DrawLine
 */
var DrawLine = {};

/**
 * 绘制线条
 * @function drawLine
 * @param {number} style - 线条样式（2=细线,3=中线,4=粗线,5=虚线,6=点线,7=点划线,8=点点划线,9-12=粗线变体）
 * @param {string} xColor - 颜色值
 * @param {CellCanvas} xGraphics - 画布对象
 * @param {XPoint} xPoint1 - 起点坐标
 * @param {XPoint} xPoint2 - 终点坐标
 * @param {number} pageHeight - 页面高度
 * @param {boolean} isDesignMode - 是否设计模式
 * @param {number} canvasType - 画布类型
 */
DrawLine.drawLine = function (/*int*/ style, /*XColor*/ xColor, /*cellCanvas*/ xGraphics, /*XPoint*/ xPoint1, /*XPoint*/ xPoint2, /*float*/ pageHeight, isDesignMode, canvasType) {
    xGraphics.SetContextByCanvasType(canvasType);
    if (style < 2) {
        if (isDesignMode)
            this.drawThinThinLine("#D4D4D4", xGraphics, xPoint1, xPoint2);
        return;
    }
    if ((xPoint2.X - xPoint1.X) == 0 && (xPoint2.Y - xPoint1.Y == 0)) {
        return;
    }
    if (g_isUseForInput) {
        xColor = "#FF9933";
    }
    //top.gf_consoleLog("drawLine,style=" + style + ",xColor:" + xColor);    
    if (style == 2) {
        this.drawThinLine(xColor, xGraphics, xPoint1, xPoint2);
    }
    else if (style == 3) {
        this.drawMiddleLine(xColor, xGraphics, xPoint1, xPoint2);
    }
    else if (style == 4) {
        this.drawBoldLine(xColor, xGraphics, xPoint1, xPoint2);
    }
    else if (style == 5) {
        this.drawDashLine(xColor, xGraphics, xPoint1, xPoint2);
    }
    else if (style == 6) {
        this.drawDotLine(xColor, xGraphics, xPoint1, xPoint2);
    }
    else if (style == 7) {
        this.drawDotDashLine(xColor, xGraphics, xPoint1, xPoint2);
    }
    else if (style == 8) {
        this.drawDotDotDashLine(xColor, xGraphics, xPoint1, xPoint2);
    }
    else if (style == 9) {
        this.drawBoldDashLine(xColor, xGraphics, xPoint1, xPoint2);
    }
    else if (style == 10) {
        this.drawBoldDotLine(xColor, xGraphics, xPoint1, xPoint2);
    }
    else if (style == 11) {
        this.drawBoldDotDashLine(xColor, xGraphics, xPoint1, xPoint2);
    }
    else if (style == 12) {
        this.drawBoldDotDotDashLine(xColor, xGraphics, xPoint1, xPoint2);
    }
}

DrawLine.drawBoldDotDotDashLine = function (/*XColor */xColor, /*cellCanvas*/ xGraphics, /*XPoint*/ xPoint1, /*XPoint*/ xPoint2) {
    xGraphics.BeginPath();
    xGraphics.SetLineWidth(GlobalV.lineWidth3);
    xGraphics.SetStrokeColor(Comman.GetColor(xColor));
    xGraphics.SetLineDash([4, 2, 2], 2);
    xGraphics.MoveTo(xPoint1.X, xPoint1.Y);
    xGraphics.LineTo(xPoint2.X, xPoint2.Y);
    xGraphics.Stroke();
    xGraphics.EndPath();
}

DrawLine.drawBoldDotDashLine = function (/*XColor */xColor, /*cellCanvas*/ xGraphics, /*XPoint*/ xPoint1, /*XPoint*/ xPoint2) {
    xGraphics.BeginPath();
    xGraphics.SetLineWidth(GlobalV.lineWidth3);
    xGraphics.SetStrokeColor(Comman.GetColor(xColor));
    xGraphics.SetLineDash([4, 2], 2);
    xGraphics.MoveTo(xPoint1.X, xPoint1.Y);
    xGraphics.LineTo(xPoint2.X, xPoint2.Y);
    xGraphics.Stroke();
    xGraphics.EndPath();
}

DrawLine.drawBoldDotLine = function (/*XColor */xColor, /*cellCanvas*/ xGraphics, /*XPoint*/ xPoint1, /*XPoint*/ xPoint2) {
    xGraphics.BeginPath();
    xGraphics.SetLineWidth(GlobalV.lineWidth3);
    xGraphics.SetStrokeColor(Comman.GetColor(xColor));
    xGraphics.SetLineDash([2], 2);
    xGraphics.MoveTo(xPoint1.X, xPoint1.Y);
    xGraphics.LineTo(xPoint2.X, xPoint2.Y);
    xGraphics.Stroke();
    xGraphics.EndPath();
}

DrawLine.drawBoldDashLine = function (/*XColor */xColor, /*cellCanvas*/ xGraphics, /*XPoint*/ xPoint1, /*XPoint*/ xPoint2) {
    xGraphics.BeginPath();
    xGraphics.SetLineWidth(GlobalV.lineWidth3);
    xGraphics.SetStrokeColor(Comman.GetColor(xColor));
    xGraphics.SetLineDash([4], 2);
    xGraphics.MoveTo(xPoint1.X, xPoint1.Y);
    xGraphics.LineTo(xPoint2.X, xPoint2.Y);
    xGraphics.Stroke();
    xGraphics.EndPath();
}

DrawLine.drawDotDotDashLine = function (/*XColor */xColor, /*cellCanvas*/ xGraphics, /*XPoint*/ xPoint1, /*XPoint*/ xPoint2) {
    xGraphics.BeginPath();
    xGraphics.SetLineWidth(GlobalV.lineWidth1);
    xGraphics.SetStrokeColor(Comman.GetColor(xColor));
    xGraphics.SetLineDash([4, 2, 2], 2);
    xGraphics.MoveTo(xPoint1.X, xPoint1.Y);
    xGraphics.LineTo(xPoint2.X, xPoint2.Y);
    xGraphics.Stroke();
    xGraphics.EndPath();
}

DrawLine.drawDotDashLine = function (/*XColor */xColor, /*cellCanvas*/ xGraphics, /*XPoint*/ xPoint1, /*XPoint*/ xPoint2) {
    xGraphics.BeginPath();
    xGraphics.SetLineWidth(GlobalV.lineWidth1);
    xGraphics.SetStrokeColor(Comman.GetColor(xColor));
    xGraphics.SetLineDash([4, 2], 2);
    xGraphics.MoveTo(xPoint1.X, xPoint1.Y);
    xGraphics.LineTo(xPoint2.X, xPoint2.Y);
    xGraphics.Stroke();
    xGraphics.EndPath();
}

DrawLine.drawDotLine = function (/*XColor */xColor, /*cellCanvas*/ xGraphics, /*XPoint*/ xPoint1, /*XPoint*/ xPoint2) {
    xGraphics.BeginPath();
    xGraphics.SetLineWidth(GlobalV.lineWidth1);
    xGraphics.SetStrokeColor(Comman.GetColor(xColor));
    xGraphics.SetLineDash([2], 2);
    xGraphics.MoveTo(xPoint1.X, xPoint1.Y);
    xGraphics.LineTo(xPoint2.X, xPoint2.Y);
    xGraphics.Stroke();
    xGraphics.EndPath();
}

DrawLine.drawDashLine = function (/*XColor */xColor, /*cellCanvas*/ xGraphics, /*XPoint*/ xPoint1, /*XPoint*/ xPoint2) {
    xGraphics.BeginPath();
    xGraphics.SetLineWidth(GlobalV.lineWidth1);
    xGraphics.SetStrokeColor(Comman.GetColor(xColor));
    xGraphics.SetLineDash([4], 2);
    xGraphics.MoveTo(xPoint1.X, xPoint1.Y);
    xGraphics.LineTo(xPoint2.X, xPoint2.Y);
    xGraphics.Stroke();
    xGraphics.EndPath();
}

DrawLine.drawBoldLine = function (/*XColor */xColor, /*cellCanvas*/ xGraphics, /*XPoint*/ xPoint1, /*XPoint*/ xPoint2) {
    xGraphics.BeginPath();
    xGraphics.SetLineWidth(GlobalV.lineWidth3);
    xGraphics.SetStrokeColor(Comman.GetColor(xColor));
    xGraphics.SetLineDash([]);
    xGraphics.MoveTo(xPoint1.X, xPoint1.Y);
    xGraphics.LineTo(xPoint2.X, xPoint2.Y);
    xGraphics.Stroke();
    xGraphics.EndPath();
}

DrawLine.drawMiddleLine = function (/*XColor */xColor, /*cellCanvas*/ xGraphics, /*XPoint*/ xPoint1, /*XPoint*/ xPoint2) {
    xGraphics.BeginPath();
    xGraphics.SetLineWidth(GlobalV.lineWidth2);
    xGraphics.SetStrokeColor(Comman.GetColor(xColor));
    xGraphics.SetLineDash([]);
    xGraphics.MoveTo(xPoint1.X, xPoint1.Y);
    xGraphics.LineTo(xPoint2.X, xPoint2.Y);
    xGraphics.Stroke();
    xGraphics.EndPath();
}

DrawLine.drawThinLine = function (/*XColor */xColor, /*cellCanvas*/ xGraphics, /*XPoint*/ xPoint1, /*XPoint*/ xPoint2) {
    xGraphics.BeginPath();
    xGraphics.SetLineWidth(GlobalV.lineWidth1);
    xGraphics.SetStrokeColor(Comman.GetColor(xColor));
    xGraphics.SetLineDash([]);
    xGraphics.MoveTo(xPoint1.X, xPoint1.Y);
    xGraphics.LineTo(xPoint2.X, xPoint2.Y);
    xGraphics.Stroke();
    xGraphics.EndPath();
}

DrawLine.drawThinThinLine = function (/*XColor */xColor, /*cellCanvas*/ xGraphics, /*XPoint*/ xPoint1, /*XPoint*/ xPoint2) {
    xGraphics.BeginPath();
    xGraphics.SetLineWidth(GlobalV.lineWidth1 / 3);
    xGraphics.SetStrokeColor(Comman.GetColor(xColor));
    xGraphics.SetLineDash([]);
    xGraphics.MoveTo(xPoint1.X, xPoint1.Y);
    xGraphics.LineTo(xPoint2.X, xPoint2.Y);
    xGraphics.Stroke();
    xGraphics.EndPath();
}