/**
 * 通用工具类
 * 提供颜色转换、公式处理、单元格操作等通用功能
 */
"use strict";

var Comman = {};

/**
 * 拆分公式字符串为公式部件数组
 * @param {string} formula - 公式字符串
 * @returns {Array<FormulaPart>} 公式部件数组
 */
Comman.SplitFormula = function (formula) {
  var result = [];
  var operandBuffer = [];
  for (var i = 0; i < formula.length; i++) {
    var char = formula[i];
    var isOperator =
      char == "+" ||
      char == "-" ||
      char == "*" ||
      char == "/" ||
      char == "×" ||
      char == "÷" ||
      char == "=" ||
      char == "∫" ||
      char == "∑" ||
      char == "√" ||
      char == "±" ||
      char == "^";
    var isDelimiter =
      char == "(" ||
      char == ")" ||
      char == "（" ||
      char == "）" ||
      char == "[" ||
      char == "]" ||
      char == "{" ||
      char == "}";

    if (isOperator) {
      result.Add(
        new FormulaPart(operandBuffer.join(""), FormulaPartType.操作数),
      );
      operandBuffer.Clear();
      result.Add(new FormulaPart(char, FormulaPartType.运算符));
    } else if (isDelimiter) {
      result.Add(
        new FormulaPart(operandBuffer.join(""), FormulaPartType.操作数),
      );
      operandBuffer.Clear();
      result.Add(new FormulaPart(char, FormulaPartType.分隔符));
    } else {
      operandBuffer.Add(char);
    }
  }
  if (operandBuffer.Count() > 0) {
    result.Add(new FormulaPart(operandBuffer.join(""), FormulaPartType.操作数));
  }
  return result;
};

/**
 * 调整图像亮度
 * @param {CanvasRenderingContext2D} ctx - 画布上下文
 * @param {HTMLCanvasElement} canvas - 画布元素
 * @param {number} brightnessFactor - 亮度因子（>1变亮，<1变暗）
 * @returns {ImageData} 调整后的图像数据
 */
Comman.getBrightnessImageData = function (ctx, canvas, brightnessFactor) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * brightnessFactor);
    data[i + 1] = Math.min(255, data[i + 1] * brightnessFactor);
    data[i + 2] = Math.min(255, data[i + 2] * brightnessFactor);
  }

  return imageData;
};

/**
 * 将整数颜色值转换为十六进制颜色字符串
 * @param {number} color - 整数颜色值
 * @returns {string} 十六进制颜色字符串（如 #RRGGBB）
 */
Comman.ToXColor = function (color) {
  const alpha = (color >> 24) & 0xff;
  const red = (color >> 16) & 0xff;
  const green = (color >> 8) & 0xff;
  const blue = color & 0xff;
  return (
    "#" +
    Comman.PadZero(blue.toString(16)) +
    Comman.PadZero(green.toString(16)) +
    Comman.PadZero(red.toString(16))
  );
};

/**
 * 将整数颜色值转换为十六进制颜色字符串
 * @param {number} intColor - 整数颜色值
 * @returns {string} 十六进制颜色字符串
 */
function intToHexColor(intColor) {
  if (intColor < 0) {
    intColor = 0;
  }
  if (intColor < 0 || intColor > 0xffffff) {
    throw new Error("Invalid color integer");
  }
  const hex = intColor.toString(16).padStart(6, "0");
  return `#${hex}`;
}

/**
 * 将RGB分量转换为整数颜色值
 * @param {number} blue - 蓝色分量
 * @param {number} green - 绿色分量
 * @param {number} red - 红色分量
 * @returns {number} 整数颜色值
 */
Comman.ToIntColor = function (blue, green, red) {
  return (red << 16) | (green << 8) | blue;
};

/**
 * 将HTML颜色字符串转换为整数颜色值
 * @param {string} htmlColor - HTML颜色字符串（如 #RRGGBB 或 #RRGGBBAA）
 * @returns {number} 整数颜色值
 */
Comman.htmlColorToInt = function (htmlColor) {
  let isRGBA = htmlColor.length === 9;
  let red = parseInt(htmlColor.slice(1, 3), 16);
  let green = parseInt(htmlColor.slice(3, 5), 16);
  let blue = parseInt(htmlColor.slice(5, 7), 16);
  let alpha = isRGBA ? parseInt(htmlColor.slice(9), 16) / 255 : 1;

  let intColor = (red << 24) | (green << 16) | (blue << 8) | (alpha * 255);
  return intColor;
};

/**
 * 字符串补零
 * @param {string} str - 原字符串
 * @returns {string} 补零后的字符串
 */
Comman.PadZero = function (str) {
  if (str.length == 1) {
    return "0" + str;
  }
  return str;
};

/**
 * 毫米转换为像素
 * @param {number} mmValue - 毫米值（乘以10后的值）
 * @returns {number} 像素值
 */
Comman.mmmToPixels2 = function (mmValue) {
  return 72 * (1 / 25.4) * (mmValue / 10.0);
};

/**
 * 像素转换为毫米（乘以10后的值）
 * @param {number} pixelValue - 像素值
 * @returns {number} 毫米值（乘以10后的值）
 */
Comman.pixelsToMmm = function (pixelValue) {
  return Math.round((pixelValue * 10) / (72 * (1 / 25.4)));
};

/**
 * 像素转换为毫米
 * @param {number} pixelValue - 像素值
 * @returns {number} 毫米值
 */
Comman.pixelsToMM = function (pixelValue) {
  return Math.round(pixelValue / (72 * (1 / 25.4)));
};

/**
 * 检查值是否为数字
 * @param {*} value - 要检查的值
 * @returns {boolean} 是否为数字
 */
