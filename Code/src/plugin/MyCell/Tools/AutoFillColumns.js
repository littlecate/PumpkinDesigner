'use strict';

/**
 * @fileoverview 自动填充列模块 - 提供智能列填充功能
 * @description 该模块根据表格中的标题和结构，自动识别并填充列字段名称。
 * 支持横向和纵向的自动填充，能够处理合并单元格等复杂情况。
 * @author MyCell Designer
 * @version 1.0.0
 */

/**
 * 字符串转换对象映射表
 * @type {Object.<string, Function>}
 * @description 存储特定字符串的转换函数，用于自定义字符串处理逻辑
 */
let autoFillColumnConvertStrObjs = {};

/**
 * 自动填充列类
 * @class AutoFillColumns
 * @description 根据表格结构和已有内容，智能识别并填充空白单元格的列名称。
 * 主要用于报价单等表格的自动化处理。
 * @param {Object} config - 配置对象
 * @param {Object} config.parentObj - 父对象（MyCellDesigner实例）
 * @param {Object} config.operCell - 操作单元格对象
 * @param {Object} config.cellSheet - 单元格表格数据
 */
function AutoFillColumns(config) {
    var parentObj = config.parentObj;
    var operCell = config.operCell;
    var cellSheet = config.cellSheet;

    /**
     * 需要生成列信息的数组
     * @type {Array.<Array.<Object>>}
     * @description 存储待填充的列信息，每个元素是一组同列的待填充单元格
     */
    var needGenColumnInfoAr = [];

    /**
     * 执行自动填充任务
     * @function doJob
     * @description 主入口函数，加载拼音库后执行自动填充逻辑
     * @returns {void}
     */
    function doJob() {
        if(readOnlyText){
            return;
        }
        showLoading("正在自动填充字段...");
        if (!window.g_isStartLoadMyPinYinJs) {
            window.g_isStartLoadMyPinYinJs = true;
            loadScript(getLocation() + "/mypinyin.js", function () {
                window.g_isLoadMyPinYinJs = true;
            });
        }
        var myInterval = setInterval(function () {
            if (!window.g_isLoadMyPinYinJs) {
                return;
            }
            clearInterval(myInterval);
            doJobDoJob();
        }, 100);
    }

    /**
     * 执行实际的填充逻辑
     * @function doJobDoJob
     * @description 遍历所有单元格，识别标题并填充空白单元格
     * @returns {void}
     */
    function doJobDoJob() {
        for (var col = 0; col < cellSheet.colWidthList.length; col++) {
            for (var row = 0; row < cellSheet.rowHeightList.length; row++) {
                var o = cellSheet.cells[col][row];
                var str = getCellStringWithoutBlankAndUnit({ col: col, row: row });                
                if (!str) {
                    continue;
                }
                if (str.indexOf(leftMark) == -1) {
                    if (!isCellBigEnough(col, row)) {
                        continue;
                    }
                    if (stringIsNotGood(str))
                        str = "";
                    str = convertStr(str, col, row);
                    var nextRightCell = getNextRightCell(col, row);
                    if (nextRightCell == null) {
                        doJobBB(str, col, row);
                        continue;
                    }
                    var nextRightCellStr = getCellStringWithoutBlankAndUnit(nextRightCell);
                    if (nextRightCellStr == "") {
                        doJobA(str, col, row, nextRightCell);
                    }
                    else {
                        doJobBB(str, col, row);
                    }
                }
            }
        }        
        fillColumns();
        new AdjustAutoFillColumnH(config).doJob();
        new AdjustAutoFillColumnV(config).doJob();
        replaceColumnsChar();
        var t = new CalReportBody(config).doJob();
        //var t2 = parentObj.getCommanColumnMaps();
        //console.log(t2);
        //new MergeReportBodyListContent(t.reportBodyList, cellSheet).doJob();
        parentObj._redraw();
        hideLoading();
    }

    /**
     * 转换字符串
     * @function convertStr
     * @description 根据转换映射表处理字符串
     * @param {string} s - 原始字符串
     * @param {number} col - 列索引
     * @param {number} row - 行索引
     * @returns {string} 转换后的字符串
     */
    function convertStr(s, col, row) {
        var t = autoFillColumnConvertStrObjs;
        if (t[s]) {
            var t1 = getThisRowStr(col, row);
            return t[s](s, t1);
        }
        return s;
    }

    /**
     * 获取当前行的字符串
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
     * 替换列中的特殊字符
     * @function replaceColumnsChar
     * @description 移除公式标记中的$符号
     * @returns {void}
     */
    function replaceColumnsChar() {
        if(readOnlyText){
            return;
        }
        for (var col = 0; col < cellSheet.colWidthList.length; col++) {
            for (var row = 0; row < cellSheet.rowHeightList.length; row++) {
                var o = cellSheet.cells[col][row];
                var str = o.str;
                if (str && str.indexOf(leftMark) != -1 && str.indexOf(rightMark) != -1) {
                    str = str.replace(/\$/g, "");
                    o.str = str;
                }
            }
        }
    }

    /**
     * 处理下方空白单元格（无右侧单元格情况）
     * @function doJobBB
     * @description 当右侧没有空白单元格时，检查下方是否有空白单元格需要填充
     * @param {string} str - 当前单元格的字符串内容
     * @param {number} col - 列索引
     * @param {number} row - 行索引
     * @returns {void}
     */
    function doJobBB(str, col, row) {
        var nextBottomCell = getNextBottomCell(col, row);
        if (nextBottomCell == null) {
            return;
        }
        var nextBottomCellStr = getCellStringWithoutBlankAndUnit(nextBottomCell);
        if (nextBottomCellStr == "") {
            doJobB(str, col, row, nextBottomCell);
        }
    }

    /**
     * 处理下方空白单元格
     * @function doJobB
     * @description 收集下方连续空白单元格的信息，用于纵向填充
     * @param {string} str - 当前单元格的字符串内容
     * @param {number} col - 列索引
     * @param {number} row - 行索引
     * @param {Object} nextBottomCell - 下方单元格位置对象
     * @returns {void}
     */
    function doJobB(str, col, row, nextBottomCell) {
        var thisCellColSpan = getCellColSpan(col, row);
        var L = [];
        var index = 0;
        while (true) {
            var nextBottomCellColSpan = getCellColSpan(nextBottomCell.col, nextBottomCell.row);
            if (thisCellColSpan == nextBottomCellColSpan) {
                var cellSize = getCellSize(nextBottomCell);
                if (index > 0) {
                    if (cellSize.width != L[0].cellSize.width || cellSize.height != L[0].cellSize.height) {
                        break;
                    }
                }
                var leftStr = getLeftStr(nextBottomCell);
                L.push({
                    cellSize: cellSize,
                    col: nextBottomCell.col,
                    row: nextBottomCell.row,
                    str1: getTopStr2({ col: col, row: row }) + str,
                    str2: getLeftStr2(nextBottomCell) + leftStr
                });
                index++;
                nextBottomCell = getNextBottomCell(nextBottomCell.col, nextBottomCell.row);
                if (nextBottomCell == null) {
                    break;
                }
                var t1 = getCellStringWithoutBlankAndUnit(nextBottomCell);
                if (t1 != "") {
                    break;
                }
            }
            else {
                break;
            }
        }
        needGenColumnInfoAr.push(L);
    }

    /**
     * 处理右侧空白单元格
     * @function doJobA
     * @description 收集右侧连续空白单元格的信息，用于横向填充
     * @param {string} str - 当前单元格的字符串内容
     * @param {number} col - 列索引
     * @param {number} row - 行索引
     * @param {Object} nextRightCell - 右侧单元格位置对象
     * @returns {void}
     */
    function doJobA(str, col, row, nextRightCell) {
        var thisCellRowSpan = getCellRowSpan(col, row);
        var L = [];
        var index = 0;
        while (true) {
            var nextRightCellRowSpan = getCellRowSpan(nextRightCell.col, nextRightCell.row);
            if (nextRightCellRowSpan == thisCellRowSpan) {
                var cellSize = getCellSize(nextRightCell);
                if (index > 0) {
                    if (cellSize.width != L[0].cellSize.width || cellSize.height != L[0].cellSize.height) {
                        break;
                    }
                }
                var topStr = getTopStr(nextRightCell);
                L.push({
                    cellSize: cellSize,
                    col: nextRightCell.col,
                    row: nextRightCell.row,
                    str1: getLeftStr2({ col: col, row: row }) + str,
                    str2: getTopStr2(nextRightCell) + topStr
                });
                index++;
                nextRightCell = getNextRightCell(nextRightCell.col, nextRightCell.row);
                if (nextRightCell == null) {
                    break;
                }
                var t1 = getCellStringWithoutBlankAndUnit(nextRightCell);
                if (t1 != "") {
                    break;
                }
            }
            else {
                break;
            }
        }
        needGenColumnInfoAr.push(L);
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
            height: operCell.GetCellHeight(colRow.col + 1, colRow.row + 1)
        };
    }

    /**
     * 填充列
     * @function fillColumns
     * @description 根据收集的列信息，生成并填充列名称到空白单元格
     * @returns {void}
     */
    function fillColumns() {
        for (var i = 0; i < needGenColumnInfoAr.length; i++) {
            var L = needGenColumnInfoAr[i];
            if (L.length == 1) {
                var t = L[0];
                if (t.str1 == "" && t.str2 == "") {
                    continue;
                }
                cellSheet.cells[t.col][t.row].str = getColumnStr(t.str1, t.str2, "");
            }
            else if (L.length > 1) {
                for (var k = 0; k < L.length; k++) {
                    var t = L[k];
                    if (t.str1 == "" && t.str2 == "") {
                        continue;
                    }
                    cellSheet.cells[t.col][t.row].str = getColumnStr(t.str1, t.str2, k + 1);
                }
            }
        }
    }

    /**
     * 获取上方字符串对象
     * @function getTopStrObj
     * @description 查找上方非空单元格并返回其内容和位置
     * @param {Object} colRow - 单元格位置对象 {col, row}
     * @returns {Object} 包含str和cell属性的对象
     */
    function getTopStrObj(colRow) {
        var col = colRow.col;
        var row = colRow.row;
        while (true) {
            var nextTopCell = getNextTopCell2(col, row);
            if (nextTopCell == null) {
                return {
                    str: "",
                    cell: null
                };
            }
            if (nextTopCell.col != col) {
                return {
                    str: "",
                    cell: null
                };
            }
            var colSpan1 = getCellColSpan(col, row);
            var colSpan2 = getCellColSpan(nextTopCell.col, nextTopCell.row);
            if (colSpan1 > colSpan2) {
                return {
                    str: "",
                    cell: null
                };
            }
            var t1 = getCellStringWithoutBlankAndUnit(nextTopCell);
            if (!t1) {
                return {
                    str: "",
                    cell: null
                };
            }
            if (t1.indexOf(leftMark) == -1) {
                if (!stringIsNotGood(t1)) {
                    return {
                        str: t1,
                        cell: nextTopCell
                    };
                }
                else {
                    return {
                        str: "",
                        cell: null
                    };
                }
            }
            col = nextTopCell.col;
            row = nextTopCell.row;
            nextTopCell = getNextTopCell2(col, row);
        }
        return {
            str: "",
            cell: null
        }
    }

    /**
     * 获取左侧字符串对象
     * @function getLeftStrObj
     * @description 查找左侧非空单元格并返回其内容和位置
     * @param {Object} colRow - 单元格位置对象 {col, row}
     * @returns {Object} 包含str和cell属性的对象
     */
    function getLeftStrObj(colRow) {
        var col = colRow.col;
        var row = colRow.row;
        while (true) {
            var nextLeftCell = getNextLeftCell2(col, row);
            if (nextLeftCell == null) {
                return {
                    str: "",
                    cell: null
                };
            }
            if (nextLeftCell.row != row) {
                return {
                    str: "",
                    cell: null
                };
            }
            var rowSpan1 = getCellRowSpan(col, row);
            var rowSpan2 = getCellRowSpan(nextLeftCell.col, nextLeftCell.row);
            if (rowSpan1 > rowSpan2) {
                return {
                    str: "",
                    cell: null
                };
            }
            var t1 = getCellStringWithoutBlankAndUnit(nextLeftCell);
            if (!t1) {
                return {
                    str: "",
                    cell: null
                };
            }
            if (t1.indexOf(leftMark) == -1) {
                if (!stringIsNotGood(t1)) {
                    return {
                        str: t1,
                        cell: nextLeftCell
                    };
                }
                else {
                    return {
                        str: "",
                        cell: null
                    };
                }
            }
            col = nextLeftCell.col;
            row = nextLeftCell.row;
            nextLeftCell = getNextLeftCell2(col, row);
        }
        return {
            str: "",
            cell: null
        };
    }   

    /**
     * 获取上方字符串（版本2）
     * @function getTopStr2
     * @description 获取上方单元格的字符串内容，考虑合并单元格和跨列情况
     * @param {Object} colRow - 单元格位置对象 {col, row}
     * @returns {string} 上方单元格的字符串内容
     */
    function getTopStr2(colRow) {
        var col = colRow.col;
        var row = colRow.row;
        var nextTopCell = getNextTopCell2(col, row);
        if (nextTopCell == null) {
            return "";
        }
        var colSpan1 = getCellColSpan(col, row);
        var colSpan2 = getCellColSpan(nextTopCell.col, nextTopCell.row);
        if (colSpan1 >= colSpan2) {
            return "";
        }
        var nextRightCell = getNextRightCell2(col, row);
        if (nextRightCell != null) {
            var rowSpan1 = getCellRowSpan(col, row);
            var rowSpan2 = getCellRowSpan(nextRightCell.col, nextRightCell.row);
            if (rowSpan1 > rowSpan2) {
                return "";
            }
            var nextTopCellStartCol = nextTopCell.col;
            var nextTopCellEndCol = nextTopCellStartCol + colSpan2 - 1;
            var nextRightCellStartCol = nextRightCell.col;
            var nextRightCellEndCol = nextRightCellStartCol + getCellColSpan(nextRightCell.col, nextRightCell.row) - 1;
            if (nextTopCellEndCol < nextRightCellEndCol) {
                return "";
            }
        }
        var t1 = getNextRightCell2(nextTopCell.col, nextTopCell.row);
        if (t1 != null) {
            if (t1.row == nextTopCell.row) {
                var s = cellSheet.cells[t1.col][t1.row].str;
                if (!s) {
                    return "";
                }
                if (s.indexOf(leftMark) == -1) {
                    return "";
                }
            }
        }
        var s1 = getCellStringWithoutBlankAndUnit(nextTopCell);
        if (!s1) {
            return "";
        }
        if (s1.indexOf(leftMark) == -1) {
            if (!stringIsNotGood(s1))
                return s1;
            return "";
        }
        return "";
    }

    /**
     * 获取左侧字符串（版本2）
     * @function getLeftStr2
     * @description 获取左侧单元格的字符串内容，考虑合并单元格和跨行情况
     * @param {Object} colRow - 单元格位置对象 {col, row}
     * @returns {string} 左侧单元格的字符串内容
     */
    function getLeftStr2(colRow) {
        var col = colRow.col;
        var row = colRow.row;
        var nextLeftCell = getNextLeftCell2(col, row);
        if (nextLeftCell == null) {
            return "";
        }
        var rowSpan1 = getCellRowSpan(col, row);
        var rowSpan2 = getCellRowSpan(nextLeftCell.col, nextLeftCell.row);
        if (rowSpan1 >= rowSpan2) {
            return "";
        }
        var startRow1 = row;
        var endRow1 = startRow1 + getCellRowSpan(col, row) - 1;
        var startRow2 = nextLeftCell.row;
        var endRow2 = startRow2 + getCellRowSpan(nextLeftCell.col, nextLeftCell.row) - 1;
        if (startRow2 > startRow1 || endRow2 < endRow1) {
            return "";
        }
        var s = getCellStringWithoutBlankAndUnit(nextLeftCell);
        if (!s) {
            return "";
        }
        if (s.indexOf(leftMark) == -1) {
            if (!stringIsNotGood(s))
                return s;
            return "";
        }
        return "";
    }

    /**
     * 获取上方字符串
     * @function getTopStr
     * @description 向上查找非空单元格并返回其字符串内容
     * @param {Object} colRow - 单元格位置对象 {col, row}
     * @returns {string} 上方单元格的字符串内容
     */
    function getTopStr(colRow) {
        var col = colRow.col;
        var row = colRow.row;
        while (true) {
            var nextTopCell = getNextTopCell(col, row);
            if (nextTopCell == null) {
                return "";
            }
            if (nextTopCell.col != col) {
                return "";
            }
            var colSpan1 = getCellColSpan(col, row);
            var colSpan2 = getCellColSpan(nextTopCell.col, nextTopCell.row);
            if (colSpan1 > colSpan2) {
                return "";
            }
            var t1 = getCellStringWithoutBlankAndUnit(nextTopCell);
            if (!t1) {
                return "";
            }
            if (t1.indexOf(leftMark) == -1) {
                if (!stringIsNotGood(t1))
                    return t1;
                return "";
            }
            col = nextTopCell.col;
            row = nextTopCell.row;
            nextTopCell = getNextTopCell(col, row);
        }
        return "";
    }

    /**
     * 获取左侧字符串
     * @function getLeftStr
     * @description 向左查找非空单元格并返回其字符串内容
     * @param {Object} colRow - 单元格位置对象 {col, row}
     * @returns {string} 左侧单元格的字符串内容
     */
    function getLeftStr(colRow) {
        var col = colRow.col;
        var row = colRow.row;
        while (true) {
            var nextLeftCell = getNextLeftCell(col, row);
            if (nextLeftCell == null) {
                return "";
            }
            if (nextLeftCell.row != row) {
                return "";
            }
            var rowSpan1 = getCellRowSpan(col, row);
            var rowSpan2 = getCellRowSpan(nextLeftCell.col, nextLeftCell.row);
            if (rowSpan1 > rowSpan2) {
                return "";
            }
            var t1 = getCellStringWithoutBlankAndUnit(nextLeftCell);
            if (!t1) {
                return "";
            }
            if (t1.indexOf(leftMark) == -1) {
                if (!stringIsNotGood(t1))
                    return t1;
                return "";
            }
            col = nextLeftCell.col;
            row = nextLeftCell.row;
            nextLeftCell = getNextLeftCell(col, row);
        }
        return "";
    }

    /**
     * 检查字符串是否不适合作为标题
     * @function stringIsNotGood
     * @description 判断字符串是否过长或为纯数字，不适合作为列标题
     * @param {string} s - 待检查的字符串
     * @returns {boolean} 如果不适合返回true
     */
    function stringIsNotGood(s) {
        var t = trimUnit(trimBlank(s));
        if (t.length > 20) {
            return true;
        }
        if (isNum(s)) {
            return true;
        }        
        return false;
    }

    /**
     * 数字正则表达式
     * @constant {RegExp}
     * @description 匹配纯数字字符串（包括中文数字符号）
     */
    const regexNum = /^[0-9－－-]+$/;
    
    /**
     * 检查是否为数字字符串
     * @function isNum
     * @description 判断字符串是否为纯数字
     * @param {string} s - 待检查的字符串
     * @returns {boolean} 如果是数字返回true
     */
    function isNum(s) {
        if (s.length < 4) {
            return false;
        }
        if (regexNum.test(s)) {
            return true;
        }
        return false;
    }

    /**
     * 中文字符正则表达式
     * @constant {RegExp}
     * @description 匹配中文字符范围
     */
    const regexChinese = /[\u4e00-\u9fa5]/;
    
    /**
     * 检查字符串是否包含中文
     * @function containsChinese
     * @description 判断字符串中是否包含中文字符
     * @param {string} str - 待检查的字符串
     * @returns {boolean} 如果包含中文返回true
     */
    function containsChinese(str) {
        return regexChinese.test(str);
    }

    /**
     * 截断字符串
     * @function truncateS
     * @description 在括号位置截断字符串
     * @param {string} s - 原始字符串
     * @returns {string} 截断后的字符串
     */
    function truncateS(s) {
        var L = ["(", " ("];
        for (var i = 0; i < L.length; i++) {
            var t = L[i];
            var pos1 = s.indexOf(t);
            if (pos1 != -1) {
                return s.substring(0, pos1);
            }
        }
        return s;
    }

    /**
     * 获取单元格字符串（去除空白和单位）
     * @function getCellStringWithoutBlankAndUnit
     * @description 获取单元格的纯文本内容，去除HTML标签、空白和单位
     * @param {Object} colRow - 单元格位置对象 {col, row}
     * @returns {string} 处理后的字符串
     */
    function getCellStringWithoutBlankAndUnit(colRow) {
        var s = cellSheet.cells[colRow.col][colRow.row].str;
        s = getHtmlText(s);
        s = trimBlank(s);
        s = trimUnit(s);
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
     * 生成列字符串
     * @function getColumnStr
     * @description 根据参考字符串和序号生成列名称
     * @param {string} str - 参考字符串1
     * @param {string} str2 - 参考字符串2
     * @param {number} order - 序号
     * @returns {string} 生成的列字符串
     */
    function getColumnStr(str, str2, order) {
        return new GenColumnStr({ refStr1: str, refStr2: str2, order: order }).doJob();
    }

    /**
     * 检查单元格是否足够大
     * @function isCellBigEnough
     * @description 判断单元格的宽度和高度是否满足最小要求
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
        if (col1 < 1 || row1 < 1 || col1 > cellSheet.colWidthList.length || row1 > cellSheet.rowHeightList.length) {
            return null;
        }
        var o = operCell.GetMergeRange(col1, row1);
        if (o != null && cellSheet.cells[col1 - 1][row1 - 1].isInMergeArea) {
            return {
                col: o.startCol - 1,
                row: o.startRow - 1
            }
        }
        else {
            return {
                col: col1 - 1,
                row: row1 - 1
            }
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

        }
        else {
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
            }
            else {
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

        }
        else {
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
            }
            else {
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

        }
        else {
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
            }
            else {
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

        }
        else {
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
            }
            else {
                return t;
            }
        }
    }

    /**
     * 获取左侧单元格（版本2）
     * @function getNextLeftCell2
     * @description 获取左侧单元格，考虑行跨度对齐
     * @param {number} col - 列索引
     * @param {number} row - 行索引
     * @returns {Object|null} 位置对象 {col, row} 或 null
     */
    function getNextLeftCell2(col, row) {
        var originalStartRow = row;
        var originalEndRow = originalStartRow + getCellRowSpan(col, row) - 1;
        function getNextLeftCellInner(col, row) {
            var col1, row1;
            var o = operCell.GetMergeRange(col + 1, row + 1);
            if (o != null && cellSheet.cells[col][row].isInMergeArea) {
                col1 = o.startCol - 1;
                row1 = o.startRow;

            }
            else {
                col1 = col + 1 - 1;
                row1 = row + 1;
            }
            var t = getRealColRowObj(col1, row1);
            if (t == null) {
                return null;
            }
            var startRow = row1 - 1;
            var endRow = startRow + getCellRowSpan(col1 - 1, row1 - 1) - 1;
            if (startRow > originalStartRow) {
                return null;
            }
            if (!isCellBigEnough(t.col, t.row)) {
                return getNextLeftCellInner(t.col, t.row);
            }
            return t;
        }

        return getNextLeftCellInner(col, row);
    }

    /**
     * 获取下方单元格（版本2）
     * @function getNextBottomCell2
     * @description 获取下方单元格，考虑列跨度对齐
     * @param {number} col - 列索引
     * @param {number} row - 行索引
     * @returns {Object|null} 位置对象 {col, row} 或 null
     */
    function getNextBottomCell2(col, row) {
        var originalStartCol = col;
        var originalEndCol = originalStartCol + getCellColSpan(col, row) - 1;
        function getNextBottomCellInner(col, row) {
            var col1, row1;
            var o = operCell.GetMergeRange(col + 1, row + 1);
            if (o != null && cellSheet.cells[col][row].isInMergeArea) {
                col1 = o.startCol;
                row1 = o.endRow + 1;

            }
            else {
                col1 = col + 1;
                row1 = row + 1 + 1;
            }
            var t = getRealColRowObj(col1, row1);
            if (t == null) {
                return null;
            }
            var startCol = col1 - 1;
            var endCol = startCol + getCellColSpan(col1 - 1, row1 - 1) - 1;
            if (startCol > originalStartCol) {
                return null;
            }
            if (!isCellBigEnough(t.col, t.row)) {
                return getNextBottomCellInner(t.col, t.row);
            }
            return t;
        }
        return getNextBottomCellInner(col, row);
    }

    /**
     * 获取上方单元格（版本2）
     * @function getNextTopCell2
     * @description 获取上方单元格，考虑列跨度对齐
     * @param {number} col - 列索引
     * @param {number} row - 行索引
     * @returns {Object|null} 位置对象 {col, row} 或 null
     */
    function getNextTopCell2(col, row) {
        var originalStartCol = col;
        var originalEndCol = originalStartCol + getCellColSpan(col, row) - 1;
        function getNextTopCellInner(col, row) {
            var col1, row1;
            var o = operCell.GetMergeRange(col + 1, row + 1);
            if (o != null && cellSheet.cells[col][row].isInMergeArea) {
                col1 = o.startCol;
                row1 = o.startRow - 1;

            }
            else {
                col1 = col + 1;
                row1 = row + 1 - 1;
            }
            var t = getRealColRowObj(col1, row1);
            if (t == null) {
                return null;
            }
            var startCol = col1 - 1;
            var endCol = startCol + getCellColSpan(col1 - 1, row1 - 1) - 1;
            if (startCol > originalStartCol) {
                return null;
            }
            if (!isCellBigEnough(t.col, t.row)) {
                return getNextTopCellInner(t.col, t.row);
            }
            return t;
        }
        return getNextTopCellInner(col, row);
    }

    /**
     * 获取右侧单元格（版本2）
     * @function getNextRightCell2
     * @description 获取右侧单元格，考虑行跨度对齐
     * @param {number} col - 列索引
     * @param {number} row - 行索引
     * @returns {Object|null} 位置对象 {col, row} 或 null
     */
    function getNextRightCell2(col, row) {
        var originalStartRow = row;
        var originalEndRow = originalStartRow + getCellRowSpan(col, row) - 1;
        function getNextRightCellInner(col, row) {
            var col1, row1;
            var o = operCell.GetMergeRange(col + 1, row + 1);
            if (o != null && cellSheet.cells[col][row].isInMergeArea) {
                col1 = o.endCol + 1;
                row1 = o.startRow;

            }
            else {
                col1 = col + 1 + 1;
                row1 = row + 1;
            }
            var t = getRealColRowObj(col1, row1);
            if (t == null) {
                return null;
            }
            var startRow = row1 - 1;
            var endRow = startRow + getCellRowSpan(col1 - 1, row1 - 1) - 1;
            if (startRow > originalStartRow) {
                return null;
            }
            if (!isCellBigEnough(t.col, t.row)) {
                return getNextRightCellInner(t.col, t.row);
            }
            return t;
        }

        return getNextRightCellInner(col, row);
    }

    /**
     * 获取上方单元格（版本3）
     * @function getNextTopCell3
     * @description 获取上方非空单元格，跳过空白单元格
     * @param {number} col - 列索引
     * @param {number} row - 行索引
     * @returns {Object|null} 位置对象 {col, row} 或 null
     */
    function getNextTopCell3(col, row) {
        var col1, row1;
        var o = operCell.GetMergeRange(col + 1, row + 1);
        if (o != null && cellSheet.cells[col][row].isInMergeArea) {
            col1 = o.startCol;
            row1 = o.startRow - 1;

        }
        else {
            col1 = col + 1;
            row1 = row + 1 - 1;
        }
        while (true) {
            var t = getRealColRowObj(col1, row1);
            if (t == null) {
                return null;
            }
            if (!isCellBigEnough(t.col, t.row) || getCellStringWithoutBlankAndUnit(t) == "") {
                row1 = t.row + 1 - 1;
            }
            else {
                return t;
            }
        }
    }

    /**
     * 获取右侧单元格（版本3）
     * @function getNextRightCell3
     * @description 获取右侧非空单元格，跳过空白单元格
     * @param {number} col - 列索引
     * @param {number} row - 行索引
     * @returns {Object|null} 位置对象 {col, row} 或 null
     */
    function getNextRightCell3(col, row) {
        var col1, row1;
        var o = operCell.GetMergeRange(col + 1, row + 1);
        if (o != null && cellSheet.cells[col][row].isInMergeArea) {
            col1 = o.endCol + 1;
            row1 = o.startRow;

        }
        else {
            col1 = col + 1 + 1;
            row1 = row + 1;
        }
        while (true) {
            var t = getRealColRowObj(col1, row1);
            if (t == null) {
                return null;
            }
            if (!isCellBigEnough(t.col, t.row) || getCellStringWithoutBlankAndUnit(t) == "") {
                col1 = t.col + 1 + getCellColSpan(t.col, t.row) - 1 + 1;
            }
            else {
                return t;
            }
        }
    }

    /**
     * 获取下方单元格（版本3）
     * @function getNextBottomCell3
     * @description 获取下方非空单元格，跳过空白单元格
     * @param {number} col - 列索引
     * @param {number} row - 行索引
     * @returns {Object|null} 位置对象 {col, row} 或 null
     */
    function getNextBottomCell3(col, row) {
        var col1, row1;
        var o = operCell.GetMergeRange(col + 1, row + 1);
        if (o != null && cellSheet.cells[col][row].isInMergeArea) {
            col1 = o.startCol;
            row1 = o.endRow + 1;

        }
        else {
            col1 = col + 1;
            row1 = row + 1 + 1;
        }
        while (true) {
            var t = getRealColRowObj(col1, row1);
            if (t == null) {
                return null;
            }
            if (!isCellBigEnough(t.col, t.row) || getCellStringWithoutBlankAndUnit(t) == "") {
                row1 = t.row + 1 + getCellRowSpan(t.col, t.row) - 1 + 1;
            }
            else {
                return t;
            }
        }
    }

    /**
     * 获取左侧单元格（版本3）
     * @function getNextLeftCell3
     * @description 获取左侧非空单元格，跳过空白单元格
     * @param {number} col - 列索引
     * @param {number} row - 行索引
     * @returns {Object|null} 位置对象 {col, row} 或 null
     */
    function getNextLeftCell3(col, row) {
        var col1, row1;
        var o = operCell.GetMergeRange(col + 1, row + 1);
        if (o != null && cellSheet.cells[col][row].isInMergeArea) {
            col1 = o.startCol - 1;
            row1 = o.startRow;

        }
        else {
            col1 = col + 1 - 1;
            row1 = row + 1;
        }
        while (true) {
            var t = getRealColRowObj(col1, row1);
            if (t == null) {
                return null;
            }
            if (!isCellBigEnough(t.col, t.row) || getCellStringWithoutBlankAndUnit(t) == "") {
                col1 = t.col + 1 - 1;
            }
            else {
                return t;
            }
        }
    }

    /**
     * 返回公共接口
     * @returns {Object} 包含所有公共方法的对象
     */
    return {
        doJob: doJob,
        getCellSize: getCellSize,
        getTopStr: getTopStr,
        getLeftStr: getLeftStr,
        getTopStr2: getTopStr2,
        getLeftStr2: getLeftStr2,
        getCellStringWithoutBlankAndUnit: getCellStringWithoutBlankAndUnit,
        getCellColSpan: getCellColSpan,
        getCellRowSpan: getCellRowSpan,
        isCellBigEnough: isCellBigEnough,
        trimBlank: trimBlank,
        getRealColRowObj: getRealColRowObj,
        getNextLeftCell: getNextLeftCell,
        getNextBottomCell: getNextBottomCell,
        getNextTopCell: getNextTopCell,
        getNextRightCell: getNextRightCell,
        getTopStrObj: getTopStrObj,
        getLeftStrObj: getLeftStrObj,
        getNextTopCell3: getNextTopCell3,
        getNextRightCell3: getNextRightCell3,
        getNextBottomCell3: getNextBottomCell3,
        getNextLeftCell3: getNextLeftCell3
    }
}