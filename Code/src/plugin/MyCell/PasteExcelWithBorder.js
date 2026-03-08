'use strict';

/**
 * @fileoverview 粘贴Excel带边框模块，处理从Excel粘贴数据并保留格式
 * @module PasteExcelWithBorder
 */

/**
 * 粘贴Excel带边框类
 * @class
 * @param {Object} config - 配置对象
 * @param {string} config.excelData - Excel粘贴的HTML数据
 */
function PasteExcelWithBorder(config) {
    var excelData = config.excelData;

    function doJob() {
        var styleStr = GetStyleStr();
        var tableStr = GetTableStr();
        var t = styleStr + tableStr;
        var div = document.createElement("DIV");
        div.setAttribute("style", "width:0px;height:0px;border:0px;");
        div.innerHTML = t;
        document.body.appendChild(div);
        var table = div.getElementsByTagName("table")[0];
        var trAr = table.getElementsByTagName("tr");
        var LAll = getLAll(trAr);
        for (var i = 0; i < trAr.length; i++) {
            var tdAr = trAr[i].getElementsByTagName("td");
            for (var k = 0; k < tdAr.length; k++) {
                var t1 = tdAr[k];
                var str = t1.innerText;
                var style = getComputedStyle(t1, null);
                var colSpan = parseInt(t1.getAttribute("colspan") ? t1.getAttribute("colspan") : "1");
                var rowSpan = parseInt(t1.getAttribute("rowspan") ? t1.getAttribute("rowspan") : "1");
                var width = parseFloat(style.width.replace("px", ""));
                var height = parseFloat(style.height.replace("px", ""));
                var isInMergeArea = colSpan > 1 || rowSpan > 1;
                var mergeAreaId = "";
                if (isInMergeArea) {
                    mergeAreaId = Comman.newGuid();
                }
                if (isInMergeArea) {
                    for (var n = 0; n < colSpan; n++) {
                        var rowIndex = i;
                        var colIndex = findColIndexNoSet(LAll, rowIndex);
                        if (colIndex == -1) {
                            break;
                        }
                        for (var m = 0; m < rowSpan; m++) {
                            if (n > 0) {
                                width = "noValue";
                            }
                            if (m > 0) {
                                height = "noValue";
                            }
                            var o = LAll[rowIndex][colIndex];
                            setOneCell(o, width, height, str, style, isInMergeArea, mergeAreaId);
                            rowIndex++;
                        }
                    }
                }
                else {
                    var rowIndex = i;
                    var colIndex = findColIndexNoSet(LAll, rowIndex);
                    var o = LAll[rowIndex][colIndex];
                    setOneCell(o, width, height, str, style, isInMergeArea, mergeAreaId);
                }
            }
        }
        document.body.removeChild(div);
        var colWidths = getColWidths(LAll);
        var rowHeights = getRowHeights(LAll);
        var mergeAreaList = getMergeAreaList(LAll);
        removeWidthHeightProperty(LAll);
        return {
            cellProps: LAll,
            colWidths: colWidths,
            rowHeights: rowHeights,
            mergeAreaList: mergeAreaList
        };
    }

    function getMergeAreaList(LAll) {
        var L = [];
        var rowCount = LAll.length;
        var colCount = LAll[0].length;
        for (var row = 0; row < rowCount; row++) {
            for (var col = 0; col < colCount; col++) {
                var o = LAll[row][col];
                if (o.isInMergeArea) {
                    var o2 = L.Find(function (p) { return p.id == o.mergeAreaId; });
                    if (!o2) {
                        var o1 = new CellMergeArea({});
                        o1.id = o.mergeAreaId;
                        o1.startCol = col;
                        o1.startRow = row;
                        o1.endCol = col;
                        o1.endRow = row;
                        o1.isDrawed = false;
                        L.push(o1);
                    }
                    else {
                        o2.endCol = col;
                        o2.endRow = row;
                    }
                }
            }
        }
        for (var i = L.length - 1; i >= 0; i--) {
            var o = L[i];
            if (o.startCol == o.endCol && o.startRow == o.endRow) {
                var t = LAll[o.startRow][o.startCol];
                t.isInMergeArea = false;
                t.mergeAreaId = "";
                L.splice(i, 1);
            }
        }
        return L;
    }

    function removeWidthHeightProperty(LAll) {
        var rowCount = LAll.length;
        var colCount = LAll[0].length;
        for (var row = 0; row < rowCount; row++) {
            for (var col = 0; col < colCount; col++) {
                var o = LAll[row][col];
                delete o["width"];
                delete o["height"];
            }
        }
    }

    function getRowHeights(LAll) {
        var rowCount = LAll.length;
        var colCount = LAll[0].length;
        var L = [];
        for (var row = 0; row < rowCount; row++) {
            var isAllNoHeight = true;
            for (var col = 0; col < colCount; col++) {
                var o = LAll[row][col];
                if (o.height != "noValue") {
                    isAllNoHeight = false;
                    break;
                }
            }
            if (isAllNoHeight) {
                L.push(row);
            }
        }
        if (L.length > 0) {
            for (var i = L.length - 1; i >= 0; i--) {
                LAll.splice(L[i], 1);
            }
        }
        rowCount = LAll.length;
        colCount = LAll[0].length;
        var rowHeights = [];
        for (var row = 0; row < rowCount; row++) {
            rowHeights.push(getRowHeight(row, LAll));
        }
        return rowHeights;
    }

    function getRowHeight(row, LAll) {
        var colCount = LAll[0].length;
        for (var col = 0; col < colCount; col++) {
            var t = LAll[row][col].height;
            if (t != "noValue") {
                return t;
            }
        }
        return "";
    }

    function getColWidths(LAll) {
        var rowCount = LAll.length;
        var colCount = LAll[0].length;
        var L = [];
        for (var col = 0; col < colCount; col++) {
            var isAllNoWidth = true;
            for (var row = 0; row < rowCount; row++) {
                var o = LAll[row][col];
                if (o.width != "noValue") {
                    isAllNoWidth = false;
                    break;
                }
            }
            if (isAllNoWidth) {
                L.push(col);
            }
        }

        if (L.length > 0) {
            for (var row = 0; row < rowCount; row++) {
                for (var i = L.length - 1; i >= 0; i--) {
                    LAll[row].splice(L[i], 1);
                }
            }
        }

        rowCount = LAll.length;
        colCount = LAll[0].length;
        var colWidths = [];
        for (var col = 0; col < colCount; col++) {
            colWidths.push(getColWidth(col, LAll));
        }
        return colWidths;
    }

    function getColWidth(col, LAll) {
        var rowCount = LAll.length;
        for (var row = 0; row < rowCount; row++) {
            var t = LAll[row][col].width;
            if (t != "noValue") {
                return t;
            }
        }
        return "";
    }

    function findColIndexNoSet(LAll, rowIndex) {
        var tAr = LAll[rowIndex];
        for (var i = 0; i < tAr.length; i++) {
            if (tAr[i].chartData == 1) {
                return i;
            }
        }
        return -1;
    }

    function GetStyleStr() {
        var pos1 = excelData.indexOf("<style>");
        var pos2 = excelData.indexOf("</style>") + "</style>".length;
        return excelData.substr(pos1, pos2 - pos1 + 1);
    }

    function GetTableStr() {
        var pos1 = excelData.indexOf("<table ");
        var pos2 = excelData.indexOf("</table>") + "</table>".length;
        return excelData.substr(pos1, pos2 - pos1 + 1);
    }

    function getLAll(trAr) {
        var maxColCount = 0;
        var maxRowCount = 0;
        var tObj = {};
        for (var i = 0; i < trAr.length; i++) {
            var tdAr = trAr[i].getElementsByTagName("td");
            var t1 = 0;
            for (var k = 0; k < tdAr.length; k++) {
                var colSpan = parseInt(tdAr[k].getAttribute("colspan") ? tdAr[k].getAttribute("colspan") : "1");
                var rowSpan = parseInt(tdAr[k].getAttribute("rowspan") ? tdAr[k].getAttribute("rowspan") : "1");
                t1 += colSpan;
                if (!tObj[k]) {
                    tObj[k] = 0;
                }
                tObj[k] += rowSpan;
            }
            if (t1 > maxColCount) {
                maxColCount = t1;
            }
        }
        var t2 = 0;
        for (var p in tObj) {
            if (!tObj.hasOwnProperty(p)) {
                continue;
            }
            if (tObj[p] > t2) {
                t2 = tObj[p];
            }
        }
        maxRowCount = t2;
        var LAll = [];
        for (var i = 0; i < maxRowCount; i++) {
            var L = [];
            for (var k = 0; k < maxColCount; k++) {
                L.push(new CellProp({ chartData: 1 }));
            }
            LAll.push(L);
        }
        return LAll;
    }

    function setOneCell(o, width, height, str, style, isInMergeArea, mergeAreaId) {
        if(readOnlyText){
            return;
        }
        o.borderLeft = getBorderLeft(style);
        o.borderRight = getBorderRight(style);
        o.borderTop = getBorderTop(style);
        o.borderBottom = getBorderBottom(style);
        o.cellHAlign = getCellHAlign(style.textAlign);
        o.cellVAlign = getCellVAlign(style.verticalAlign);
        o.fontColor = getFontColor(style.color);
        o.fontFamily = style.fontFamily;
        o.fontSize = parseFloat(style.fontSize.replace("px", ""));
        o.fontStyle = getFontStyle(style.fontStyle, style.fontWeight);
        o.isInMergeArea = isInMergeArea;
        o.mergeAreaId = mergeAreaId;
        o.str = str;
        o.chartData = "";
        o.width = width;
        o.height = height;
    }

    function getFontStyle(t1, t2) {
        if (t1 == "normal") {
            if (t2 == "bold") {
                return 2;
            }
            return 0;
        }
        if (t1 == "italic") {
            if (t2 == "bold") {
                return 2 + 4;
            }
            return 4;
        }
        return 0;
    }

    function getFontColor(color) {
        return 0;
    }

    function getCellVAlign(align) {
        if (align == "top") {
            return 8;
        }
        if (align == "bottom") {
            return 16;
        }
        if (align == "middle") {
            return 32;
        }
        return 32;
    }

    function getCellHAlign(align) {
        if (align == "left") {
            return 1;
        }
        if (align == "right") {
            return 2;
        }
        if (align == "center") {
            return 4;
        }
        if (align == "justify") {
            return 4;
        }
        return 1;
    }

    function getBorderLeft(style) {
        var t1 = style.borderLeftStyle;
        var t2 = style.borderLeftWidth;
        return getBorder(t1, t2);
    }

    function getBorderRight(style) {
        var t1 = style.borderRightStyle;
        var t2 = style.borderRightWidth;
        return getBorder(t1, t2);
    }

    function getBorderTop(style) {
        var t1 = style.borderTopStyle;
        var t2 = style.borderTopWidth;
        return getBorder(t1, t2);
    }

    function getBorderBottom(style) {
        var t1 = style.borderBottomStyle;
        var t2 = style.borderBottomWidth;
        return getBorder(t1, t2);
    }

    function getBorder(t1, t2) {
        if (t1 == "none" || t1 == "hidden") {
            return 0;
        }
        if (t1 == "dotted") {
            return 6;
        }
        if (t1 == "dashed") {
            return 5;
        }
        if (t1 == "solid") {
            return 2;
        }
        return 0;
    }

    return {
        doJob: doJob
    };
}