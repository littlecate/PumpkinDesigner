"use strict";

/**
 * @fileoverview 获取右侧单元格类 - 提供查找并返回右侧单元格功能
 * @description 该模块用于查找包含指定字符串的单元格，并返回其右侧的单元格位置。
 * 常用于查找标题并获取其对应的数据单元格。
 * @author MyCell Designer
 * @version 1.0.0
 */

/**
 * 获取右侧单元格类
 * @class GetOneRightCellClass
 * @description 查找包含指定字符串的单元格，返回其右侧单元格位置
 * @param {Object} config - 配置对象
 * @param {Object} config.operCell - 操作单元格对象
 * @param {Object} config.cellSheet - 单元格表格数据
 * @param {string} config.needFindStr - 需要查找的字符串
 */
function GetOneRightCellClass(config) {
  var operCell = config.operCell;
  var cellSheet = config.cellSheet;
  var needFindStr = config.needFindStr;

  /**
   * 执行查找任务
   * @function doJob
   * @description 遍历表格查找匹配字符串，返回其右侧单元格位置
   * @returns {Object|null} 右侧单元格位置 {col, row} 或 null
   */
  function doJob() {
    for (var col = 0; col < cellSheet.colWidthList.length; col++) {
      for (var row = 0; row < cellSheet.rowHeightList.length; row++) {
        var o = cellSheet.cells[col][row];
        var str = getCellStringString({ col: col, row: row });
        if (!str) {
          continue;
        }
        str = trimBlank(str);
        if (("|" + needFindStr + "|").indexOf("|" + str + "|") != -1) {
          return getNextRightCell2(col, row);          
        }
      }
    }
    return null;
  }

  /**
   * 获取当前行字符串
   * @function getThisRowStr
   * @description 获取指定行所有非空单元格内容，用"|"连接
   * @param {number} col - 列索引（未使用）
   * @param {number} row - 行索引
   * @returns {string} 连接后的字符串
   */
  function getThisRowStr(col, row) {
    var L = [];
    for (var col = 0; col < cellSheet.colWidthList.length; col++) {
      var s = cellSheet.cells[col][row].str;
      if (s != "") {
        s = trimBlank(s);
        L.push(s);
      }
    }
    return L.join("|");
  }

  /**
   * 获取单元格尺寸
   * @function getCellSize
   * @description 获取指定单元格的宽度和高度
   * @param {Object} colRow - 单元格位置对象 {col, row}
   * @returns {Object} 包含width和height属性的对象
   */
  function getCellSize(colRow) {
    return {
      width: operCell.GetCellWidth(colRow.col + 1, colRow.row + 1),
      height: operCell.GetCellHeight(colRow.col + 1, colRow.row + 1),
    };
  }

  /**
   * 去除空白字符
   * @function trimBlank
   * @description 移除字符串中的空格和冒号
   * @param {string} s - 原始字符串
   * @returns {string} 处理后的字符串
   */
  function trimBlank(s) {
    if (s == "") return "";
    return s.replace(/[\s:：]/g, "");
  }

  /**
   * 获取单元格字符串内容
   * @function getCellStringString
   * @description 获取单元格的纯文本内容
   * @param {Object} colRow - 单元格位置对象 {col, row}
   * @returns {string} 单元格纯文本内容
   */
  function getCellStringString(colRow) {
    var s = cellSheet.cells[colRow.col][colRow.row].str;
    s = getHtmlText(s);
    return s;
  }

  /**
   * 获取HTML纯文本
   * @function getHtmlText
   * @description 从HTML字符串中提取纯文本内容
   * @param {string} s - HTML字符串
   * @returns {string} 纯文本内容
   */
  function getHtmlText(s) {
    var t = document.createElement("div");
    t.innerHTML = s;
    return t.innerText;
  }

  /**
   * 去除单位
   * @function trimUnit
   * @description 去除字符串中括号及其后面的内容
   * @param {string} s - 原始字符串
   * @returns {string} 处理后的字符串
   */
  function trimUnit(s) {
    var s1 = s;
    s1 = s1.replace(/[\(（（]/g, "(");
    var pos1 = s1.lastIndexOf("(");
    if (pos1 == -1) {
      return s;
    }
    return s1.substring(0, pos1);
  }

  /**
   * 获取单元格列跨度
   * @function getCellColSpan
   * @description 获取单元格的列合并跨度
   * @param {number} col - 列索引
   * @param {number} row - 行索引
   * @returns {number} 列跨度值
   */
  function getCellColSpan(col, row) {
    var o = operCell.GetMergeRange(col + 1, row + 1);
    if (o != null && cellSheet.cells[col][row].isInMergeArea) {
      return o.endCol - o.startCol + 1;
    }
    return 1;
  }

  /**
   * 获取单元格行跨度
   * @function getCellRowSpan
   * @description 获取单元格的行合并跨度
   * @param {number} col - 列索引
   * @param {number} row - 行索引
   * @returns {number} 行跨度值
   */
  function getCellRowSpan(col, row) {
    var o = operCell.GetMergeRange(col + 1, row + 1);
    if (o != null && cellSheet.cells[col][row].isInMergeArea) {
      return o.endRow - o.startRow + 1;
    }
    return 1;
  }

  /**
   * 检查单元格是否足够大
   * @function isCellBigEnough
   * @description 判断单元格的宽度和高度是否满足最小要求（5像素）
   * @param {number} col - 列索引
   * @param {number} row - 行索引
   * @returns {boolean} 如果足够大返回true
   */
  function isCellBigEnough(col, row) {
    var w = operCell.GetCellWidth(col + 1, row + 1);
    if (w < 5) {
      return false;
    }
    var h = operCell.GetCellHeight(col + 1, row + 1);
    if (h < 5) {
      return false;
    }
    return true;
  }

  /**
   * 获取真实行列位置对象
   * @function getRealColRowObj
   * @description 将1-based索引转换为0-based，并处理合并单元格
   * @param {number} col1 - 1-based列索引
   * @param {number} row1 - 1-based行索引
   * @returns {Object|null} 位置对象 {col, row} 或 null
   */
  function getRealColRowObj(col1, row1) {
    if (
      col1 < 1 ||
      row1 < 1 ||
      col1 > cellSheet.colWidthList.length ||
      row1 > cellSheet.rowHeightList.length
    ) {
      return null;
    }
    var o = operCell.GetMergeRange(col1, row1);
    if (o != null && cellSheet.cells[col1 - 1][row1 - 1].isInMergeArea) {
      return {
        col: o.startCol - 1,
        row: o.startRow - 1,
      };
    } else {
      return {
        col: col1 - 1,
        row: row1 - 1,
      };
    }
  }

  /**
   * 获取左侧单元格
   * @function getNextLeftCell
   * @description 获取当前单元格左侧的有效单元格
   * @param {number} col - 列索引
   * @param {number} row - 行索引
   * @returns {Object|null} 位置对象 {col, row} 或 null
   */
  function getNextLeftCell(col, row) {
    var col1, row1;
    var o = operCell.GetMergeRange(col + 1, row + 1);
    if (o != null && cellSheet.cells[col][row].isInMergeArea) {
      col1 = o.startCol - 1;
      row1 = o.startRow;
    } else {
      col1 = col + 1 - 1;
      row1 = row + 1;
    }
    while (true) {
      var t = getRealColRowObj(col1, row1);
      if (t == null) {
        return null;
      }
      if (!isCellBigEnough(t.col, t.row)) {
        col1 = t.col + 1 - 1;
      } else {
        return t;
      }
    }
  }

  /**
   * 获取下方单元格
   * @function getNextBottomCell
   * @description 获取当前单元格下方的有效单元格
   * @param {number} col - 列索引
   * @param {number} row - 行索引
   * @returns {Object|null} 位置对象 {col, row} 或 null
   */
  function getNextBottomCell(col, row) {
    var col1, row1;
    var o = operCell.GetMergeRange(col + 1, row + 1);
    if (o != null && cellSheet.cells[col][row].isInMergeArea) {
      col1 = o.startCol;
      row1 = o.endRow + 1;
    } else {
      col1 = col + 1;
      row1 = row + 1 + 1;
    }
    while (true) {
      var t = getRealColRowObj(col1, row1);
      if (t == null) {
        return null;
      }
      if (!isCellBigEnough(t.col, t.row)) {
        row1 = t.row + 1 + getCellRowSpan(t.col, t.row) - 1 + 1;
      } else {
        return t;
      }
    }
  }

  /**
   * 获取上方单元格
   * @function getNextTopCell
   * @description 获取当前单元格上方的有效单元格
   * @param {number} col - 列索引
   * @param {number} row - 行索引
   * @returns {Object|null} 位置对象 {col, row} 或 null
   */
  function getNextTopCell(col, row) {
    var col1, row1;
    var o = operCell.GetMergeRange(col + 1, row + 1);
    if (o != null && cellSheet.cells[col][row].isInMergeArea) {
      col1 = o.startCol;
      row1 = o.startRow - 1;
    } else {
      col1 = col + 1;
      row1 = row + 1 - 1;
    }
    while (true) {
      var t = getRealColRowObj(col1, row1);
      if (t == null) {
        return null;
      }
      if (!isCellBigEnough(t.col, t.row)) {
        row1 = t.row + 1 - 1;
      } else {
        return t;
      }
    }
  }

  /**
   * 获取右侧单元格
   * @function getNextRightCell
   * @description 获取当前单元格右侧的有效单元格
   * @param {number} col - 列索引
   * @param {number} row - 行索引
   * @returns {Object|null} 位置对象 {col, row} 或 null
   */
  function getNextRightCell(col, row) {
    var col1, row1;
    var o = operCell.GetMergeRange(col + 1, row + 1);
    if (o != null && cellSheet.cells[col][row].isInMergeArea) {
      col1 = o.endCol + 1;
      row1 = o.startRow;
    } else {
      col1 = col + 1 + 1;
      row1 = row + 1;
    }
    while (true) {
      var t = getRealColRowObj(col1, row1);
      if (t == null) {
        return null;
      }
      if (!isCellBigEnough(t.col, t.row)) {
        col1 = t.col + 1 + getCellColSpan(t.col, t.row) - 1 + 1;
      } else {
        return t;
      }
    }
  }

  /**
   * 获取右侧单元格（版本2）
   * @function getNextRightCell2
   * @description 获取右侧单元格，验证行跨度是否一致
   * @param {number} col - 列索引
   * @param {number} row - 行索引
   * @returns {Object|null} 位置对象 {col, row} 或 null
   */
  function getNextRightCell2(col, row) {
    var t1 = getNextRightCell(col, row);
    if (t1 == null) {
      return null;
    }
    var tt1 = getCellRowSpan(t1.col, t1.row);
    var tt2 = getCellRowSpan(col, row);
    if (tt1 != tt2) {
      return null;
    }
    return t1;
  }

  /**
   * 获取下方单元格（版本2）
   * @function getNextBottomCell2
   * @description 获取下方单元格，验证列跨度是否一致
   * @param {number} col - 列索引
   * @param {number} row - 行索引
   * @returns {Object|null} 位置对象 {col, row} 或 null
   */
  function getNextBottomCell2(col, row) {
    var t1 = getNextBottomCell(col, row);
    if (t1 == null) {
      return null;
    }
    var tt1 = getCellColSpan(t1.col, t1.row);
    var tt2 = getCellColSpan(col, row);
    if (tt1 != tt2) {
      return null;
    }
    return t1;
  }

  /**
   * 返回公共接口
   * @returns {Object} 包含doJob方法的对象
   */
  return {
    doJob: doJob,
  };
}