Comman.IsNumber = function (value) {
  return !isNaN(value);
};

/**
 * 获取单元格字体配置
 * @param {Object} cellProp - 单元格属性对象
 * @returns {Object} 字体配置对象
 */
Comman.GetCellFont = function (cellProp) {
  var fontStyle = this.GetFontStyle(cellProp.fontStyle);
  var font = {
    fontStyle: fontStyle.fontStyle,
    fontWeight: fontStyle.fontWeight,
    fontSize: cellProp.fontSize,
    fontFamily: cellProp.fontFamily,
    textDecoration: fontStyle.textDecoration,
    color: Comman.ToXColor(cellProp.fontColor),
  };
  return font;
};

/**
 * 根据字体样式代码获取字体样式对象
 * @param {number} fontStyleCode - 字体样式代码
 * @returns {Object} 字体样式对象
 */
Comman.GetFontStyle = function (fontStyleCode) {
  if (fontStyleCode == 0) {
    return { fontStyle: "normal", fontWeight: "normal" };
  }
  if (fontStyleCode == 2) {
    return { fontStyle: "normal", fontWeight: "bold" };
  }
  if (fontStyleCode == 4) {
    return { fontStyle: "Italic", fontWeight: "normal" };
  }
  if (fontStyleCode == 8) {
    return {
      fontStyle: "normal",
      fontWeight: "normal",
      textDecoration: "underline",
    };
  }
  if (fontStyleCode == 16) {
    return {
      fontStyle: "normal",
      fontWeight: "normal",
      textDecoration: "linethrough",
    };
  }
  if (fontStyleCode == 2 + 4) {
    return { fontStyle: "Italic", fontWeight: "bold" };
  }
  return { fontStyle: "normal", fontWeight: "normal" };
};

/**
 * 获取文本对齐方式
 * @param {number} halign - 水平对齐代码
 * @param {number} valign - 垂直对齐代码
 * @returns {Object} 包含halign和valign的对象
 */
Comman.GetTextAlign = function (halign, valign) {
  return {
    halign: this.getHAlignText(halign),
    valign: this.getVAlignText(valign),
  };
};

/**
 * 获取垂直对齐文本描述
 * @param {number} valign - 垂直对齐代码
 * @returns {string} 垂直对齐文本描述
 */
Comman.getVAlignText = function (valign) {
  if (valign == -1) {
    return "bottom";
  }
  if (valign == 8) {
    return "top";
  }
  if (valign == 16) {
    return "bottom";
  }
  if (valign == 32) {
    return "middle";
  }
  return "bottom";
};

/**
 * 获取水平对齐文本描述
 * @param {number} halign - 水平对齐代码
 * @returns {string} 水平对齐文本描述
 */
Comman.getHAlignText = function (halign) {
  if (halign == -1) {
    return "left";
  }
  if (halign == 1) {
    return "left";
  }
  if (halign == 2) {
    return "right";
  }
  if (halign == 4) {
    return "center";
  }
  return "left";
};

/**
 * 格式化单元格字符串
 * @param {Object} cellProp - 单元格属性对象
 * @returns {string} 格式化后的字符串
 */
Comman.formatCellStr = function (cellProp) {
  if (!Comman.isNumberCell(cellProp)) {
    return cellProp.str;
  }
  if (
    cellProp.rawValue === "" ||
    cellProp.rawValue === null ||
    cellProp.rawValue === undefined
  ) {
    return cellProp.str;
  }
  if (isNaN(cellProp.rawValue)) {
    return cellProp.str;
  }
  if (cellProp.numType == 1) {
    return Comman.formatNumer(Number(cellProp.rawValue), cellProp.amendObj);
  } else if (cellProp.numType == 5) {
    var percentValue = Number(cellProp.rawValue) * 100;
    var formattedValue = Comman.formatNumer(percentValue, cellProp.amendObj);
    return formattedValue + "%";
  }
  return cellProp.str;
};

/**
 * 检查单元格是否为数字类型
 * @param {Object} cellProp - 单元格属性对象
 * @returns {boolean} 是否为数字类型
 */
Comman.isNumberCell = function (cellProp) {
  if (!cellProp.amendObj) {
    return false;
  }
  if (cellProp.numType == 1 || cellProp.numType == 5) {
    return true;
  }
  return false;
};

/**
 * Amend对象实例（用于数字格式化）
 * @type {Amend|null}
 */
let AmendInstance = null;

/**
 * 格式化数字
 * @param {number} value - 数字值
 * @param {Object} amendObj - 修正对象
 * @returns {string} 格式化后的字符串
 */
Comman.formatNumer = function (value, amendObj) {
  if (!AmendInstance) {
    AmendInstance = new Amend();
  }
  var formattedValue = AmendInstance.gf_amel_all(
    value,
    amendObj.amendType,
    amendObj.presion,
    amendObj.displayValue,
    amendObj.fixnum,
  );
  var result = AmendInstance.setFormat(formattedValue, amendObj);
  return result.toString();
};

/**
 * 根据ID获取合并区域
 * @param {Object} cellSheet - 单元格工作表
 * @param {string} mergeAreaId - 合并区域ID
 * @returns {Object|null} 合并区域对象或null
 */
Comman.getMergeAreaById = function (cellSheet, mergeAreaId) {
  for (var i = 0; i < cellSheet.cellMergeAreaList.length; i++) {
    var mergeArea = cellSheet.cellMergeAreaList[i];
    if (mergeArea.id == mergeAreaId) {
      return mergeArea;
    }
  }
  return null;
};

