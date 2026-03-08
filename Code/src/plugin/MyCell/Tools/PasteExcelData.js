"use strict";

/**
 * @fileoverview 粘贴Excel数据模块 - 提供Excel数据粘贴功能
 * @description 该模块用于将从Excel复制的数据粘贴到表格中。
 * 支持处理合并单元格， * @author MyCell Designer
 * @version 1.0.0
 */

/**
 * 粘贴Excel数据类
 * @class PasteExcelData
 * @description 将Excel数据粘贴到表格指定位置
 * @param {Object} config - 配置对象
 * @param {Object} config.operCell - 操作单元格对象
 * @param {Object} config.cellSheet - 单元格表格数据
 * @param {Array.<string>} config.excelData - Excel数据数组，每行为一个制表符分隔的字符串
 * @param {number} config.startCol - 起始列索引（1-based）
 * @param {number} config.startRow - 起始行索引（1-based）
 */
function PasteExcelData(config) {
  var operCell = config.operCell;
  var cellSheet = config.cellSheet;
  var excelData = config.excelData;
  var startCol = config.startCol;
  var startRow = config.startRow;

  /**
   * 执行粘贴操作
   * @function doJob
   * @description 遍历Excel数据数组，   * @returns {void}
   */
  function doJob() {
    var row = startRow;
    for(var i = 0; i < excelData.length; i++){
      var tAr = excelData[i].split('\t');
      processOneRow(tAr, row);      
      var o = getNextBottomCell2(startCol - 1, row - 1);
      if(o == null){
        break;
      }
      row = o.row + 1;      
    }    
  }

  /**
   * 处理单行数据
   * @function processOneRow
   * @description 将一行数据写入表格单元格
   * @param {Array.<string>} tAr - 数据数组
   * @param {number} row - 行索引（1-based）
   * @returns {void}
   */
  function processOneRow(tAr, row){
    var col = startCol;
    for(var i = 0; i < tAr.length; i++){
      operCell.SetCellString(col, row, 0, tAr[i]);
      var o = getNextRightCell2(col - 1, row - 1);
      if(o == null){
        break;
      }
      col = o.col + 1;
    }
  }

  /**
   * 获取单元格列跨度
   * @function getCellColSpan
   * @description 获取单元格的列合并跨度
   * @param {number} col - 列索引（0-based）
   * @param {number} row - 行索引（0-based）
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
   * @param {number} col - 列索引（0-based）
   * @param {number} row - 行索引（0-based）
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
   * @param {number} col - 列索引（0-based）
   * @param {number} row - 行索引（0-based）
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
   * @param {number} col - 列索引（0-based）
   * @param {number} row - 行索引（0-based）
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
   * @param {number} col - 列索引（0-based）
   * @param {number} row - 行索引（0-based）
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
   * @param {number} col - 列索引（0-based）
   * @param {number} row - 行索引（0-based）
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

  return {
    doJob: doJob,
  };
}
