/**
 * @fileoverview 填充数据通用工具类模块 - 提供日期解析、格式化、人民币大写转换等通用功能
 * @description 该模块提供了数据处理过程中常用的工具函数，
 * 包括日期解析、日期格式化、人民币大写转换、单元格尺寸获取等功能。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 填充数据通用工具对象
 * @namespace Common
 * @description 提供日期解析、格式化、人民币大写转换等通用功能
 */
const Common = {
    /**
     * 大写日列表（1-31）
     * @type {string[]}
     */
    daxieriList: [
        "", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
        "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
        "二十一", "二十二", "二十三", "二十四", "二十五", "二十六", "二十七", "二十八", "二十九", "三十",
        "三十一"
    ],

    /**
     * 大写月列表（1-12）
     * @type {string[]}
     */
    daxieyueList: ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],

    /**
     * 大写年数字列表（0-9）
     * @type {string[]}
     */
    daxienianList: ["○", "一", "二", "三", "四", "五", "六", "七", "八", "九"],

    /**
     * 解析日期字符串
     * @param {string} dateStr - 日期字符串
     * @returns {Date} 解析后的日期对象
     * @throws {Error} 当日期格式无法识别时抛出错误
     */
    ParseDate: function (dateStr) {
        const patterns = [
            /(\d{4})年(\d{1,2})月(\d{1,2})日.*/,
            /(\d{4})-(\d{1,2})-(\d{1,2}).*/,
            /(\d{4})\/(\d{1,2})\/(\d{1,2}).*/,
            /(\d{1,2})\/(\d{1,2})\/(\d{4}).*/
        ];

        let year = -1, month = -1, day = -1;

        for (let i = 0; i < patterns.length; i++) {
            const match = dateStr.match(patterns[i]);
            if (match) {
                if (i === 3) {
                    year = parseInt(match[3]);
                    month = parseInt(match[1]);
                    day = parseInt(match[2]);
                } else {
                    year = parseInt(match[1]);
                    month = parseInt(match[2]);
                    day = parseInt(match[3]);
                }
                break;
            }
        }

        if (year !== -1 && month !== -1 && day !== -1) {
            return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
        }

        throw new Error(`将${dateStr}转换成日期格式失败!`);
    },

    /**
     * 合并PDF文件（待实现）
     * @param {string[]} inputPdfFiles - 输入PDF文件列表
     * @param {string} outputPdfFile - 输出PDF文件路径
     * @returns {Promise<void>}
     */
    MergePdfFiles: async function (inputPdfFiles, outputPdfFile) {
    },

    /**
     * 解析日期时间字符串
     * @param {string} dateTimeStr - 日期时间字符串
     * @returns {Date} 解析后的日期对象
     */
    ParseDateTime: function (dateTimeStr) {
        const timePattern = '[ T](\\d{1,2})[:时](\\d{1,2})[:分](\\d{1,2}).*';
        const patterns = [
            new RegExp(`(\\d{4})年(\\d{1,2})月(\\d{1,2})日${timePattern}`),
            new RegExp(`(\\d{4})-(\\d{1,2})-(\\d{1,2})${timePattern}`),
            new RegExp(`(\\d{4})\/(\\d{1,2})\/(\\d{1,2})${timePattern}`),
            new RegExp(`(\\d{1,2})\/(\\d{1,2})\/(\\d{4})${timePattern}`)
        ];

        let year = -1, month = -1, day = -1, hour = -1, minute = -1, second = -1;

        for (let i = 0; i < patterns.length; i++) {
            const match = dateTimeStr.match(patterns[i]);
            if (match) {
                if (i === 3) {
                    year = parseInt(match[3]);
                    month = parseInt(match[1]);
                    day = parseInt(match[2]);
                    hour = parseInt(match[4]);
                    minute = parseInt(match[5]);
                    second = parseInt(match[6]);
                } else {
                    year = parseInt(match[1]);
                    month = parseInt(match[2]);
                    day = parseInt(match[3]);
                    hour = parseInt(match[4]);
                    minute = parseInt(match[5]);
                    second = parseInt(match[6]);
                }
                break;
            }
        }

        if (year !== -1 && month !== -1 && day !== -1 && hour !== -1 && minute !== -1 && second !== -1) {
            return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
        } else {
            return this.ParseDate(dateTimeStr);
        }
    },

    /**
     * 去除字符串首尾的标点符号
     * @param {string} str - 原字符串
     * @returns {string} 处理后的字符串
     */
    TrimS: function (str) {
        while (true) {
            let original = str;
            str = str.replace(/^[、,，；]|[、,，；]$/, '');
            if (str === original) {
                break;
            }
        }
        return str;
    },

    /**
     * 写入日志（Node.js环境）
     * @param {string} message - 日志消息
     */
    WriteLog: function (message) {
        const logFile = 'H:\\A\\TestReportGenDll_java_metaData\\log.txt';
        const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        const logMessage = `${timestamp}: ${message}`;
        if (typeof fs !== 'undefined') {
            fs.appendFileSync(logFile, logMessage + '\n', 'utf8');
        }
    },

    /**
     * 获取单元格尺寸
     * @param {Object} cell - 单元格对象
     * @param {number} col - 列号
     * @param {number} row - 行号
     * @param {Object} sheet - 工作表对象
     * @returns {Object} 包含height和width的对象
     */
    GetCellSize: function (cell, col, row, sheet) {
        let startCol = 0, startRow = 0, endCol = 0, endRow = 0;
        let cellSize = { height: 0, width: 0 };

        if (cell.GetMergeRange(col, row, startCol, startRow, endCol, endRow) === 1) {
            cellSize.height = this.GetRowHeight(cell, startRow, endRow);
            cellSize.width = this.GetColWidth(cell, startCol, endCol);
        } else {
            cellSize.height = this.GetRowHeight(cell, row, row);
            cellSize.width = this.GetColWidth(cell, col, col);
        }

        return cellSize;
    },

    /**
     * 获取列宽度总和
     * @param {Object} cell - 单元格对象
     * @param {number} startCol - 起始列
     * @param {number} endCol - 结束列
     * @returns {number} 列宽度总和
     */
    GetColWidth: function (cell, startCol, endCol) {
        var totalWidth = 0;
        for (var col = startCol; col <= endCol; col++) {
            totalWidth += cell.GetColWidth(0, col, 0);
        }
        return totalWidth;
    },

    /**
     * 获取行高度总和
     * @param {Object} cell - 单元格对象
     * @param {number} startRow - 起始行
     * @param {number} endRow - 结束行
     * @returns {number} 行高度总和
     */
    GetRowHeight: function (cell, startRow, endRow) {
        var totalHeight = 0;
        for (var row = startRow; row <= endRow; row++) {
            totalHeight += cell.GetRowHeight(0, row, 0);
        }
        return totalHeight;
    },

    /**
     * 获取格式化的日期字符串
     * @param {string} dateStr - 日期字符串
     * @param {string} dateFormat - 日期格式
     * @returns {string} 格式化后的日期字符串
     */
    GetDateStr: function (dateStr, dateFormat) {
        try {
            var date = this.ParseDate(dateStr);
            return formatDate(date, dateFormat);
        } catch (e) {
            return dateStr;
        }
    },

    /**
     * 获取格式化的日期时间字符串
     * @param {string} dateTimeStr - 日期时间字符串
     * @param {string} dateTimeFormat - 日期时间格式
     * @returns {string} 格式化后的日期时间字符串
     */
    GetDateTimeStr: function (dateTimeStr, dateTimeFormat) {
        try {
            var dateTime = this.ParseDateTime(dateTimeStr);
            return formatDate(dateTime, dateTimeFormat);
        } catch (e) {
            return dateTimeStr;
        }
    },

    /**
     * 获取格式化的时间字符串
     * @param {string} timeStr - 时间字符串
     * @param {string} timeFormat - 时间格式
     * @returns {string} 格式化后的时间字符串
     */
    GetTimeStr: function (timeStr, timeFormat) {
        try {
            var dateTime = this.ParseDateTime(timeStr);
            return formatDate(dateTime, timeFormat);
        } catch (e) {
            return timeStr;
        }
    },

    /**
     * 获取大写中文年月日字符串
     * @param {string} dateStr - 日期字符串
     * @returns {string} 大写中文年月日字符串
     */
    GetDateDaxienianyueriStr: function (dateStr) {
        try {
            var date = this.ParseDateTime(dateStr);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            var yearStr = this.GetNumberDaxienian(year);
            var monthStr = this.GetNumberDaxieyue(month);
            var dayStr = this.GetNumberDaxieri(day);

            return yearStr + "年" + monthStr + "月" + dayStr + "日";
        } catch (e) {
            return dateStr;
        }
    },

    /**
     * 获取大写日
     * @param {number} day - 日（1-31）
     * @returns {string} 大写日字符串
     */
    GetNumberDaxieri: function (day) {
        return this.daxieriList[day];
    },

    /**
     * 获取大写月
     * @param {number} month - 月（1-12）
     * @returns {string} 大写月字符串
     */
    GetNumberDaxieyue: function (month) {
        return this.daxieyueList[month];
    },

    /**
     * 获取大写年
     * @param {number} year - 年
     * @returns {string} 大写年字符串
     */
    GetNumberDaxienian: function (year) {
        var yearStr = year.toString();
        var result = '';

        for (var i = 0; i < yearStr.length; i++) {
            var digit = parseInt(yearStr.charAt(i), 10);
            result += this.daxienianList[digit];
        }

        return result;
    },

    /**
     * 获取大写中文年月字符串
     * @param {string} dateStr - 日期字符串
     * @returns {string} 大写中文年月字符串
     */
    GetDateDaxienianyueStr: function (dateStr) {
        try {
            var date = this.ParseDateTime(dateStr);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;

            var yearStr = this.GetNumberDaxienian(year);
            var monthStr = this.GetNumberDaxieyue(month);

            return yearStr + "年" + monthStr + "月";
        } catch (e) {
            return dateStr;
        }
    },

    /**
     * 获取人民币大写字符串
     * @param {string|number} amount - 金额
     * @returns {string} 人民币大写字符串
     */
    GetRenmingbidaxieStr: function (amount) {
        try {
            return ConvertUpMoney.ToChinese(amount);
        } catch (e) {
            return amount;
        }
    }
};