/**
 * 根据行号获取合并区域列表
 * @param {Object} cellSheet - 单元格工作表
 * @param {number} row - 行号
 * @returns {Array} 合并区域列表
 */
Comman.getMergeAreaListByRow = function (cellSheet, row) {
  var result = [];
  for (var i = 0; i < cellSheet.cellMergeAreaList.length; i++) {
    var mergeArea = cellSheet.cellMergeAreaList[i];
    if (mergeArea.startRow == row) {
      result.push(mergeArea);
    }
  }
  return result;
};

/**
 * 获取判断行高度
 * @param {Object} cellSheet - 单元格工作表
 * @param {number} row - 行号
 * @returns {Object} 包含rowSpan和height的对象
 */
Comman.getJudageRowHeight = function (cellSheet, row) {
  var nextRow = row + 1;
  var mergeAreaList = Comman.getMergeAreaListByRow(cellSheet, nextRow);
  if (mergeAreaList.Count() > 0) {
    var minStartRow = 14564562258;
    var maxEndRow = 0;
    for (var i = 0; i < mergeAreaList.Count(); i++) {
      var mergeArea = mergeAreaList[i];
      if (mergeArea.startRow - 1 < minStartRow) {
        minStartRow = mergeArea.startRow - 1;
      }
      if (mergeArea.endRow - 1 > maxEndRow) {
        maxEndRow = mergeArea.endRow - 1;
      }
    }
    var totalHeight = 0;
    for (var i = minStartRow; i <= maxEndRow; i++) {
      totalHeight += cellSheet.rowHeightList[i];
    }
    var rowSpan = maxEndRow - minStartRow + 1;
    return {
      rowSpan: rowSpan,
      height: totalHeight,
    };
  } else {
    return {
      rowSpan: 1,
      height: cellSheet.rowHeightList[row],
    };
  }
};

/**
 * 根据索引获取单元格图像
 * @param {Object} cellSheet - 单元格工作表
 * @param {number} index - 图像索引
 * @returns {Object|null} 单元格图像对象或null
 */
Comman.getCellImageByIndex = function (cellSheet, index) {
  for (var i = 0; i < cellSheet.cellImageList.length; i++) {
    var cellImage = cellSheet.cellImageList[i];
    if (cellImage.imageIndex == index) {
      return cellImage;
    }
  }
  return null;
};

/**
 * 根据索引获取浮动图像
 * @param {Object} cellSheet - 单元格工作表
 * @param {number} index - 图像索引
 * @returns {Object|null} 浮动图像对象或null
 */
Comman.getFloatImageByIndex = function (cellSheet, index) {
  for (var i = 0; i < cellSheet.floatImageList.length; i++) {
    var floatImage = cellSheet.floatImageList[i];
    if (floatImage.index == index) {
      return floatImage;
    }
  }
  return null;
};

/**
 * 生成新的GUID
 * @returns {string} 新的GUID字符串
 */
Comman.newGuid = function () {
  var guid = "";
  for (var i = 1; i <= 32; i++) {
    var hexDigit = Math.floor(Math.random() * 16.0).toString(16);
    guid += hexDigit;
    if (i == 8 || i == 12 || i == 16 || i == 20) {
      guid += "-";
    }
  }
  return guid;
};

/**
 * 获取颜色值
 * @param {string} xColor - 颜色值
 * @returns {string} 颜色值
 */
Comman.GetColor = function (xColor) {
  return xColor;
};

/**
 * 获取文本框ID
 * @param {number} rangeStartCol - 起始列
 * @param {number} rangeStartRow - 起始行
 * @param {number} rangeEndCol - 结束列
 * @param {number} rangeEndRow - 结束行
 * @returns {string} 文本框ID
 */
Comman.getTextBoxId = function (
  rangeStartCol,
  rangeStartRow,
  rangeEndCol,
  rangeEndRow,
) {
  return (
    "textbox_" +
    rangeStartCol +
    "_" +
    rangeStartRow +
    "_" +
    rangeEndCol +
    "_" +
    rangeEndRow
  );
};

/**
 * 根据单元格名称获取行列对象
 * @param {string} cellName - 单元格名称（如 A1, B2）
 * @returns {ColRow} 行列对象
 */
Comman.GetColRow = function (cellName) {
  cellName = cellName.ToUpper();
  var match = Regex.Match(cellName, /^([A-Z]{1,3})(\d{1,5})$/);
  if (match.Success) {
    var col = NumberFormat.StringToNumber26(match.Groups[1]) - 1;
    var row = Convert.ToInt32(match.Groups[2]) - 1;
    return new ColRow({
      col: col,
      row: row,
    });
  }
  throw "单元格名字非预定格式!";
};

/**
 * 根据单元格名称获取行列对象（1-based）
 * @param {string} cellName - 单元格名称
 * @returns {ColRow} 行列对象
 */
Comman.GetColRow2 = function (cellName) {
  cellName = cellName.ToUpper();
  var match = Regex.Match(cellName, /^([A-Z]{1,3})(\d{1,5})$/);
  if (match.Success) {
    var col = NumberFormat.StringToNumber26(match.Groups[1]);
    var row = Convert.ToInt32(match.Groups[2]);
    return new ColRow({
      col: col,
      row: row,
    });
  }
  throw "单元格名字非预定格式!";
};

/**
 * 获取行列字符串表示
 * @param {ColRow} colRow - 行列对象
 * @returns {string} 行列字符串（如 A1）
 */
Comman.GetColRowStr = function (colRow) {
  return Comman.GetColStr(colRow.col) + Comman.GetRowStr(colRow.row);
};

/**
 * 获取行字符串
 * @param {number} row - 行号
 * @returns {string} 行字符串
 */
