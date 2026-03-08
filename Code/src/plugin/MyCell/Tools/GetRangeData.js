"use strict";

/**
 * @fileoverview 获取范围数据模块 - 提供单元格范围数据提取功能
 * @description 该模块用于从表格中提取指定矩形范围内的所有单元格数据。
 * 支持处理合并单元格，确保合并区域只被提取一次。
 * @author MyCell Designer
 * @version 1.0.0
 */

/**
 * 获取范围数据类
 * @class GetRangeData
 * @description 提取指定范围内的单元格数据，处理合并单元格情况
 * @param {Object} config - 配置对象
 * @param {Object} config.cellSheet - 单元格表格数据
 * @param {number} config.startCol - 起始列索引（0-based）
 * @param {number} config.startRow - 起始行索引（0-based）
 * @param {number} config.endCol - 结束列索引（0-based）
 * @param {number} config.endRow - 结束行索引（0-based）
 */
function GetRangeData(config) {
  var cellSheet = config.cellSheet;
  var startCol = config.startCol;
  var startRow = config.startRow;
  var endCol = config.endCol;
  var endRow = config.endRow;
  
  /**
   * 字符串列表
   * @type {Array.<string>}
   * @description 临时存储当前行的单元格字符串
   */
  let strList = [];

  /**
   * 执行范围数据提取
   * @function doJob
   * @description 遍历指定范围内的所有单元格，提取数据并返回二维数组
   * @returns {Array.<Array.<string>>} 二维数组，每行为一个数组
   */
  function doJob() {    
    setMergeAreaUnDrawed();
    let L = [];
    for(var row = startRow; row <= endRow; row++){
      strList = [];
      for(var col = startCol; col <= endCol; col++){
          var o = cellSheet.cells[col][row];
          doJobA(o, col, row);
      }
      L.push(JSON.parse(JSON.stringify(strList)));
    }
    setMergeAreaUnDrawed();
    return L;
  }

  /**
   * 处理单个单元格
   * @function doJobA
   * @description 处理单个单元格，处理合并单元格情况
   * @param {Object} o - 单元格对象
   * @param {number} col - 列索引
   * @param {number} row - 行索引
   * @returns {void}
   */
  function doJobA(o, col, row) {
    if (o.isInMergeArea) {
      var o1 = Comman.getMergeAreaById(cellSheet, o.mergeAreaId);
      if (o1 != null && !o1.isDrawed) {
        strList.push(o.str);
        o1.isDrawed = true;
      } else if (o1 == null) {
        strList.push(o.str);
      }
    } else {
      strList.push(o.str);
    }
  }

  /**
   * 设置合并区域未绘制状态
   * @function setMergeAreaUnDrawed
   * @description 将所有合并区域的isDrawed标志重置为false
   * @returns {void}
   */
  function setMergeAreaUnDrawed() {
    for (var i = 0; i < cellSheet.cellMergeAreaList.length; i++) {
      cellSheet.cellMergeAreaList[i].isDrawed = false;
    }
  }

  /**
   * 返回公共接口
   * @returns {Object} 包含doJob方法的对象
   */
  return {
    doJob: doJob,
  };
}
