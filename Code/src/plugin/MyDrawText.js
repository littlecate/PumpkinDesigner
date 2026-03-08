/**
 * 文本绘制类
 * 提供文本的自动换行、上下标、对齐等绘制功能
 */
'use strict';

/**
 * 文本绘制构造函数
 */
function MyDrawText() {
    /**
     * 自动填充拖拽标志
     * @type {boolean}
     */
    var g_isAutoFillDrag = false;

    /**
     * 调整字符串数组（自动换行）
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     * @param {Array} strList - 字符串数组
     * @param {Object} rect - 矩形区域
     * @param {Object} font - 字体配置
     * @param {number} lineSpace - 行间距
     * @returns {Object} 调整后的结果对象
     */
    var AdjustStrAr = function (ctx, strList, rect, font, lineSpace) {
        var fontSize = font.fontSize;
        var isNeedAdjustFontSize = false;

        for (var i = 0; i < strList.Count(); i++) {
            var str = strList[i];
            var measureResult = ctx.measureText(str);

            if (measureResult.width > rect.width) {
                var adjustedLines = [];
                var currentLine = [];

                for (var k = 0; k < str.length; k++) {
                    currentLine.push(str[k].toString());
                    measureResult = ctx.measureText(currentLine.join(""));

                    if (measureResult.width > rect.width) {
                        var breakPosition = getBreakPosition(str, k);

                        if (breakPosition != -11111) {
                            var tempList = [];

                            if (breakPosition > 0) {
                                var startIndex = currentLine.length - 1 - breakPosition;
                                if (startIndex < 0) {
                                    startIndex = 0;
                                }
                                var endIndex = breakPosition;
                                if (endIndex - startIndex > currentLine.length) {
                                    endIndex = currentLine.length - startIndex;
                                }
                                tempList = currentLine.GetRange(startIndex, endIndex);

                                for (var n = currentLine.Count() - 1; n > startIndex; n--) {
                                    currentLine.RemoveAt(n);
                                }
                            }

                            if (currentLine.Count() > 1) {
                                var lineText = currentLine.GetRange(0, currentLine.Count() - 1).Join("");
                                adjustedLines.Add(lineText);
                                currentLine.Clear();
                                currentLine.Add(tempList.Join("") + str[k].toString());
                            } else {
                                adjustedLines.Add(currentLine.Join(""));
                                currentLine.Clear();
                                fontSize -= 0.1;

                                if (fontSize > 0) {
                                    isNeedAdjustFontSize = true;
                                    font.fontSize = fontSize;
                                    return {
                                        strList: strList,
                                        isNeedAdjustFontSize: isNeedAdjustFontSize,
                                        font: font
                                    };
                                }
                            }
                        } else {
                            fontSize -= 0.1;
                            if (fontSize > 0) {
                                isNeedAdjustFontSize = true;
                                font.fontSize = fontSize;
                                return {
                                    strList: strList,
                                    isNeedAdjustFontSize: isNeedAdjustFontSize,
                                    font: font
                                };
                            }
                        }
                    }
                }

                if (currentLine.Count() > 0) {
                    adjustedLines.Add(currentLine.Join(""));
                }

                strList.InsertRange(i + 1, adjustedLines);
                strList.RemoveAt(i);
            }
        }

        if ((strList.Count() * fontSize + (strList.Count() - 1) * lineSpace) > rect.height) {
            if (fontSize > 0) {
                fontSize -= 0.1;
                isNeedAdjustFontSize = true;
                font.fontSize = fontSize;
                return {
                    strList: strList,
                    isNeedAdjustFontSize: isNeedAdjustFontSize,
                    font: font
                };
            }
        }

        return {
            strList: strList,
            isNeedAdjustFontSize: isNeedAdjustFontSize,
            font: font
        };
    };

    /**
     * 获取断句位置
     * @param {string} str - 字符串
     * @param {number} currentIndex - 当前索引
     * @returns {number} 断句位置
     */
    var getBreakPosition = function (str, currentIndex) {
        if (currentIndex == 0) {
            return -11111;
        }

        var prevChar = str[currentIndex - 1];
        var currentChar = str[currentIndex];

        if (GlobalV.canNotInTheEndChars.Contains(prevChar)) {
            return 1;
        }
        if (GlobalV.canNotInTheFirstChars.Contains(currentChar)) {
            return -11111;
        }
        return 0;
    };

    /**
     * 获取上标下标信息列表
     * @param {string} str - 包含上下标标记的字符串
     * @returns {Object} 包含处理后的字符串和上下标信息
     */
    var GetSupSubInfoList = function (str) {
        if (!str.Contains("&End")) {
            return {
                str: str,
                supInfos: [],
                subInfos: []
            };
        }

        var supInfos = [];
        var subInfos = [];
        var supInfo = null;
        var subInfo = null;

        for (var i = 0; i < str.length - 3; i++) {
            var tag = str.substr(i, 4);

            if (tag == "&Sup") {
                supInfo = { start: i };
                subInfo = null;
                str = removeSubstring(str, i, 4);
            } else if (tag == "&Sub") {
                supInfo = null;
                subInfo = { start: i };
                str = removeSubstring(str, i, 4);
            } else if (tag == "&End") {
                if (supInfo != null) {
                    supInfo.end = i - 1;
                    supInfos.push(supInfo);
                } else if (subInfo != null) {
                    subInfo.end = i - 1;
                    subInfos.push(subInfo);
                }
                supInfo = null;
                subInfo = null;
                str = removeSubstring(str, i, 4);
                i = i - 1;
            }
        }

        return {
            str: str,
            supInfos: supInfos,
            subInfos: subInfos
        };
    };

    /**
     * 移除子字符串
     * @param {string} str - 原字符串
     * @param {number} position - 起始位置
     * @param {number} length - 长度
     * @returns {string} 处理后的字符串
     */
    var removeSubstring = function (str, position, length) {
        if (position == 0) {
            str = str.substr(length);
        } else if (position + length == str.length) {
            str = str.substr(0, position);
        } else {
            str = str.substr(0, position) + str.substr(position + length);
        }
        return str;
    };

    /**
     * 绘制文本
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     * @param {string} text - 文本内容
     * @param {Object} font - 字体配置
     * @param {string} halign - 水平对齐方式
     * @param {string} valign - 垂直对齐方式
     * @param {Object} rect - 矩形区域
     * @param {number} lineSpace - 行间距
     */
    var draw = function (ctx, text, font, halign, valign, rect, lineSpace) {
        var drawFont = Utils.getDrawFont(font);
        ctx.font = drawFont;

        if (typeof lineSpace == undefined || isNaN(lineSpace)) {
            lineSpace = 4;
        } else {
            lineSpace += 4;
        }

        var textSize = {
            Height: font.fontSize
        };

        rect.y = rect.y + 2;
        rect.Y = rect.Y + 2;
        rect.height = rect.height - 4;
        rect.Height = rect.Height - 4;

        var strList = text.split("\r\n");
        var supSubInfo = GetSupSubInfoList(text.replace(/\r\n/g, ""));
        var supInfos = supSubInfo.supInfos;
        var subInfos = supSubInfo.subInfos;

        for (var i = 0; i < strList.length; i++) {
            strList[i] = strList[i].replace(/(&Sup|&Sub|&End)/g, "");
        }

        var strListOriginal = Comman.DeepCopyObj(strList);
        var adjustResult = AdjustStrAr(ctx, strList, rect, font, lineSpace);

        while (adjustResult.isNeedAdjustFontSize) {
            drawFont = Utils.getDrawFont(font);
            ctx.font = drawFont;
            strList = Comman.DeepCopyObj(strListOriginal);
            adjustResult = AdjustStrAr(ctx, strList, rect, font, lineSpace);
        }

        strList = adjustResult.strList;

        var paddingLeft = 2;
        var paddingTop = 0;
        var index = 0;

        ctx.save();
        ctx.lineWidth = 0;
        ctx.beginPath();
        ctx.moveTo(rect.x, rect.y);
        ctx.lineTo(rect.x + rect.width, rect.y);
        ctx.lineTo(rect.x + rect.width, rect.y + rect.height);
        ctx.lineTo(rect.x, rect.y + rect.height);
        ctx.lineTo(rect.x, rect.y);
        ctx.closePath();
        ctx.clip();

        var y = GetY(rect, valign, strList.Count(), textSize, lineSpace) + textSize.Height;

        for (var i = 0; i < strList.Count(); i++) {
            var line = strList[i];
            var supSubFont = Utils.getDrawFont({
                fontFamily: font.fontFamily,
                fontStyle: font.fontStyle,
                fontSize: font.fontSize * 0.7,
                fontWeight: font.fontWeight
            });

            DrawTextLine(ctx, line, supInfos, subInfos, index, drawFont,
                rect, paddingLeft, paddingTop, halign, y, supSubFont, font.color, font.textDecoration);

            y += textSize.Height + lineSpace;
            index += line.length;
        }

        ctx.restore();
    };

    var DrawTextLine = function (ctx, line, supInfos, subInfos, index, font,
        t, padingLeft, paddingTop, halign, y, supSubFont, color, textDecoration) {
        var L;
        if (supInfos.length > 0 || subInfos.length > 0) {
            L = GetStrList(line, supInfos, subInfos, index);
        } else {
            L = [{
                textType: 0,
                text: line
            }];
        }
        DrawTextHaveSupSubsFromLeftToRight(
            ctx, L, t, font, supSubFont,
            padingLeft, paddingTop, y, halign, line, color, textDecoration
        );
    }

    var DrawTextHaveSupSubsFromLeftToRight = function (ctx, L, t, font, supSubFont,
        padingLeft, paddingTop, y, halign, line, color, textDecoration) {
        var x = 0;
        ctx.font = font;
        if (halign == "center") {
            var t1 = ctx.measureText(line);
            x = t.x + (t.width - t1.width) / 2;
        } else if (halign == "right") {
            var t1 = ctx.measureText(line);
            x = t.x + t.width - t1.width - padingLeft;
        } else {
            x = t.x + padingLeft;
        }
        for (var k = 0; k < L.Count(); k++) {
            ctx.font = font;
            var width = ctx.measureText(L[k].text).width;
            if (L[k].textType == 1) {
                ctx.font = supSubFont;
                if (color) {
                    ctx.fillStyle = color;
                }
                ctx.fillText(L[k].text, x, y + paddingTop - 3);
            } else if (L[k].textType == 2) {
                ctx.font = supSubFont;
                if (color) {
                    ctx.fillStyle = color;
                }
                ctx.fillText(L[k].text, x, y + paddingTop + 3);
            } else {
                ctx.font = font;
                if (color) {
                    ctx.fillStyle = color;
                }
                ctx.fillText(L[k].text, x, y + paddingTop);
            }
            x += width;
        }
    }

    /**
     * 计算Y坐标
     * @param {Object} rect - 矩形区域
     * @param {string} valign - 垂直对齐方式
     * @param {number} lineCount - 行数
     * @param {Object} textSize - 文本尺寸
     * @param {number} lineSpace - 行间距
     * @returns {number} Y坐标
     */
    var GetY = function (rect, valign, lineCount, textSize, lineSpace) {
        var padding = 2;

        if (valign == "top") {
            return rect.Y + padding;
        }

        if (valign == "middle" || valign == "center") {
            var remainingHeight = rect.Height - textSize.Height * lineCount - lineSpace * (lineCount - 1);
            if (remainingHeight > 0) {
                return ((remainingHeight / 2) + rect.Y);
            } else {
                return rect.Y - padding;
            }
        } else {
            var remainingHeight = rect.Height - textSize.Height * lineCount - lineSpace * (lineCount - 1);
            if (remainingHeight > 0) {
                return remainingHeight + rect.Y - padding;
            } else {
                return rect.Y - padding;
            }
        }
    };

    return {
        draw: draw
    };
}

/**
 * 文本绘制实例
 * @type {MyDrawText}
 */
let myDrawText = new MyDrawText();