Comman.GetRowStr = function (row) {
  return row.toString();
};

/**
 * 获取列字符串
 * @param {number} col - 列号
 * @returns {string} 列字符串（如 A, B, AA）
 */
Comman.GetColStr = function (col) {
  return NumberFormat.NumberToString26(col).toString();
};

/**
 * 根据字符串获取单元格范围
 * @param {string} rangeStr - 范围字符串（如 A1:B2）
 * @returns {CellRange} 单元格范围对象
 */
Comman.GetCellRange = function (rangeStr) {
  var parts = rangeStr.split(":");
  var startColRow = Comman.GetColRow(parts[0]);
  var endColRow = Comman.GetColRow(parts[1]);
  return new CellRange({
    startCol: startColRow.col,
    startRow: startColRow.row,
    endCol: endColRow.col,
    endRow: endColRow.row,
  });
};

/**
 * 根据对齐代码获取单元格对齐方式
 * @param {number} align - 对齐代码
 * @returns {Object} 包含cellHAlign和cellVAlign的对象
 */
Comman.GetCellAlign = function (align) {
  var cellHAlign = 1;
  var cellVAlign = 8;
  var alignMap = {
    1: { cellHAlign: 1, cellVAlign: 8 },
    2: { cellHAlign: 2, cellVAlign: 8 },
    4: { cellHAlign: 4, cellVAlign: 8 },
    8: { cellHAlign: 1, cellVAlign: 8 },
    16: { cellHAlign: 1, cellVAlign: 16 },
    32: { cellHAlign: 1, cellVAlign: 32 },
    9: { cellHAlign: 1, cellVAlign: 8 },
    17: { cellHAlign: 1, cellVAlign: 16 },
    33: { cellHAlign: 1, cellVAlign: 32 },
    10: { cellHAlign: 2, cellVAlign: 8 },
    18: { cellHAlign: 2, cellVAlign: 16 },
    34: { cellHAlign: 2, cellVAlign: 32 },
    12: { cellHAlign: 4, cellVAlign: 8 },
    20: { cellHAlign: 4, cellVAlign: 16 },
    36: { cellHAlign: 4, cellVAlign: 32 },
  };
  if (alignMap[align]) {
    return alignMap[align];
  }
  return { cellHAlign: cellHAlign, cellVAlign: cellVAlign };
};

/**
 * 获取表头高度
 * @param {Object} cellSheet - 单元格工作表
 * @returns {number} 表头高度
 */
Comman.GetHeadHeight = function (cellSheet) {
  var startRow = cellSheet.topTitleStartRow;
  var endRow = cellSheet.topTitleEndRow;
  if (startRow < 1 || endRow < 1) {
    return 0;
  }
  var totalHeight = 0;
  for (var row = startRow - 1; row <= endRow - 1; row++) {
    totalHeight += cellSheet.rowHeightList[row];
  }
  return totalHeight;
};

/**
 * 获取表尾高度
 * @param {Object} cellSheet - 单元格工作表
 * @returns {number} 表尾高度
 */
Comman.GetTailHeight = function (cellSheet) {
  var startRow = cellSheet.bottomTitleStartRow;
  var endRow = cellSheet.bottomTitleEndRow;
  if (startRow < 1 || endRow < 1) {
    return 0;
  }
  var totalHeight = 0;
  for (var row = startRow - 1; row <= endRow - 1; row++) {
    totalHeight += cellSheet.rowHeightList[row];
  }
  return totalHeight;
};

/**
 * 获取转换页面信息列表
 * @param {Object} cellSheet - 单元格工作表
 * @param {number} headHeight - 表头高度
 * @param {number} tailHeight - 表尾高度
 * @returns {Array<ConvertPageInfo>} 转换页面信息列表
 */
Comman.GetConvertPageInfoList = function (cellSheet, headHeight, tailHeight) {
  var horizontalList = GetConvertPageInfoList_Horizontal(cellSheet);
  var verticalList = GetConvertPageInfoList_Vertical(
    cellSheet,
    headHeight,
    tailHeight,
  );
  return MergeHorizontalAndVerticalPageInfo(horizontalList, verticalList);
};

/**
 * 合并横纵向的打印页面信息
 * @param {Array} horizontalList - 横向页面信息列表
 * @param {Array} verticalList - 纵向页面信息列表
 * @returns {Array} 合并后的页面信息列表
 */
function MergeHorizontalAndVerticalPageInfo(horizontalList, verticalList) {
  var result = [];
  let pageIndex = 0;
  for (var i = 0; i < verticalList.Count(); i++) {
    var verticalInfo = verticalList[i];
    for (var k = 0; k < horizontalList.Count(); k++) {
      var horizontalInfo = horizontalList[k];
      var pageInfo = new ConvertPageInfo({});
      pageInfo.contentWidth = horizontalInfo.contentWidth;
      pageInfo.startCol = horizontalInfo.startCol;
      pageInfo.endCol = horizontalInfo.endCol;
      pageInfo.contentHeight = verticalInfo.contentHeight;
      pageInfo.startRow = verticalInfo.startRow;
      pageInfo.endRow = verticalInfo.endRow;
      pageInfo.preDrawPageHeight = GetPreDrawPageHeight(verticalList, i);
      pageInfo.preDrawPageWidth = GetPreDrawPageWidth(horizontalList, k);
      pageInfo.pageIndex = pageIndex;
      result.Add(pageInfo);
      pageIndex++;
    }
  }
  return result;
}

/**
 * 获取之前绘制页面的宽度
 * @param {Array} pageInfoList - 页面信息列表
 * @param {number} index - 当前索引
 * @returns {number} 之前绘制页面的总宽度
 */
