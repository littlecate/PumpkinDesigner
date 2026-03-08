"use strict";

/**
 * @fileoverview 获取仪器单元格类 - 提供仪器单元格位置提取功能
 * @description 该模块用于从表格中提取仪器设备相关单元格的位置信息，
 * 与GetInstrumentDataClass不同，此类返回单元格位置而非内容。
 * @author MyCell Designer
 * @version 1.0.0
 */

/**
 * 获取仪器单元格类
 * @class GetInstrumentCellsClass
 * @description 查找表格中包含"仪器名称"、"设备名称"或"名称"的单元格，
 * 提取相关的仪器设备单元格位置
 * @param {Object} config - 配置对象
 * @param {Object} config.operCell - 操作单元格对象
 * @param {Object} config.cellSheet - 单元格表格数据
 */
function GetInstrumentCellsClass(config) {
  var operCell = config.operCell;
  var cellSheet = config.cellSheet;

  /**
   * 执行仪器单元格提取
   * @function doJob
   * @description 遍历表格查找仪器名称标题，提取所有仪器相关单元格位置
   * @returns {Array.<Object>} 仪器单元格位置数组，每项包含name、type、num、usage属性（值为{col, row}对象）
   */
  function doJob() {
    var L = [];
    for (var col = 0; col < cellSheet.colWidthList.length; col++) {
      for (var row = 0; row < cellSheet.rowHeightList.length; row++) {
        var o = cellSheet.cells[col][row];
        var str = getCellStringWithoutBlank({ col: col, row: row });
        if (!str) {
          continue;
        }
        if ("|仪器名称|设备名称|名称|".indexOf("|" + str + "|") != -1) {
          var t = doJobA(col, row);
          if (t) {
            L = L.concat(t);
          } else {
            var t1 = doJobB(col, row);
            if (t1) {
              L = L.concat(t1);
            }
          }
        }
      }
    }
    return L;
  }

  /**
   * 处理仪器区域（包含使用情况列）
   * @function doJobA
   * @description 从仪器名称标题位置开始，提取名称、型号、编号、使用情况的单元格位置
   * @param {number} col - 列索引
   * @param {number} row - 行索引
   * @returns {Array.<Object>|undefined} 仪器单元格位置数组或undefined
   */
  function doJobA(col, row) {
    var L = doJobAA(col, row);
    if (!L) {
      return;
    }
    var instrumentNameCells = getInstrumentNameCells(L);
    if (instrumentNameCells.length == 0) {
      return;
    }
    var count = instrumentNameCells.length;
    var instrumentTypeCells = getOtherAr(L[1], count);
    var instrumentNumCells = getOtherAr(L[2], count);
    var instrumentUsageCells = getOtherAr(L[3], count);
    var L1 = [];
    for (var i = 0; i < count; i++) {
      if (!instrumentTypeCells[i] || !instrumentNumCells[i]) {
        continue;
      }
      L1.push({
        name: instrumentNameCells[i],
        type: instrumentTypeCells[i],
        num: instrumentNumCells[i],
        usage: instrumentUsageCells[i] || null,
      });
    }
    return L1;
  }

  /**
   * 获取其他列单元格位置数组
   * @function getOtherAr
   * @description 从指定单元格向下提取单元格位置
   * @param {Object} t - 起始单元格位置 {col, row}
   * @param {number} count - 需要提取的数量
   * @returns {Array.<Object>} 单元格位置数组
   */
  function getOtherAr(t, count) {
    var L = [];
    var i = 0;
    while (true) {
      i++;
      if (i > count) {
        break;
      }
      var nextBottomCell = getNextBottomCell2(t.col, t.row);
      if (nextBottomCell == null) {
        break;
      }
      L.push({
        col: nextBottomCell.col + 1,
        row: nextBottomCell.row + 1
      });
      t = nextBottomCell;
    }
    return L;
  }

  /**
   * 获取仪器名称单元格位置数组
   * @function getInstrumentNameCells
   * @description 从仪器名称标题下方提取所有仪器名称单元格位置
   * @param {Array.<Object>} L - 单元格位置数组
   * @returns {Array.<Object>} 仪器名称单元格位置数组
   */
  function getInstrumentNameCells(L) {
    var instrumentNameCells = [];
    var t = L[0];
    while (true) {
      var nextBottomCell = getNextBottomCell2(t.col, t.row);
      if (nextBottomCell == null) {
        break;
      }
      var s = getCellStringWithoutBlank(nextBottomCell);
      if (s == "") {
        break;
      }
      instrumentNameCells.push({
        col: nextBottomCell.col + 1,
        row: nextBottomCell.row + 1
      });
      t = nextBottomCell;
    }
    return instrumentNameCells;
  }

  /**
   * 验证仪器区域（包含使用情况列）
   * @function doJobAA
   * @description 验证仪器名称标题右侧是否有"型号"、"编号"、"使用情况"列
   * @param {number} col - 列索引
   * @param {number} row - 行索引
   * @returns {Array.<Object>|null} 单元格位置数组或null
   */
  function doJobAA(col, row) {
    var L1 = [];
    L1.push({ col: col, row: row });
    var nextRightCell = getNextRightCell2(col, row);
    if (nextRightCell == null) {
      return null;
    }
    var L = [
      "|型号|设备型号|仪器型号|",
      "|编号|设备编号|仪器编号|",
      "|使用情况|使用|",
    ];
    for (var i = 0; i < L.length; i++) {
      if (nextRightCell == null) {
        return null;
      }
      var s = getCellStringWithoutBlank(nextRightCell);
      if (L[i].indexOf("|" + s + "|") == -1) {
        return null;
      }
      L1.push({ col: nextRightCell.col, row: nextRightCell.row });
      nextRightCell = getNextRightCell2(nextRightCell.col, nextRightCell.row);
    }
    return L1;
  }

  /**
   * 处理仪器区域（不含使用情况列）
   * @function doJobB
   * @description 从仪器名称标题位置开始，提取名称、型号、编号的单元格位置
   * @param {number} col - 列索引
   * @param {number} row - 行索引
   * @returns {Array.<Object>|undefined} 仪器单元格位置数组或undefined
   */
  function doJobB(col, row) {
    var L = doJobBB(col, row);
    if (!L) {
      return;
    }
    var instrumentNameAr = getInstrumentNameCells(L);
    if (instrumentNameAr.length == 0) {
      return;
    }
    var count = instrumentNameAr.length;
    var instrumentTypeAr = getOtherAr(L[1], count);
    var instrumentNumAr = getOtherAr(L[2], count);
    var L1 = [];
    for (var i = 0; i < count; i++) {
      if (!instrumentTypeAr[i] || !instrumentNumAr[i]) {
        continue;
      }
      L1.push({
        name: instrumentNameAr[i],
        type: instrumentTypeAr[i],
        num: instrumentNumAr[i],
        usage: "",
      });
    }
    return L1;
  }

  /**
   * 验证仪器区域（不含使用情况列）
   * @function doJobBB
   * @description 验证仪器名称标题右侧是否有"型号"、"编号"列
   * @param {number} col - 列索引
   * @param {number} row - 行索引
   * @returns {Array.<Object>|null} 单元格位置数组或null
   */
  function doJobBB(col, row) {
    var L1 = [];
    L1.push({ col: col, row: row });
    var nextRightCell = getNextRightCell2(col, row);
    if (nextRightCell == null) {
      return null;
    }
    var L = ["|型号|设备型号|仪器型号|", "|编号|设备编号|仪器编号|"];
    for (var i = 0; i < L.length; i++) {
      if (nextRightCell == null) {
        return null;
      }
      var s = getCellStringWithoutBlank(nextRightCell);
      if (L[i].indexOf("|" + s + "|") == -1) {
        return null;
      }
      L1.push({ col: nextRightCell.col, row: nextRightCell.row });
      nextRightCell = getNextRightCell2(nextRightCell.col, nextRightCell.row);
    }
    return L1;
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
   * 获取单元格字符串（去除空白）
   * @function getCellStringWithoutBlank
   * @description 获取单元格的纯文本内容，去除HTML标签和空白
   * @param {Object} colRow - 单元格位置对象 {col, row}
   * @returns {string} 处理后的字符串
   */
  function getCellStringWithoutBlank(colRow) {
    var s = cellSheet.cells[colRow.col][colRow.row].str;
    s = getHtmlText(s);
    s = trimBlank(s);
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
