'use strict';

/**
 * @fileoverview HTML字符串绘制类模块，用于在画布上绘制HTML格式的文本
 * @module DrawHtmlStringClass
 */

/**
 * 是否使用单元格绘制字符串模式（兼容华表模式）
 * @type {boolean}
 */
let isUseCellDrawStringMode = true;

/**
 * HTML字符串绘制类
 * @class
 * @param {CanvasRenderingContext2D} ctx - 画布上下文
 * @param {Object} o - 配置对象
 * @param {string} html - HTML字符串
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {number} width - 宽度
 * @param {number} height - 高度
 */
function DrawHtmlStringClass(ctx, o, html, x, y, width, height) {    
    let rect0 = new XRect(x, y, width, height);
    var rect = adjustRect(rect0);
    x = rect.GetX();
    y = rect.GetY();
    width = rect.GetWidth();
    height = rect.GetHeight();
    let xx = 0;
    let yy = 0;
    let originalX = xx;
    let textWidth = 0;
    let textHeight = 0;
    let drawTextObjs = [];
    let isHtmlDraw = false;
    let isAutoWrap = o.isMultiLine;
    let isAutoScale = o.isAutoScale;
    let fontSizeAdjust = 0;
    let isStopScale = false;
    let firstCharRect;

    function DoJob() {
        Init();
        DoJobA();
        DoJobB();
        return firstCharRect;
    }

    function Init() {
        xx = 0;
        yy = 0;
        originalX = xx;
        textWidth = 0;
        textHeight = 0;
        drawTextObjs = [];
    }

    function DoJobB() {
        var L = SplitDrawTextObjsByLineBreak();
        var lineSpaceRate;
        if (isUseCellDrawStringMode) {
            lineSpaceRate = GetLineSpaceRateCell(L);
        }
        else {
            lineSpaceRate = GetLineSpaceRate(L);
        }       
        if (!isStopScale && isAutoScale && (textWidth > width || textHeight > height)) {
            fontSizeAdjust += 0.1;
            DoJob();
            return;
        }        
        if (o.cellVAlign == 8) //上
        {
            y += 2;
        }
        else if (o.cellVAlign == 16) //下
        {
            if (height > textHeight)
                y += (height - textHeight) - 2;
        }
        else if (o.cellVAlign == 32) //中
        {
            if (height > textHeight)
                y += (height - textHeight) / 2;
        }
        ctx.save();
        ctx.beginPath();
        ctx.rect(rect.GetX(), rect.GetY(), rect.GetWidth(), rect.GetHeight());
        ctx.clip();
        var lineIndex = 0;
        var needAddY = 0;
        for (var i = 0; i < L.length; i++) {
            var L1 = L[i];
            var lineWidth = GetLineWidth(L1);
            var x1 = x;
            var y1 = y;
            if (lineIndex > 0) {
                needAddY += L[lineIndex - 1][0].XRect.GetHeight() * (lineSpaceRate * scaleRate - 1);
            }
            if (o.cellHAlign == 1) //左
            {
                //
            }
            else if (o.cellHAlign == 2) //右
            {
                if (width >= lineWidth)
                    x1 += (width - lineWidth);
            }
            else if (o.cellHAlign == 4) //中
            {
                if (width >= lineWidth)
                    x1 += (width - lineWidth) / 2;
            }
            for (var j = 0; j < L1.length; j++) {
                var p = L1[j];
                var x11 = p.XRect.GetX() + x1;
                var y11 = p.XRect.GetY() + y1 + p.TextHeight + needAddY;
                if (i == 0 && j == 0) {
                    firstCharRect = new XRect(x11, y11 - p.TextHeight, p.XRect.GetWidth(), p.XRect.GetHeight());
                }
                drawText(ctx, p.Text, p.Font, x11, y11, p.Color);
            }
            lineIndex++;
        }
        ctx.restore();
    }

    function GetLineSpaceRate(L) {
        var t1 = 1.5;
        while (true) {
            var t2 = 0;
            for (var i = 0; i < L.length; i++) {
                var L1 = L[i];
                if (i == 0) {
                    t2 += L1[0].XRect.GetHeight();
                }
                else {
                    t2 += L1[0].XRect.GetHeight() * t1 * scaleRate;
                }
            }
            textHeight = t2;
            if (t2 < height - 4) {
                break;
            }
            t1 -= 0.1;
            if (t1 < 1) {
                t1 = 1;
                return t1;
            }
        }
        return t1;
    }

    function GetLineSpaceRateCell(L) {
        var t1 = (L[0][0].XRect.GetHeight() + o.lineSpace) / L[0][0].XRect.GetHeight();
        var t2 = 0;
        for (var i = 0; i < L.length; i++) {
            var L1 = L[i];
            if (i == 0) {
                t2 += L1[0].XRect.GetHeight();
            }
            else {
                t2 += L1[0].XRect.GetHeight() * t1 * scaleRate;
            }
        }
        textHeight = t2;        
        return t1;
    }

    function GetLineWidth(L1) {
        var t = 0;
        for (var i = 0; i < L1.length; i++) {
            var p = L1[i];
            t += p.XRect.GetWidth();
        }
        return t;
    }

    function SplitDrawTextObjsByLineBreak() {
        var L = [];
        var L1 = []
        for (var i = 0; i < drawTextObjs.length; i++) {
            var p = drawTextObjs[i];
            if (p.Text == "lineBreak") {
                if (L1.length == 0) {
                    L1.Add(new DrawTextObj("", p.Font, p.NormalFont, p.Color, p.XRect, p.HAlign, p.VAlign, p.TextHeight, false));
                }
                L.Add(L1);
                L1 = [];
            }
            else {
                L1.Add(p);
            }
        }
        if (L1.length > 0) {
            L.Add(L1);
        }
        return L;
    }

    function drawText(ctx, text, font, x1, y1, color) {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText(text, x1, y1);
    }

    function DoJobA() {
        html = html.replace(/Font/gm, "font").replace(/FONT/gm, "font");
        if (html.Contains("<font ")) {
            isHtmlDraw = true;
            DoJobAA();
        }
        else {
            isHtmlDraw = false;
            DoJobAB();
        }
    }

    function DoJobAB() {
        var fontSize1 = o.fontSize - fontSizeAdjust;
        if (fontSize1 < 0.1) {
            fontSize1 = 0.1;
            isStopScale = true;
        }
        var t = Comman.GetFontStyle(o.fontStyle);
        var normalFont = GetFont(o.fontFamily, fontSize1, t.fontStyle, t.fontWeight);
        var supSubFont = GetFont(o.fontFamily, fontSize1 * 0.7, t.fontStyle, t.fontWeight);
        DrawText(html, normalFont, supSubFont, fontSize1, intToHexColor(o.fontColor), "left");
    }

    function DoJobAA() {
        var htmlElements = html.split("<font");
        for (var i = 0; i < htmlElements.length; i++) {
            var element = htmlElements[i];
            if (!string.IsNullOrEmpty(element.Trim())) {
                let style = GetStyle(element);
                let text = GetText(element);
                let fontFamily = GetStyleValue(style, "FONT-FAMILY");
                if (string.IsNullOrEmpty(fontFamily)) {
                    fontFamily = "宋体";
                }
                let fontSize = GetStyleValue(style, "FONT-SIZE").Replace("pt", "");
                if (string.IsNullOrEmpty(fontSize)) {
                    fontSize = "10.5";
                }
                let color = GetStyleValue(style, "COLOR");
                if (string.IsNullOrEmpty(color)) {
                    color = "#000000";
                }
                let textAlign = GetStyleValue(style, "TEXT-ALIGN");
                if (textAlign == "") {
                    textAlign = "left";
                }
                let fontStyle = GetStyleValue(style, "FONT-STYLE");
                let fontWeight = GetStyleValue(style, "FONT-WEIGHT");
                let textDecoration = GetStyleValue(style, "TEXT-DECORATION");
                var fontSize1 = Convert.ToSingle(fontSize) - fontSizeAdjust;
                if (fontSize1 < 0.1) {
                    fontSize1 = 0.1;
                    isStopScale = true;
                }
                var normalFont = GetFont(fontFamily, fontSize1, fontStyle, fontWeight);
                var supSubFont = GetFont(fontFamily, fontSize1 * 0.7, fontStyle, fontWeight);
                DrawText(text, normalFont, supSubFont, fontSize1, color, textAlign);
            }
        }
    }

    function DrawText(text, normalFont, supSubFont, fontSize, color, textAlign) {        
        text = ReplaceEscapeStr(text);
        var font = normalFont;
        var L = SplitStr(text);
        var x1 = xx;
        var y1 = yy;
        var isSubSup = false;
        var isSub = false;
        var isSup = false;
        for (var i = 0; i < L.length; i++) {
            var t = L[i];
            var size = MeasureString(t, font, fontSize);
            if (IsStr(L, i, "<sub>") || IsStr(L, i, "&sub")) {
                font = supSubFont;
                y1 = yy + 3;
                if (t == "<") {
                    i += 4;
                }
                else {
                    i += 3;
                }
                isSubSup = true;
                isSub = true;
                isSup = false;
                continue;
            }
            if (IsStr(L, i, "</sub>")) {
                font = normalFont;
                y1 = yy;
                i += 5;
                isSubSup = false;
                isSub = false;
                isSup = false;
                continue;
            }
            if (IsStr(L, i, "<sup>") || IsStr(L, i, "&sup")) {
                font = supSubFont;
                y1 = yy - 3;               
                if (t == "<") {
                    i += 4;                    
                }
                else {
                    i += 3;
                }
                isSubSup = true;
                isSup = true;
                isSub = false;
                continue;
            }
            if (IsStr(L, i, "</sup>")) {
                font = normalFont;
                y1 = yy;
                i += 5;
                isSubSup = false;
                isSup = false;
                isSub = false;
                continue;
            }
            if (IsStr(L, i, "&end")) {
                font = normalFont;
                isSubSup = false;
                isSup = false;
                isSub = false;
                y1 = yy;
                i += 3;
                continue;
            }
            if (IsStr(L, i, "<br>") || (!isHtmlDraw && IsStr(L, i, "\r\n"))) {
                font = normalFont;
                yy = yy + size.Height;
                y1 = yy;
                xx = originalX;
                x1 = xx;
                if (t == "<") {
                    i += 3;
                }
                else {
                    i += 1;
                }
                drawTextObjs.Add(new DrawTextObj("lineBreak", font, normalFont, color, new XRect(x1, y1, size.Width, size.Height), textAlign, "middle", size.Height, isSubSup));
                continue;
            }
            if (x1 + size.Width > textWidth) {
                textWidth = x1 + size.Width;
            }
            if (y1 + size.Height > textHeight) {
                textHeight = y1 + size.Height;
            }
            drawTextObjs.Add(new DrawTextObj(t, font, normalFont, color, new XRect(x1, y1, size.Width, size.Height), textAlign, "middle", size.Height, isSubSup));
            xx += size.Width;
            if (isAutoWrap && textWidth > width) {
                FindPrevDrawTextObjAndIndexAndAddBrAndAdjust();
                y1 = yy;
                if (isSub) {
                    y1 += 3;
                }
                else if (isSup) {
                    y1 -= 3;
                }
            }
            x1 = xx;
        }
    }

    function IsStr(L, i, targetStr) {        
        if (L[i] != targetStr.substring(0, 1)) {
            return false;
        }        
        var len = targetStr.length;
        var pos2 = i + len - 1;
        if (pos2 > L.length - 1) {
            return false;
        }
        var t = L.GetRange(i, len);
        var t1 = t.join("").toLowerCase();
        return t1 == targetStr;
    }

    function FindPrevDrawTextObjAndIndexAndAddBrAndAdjust() {
        var textWidthOld = textWidth;
        var isAfterIsEnglishChar = false;
        for (var i = drawTextObjs.length - 1; i >= 0; i--) {
            var p = drawTextObjs[i];
            var t = p.Text;
            if (p.isSubSup) {
                isAfterIsEnglishChar = false;
                textWidth -= p.XRect.GetWidth();
                continue;
            }
            else if (!isUseCellDrawStringMode && IsEnglishChar(t)) {
                isAfterIsEnglishChar = true;
                textWidth -= p.XRect.GetWidth();
                if (textWidth <= p.XRect.GetWidth()) {
                    textWidth = textWidthOld;
                    InsertLineBreak(drawTextObjs.length - 1);
                    break;
                }
                continue;
            }            
            else if (t == "lineBreak") {
                break;
            }
            else {
                if (isAfterIsEnglishChar) {
                    InsertLineBreak(i + 1);
                }
                else {
                    if (isUseCellDrawStringMode && (i - 1 > 1) && GlobalV.canNotInTheEndChars.Contains(drawTextObjs[i - 1].Text)) {
                        InsertLineBreak(i - 1);
                    }
                    else {
                        InsertLineBreak(i);
                    }
                }
                break;
            }
        }
    }

    function InsertLineBreak(index) {
        var p = drawTextObjs[index];
        textWidth -= p.XRect.GetWidth();
        var rect1 = new XRect(0, p.XRect.GetY() + p.XRect.GetHeight(), p.XRect.GetWidth(), p.XRect.GetHeight());
        xx = 0 + rect1.GetWidth();
        yy += p.XRect.GetHeight();
        if (yy + p.XRect.GetHeight() > textHeight) {
            textHeight = yy + p.XRect.GetHeight();
        }
        drawTextObjs.Insert(index, new DrawTextObj("lineBreak", p.Font, p.NormalFont, p.Color, p.XRect, p.HAlign, p.VAlign, p.TextHeight, p.isSubSup));
        var deltaX = p.XRect.GetX();
        var deltaY = p.XRect.GetHeight();
        p.XRect = rect1;
        AdjustDrawTextObjsPosition(deltaX, deltaY, index + 2);
    }

    function IsEnglishChar(t) {
        return /[0-9a-zA-Z(（)）_\[#\.\{/% ％±＋－×÷≈≠＝≤≥＜＞≮≯∫∮∝∞∧∨∑∏∪∩∈∵∴∠⌒⊙≌∽√℃‰€〈《「『〖【｛]+/.test(t);
    }

    function AdjustDrawTextObjsPosition(deltaX, deltaY, startIndex) {
        for (var j = startIndex; j < drawTextObjs.length; j++) {
            var p1 = drawTextObjs[j];
            var rect = new XRect(p1.XRect.GetX() - deltaX, p1.XRect.GetY() + deltaY, p1.XRect.GetWidth(), p1.XRect.GetHeight());
            p1.XRect = rect;
            xx += rect.GetWidth();
        }
    }

    function ReplaceEscapeStr(text) {
        return text.Replace(/&nbsp;/gm, " ").Replace(/&lt;/gm, "<").Replace(/&gt;/gm, ">").Replace(/&amp;/gm, "&").Replace(/&quot;/gm, /\"/).Replace(/&apos;/gm, "'")
            .Replace(/&copy;/gm, "©").Replace(/&reg;/gm, "®").Replace(/&trade;/gm, "™").Replace(/&times;/gm, "×").Replace(/&divide;/gm, "÷");
    }

    function MeasureString(text, font, fontSize) {
        ctx.font = font;
        var t = ctx.measureText(text);
        return new XSize({
            Width: t.width,
            Height: fontSize
        });
    }

    function GetFont(fontFamily, fontSize, fontStyle, fontWeight) {
        var ar = [];
        ar.push(fontStyle || "");
        ar.push(fontWeight || "");
        ar.push((fontSize || "12") + "pt");
        ar.push(fontFamily || "");
        return ar.join(" ");
    }

    function SplitStr(text) {
        var L1 = [];
        for (var i = 0; i < text.length; i++) {
            var t = text.substring(i, i + 1);
            L1.push(t);
        }
        return L1;
    }

    function GetStyle(element) {
        element = element.replace(/Style/gm, "style").replace(/STYLE/gm, "style");
        var styleStart = element.indexOf("style=\"") + 7;
        var styleEnd = element.indexOf("\"", styleStart);
        return element.substring(styleStart, styleEnd);
    }

    function GetText(element) {
        var textStart = element.indexOf(">") + 1;
        var textEnd = element.lastIndexOf("<");
        return element.substring(textStart, textEnd);
    }

    function GetStyleValue(style, property) {
        var styles = style.split(";");
        property = property.ToLower();
        for (var i = 0; i < styles.length; i++) {
            var s = styles[i];
            var tAr = s.split(':');
            if (tAr.length < 2) {
                continue;
            }
            var t1 = tAr[0].Trim();
            var t2 = tAr[1].Trim();
            if (t1.ToLower() == property) {
                return t2;
            }
        }
        return "";
    }

    return {
        DoJob: DoJob
    }
}