function GetPreDrawPageWidth(pageInfoList, index) {
  var totalWidth = 0;
  for (var n = 0; n < index; n++) {
    totalWidth += pageInfoList[n].contentWidth;
  }
  return totalWidth;
}

/**
 * 获取之前绘制页面的高度
 * @param {Array} pageInfoList - 页面信息列表
 * @param {number} index - 当前索引
 * @returns {number} 之前绘制页面的总高度
 */
function GetPreDrawPageHeight(pageInfoList, index) {
  var totalHeight = 0;
  for (var n = 0; n < index; n++) {
    totalHeight += pageInfoList[n].contentHeight;
  }
  return totalHeight;
}

/**
 * 获取横向转换页面信息列表
 * @param {Object} cellSheet - 单元格工作表
 * @returns {Array} 横向页面信息列表
 */
function GetConvertPageInfoList_Horizontal(cellSheet) {
  var colWidthList = cellSheet.colWidthList;
  var printInfo = cellSheet.printInfo;
  var colSpan = 0;
  var colWidthAdd = 0;
  var accumulatedWidth = 0;
  var startCol = 0;
  var endCol = 0;
  var contentWidth = Math.floor(printInfo.contentWidth) + 2;
  var result = [];

  for (var col = 0; col < colWidthList.Count(); col++) {
    var isColPageBreak = Comman.IsColPageBreak(cellSheet, col);
    if (colSpan == 0 || (col > 0 && isColPageBreak)) {
      var colInfo = getJudageColWidth(cellSheet, col);
      colWidthAdd = colInfo.colWidthAdd;
      colSpan = colInfo.colSpan;
      accumulatedWidth += colWidthAdd;
      if (
        Math.floor(accumulatedWidth) > contentWidth ||
        (col > 0 && isColPageBreak)
      ) {
        let remainingWidth = 0;
        if (isColPageBreak) {
          endCol = col;
        } else {
          endCol = col + colSpan - 1;
          if (accumulatedWidth - contentWidth > 1) {
            endCol = col - 1;
            remainingWidth = colWidthAdd;
            if (endCol == -1) {
              let tempEndCol = col + colSpan - 1;
              remainingWidth = 0;
              for (let i = tempEndCol; i > 0; i--) {
                accumulatedWidth -= colWidthList[i];
                remainingWidth += colWidthList[i];
                if (accumulatedWidth - contentWidth < 1) {
                  endCol = i - 1;
                  break;
                }
              }
            }
          }
        }
        result.Add(
          new ConvertPageInfo({
            contentWidth: Comman.getColsWidth(colWidthList, startCol, endCol),
            startCol: startCol,
            endCol: endCol,
          }),
        );
        startCol = endCol + 1;
        accumulatedWidth = remainingWidth;
      }
    }
    colSpan--;
  }
  if (endCol < colWidthList.Count() - 1) {
    endCol = colWidthList.Count() - 1;
    result.Add(
      new ConvertPageInfo({
        contentWidth: Comman.getColsWidth(colWidthList, startCol, endCol),
        startCol: startCol,
        endCol: endCol,
      }),
    );
  }
  return result;
}

/**
 * 获取列宽度总和
 * @param {Array} colWidthList - 列宽度列表
 * @param {number} startCol - 起始列
 * @param {number} endCol - 结束列
 * @returns {number} 列宽度总和
 */
Comman.getColsWidth = function (colWidthList, startCol, endCol) {
  var totalWidth = 0;
  for (var i = startCol; i <= endCol; i++) {
    totalWidth += colWidthList[i];
  }
  return totalWidth;
};

/**
 * 检查是否为列分页符
 * @param {Object} cellSheet - 单元格工作表
 * @param {number} col - 列号
 * @returns {boolean} 是否为列分页符
 */
Comman.IsColPageBreak = function (cellSheet, col) {
  return cellSheet.pageHardBreakColList.Contains(col + 1);
};

/**
 * 获取判断列宽度
 * @param {Object} cellSheet - 单元格工作表
 * @param {number} col - 列号
 * @returns {Object} 包含colWidthAdd和colSpan的对象
 */
function getJudageColWidth(cellSheet, col) {
  var col1 = col + 1;
  var mergeAreaList = cellSheet.cellMergeAreaList.FindAll(function (mergeArea) {
    return mergeArea.startCol == col1;
  });
  if (mergeAreaList.Count() > 0) {
    var minStartCol = 9999999;
    var maxEndCol = 0;
    for (var i = 0; i < mergeAreaList.length; i++) {
      var mergeArea = mergeAreaList[i];
      if (mergeArea.startCol - 1 < minStartCol) {
        minStartCol = mergeArea.startCol - 1;
      }
      if (mergeArea.endCol - 1 > maxEndCol) {
        maxEndCol = mergeArea.endCol - 1;
      }
    }
    var totalWidth = 0;
    for (var i = minStartCol; i <= maxEndCol; i++) {
      totalWidth += cellSheet.colWidthList[i];
    }
    var colSpan = maxEndCol - minStartCol + 1;
    return {
      colWidthAdd: totalWidth,
      colSpan: colSpan,
    };
  } else {
    return {
      colWidthAdd: cellSheet.colWidthList[col],
      colSpan: 1,
    };
  }
}

/**
 * 获取纵向转换页面信息列表
 * @param {Object} cellSheet - 单元格工作表
 * @param {number} headHeight - 表头高度
 * @param {number} tailHeight - 表尾高度
 * @returns {Array} 纵向页面信息列表
 */
