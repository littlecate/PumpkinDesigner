"use strict";

/**
 * @fileoverview 获取右侧单元格字符串类 - 提供查找并返回右侧单元格内容功能
 * @description 该模块用于查找包含指定字符串的单元格，并返回其右侧单元格的文本内容。
 * 是GetOneRightCellClass的扩展版本，直接返回字符串而非位置。
 * @author MyCell Designer
 * @version 1.0.0
 */

/**
 * 获取右侧单元格字符串类
 * @class GetOneRightCellStrClass
 * @description 查找包含指定字符串的单元格，返回其右侧单元格的文本内容
 * @param {Object} config - 配置对象
 * @param {Object} config.operCell - 操作单元格对象
 * @param {Object} config.cellSheet - 单元格表格数据
 * @param {string} config.needFindStr - 需要查找的字符串
 */
function GetOneRightCellStrClass(config) {
  var operCell = config.operCell;
  var cellSheet = config.cellSheet;
  var needFindStr = config.needFindStr;

  /**
   * 执行查找任务
   * @function doJob
   * @description 遍历表格查找匹配字符串，返回其右侧单元格的文本内容
   * @returns {string} 右侧单元格的文本内容，未找到时返回空字符串
   */
  function doJob() {
    var t = new GetOneRightCellClass(config).doJob();
    if(!t){
      return "";
    }    
    return getCellStringString(t);
  }

  /**
   * 获取单元格字符串内容
   * @function getCellStringString
   * @description 获取指定位置的单元格纯文本内容
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
   * 返回公共接口
   * @returns {Object} 包含doJob方法的对象
   */
  return {
    doJob: doJob,
  };
}