function GetConvertPageInfoList_Vertical(cellSheet, headHeight, tailHeight) {
  var rowHeightList = cellSheet.rowHeightList;
  var printInfo = cellSheet.printInfo;
  var rowSpan = 0;
  var rowHeightAdd = 0;
  var accumulatedHeight = 0;
  var maxContentHeight =
    Math.floor(printInfo.contentHeight - headHeight - tailHeight) + 2;
  var startStartRow = 0;
  var endEndRow = rowHeightList.Count() - 1;

  if (headHeight > 0) {
    startStartRow = cellSheet.topTitleEndRow + 1 - 1;
  }
  if (tailHeight > 0) {
    endEndRow = cellSheet.bottomTitleStartRow - 1 - 1;
  }
  var startRow = startStartRow;
  var endRow = 0;
  var result = [];

  for (var row = startStartRow; row < endEndRow + 1; row++) {
    var isRowPageBreak = Comman.IsRowPageBreak(cellSheet, row);
    if (rowSpan == 0 || (row > 0 && isRowPageBreak)) {
      var rowInfo = Comman.getJudageRowHeight(cellSheet, row);
      rowHeightAdd = rowInfo.height;
      rowSpan = rowInfo.rowSpan;
      accumulatedHeight += rowHeightAdd;
      if (accumulatedHeight > maxContentHeight || (row > 0 && isRowPageBreak)) {
        let remainingHeight = 0;
        if (isRowPageBreak) {
          endRow = row;
        } else {
          endRow = row + rowSpan - 1;
          if (accumulatedHeight - maxContentHeight > 1) {
            endRow = row - 1;
            remainingHeight = rowHeightAdd;
          }
        }
        result.Add(
          new ConvertPageInfo({
            contentHeight: Comman.getRowsHeight(
              rowHeightList,
              startRow,
              endRow,
            ),
            startRow: startRow,
            endRow: endRow,
          }),
        );
        startRow = endRow + 1;
        accumulatedHeight = remainingHeight;
      }
    }
    rowSpan--;
  }
  if (endRow < endEndRow) {
    endRow = endEndRow;
    result.Add(
      new ConvertPageInfo({
        contentHeight: Comman.getRowsHeight(rowHeightList, startRow, endRow),
        startRow: startRow,
        endRow: endRow,
      }),
    );
  }
  return result;
}

/**
 * 获取行高度总和
 * @param {Array} rowHeightList - 行高度列表
 * @param {number} startRow - 起始行
 * @param {number} endRow - 结束行
 * @returns {number} 行高度总和
 */
Comman.getRowsHeight = function (rowHeightList, startRow, endRow) {
  var totalHeight = 0;
  for (var i = startRow; i <= endRow; i++) {
    totalHeight += rowHeightList[i];
  }
  return totalHeight;
};

/**
 * 检查是否为行分页符
 * @param {Object} cellSheet - 单元格工作表
 * @param {number} row - 行号
 * @returns {boolean} 是否为行分页符
 */
Comman.IsRowPageBreak = function (cellSheet, row) {
  return cellSheet.pageHardBreakRowList.Contains(row + 1);
};

/**
 * 拆分源字符串
 * @param {string} sourceStr - 源字符串
 * @returns {Array<string>} 拆分后的字符串数组
 */
Comman.SplitSource = function (sourceStr) {
  sourceStr = sourceStr.Replace('""', '"' + GlobalV.emptyStrMark + '"');
  var result = [];
  var buffer = "";
  var inQuote = 0;

  for (var i = 0; i < sourceStr.length; i++) {
    if (sourceStr[i] == '"') {
      if (i + 1 < sourceStr.length && sourceStr[i + 1] == '"') {
        i++;
      } else {
        inQuote++;
      }
      buffer += sourceStr[i];
    } else if (inQuote % 2 == 0) {
      if (Regex.IsMatch(sourceStr[i].toString(), /\s/)) {
        if (buffer.Trim() != "") {
          result.Add(buffer.Trim());
          buffer = "";
        }
      } else if (
        (sourceStr[i] == ">" || sourceStr[i] == "<") &&
        sourceStr[i + 1] == "="
      ) {
        if (buffer.Trim() != "") {
          result.Add(buffer.Trim());
          buffer = "";
        }
        result.Add(sourceStr[i] + "=");
        i += 1;
      } else if (sourceStr[i] == "<" && sourceStr[i + 1] == ">") {
        if (buffer.Trim() != "") {
          result.Add(buffer.Trim());
          buffer = "";
        }
        result.Add("<>");
        i += 1;
      } else if (
        sourceStr[i] == "(" ||
        sourceStr[i] == ")" ||
        sourceStr[i] == "," ||
        sourceStr[i] == "=" ||
        sourceStr[i] == ">" ||
        sourceStr[i] == "<" ||
        sourceStr[i] == ";" ||
        sourceStr[i] == "+" ||
        sourceStr[i] == "-" ||
        sourceStr[i] == "*" ||
        sourceStr[i] == "/" ||
        sourceStr[i] == "^" ||
        sourceStr[i] == "%"
      ) {
        if (buffer.Trim() != "") {
          result.Add(buffer.Trim());
          buffer = "";
        }
        result.Add(sourceStr[i].toString());
      } else {
        buffer += sourceStr[i];
      }
    } else {
      buffer += sourceStr[i];
    }
  }
  if (buffer.Trim() != "") {
    result.Add(buffer.Trim());
  }
  for (var i = 0; i < result.Count(); i++) {
    result[i] = result[i].Replace('"' + GlobalV.emptyStrMark + '"', '""');
  }
  return result;
};

/**
 * 处理代码行原始数据
 * @param {Array<string>} codeLineRaw - 代码行原始数据
 * @param {string} sheetName - 工作表名称
 */
Comman.DisposeCodeLineRaw = function (codeLineRaw, sheetName) {
  for (var i = 0; i < codeLineRaw.Count(); i++) {
    codeLineRaw[i] = codeLineRaw[i].replace(
      new RegExp(sheetName + "!", "gi"),
      "",
    );
  }
};

/**
 * 拆分源公式字符串
 * @param {string} sourceStr - 源公式字符串
 * @returns {Array<string>} 拆分后的字符串数组
 */
Comman.SplitSourceFormula = function (sourceStr) {
  var result = [];
  var buffer = "";
  var inQuote = 0;

  for (var i = 0; i < sourceStr.length; i++) {
    if (sourceStr[i] == '"') {
      if (i + 1 < sourceStr.length && sourceStr[i + 1] == '"') {
        i++;
      } else {
        inQuote++;
      }
      buffer += sourceStr[i];
    } else if (inQuote % 2 == 0) {
      if (Regex.IsMatch(sourceStr[i].toString(), /\s/)) {
        if (buffer.Trim() != "") {
          result.Add(buffer.Trim());
          buffer = "";
        }
      } else if (
        sourceStr[i] == "(" ||
        sourceStr[i] == ")" ||
        sourceStr[i] == "," ||
        sourceStr[i] == "=" ||
        sourceStr[i] == ">" ||
        sourceStr[i] == "<" ||
        sourceStr[i] == ";" ||
        sourceStr[i] == "+" ||
        sourceStr[i] == "-" ||
        sourceStr[i] == "*" ||
        sourceStr[i] == "/" ||
        sourceStr[i] == "%" ||
        sourceStr[i] == "[" ||
        sourceStr[i] == "]"
      ) {
        if (buffer.Trim() != "") {
          result.Add(buffer.Trim());
          buffer = "";
        }
        result.Add(sourceStr[i].toString());
      } else {
        buffer += sourceStr[i];
      }
    } else {
      buffer += sourceStr[i];
    }
  }
  if (buffer.Trim() != "") {
    result.Add(buffer.Trim());
  }
  return result;
};

/**
 * 深度复制对象
 * @param {Object} obj - 要复制的对象
 * @returns {Object} 复制后的对象
 */
Comman.DeepCopyObj = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * 深度复制数组
 * @param {Array} array - 要复制的数组
 * @returns {Array} 复制后的数组
 */
Comman.DeepCopyArray = function (array) {
  return JSON.parse(JSON.stringify(array));
};

/**
 * 触发键盘事件
 * @param {Element} element - DOM元素
 * @param {string} eventType - 事件类型
 * @param {number} keyCode - 键码
 */
Comman.fireKeyEvent = function (element, eventType, keyCode) {
  if (element.createEvent) {
    if (window.KeyboardEvent) {
      var event = element.createEvent("KeyboardEvent");
      Object.defineProperty(event, "keyCode", {
        get: function () {
          return this.keyCodeVal;
        },
      });
      Object.defineProperty(event, "which", {
        get: function () {
          return this.keyCodeVal;
        },
      });
    } else {
      event = element.createEvent("UIEvents");
      Object.defineProperty(event, "keyCode", {
        get: function () {
          return this.keyCodeVal;
        },
      });
      Object.defineProperty(event, "which", {
        get: function () {
          return this.keyCodeVal;
        },
      });
      event.initUIEvent(eventType, true, true, win, 1);
      event.keyCodeVal = keyCode;
    }
    element.dispatchEvent(event);
  } else if (element.createEventObject) {
    event = element.createEventObject();
    event.keyCode = keyCode;
    element.fireEvent("on" + eventType, event);
  }
};

/**
 * 获取节点矩形信息
 * @param {HTMLElement} node - DOM节点
 * @returns {Object} 包含top, left, width, height的对象
 */
Comman.getNodeRect = function (node) {
  if (!node || !node.getBoundingClientRect) return { top: 0, left: 0 };

  const rect = node.getBoundingClientRect();
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const scrollLeft =
    document.documentElement.scrollLeft || document.body.scrollLeft;
  const top = rect.top + scrollTop;
  const left = rect.left + scrollLeft;

  return { top, left, width: rect.width, height: rect.height };
};

/**
 * 获取节点位置
 * @param {HTMLElement} node - DOM节点
 * @returns {Object} 包含top和left的对象
 */
Comman.getNodePosition = function (node) {
  if (!node || !node.getBoundingClientRect) return { top: 0, left: 0 };

  const rect = node.getBoundingClientRect();
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const scrollLeft =
    document.documentElement.scrollLeft || document.body.scrollLeft;
  const top = rect.top + scrollTop;
  const left = rect.left + scrollLeft;

  return { top, left };
};

/**
 * 获取鼠标相对于父元素的位置
 * @param {HTMLElement} parentEl - 父元素
 * @param {number} pageX - 页面X坐标
 * @param {number} pageY - 页面Y坐标
 * @returns {Object} 包含x和y的位置对象
 */
Comman.getMousePosition = function (parentEl, pageX, pageY) {
  if (
    !parentEl ||
    !parentEl.getBoundingClientRect ||
    isNaN(pageX) ||
    isNaN(pageY)
  ) {
    return { x: 0, y: 0 };
  }

  const parentDocPos = Comman.getNodePosition(parentEl);
  const scrollTop = parentEl.scrollTop;
  const scrollLeft = parentEl.scrollLeft;
  const mouseDocX = pageX + scrollLeft;
  const mouseDocY = pageY + scrollTop;

  const x = mouseDocX - parentDocPos.left;
  const y = mouseDocY - parentDocPos.top;

  return { x, y };
};

/**
 * 发送AJAX JSON请求
 * @param {string} url - 请求URL
 * @param {string} jsonStr - JSON字符串
 * @param {Function} successCallback - 成功回调函数
 * @param {Function} errorCallback - 错误回调函数
 */
function myAjaxJson(url, jsonStr, successCallback, errorCallback) {
  var request = null;
  try {
    request = new XMLHttpRequest();
  } catch (e) {
    try {
      request = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        request = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        try {
          request = new ActiveXObject("Msxml2.XMLHTTP.6.0");
        } catch (e) {
          try {
            request = new ActiveXObject("Msxml2.XMLHTTP.3.0");
          } catch (e) {
            request = false;
          }
        }
      }
    }
  }
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      if (request.status == 200) {
        var response = request.responseText;
        successCallback(response);
      } else {
        errorCallback(request.responseText);
      }
    }
  };
  url += "?t=" + new Date().getTime();
  request.open("POST", url, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(jsonStr);
}

/**
 * 简单加密字符串
 * @param {string} str - 原字符串
 * @returns {string} 加密后的字符串
 */
function myEncrypt(str) {
  var charCodes = [];
  for (var i = 0; i < str.length; i++) {
    charCodes.push((str.charCodeAt(i) + 1).toString());
  }
  return charCodes.join("@");
}

/**
 * 获取位置信息
 * @param {Window} windowObj - 窗口对象
 * @returns {string} 位置信息
 */
function getLocation(windowObj) {
  windowObj = windowObj || self.document;
  var href = windowObj.location.href;
  var protocolEnd = href.indexOf("//");
  var pathStart = href.indexOf("/", protocolEnd + 2);
  return href.substring(0, pathStart);
}

/**
 * 画布垂直滚动条图像数据
 * @type {ImageData|null}
 */
Comman.canvasVHandlerImageData = null;

/**
 * 显示垂直滚动条处理图像
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {Object} stage - 舞台对象
 */
Comman.showVHandler = function (x, y, width, height, stage) {
  var canvas = stage.canvas;
  Comman.canvasVHandlerImageData = canvas.getImageData(x, y, width, height);
  canvas.drawImage(GlobalV.vHandlerImage, x, y, width, height);
};

/**
 * 隐藏垂直滚动条处理图像
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {Object} stage - 舞台对象
 */
Comman.hideVHandler = function (x, y, width, height, stage) {
  var canvas = stage.canvas;
  if (Comman.canvasVHandlerImageData != null) {
    canvas.drawImage(GlobalV.canvasVHandlerImageData, x, y, width, height);
  }
};

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @param {string} format - 格式字符串
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date, format) {
  const map = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
    q: Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  };
  format = format.replace(/([yMdhmsqS])+/g, function (all, char) {
    let value = map[char];
    if (value !== undefined) {
      if (all.length > 1) {
        value = "0" + value;
        value = value.substr(value.length - 2);
      }
      return value;
    } else if (char === "y") {
      return (date.getFullYear() + "").substr(4 - all.length);
    }
    return all;
  });
  return format;
}

/**
 * 显示加载中提示
 * @param {string} message - 提示消息
 */
function showLoading(message) {
  var loadingId = "div_my_loading";
  var maskId = "div_my_loading_mask";
  var loadingElement = document.getElementById(loadingId);
  var maskElement = document.getElementById(maskId);

  if (!maskElement) {
    maskElement = document.createElement("div");
    maskElement.setAttribute("id", maskId);
    maskElement.style.position = "fixed";
    maskElement.style.top = "0";
    maskElement.style.left = "0";
    maskElement.style.width = "100vw";
    maskElement.style.height = "100vh";
    maskElement.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    maskElement.style.zIndex = 999999;
    maskElement.style.display = "block";
    document.body.appendChild(maskElement);
  }

  if (!loadingElement) {
    loadingElement = document.createElement("div");
    loadingElement.setAttribute("id", loadingId);
    loadingElement.style.borderRadius = "10px";
    loadingElement.style.backgroundColor = "white";
    loadingElement.style.boxShadow = "3px 3px 10px 2px rgba(0, 0, 0, 0.2)";
    loadingElement.style.width = "210px";
    loadingElement.style.position = "fixed";
    loadingElement.style.left = "50%";
    loadingElement.style.top = "50%";
    loadingElement.style.transform = "translate(-50%, -50%)";
    loadingElement.style.zIndex = 1000000;
    loadingElement.style.padding = "15px";
    loadingElement.style.boxSizing = "border-box";
    loadingElement.style.display = "flex";
    loadingElement.style.alignItems = "center";
    loadingElement.style.gap = "10px";
    document.body.appendChild(loadingElement);
  }  

  var iconDiv =
    '<div style="flex-shrink: 0;"><img src="' +
    theme.loading +
    '" width="30" height="30" border="0"></div>';
  var textDiv = `
    <div style="flex: 1; color: red; font-size: 14px; line-height: 1.4;">
      <div style="word-wrap: break-word; word-break: break-all; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
        ${message || "加载中..."}
      </div>
    </div>
  `;
  loadingElement.innerHTML = iconDiv + textDiv;
  loadingElement.style.display = "flex";
  maskElement.style.display = "block";
}

/**
 * 隐藏加载中提示
 */
function hideLoading() {
  var loadingElement = document.getElementById("div_my_loading");
  var maskElement = document.getElementById("div_my_loading_mask");
  if (loadingElement) loadingElement.style.display = "none";
  if (maskElement) maskElement.style.display = "none";
}
