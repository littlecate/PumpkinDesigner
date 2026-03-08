/**
 * 修约工具类
 * 提供数值修约、字符串处理、日期处理等工具函数
 */
'use strict';

/**
 * 创建修约实例
 * @returns {Object} 修约实例
 */
function Amend() {
  /**
   * 判断字符串是否为空
   * @param {string} str - 待检查字符串
   * @returns {boolean} 是否为空
   */
  function gf_snull_x(str) {
    if (typeof str === "undefined" || str === null || str.toString() === "" || pos_x(str.toString(), "undefined") > 0) {
      return true;
    }
    return false;
  }

  /**
   * 判断数值是否为空
   * @param {number} num - 待检查数值
   * @returns {boolean} 是否为空
   */
  function gf_nnull_x(num) {
    if (typeof num === "undefined" || num === null || num === 0 || pos_x(num.toString(), "undefined") > 0 || isNaN(num)) {
      return true;
    }
    return false;
  }

  /**
   * 判断日期是否为空
   * @param {Date|string} date - 待检查日期
   * @returns {boolean} 是否为空
   */
  function gf_dtnull_x(date) {
    if (typeof date === "undefined" || date === null || date === "" || pos_x(date.toString(), "undefined") > 0) {
      return true;
    }
    return false;
  }

  /**
   * 获取字符ASCII码(带扩展)
   * @param {string} str - 字符串
   * @returns {number|undefined} ASCII码
   */
  function asca_x(str) {
    if (gf_snull_x(str)) {
      return undefined;
    }
    return str.charCodeAt(0);
  }

  /**
   * 获取字符ASCII码
   * @param {string} str - 字符串
   * @returns {number|undefined} ASCII码
   */
  function asc_x(str) {
    if (gf_snull_x(str)) {
      return undefined;
    }
    return str.charCodeAt(0);
  }

  /**
   * 获取字符(带扩展)
   * @param {string|number} value - 字符串或ASCII码
   * @returns {string|undefined} 字符
   */
  function chara_x(value) {
    if (typeof value === "string") {
      if (gf_snull_x(value)) {
        return undefined;
      }
      return value.substr(0, 1);
    } else if (typeof value === "number") {
      return String.fromCharCode(value);
    }
    return undefined;
  }

  /**
   * 获取字符
   * @param {string|number} value - 字符串或ASCII码
   * @returns {string|undefined} 字符
   */
  function char_x(value) {
    if (typeof value === "string") {
      if (gf_snull_x(value)) {
        return undefined;
      }
      return value.substr(0, 1);
    } else if (typeof value === "number") {
      return String.fromCharCode(value);
    }
    return undefined;
  }

  /**
   * 填充字符
   * @param {string} chars - 待填充字符
   * @param {number} count - 填充次数
   * @returns {string|undefined} 填充后的字符串
   */
  function fill_x(chars, count) {
    if (typeof chars === "undefined") {
      return undefined;
    }
    var result = "";
    for (var i = 0; i < count; i++) {
      result += chars;
    }
    return result;
  }

  /**
   * 从后向前查找字符串位置
   * @param {string} string1 - 被搜索字符串
   * @param {string} string2 - 搜索字符串
   * @param {number} [searchLength] - 搜索长度
   * @returns {number|undefined} 位置(1-based)
   */
  function lastpos_x(string1, string2, searchLength) {
    if (arguments.length === 2) {
      if (typeof string1 === "undefined" || typeof string2 === "undefined") {
        return undefined;
      }
      return string1.lastIndexOf(string2) + 1;
    } else if (arguments.length === 3) {
      if (typeof string1 === "undefined" || typeof string2 === "undefined" || typeof searchLength === "undefined") {
        return undefined;
      }
      var startPos = string1.length - searchLength;
      if (startPos < 0) {
        startPos = 0;
      }
      var subStr = string1.substr(startPos);
      return subStr.lastIndexOf(string2) + 1;
    }
    return undefined;
  }

  /**
   * 获取左侧字符串
   * @param {string} str - 字符串
   * @param {number} length - 长度
   * @returns {string|undefined} 左侧字符串
   */
  function left_x(str, length) {
    if (typeof str === "undefined") {
      return undefined;
    }
    if (length >= str.length) {
      return str;
    }
    return str.substr(0, length);
  }

  /**
   * 去除左侧空格
   * @param {string} str - 字符串
   * @returns {string|undefined} 处理后的字符串
   */
  function lefttrim_x(str) {
    if (typeof str === "undefined") {
      return undefined;
    }
    return str.replace(/(^\s*)/g, "");
  }

  /**
   * 获取字符串长度
   * @param {string} str - 字符串
   * @returns {number} 长度
   */
  function len_x(str) {
    if (!str) {
      return 0;
    }
    if (typeof str === "undefined") {
      return 0;
    }
    return str.length;
  }

  /**
   * 转换为小写
   * @param {string} str - 字符串
   * @returns {string|undefined} 小写字符串
   */
  function lower_x(str) {
    if (typeof str === "undefined") {
      return undefined;
    }
    return str.toLowerCase();
  }

  /**
   * 正则匹配
   * @param {string} str - 字符串
   * @param {string} pattern - 正则模式
   * @returns {boolean|undefined} 是否匹配
   */
  function match_x(str, pattern) {
    if (typeof str === "undefined" || typeof pattern === "undefined") {
      return undefined;
    }
    str = str.toString();
    return str.match_x(pattern) !== null;
  }

  /**
   * 获取中间字符串
   * @param {string} str - 字符串
   * @param {number} start - 起始位置(1-based)
   * @param {number} [length] - 长度
   * @returns {string|undefined} 中间字符串
   */
  function mid_x(str, start, length) {
    var subLen = 0;
    if (arguments.length === 2) {
      if (typeof str === "undefined" || typeof start === "undefined") {
        return undefined;
      }
      subLen = str.length - start + 1;
    } else if (arguments.length === 3) {
      if (typeof str === "undefined" || typeof start === "undefined" || typeof length === "undefined") {
        return undefined;
      }
      subLen = length;
    }
    return str.substr(start - 1, subLen);
  }

  /**
   * 查找字符串位置
   * @param {string} string1 - 被搜索字符串
   * @param {string} string2 - 搜索字符串
   * @param {number} [start] - 起始位置(1-based)
   * @returns {number|undefined} 位置(1-based)
   */
  function pos_x(string1, string2, start) {
    if (arguments.length === 2) {
      if (typeof string1 === "undefined" || typeof string2 === "undefined") {
        return undefined;
      }
      return string1.indexOf(string2) + 1;
    } else if (arguments.length === 3) {
      if (typeof string1 === "undefined" || typeof string2 === "undefined" || typeof start === "undefined") {
        return undefined;
      }
      return string1.indexOf(string2, start - 1) + 1;
    }
    return undefined;
  }

  /**
   * 替换字符串
   * @param {string} string1 - 原字符串
   * @param {number} start - 起始位置(1-based)
   * @param {number} length - 替换长度
   * @param {string} string2 - 替换字符串
   * @returns {string|undefined} 替换后的字符串
   */
  function replace_x(string1, start, length, string2) {
    if (typeof string1 === "undefined" || typeof start === "undefined" || typeof length === "undefined" || typeof string2 === "undefined") {
      return undefined;
    }
    return string1.replace(string1.substr(start - 1, length), string2);
  }

  /**
   * 反转字符串
   * @param {string} str - 字符串
   * @returns {string|undefined} 反转后的字符串
   */
  function reverse_x(str) {
    if (typeof str === "undefined") {
      return undefined;
    }
    var result = "";
    for (var i = 0; i < str.length; i++) {
      result += str.substr(str.length - i - 1, 1);
    }
    return result;
  }

  /**
   * 获取右侧字符串
   * @param {string} str - 字符串
   * @param {number} length - 长度
   * @returns {string|undefined} 右侧字符串
   */
  function right_x(str, length) {
    if (typeof str === "undefined") {
      return undefined;
    }
    if (length >= str.length) {
      return str;
    }
    var strValue = cstr(str);
    return strValue.substr(strValue.length - length, length);
  }

  /**
   * 去除右侧空格
   * @param {string} str - 字符串
   * @returns {string|undefined} 处理后的字符串
   */
  function righttrim_x(str) {
    if (typeof str === "undefined") {
      return undefined;
    }
    return str.replace(/(\s*$)/g, "");
  }

  /**
   * 生成空格字符串
   * @param {number} count - 空格数量
   * @returns {string|undefined} 空格字符串
   */
  function space_x(count) {
    if (typeof count === "undefined") {
      return undefined;
    }
    var result = "";
    for (var i = 0; i < count; i++) {
      result += " ";
    }
    return result;
  }

  /**
   * 去除两端空格
   * @param {string} str - 字符串
   * @returns {string|undefined} 处理后的字符串
   */
  function trim_x(str) {
    if (typeof str === "undefined") {
      return undefined;
    }
    return righttrim_x(lefttrim_x(str));
  }

  /**
   * 单词首字母大写
   * @param {string} str - 字符串
   * @returns {string|undefined} 处理后的字符串
   */
  function wordcap_x(str) {
    if (typeof str === "undefined") {
      return undefined;
    }
    var result = "";
    var words = str.split(/\w+/);
    for (var i = 0; i < words.length; i++) {
      if (words[i].length > 1) {
        result += words[i].substr(0, 1).toUpperCase() + words[i].substr(1);
      } else {
        result += words[i].substr(0, 1).toUpperCase();
      }
    }
    return result;
  }

  /**
   * 转换为大写
   * @param {string} str - 字符串
   * @returns {string|undefined} 大写字符串
   */
  function upper_x(str) {
    if (typeof str === "undefined") {
      return undefined;
    }
    return str.toUpperCase();
  }

  /**
   * 获取数组下界
   * @param {Array} arr - 数组
   * @param {number} [dimension] - 维度
   * @returns {number|undefined} 下界
   */
  function lowerbound_x(arr, dimension) {
    if (arguments.length === 1) {
      if (typeof arr === "undefined") {
        return undefined;
      }
      return 1;
    } else if (arguments.length === 2) {
      if (typeof arr === "undefined" || typeof dimension === "undefined") {
        return undefined;
      }
      return 1;
    }
    return undefined;
  }

  /**
   * 获取数组上界
   * @param {Array} arr - 数组
   * @param {number} [dimension] - 维度
   * @returns {number|undefined} 上界
   */
  function upperbound_x(arr, dimension) {
    if (arr.length === 0) {
      return 0;
    }
    if (arguments.length === 1) {
      if (typeof arr === "undefined") {
        return undefined;
      }
      return arr.length - 1;
    } else if (arguments.length === 2) {
      if (typeof arr === "undefined" || typeof dimension === "undefined") {
        return undefined;
      }
      return arr.length - 1;
    }
    return undefined;
  }

  /**
   * 获取日期的天数
   * @param {Date|string} date - 日期
   * @returns {number|undefined} 天数
   */
  function day_x(date) {
    if (typeof date === "undefined") {
      return undefined;
    }
    try {
      date = date.toString().replace(/-/g, "/");
      var dateObj = new Date(date);
      return dateObj.getDate();
    } catch (e) {
      top.alert("日期非法！" + date);
    }
  }

  /**
   * 获取星期名称
   * @param {Date|string} date - 日期
   * @returns {string|undefined} 星期名称
   */
  function dayname_x(date) {
    if (typeof date === "undefined") {
      return undefined;
    }
    try {
      date = date.toString().replace(/-/g, "/");
      var dateObj = new Date(date);
      var weekday = dateObj.getDay();
      var weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return weekdayNames[weekday];
    } catch (e) {
      top.alert("日期非法！" + date);
    }
  }

  /**
   * 获取星期数字(1-7)
   * @param {Date|string} date - 日期
   * @returns {number|undefined} 星期数字
   */
  function daynumber_x(date) {
    if (typeof date === "undefined") {
      return undefined;
    }
    try {
      date = date.toString().replace(/-/g, "/");
      var dateObj = new Date(date);
      return dateObj.getDay() + 1;
    } catch (e) {
      top.alert("日期非法！" + date);
    }
  }

  /**
   * 计算两个日期之间的天数差
   * @param {Date|string} date1 - 日期1
   * @param {Date|string} date2 - 日期2
   * @returns {number|undefined} 天数差
   */
  function daysafter(date1, date2) {
    if (typeof date1 === "undefined" || typeof date2 === "undefined") {
      return undefined;
    }
    try {
      var d1 = new Date(date1);
      var d2 = new Date(date2);
      return d1.dateDiff("d", d2);
    } catch (e) {
      top.alert("日期非法！" + date1 + " " + date2);
    }
  }

  /**
   * 获取小时
   * @param {string} timeStr - 时间字符串
   * @returns {number|undefined} 小时
   */
  function hour(timeStr) {
    if (typeof timeStr === "undefined") {
      return undefined;
    }
    try {
      var dateObj = new Date("2012/01/01 " + timeStr);
      return dateObj.getHours();
    } catch (e) {
      top.alert("时间非法！" + timeStr);
    }
  }

  /**
   * 获取分钟
   * @param {string} timeStr - 时间字符串
   * @returns {number|undefined} 分钟
   */
  function minute(timeStr) {
    if (typeof timeStr === "undefined") {
      return undefined;
    }
    try {
      var dateObj = new Date("2012/01/01 " + timeStr);
      return dateObj.getMinutes();
    } catch (e) {
      top.alert("时间非法！" + timeStr);
    }
  }

  /**
   * 获取月份
   * @param {Date|string} date - 日期
   * @returns {number|undefined} 月份(1-12)
   */
  function month(date) {
    if (typeof date === "undefined") {
      return undefined;
    }
    try {
      date = date.toString().replace(/-/g, "/");
      var dateObj = new Date(date);
      return dateObj.getMonth() + 1;
    } catch (e) {
      top.alert("时间非法！" + date);
    }
  }

  /**
   * 获取当前时间
   * @returns {Date} 当前时间
   */
  function now() {
    return new Date();
  }

  /**
   * 计算相对日期
   * @param {Date|string} date - 日期
   * @param {number} days - 天数偏移
   * @returns {Date|undefined} 相对日期
   */
  function relativedate(date, days) {
    if (typeof date === "undefined" || typeof days === "undefined") {
      return undefined;
    }
    try {
      var dateObj = new Date(date.replace(/-/g, "/"));
      return dateObj.dateAdd("d", days);
    } catch (e) {
      top.alert("日期非法！" + date);
    }
  }

  /**
   * 计算相对时间
   * @param {string} timeStr - 时间字符串
   * @param {number} seconds - 秒数偏移
   * @returns {string|undefined} 相对时间
   */
  function relativetime(timeStr, seconds) {
    if (typeof timeStr === "undefined" || typeof seconds === "undefined") {
      return undefined;
    }
    try {
      var dateObj = new Date("2012/01/01 " + timeStr);
      return dateObj.dateAdd("s", seconds).split(" ")[1];
    } catch (e) {
      top.alert("日期非法！");
    }
  }

  /**
   * 获取秒数
   * @param {string} timeStr - 时间字符串
   * @returns {number|undefined} 秒数
   */
  function second(timeStr) {
    if (typeof timeStr === "undefined") {
      return undefined;
    }
    try {
      var dateObj = new Date("2012/01/01 " + timeStr);
      return dateObj.getSeconds();
    } catch (e) {
      top.alert("时间非法！" + timeStr);
    }
  }

  /**
   * 计算两个时间之间的秒数差
   * @param {string} time1 - 时间1
   * @param {string} time2 - 时间2
   * @returns {number|undefined} 秒数差
   */
  function secondsafter(time1, time2) {
    if (typeof time1 === "undefined" || typeof time2 === "undefined") {
      return undefined;
    }
    try {
      var date1 = new Date("2012/01/01 " + time1);
      var date2 = new Date("2012/01/01 " + time2);
      if (time1 === "24:00") {
        date1 = new Date("2012/01/02 0:00");
      }
      return date1.dateDiff("s", date2);
    } catch (e) {
      top.alert("时间非法！" + time1 + " " + time2);
    }
  }

  /**
   * 获取当前日期
   * @returns {Date} 当前日期
   */
  function today() {
    return new Date();
  }

  /**
   * 获取年份
   * @param {Date|string} date - 日期
   * @returns {number|undefined} 年份
   */
  function year(date) {
    if (typeof date === "undefined") {
      return undefined;
    }
    try {
      date = date.toString().replace(/-/g, "/");
      var dateObj = new Date(date);
      return dateObj.getFullYear();
    } catch (e) {
      top.alert("时间非法！" + date);
    }
  }

  /**
   * 向上取整
   * @param {number} num - 数值
   * @returns {number|undefined} 取整结果
   */
  function ceiling(num) {
    if (typeof num === "undefined") {
      return undefined;
    }
    return Math.ceil(num);
  }

  /**
   * 向下取整
   * @param {number} num - 数值
   * @returns {number|undefined} 取整结果
   */
  function int_x(num) {
    if (typeof num === "undefined") {
      return undefined;
    }
    return Math.floor(num);
  }

  /**
   * 计算以10为底的对数
   * @param {number} x - 数值
   * @returns {number} 对数结果
   */
  function logten(x) {
    var arg1 = Math.log(x).toString();
    var arg2 = Math.log(10).toString();
    var t1 = 0, t2 = 0, r1, r2;
    try {
      t1 = arg1.toString().split(".")[1].length;
    } catch (e) {}
    try {
      t2 = arg2.toString().split(".")[1].length;
    } catch (e) {}
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
  }

  /**
   * 四舍五入
   * @param {number} x - 数值
   * @param {number} decimalPlaces - 小数位数
   * @returns {number|undefined} 四舍五入结果
   */
  function round(x, decimalPlaces) {
    if (typeof x === "undefined" || typeof decimalPlaces === "undefined") {
      return undefined;
    }
    return roundFix(Number(x), decimalPlaces);
  }

  /**
   * 标准四舍五入
   * @param {number} num - 待处理数值
   * @param {number} decimal - 保留的小数位数
   * @returns {number} 处理后的数值
   */
  function roundFix(num, decimal) {
    if (decimal === undefined) decimal = 0;
    var multiple = Math.pow(10, decimal);
    return Math.round(num * multiple) / multiple;
  }

  /**
   * 截断数值
   * @param {number} x - 数值
   * @param {number} decimalPlaces - 小数位数
   * @returns {number|undefined} 截断结果
   */
  function truncate(x, decimalPlaces) {
    if (typeof x === "undefined" || typeof decimalPlaces === "undefined") {
      return undefined;
    }
    var str = x.toString();
    if (str.indexOf(".") !== -1) {
      str = str + "000000000000000000000000000000000000000000000000000";
      return parseFloat(str.substr(0, str.indexOf(".") + decimalPlaces + 1));
    } else {
      return x;
    }
  }

  /**
   * 转换为十进制数
   * @param {string} str - 字符串
   * @returns {number|undefined} 十进制数
   */
  function dec_x(str) {
    if (typeof str === "undefined") {
      return undefined;
    }
    if (str === "") {
      return 0;
    }
    if (isNaN(str)) {
      return undefined;
    }
    return parseFloat(str);
  }

  var double_x = dec_x;
  var real_x = dec_x;

  /**
   * 转换为整数
   * @param {string} str - 字符串
   * @returns {number|undefined} 整数
   */
  function integer_x(str) {
    if (typeof str === "undefined") {
      return undefined;
    }
    if (isNaN(str)) {
      return undefined;
    }
    return parseInt(str);
  }

  var long_x = integer_x;
  var longlong_x = integer_x;

  /**
   * 转换为日期
   * @param {string} str - 字符串
   * @returns {string|undefined} 日期字符串
   */
  var date = function (str) {
    if (typeof str === "undefined") {
      return undefined;
    }
    str = str.toString().replace(/-/g, "/");
    var timestamp = Date.parse(str);
    if (isNaN(timestamp)) {
      return undefined;
    }
    var dateObj = new Date(timestamp);
    return (dateObj.getMonth() + 1) + "/" + dateObj.getDate() + "/" + dateObj.getFullYear();
  };

  /**
   * 转换为日期时间
   * @param {string} str - 字符串
   * @returns {Date|undefined} 日期对象
   */
  var datetime = function (str) {
    if (typeof str === "undefined") {
      return undefined;
    }
    str = str.toString().replace(/-/g, "/");
    var timestamp = Date.parse(str);
    if (isNaN(timestamp)) {
      return undefined;
    }
    return new Date(timestamp);
  };

  /**
   * 判断是否为日期
   * @param {string} str - 字符串
   * @returns {boolean} 是否为日期
   */
  var isdate = function (str) {
    if (typeof str === "undefined") {
      return false;
    }
    str = str.toString().replace(/-/g, "/");
    var timestamp = Date.parse(str + " 00:00:00.000");
    if (isNaN(timestamp)) {
      return false;
    }
    return true;
  };

  /**
   * 判断是否为空
   * @param {*} value - 值
   * @returns {boolean} 是否为空
   */
  var isnull = function (value) {
    if (typeof value === "undefined" || value === null || value.toString() === "" || pos_x(value.toString(), "undefined") > 0) {
      return true;
    }
    return false;
  };

  /**
   * 判断是否为数字
   * @param {*} value - 值
   * @returns {boolean} 是否为数字
   */
  var isnumber = function (value) {
    if (value === "") {
      return false;
    }
    if (value !== 0 && value !== "0" && !value) {
      return false;
    }
    if (typeof value === "undefined") {
      return false;
    }
    if (isNaN(value)) {
      return false;
    }
    return true;
  };

  /**
   * 判断是否为时间
   * @param {string} str - 字符串
   * @returns {boolean} 是否为时间
   */
  var istime = function (str) {
    if (typeof str === "undefined") {
      return false;
    }
    if (match_x(str, "^\\d{1,2}:\\d{1,2}$")) {
      str += ":00";
    }
    var timestamp = Date.parse("2012/01/01 " + str);
    if (isNaN(timestamp)) {
      return false;
    }
    return true;
  };

  /**
   * 转换为字符串
   * @param {*} value - 值
   * @param {string} [format] - 格式
   * @returns {string|undefined} 字符串
   */
  var cstr = function (value, format) {
    if (typeof value === "undefined") {
      return undefined;
    }
    if (format && match_x(format, "0+\\.+0*")) {
      if (format.indexOf(".") !== -1) {
        var digits = len_x(format) - (format.indexOf(".") + 1);
        var formattedValue = Number(gf_amel(parseFloat(value), digits)).toFixed(digits);
        return setFormatZero(len_x(format) - len_x(formattedValue)) + formattedValue;
      } else {
        var strValue = value.toString();
        return setFormatZero(len_x(format) - len_x(strValue)) + strValue;
      }
    }
    return value.toString();
  };

  /**
   * 生成指定数量的零
   * @param {number} count - 数量
   * @returns {string} 零字符串
   */
  var setFormatZero = function (count) {
    var result = "";
    for (var i = 0; i < count; i++) {
      result += "0";
    }
    return result;
  };

  /**
   * 转换为时间
   * @param {string} str - 字符串
   * @param {number} [a] - 分钟
   * @param {number} [b] - 秒
   * @param {number} [c] - 毫秒
   * @returns {string|undefined} 时间字符串
   */
  var time = function (str, a, b, c) {
    if (istime(str)) {
      return str;
    }
    str = str.toString().replace(/-/g, "/");
    var dateObj;
    if (arguments.length === 1) {
      if (typeof str === "undefined") {
        return undefined;
      }
      if (match_x(str.toString(), "\\d{1,2}:\\d{1,2}")) {
        str += ":00";
      }
      var timestamp = Date.parse(str);
      if (isNaN(timestamp)) {
        return undefined;
      }
      dateObj = new Date(timestamp);
    } else if (arguments.length === 3) {
      var timestamp = Date.parse("2012/01/01 " + str + ":" + a + ":" + b);
      if (isNaN(timestamp)) {
        return undefined;
      }
      dateObj = new Date(timestamp);
    } else if (arguments.length === 4) {
      var timestamp = Date.parse("2012/01/01 " + str + ":" + a + ":" + b + ":" + c);
      if (isNaN(timestamp)) {
        return undefined;
      }
      dateObj = new Date(timestamp);
    }
    if (dateObj === undefined) {
      return undefined;
    }
    return dateObj.getHours() + ":" + dateObj.getMinutes() + ":" + dateObj.getSeconds();
  };

  /**
   * 取模运算
   * @param {number} x - 被除数
   * @param {number} y - 除数
   * @returns {number|undefined} 余数
   */
  var mod = function (x, y) {
    if (typeof x === "undefined" || typeof y === "undefined") {
      return undefined;
    }
    return x % y;
  };

  /**
   * 设置为空
   * @param {*} str - 值
   * @returns {string} 空字符串
   */
  var setnull = function (str) {
    return "";
  };

  /**
   * 取绝对值
   * @param {number} x - 数值
   * @returns {number|undefined} 绝对值
   */
  var abs = function (x) {
    if (typeof x === "undefined") {
      return undefined;
    }
    if (isNaN(x)) {
      return;
    }
    return Math.abs(x);
  };

  /**
   * 字符串转数字
   * @param {string} str - 字符串
   * @returns {number} 数字
   */
  var gf_stringtonumber = function (str) {
    str = trim_x(str);
    var length = len_x(str);
    var result = "";
    for (var i = 1; i <= length; i++) {
      var char = mid_x(str, i, 1);
      if (pos_x("0123456789.", char) > 0) {
        result = result + char;
      }
    }
    result = trim_x(righttrim_x(lefttrim_x(result)));
    return result * 1;
  };

  /**
   * 计算乘方
   * @param {number} x - 底数
   * @param {number} n - 指数
   * @returns {number|undefined} 乘方结果
   */
  var countSquare = function (x, n) {
    if (typeof x === "undefined" || typeof n === "undefined") {
      return undefined;
    }
    if (isNaN(x) || isNaN(n)) {
      top.alert("输入的不是数字！");
      return;
    }
    return Math.pow(x, n);
  };

  /**
   * 判断是否为数组
   * @param {*} obj - 对象
   * @returns {boolean} 是否为数组
   */
  var isArray = function (obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };

  /**
   * 显示消息框
   * @param {string} title - 标题
   * @param {string} text - 文本
   */
  var messagebox = function (title, text) {
    top.alert(text);
  };

  /**
   * 十六进制转十进制
   * @param {string} hex - 十六进制字符串
   * @returns {number} 十进制数
   */
  function hexToInt(hex) {
    return parseInt("0x" + hex);
  }

  /**
   * 十六进制颜色转整数颜色
   * @param {string} hexColor - 十六进制颜色
   * @returns {number} 整数颜色值
   */
  function hexColorToIntColor(hexColor) {
    hexColor = hexColor.replace("#", "");
    var r = hexColor.substr(0, 2);
    var g = hexColor.substr(2, 2);
    var b = hexColor.substr(4, 2);
    return hexToInt(b) * 65536 + hexToInt(g) * 256 + hexToInt(r);
  }

  /**
   * 整数颜色转RGB颜色
   * @param {number} colorLong - 整数颜色值
   * @returns {string} RGB颜色字符串
   */
  function colorToRGB(colorLong) {
    var R = (colorLong & 0xff0000) >> 16;
    var G = (colorLong & 0x00ff00) >> 8;
    var B = colorLong & 0x0000ff;
    return "#" + intToHex(R) + intToHex(G) + intToHex(B);
  }

  /**
   * 整数转十六进制
   * @param {number} num - 整数
   * @returns {string} 十六进制字符串
   */
  function intToHex(num) {
    var str = num.toString(16);
    if (str.length === 1) {
      str = "0" + str;
    }
    return str;
  }

  /**
   * 混合颜色
   * @param {Array<string>} hexColorAr - 十六进制颜色数组
   * @returns {number} 混合后的颜色值
   */
  function mixColor(hexColorAr) {
    var mixRGBA = { alpha: 0, red: 0, green: 0, blue: 0 };
    for (var i = 0; i < hexColorAr.length; i++) {
      var rgba = color32ToRGBA(hexColorToIntColor(hexColorAr[i]));
      mixRGBA.alpha += rgba.alpha;
      mixRGBA.red += rgba.red;
      mixRGBA.green += rgba.green;
      mixRGBA.blue += rgba.blue;
    }
    return RGBAToColor32(mixRGBA);
  }

  /**
   * RGBA转32位颜色值
   * @param {Object} RGBA - RGBA对象
   * @returns {number} 32位颜色值
   */
  function RGBAToColor32(RGBA) {
    return (RGBA.alpha << 24) | (RGBA.red << 16) | (RGBA.green << 8) | RGBA.blue;
  }

  /**
   * 32位颜色值转RGBA
   * @param {number} color32 - 32位颜色值
   * @returns {Object} RGBA对象
   */
  function color32ToRGBA(color32) {
    var alpha = color32 >> 24;
    var red = (color32 >> 16) & 0xff;
    var green = (color32 >> 8) & 0xff;
    var blue = color32 & 0xff;
    return { alpha: alpha, red: red, green: green, blue: blue };
  }

  /**
   * 计算平方根
   * @param {number} x - 数值
   * @returns {number} 平方根
   */
  var sqrt = function (x) {
    return Math.sqrt(x);
  };

  /**
   * 计算反正切
   * @param {number} x - 数值
   * @returns {number} 反正切值
   */
  var atan = function (x) {
    return Math.atan(x);
  };

  /**
   * 计算PI的倍数
   * @param {number} x - 倍数
   * @returns {number} PI*x
   */
  var pi = function (x) {
    return Math.PI * x;
  };

  /**
   * 计算正切
   * @param {number} x - 数值
   * @returns {number} 正切值
   */
  var tan = function (x) {
    return Math.tan(x);
  };

  /**
   * 计算反正弦
   * @param {number} x - 数值
   * @returns {number} 反正弦值
   */
  var asin = function (x) {
    return Math.asin(x);
  };

  /**
   * 计算反余弦
   * @param {number} x - 数值
   * @returns {number} 反余弦值
   */
  var acos = function (x) {
    return Math.acos(x);
  };

  /**
   * 计算正弦
   * @param {number} x - 数值
   * @returns {number} 正弦值
   */
  var sin = function (x) {
    return Math.sin(x);
  };

  /**
   * 获取最大值
   * @param {number} x1 - 数值1
   * @param {number} x2 - 数值2
   * @returns {number} 最大值
   */
  var max = function (x1, x2) {
    return Math.max(x1, x2);
  };

  /**
   * 获取最小值
   * @param {number} x1 - 数值1
   * @param {number} x2 - 数值2
   * @returns {number} 最小值
   */
  var min = function (x1, x2) {
    return Math.min(x1, x2);
  };

  /**
   * 创建二维数组
   * @param {number} rows - 行数
   * @param {number} cols - 列数
   * @param {string} type - 类型(number/boolean/string)
   * @returns {Array} 二维数组
   */
  var getArray2D = function (rows, cols, type) {
    var defaultValue;
    if (type && type === "number") {
      defaultValue = 0;
    } else if (type && type === "boolean") {
      defaultValue = false;
    } else {
      defaultValue = "";
    }
    var result = [];
    for (var k = 1; k <= rows; k++) {
      result[k] = [];
      for (var j = 1; j <= cols; j++) {
        result[k][j] = defaultValue;
      }
    }
    return result;
  };

  /**
   * 获取项目参数
   * @param {string} itemTableName - 项目表名
   * @param {string} code - 编码
   * @returns {string} 参数值
   */
  var gf_getitemparm = function (itemTableName, code) {
    if (!self.cacheItemParmData) {
      cacheItemParmData = {};
    }
    if (cacheItemParmData[itemTableName + code]) {
      return cacheItemParmData[itemTableName + code];
    }
    var data = gf_getDataFromServer("itemParmList", "itemTableName='" + itemTableName + "' and id='" + code + "'");
    if (data.length > 0) {
      var result = data[0]["parmvalue"];
      cacheItemParmData[itemTableName + code] = result;
      return result;
    }
    return "";
  };

  /**
   * 钢筋类修约函数
   * @param {number} source - 源数值
   * @returns {number} 修约结果
   */
  function gf_amelsteel(source) {
    if (double_x(source) === 0) {
      return 0;
    }
    if (isnull(source)) {
      return double_x(source);
    }
    if (double_x(source) <= 200) {
      return gf_amel(double_x(source), 0);
    } else if (double_x(source) > 1000) {
      return gf_amel(double_x(source), -1);
    } else {
      return gf_amel(double_x(source) * 2, -1) / 2;
    }
  }

  /**
   * 修约函数(四舍五入)
   * @param {number} source - 源数值
   * @param {number} quantity - 修约位数(0=个位, 1=小数位, -1=十位)
   * @returns {number} 修约结果
   */
  function gf_amel(source, quantity) {
    var isNegative = false;
    if (source < 0) {
      source = Math.abs(source);
      isNegative = true;
    }
    source = convertScienceNum(source);
    source = gf_amel_func(source, quantity);
    source = gf_amel_func(source, quantity);
    if (isNegative) {
      source = -source;
    }
    return source;
  }

  /**
   * 科学计数法转数字
   * @param {number|string} value - 科学计数法数值
   * @returns {number} 普通数字
   */
  function convertScienceNum(value) {
    if (value === "") {
      return value;
    }
    var str = String(value);
    if (str.indexOf("E") !== -1 || str.indexOf("e") !== -1) {
      str = str.toLowerCase();
      var numStr = str.substr(0, str.indexOf("e"));
      var expStr = str.substr(str.indexOf("e") + 1);
      if (expStr.substr(0, 1) === "-") {
        var exp = Number(expStr.substring(1));
        if (exp > 4) {
          str = "0";
        } else {
          if (numStr.indexOf(".") !== -1) {
            exp = exp - numStr.indexOf(".");
            numStr = numStr.replace(".", "");
          }
          var zeros = "";
          for (var i = 0; i < exp; i++) {
            zeros += "0";
          }
          str = "0." + zeros + numStr;
        }
      } else {
        var exp = Number(expStr);
        if (numStr.indexOf(".") !== -1) {
          exp = exp - numStr.indexOf(".");
          numStr = numStr.replace(".", "");
        }
        var zeros = "";
        for (var i = 1; i < exp; i++) {
          zeros += "0";
        }
        str = numStr + zeros;
      }
    }
    return Number(str);
  }

  /**
   * 修约函数核心实现
   * @param {number} source - 源数值
   * @param {number} quantity - 修约位数
   * @returns {number} 修约结果
   */
  function gf_amel_func(source, quantity) {
    var dest = cstr(source);
    if (!dest) {
      return source;
    }
    if (dest.indexOf(".") !== -1 && dest.indexOf("9999999") !== -1) {
      var pos = dest.indexOf("9999999");
      dest = dest.substr(0, pos);
      if (dest.substr(dest.length - 1) === ".") {
        dest = cstr(Number(dest.substr(0, dest.length - 1)) + 1);
      } else {
        var part1 = dest.substr(0, len_x(dest) - 1);
        var part2 = cstr(Number(dest.substr(len_x(dest) - 1, 1)) + 1);
        dest = part1 + part2;
      }
    } else if (dest.indexOf(".") !== -1 && dest.indexOf("0000000") !== -1) {
      var pos = dest.indexOf("0000000");
      dest = dest.substr(0, pos);
    }

    var ePos = pos_x(dest, "E-");
    if (ePos > 0) {
      var tempStr = "";
      dest = mid_x(dest, 1, ePos - 1);
      for (var i = 1; i <= len_x(dest); i++) {
        if (mid_x(dest, i, 1) !== ".") {
          tempStr += mid_x(dest, i, 1);
        }
      }
      var exp = integer_x(mid_x(dest, ePos + 2));
      var zeros = "0.";
      for (var i = 1; i <= exp; i++) {
        zeros += "0";
      }
      dest = zeros + tempStr;
    }

    if (isnull(dest)) {
      return dec_x(dest);
    }

    if (dec_x(dest) === 0) {
      return 0;
    }

    var dotPos = pos_x(dest, ".");
    var strLen = len_x(dest);

    if (dotPos === 0 && quantity >= 0) {
      return dec_x(dest);
    }
    if (len_x(right_x(dest, strLen - dotPos)) <= quantity) {
      return dec_x(dest);
    }

    var temp, result;
    if (quantity > 0) {
      temp = right_x(dest, strLen - dotPos - quantity);
      result = dec_x(left_x(dest, dotPos + quantity));
      dest = left_x(dest, strLen - len_x(temp));
    } else {
      if (dotPos !== 0) {
        var intLen = len_x(left_x(dest, dotPos - 1));
      } else {
        var intLen = len_x(dest);
      }
      if (quantity < 0) {
        temp = right_x(dest, strLen - intLen - quantity);
        result = dec_x(left_x(dest, intLen + quantity) + left_x("00000000", abs(quantity)));
        dest = left_x(dest, strLen - len_x(temp));
      } else {
        temp = right_x(dest, strLen - dotPos);
        result = dec_x(left_x(dest, intLen));
        dest = left_x(dest, strLen - len_x(temp) - 1);
      }
    }

    var ch = asc_x(temp);
    var digit = ch - asc_x("0");
    if (digit <= 4) {
      if (quantity > 0) {
        return (result * Math.pow(10, quantity)) / Math.pow(10, quantity);
      } else {
        return result;
      }
    }

    var add = source > 0 ? 1 : -1;
    if (digit > 5) {
      if (quantity > 0) {
        for (var i = 1; i <= quantity; i++) {
          add = add / 10;
        }
      } else if (quantity < 0) {
        for (var i = 1; i <= abs(quantity); i++) {
          add = add * 10;
        }
      }
      if (quantity > 0) {
        return (result * Math.pow(10, quantity) + add * Math.pow(10, quantity)) / Math.pow(10, quantity);
      } else {
        return result + add;
      }
    }

    temp = right_x(temp, len_x(temp) - 1);
    if (dec_x(temp) !== 0) {
      if (quantity > 0) {
        for (var i = 1; i <= quantity; i++) {
          add = add / 10;
        }
      } else if (quantity < 0) {
        for (var i = 1; i <= abs(quantity); i++) {
          add = add * 10;
        }
      }
      if (quantity > 0) {
        return (result * Math.pow(10, quantity) + add * Math.pow(10, quantity)) / Math.pow(10, quantity);
      } else {
        return result + add;
      }
    } else {
      ch = asc_x(right_x(dest, 1));
      digit = ch - asc_x("0");
      if (mod(digit, 2) === 0) {
        if (quantity > 0) {
          return (result * Math.pow(10, quantity)) / Math.pow(10, quantity);
        } else {
          return result;
        }
      } else {
        if (quantity > 0) {
          for (var i = 1; i <= quantity; i++) {
            add = add / 10;
          }
        } else if (quantity < 0) {
          for (var i = 1; i <= abs(quantity); i++) {
            add = add * 10;
          }
        }
        if (quantity > 0) {
          return (result * Math.pow(10, quantity) + add * Math.pow(10, quantity)) / Math.pow(10, quantity);
        } else {
          return result + add;
        }
      }
    }
  }

  /**
   * 触发ItemChanged事件
   * @param {string} column - 列名
   */
  function triggerItemchanged(column) {}

  /**
   * 冒泡排序
   * @param {Array} arr - 数组
   */
  function bubbleSort(arr) {
    for (var i = 0; i < arr.length; i++) {
      for (var j = i; j < arr.length; j++) {
        if (arr[i] < arr[j]) {
          var temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
      }
    }
  }

  /**
   * 转换为数字数组
   * @param {Array} arr - 数组
   * @returns {Array} 数字数组
   */
  function gf_toNumberArray(arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === undefined) {
        continue;
      }
      arr[i] = Number(arr[i]);
    }
    return arr;
  }

  /**
   * 计算平均值
   * @param {Array} arr - 数组
   * @returns {number|string} 平均值
   */
  function avgCount(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
      if (gf_snull_x(arr[i])) {
        return "";
      }
      sum += arr[i];
    }
    return sum / arr.length;
  }

  /**
   * 计算平均值(跳过空值)
   * @param {Array} arr - 数组
   * @returns {number|string} 平均值
   */
  function avgCount2(arr) {
    var sum = 0;
    var count = 0;
    for (var i = 0; i < arr.length; i++) {
      if (gf_snull_x(arr[i])) {
        continue;
      }
      sum += arr[i];
      count++;
    }
    if (count > 0) {
      return sum / count;
    }
    return "";
  }

  /**
   * 获取输入框修约精度
   * @param {string} id - 元素ID
   * @param {Document} doc - 文档对象
   * @returns {number|string} 修约精度
   */
  function getPresionById(id, doc) {
    doc = doc || self.document;
    if (id === "" || typeof id === "undefined") {
      alert("传入的id为空！");
      return "";
    }
    var element = top.$("#" + id, doc);
    if (element.attr("presion") && element.attr("presion") !== "") {
      var value = element.val();
      var presion = element.attr("presion");
      if (presion.indexOf(".") !== -1) {
        if (presion.trim().split(".").length > 0) {
          return presion.trim().split(".")[1].length;
        }
      } else {
        if (presion === "100") {
          return -2;
        } else if (presion === "10") {
          return -1;
        } else if (presion === "0") {
          return 0;
        }
      }
    }
  }

  /**
   * 05修约方法
   * @param {number} source - 源数值
   * @param {number} wei - 修约位数
   * @returns {number} 修约结果
   */
  function gf_amelhalf(source, wei) {
    if (double_x(source) === 0) {
      return 0;
    }
    if (isnull(source)) {
      return double_x(source);
    } else {
      return gf_amel(double_x(source) * 2, wei - 1) / 2;
    }
  }

  /**
   * 02修约函数
   * @param {number} source - 源数值
   * @param {number} wei - 修约位数
   * @returns {number} 修约结果
   */
  function gf_amel02(source, wei) {
    if (double_x(source) === 0) {
      return 0;
    }
    if (isnull(source)) {
      return double_x(source);
    } else {
      return gf_amel(double_x(source) * 5, wei - 1) / 5;
    }
  }

  /**
   * 03修约函数
   * @param {number} source - 源数值
   * @param {number} wei - 修约位数
   * @returns {number} 修约结果
   */
  function gf_amel03(source, wei) {
    if (double_x(source) === 0) {
      return 0;
    }
    if (isnull(source)) {
      return double_x(source);
    } else {
      return gf_amel((double_x(source) * 10) / 3, wei - 1) * 0.3;
    }
  }

  /**
   * 四舍五入修约函数
   * @param {number} source - 源数值
   * @param {number} wei - 修约位数
   * @returns {number} 修约结果
   */
  function gf_amel45(source, wei) {
    if (double_x(source) === 0) {
      return 0;
    }
    if (isnull(source)) {
      return double_x(source);
    }
    wei = parseInt(wei);
    return roundFix(source, wei);
  }

  /**
   * 修正数值
   * @param {string} value - 数值字符串
   * @param {string} part1 - 整数部分
   * @param {string} part2 - 小数部分
   * @returns {Object} 修正结果
   */
  function gf_xiuzheng(value, part1, part2) {
    function accAdd(arg1, arg2) {
      arg1 = arg1.toString();
      arg2 = arg2.toString();
      var arg1Arr = arg1.split(".");
      var arg2Arr = arg2.split(".");
      var d1 = arg1Arr.length === 2 ? arg1Arr[1] : "";
      var d2 = arg2Arr.length === 2 ? arg2Arr[1] : "";
      var maxLen = Math.max(d1.length, d2.length);
      var m = Math.pow(10, maxLen);
      var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
      var d = arguments[2];
      return typeof d === "number" ? Number(result.toFixed(d)) : result;
    }

    if (value.indexOf(".") !== -1 && value.indexOf("9999999") !== -1) {
      var pos = value.indexOf("9999999");
      value = value.substr(0, pos);
      if (value.substr(value.length - 1) === ".") {
        value = cstr(Number(value.substr(0, value.length - 1)) + 1);
      } else {
        part1 = value.substr(0, value.indexOf("."));
        var t1 = value.substr(value.indexOf(".") + 1);
        var t2 = t1.substr(t1.length - 1);
        if (t1.length === t2.length) {
          part2 = Number(t2) + 1;
        } else {
          part2 = cstr(accAdd(Number("0." + t1), Math.pow(0.1, Number(t1.length))));
          part2 = part2.substr(part2.indexOf(".") + 1);
        }
        value = part1 + "." + part2;
      }
    } else if (value.indexOf(".") !== -1 && value.indexOf("0000000") !== -1) {
      var pos = value.indexOf("0000000");
      value = value.substr(0, pos);
    }
    return { v: value, part1: part1, part2: part2 };
  }

  /**
   * 测试是否相等
   * @param {*} a - 值1
   * @param {*} b - 值2
   */
  function test_isEqual(a, b) {
    if (a !== b) {
      console.log("不一致,a:" + a + ",b:" + b);
    } else {
      console.log("一致,a:" + a + ",b:" + b);
    }
  }

  /**
   * 测试非零进位修约
   */
  function gf_amelZero_test() {
    function test1() {
      var x1 = 12030.4050607089;
      var acturalValues = ["12100", "12030", "12031", "12030.4", "12030.41", "12030.405", "12030.4051"];
      var index = 0;
      for (var i = -2; i < 5; i++) {
        var x2 = gf_amelZero(x1, i).toString();
        test_isEqual(x2, acturalValues[index]);
        index++;
      }
    }
    test1();
  }

  /**
   * 测试非零进位修约2
   */
  function gf_amelZero_test2() {
    function test1() {
      var x1 = 25.092000000000002;
      var acturalValue = "25.1";
      var x2 = gf_amelZero(x1, 1);
      test_isEqual(x2, acturalValue);
    }
    test1();
  }

  /**
   * 非零进位修约函数
   * @param {number} source - 源数值
   * @param {number} wei - 修约位数
   * @returns {number} 修约结果
   */
  function gf_amelZero(source, wei) {
    function accAdd(arg1, arg2) {
      arg1 = arg1.toString();
      arg2 = arg2.toString();
      var arg1Arr = arg1.split(".");
      var arg2Arr = arg2.split(".");
      var d1 = arg1Arr.length === 2 ? arg1Arr[1] : "";
      var d2 = arg2Arr.length === 2 ? arg2Arr[1] : "";
      var maxLen = Math.max(d1.length, d2.length);
      var m = Math.pow(10, maxLen);
      var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
      var d = arguments[2];
      return typeof d === "number" ? Number(result.toFixed(d)) : result;
    }

    function getNumber(n) {
      var str = "0.";
      for (var i = 0; i < n - 1; i++) {
        str += "0";
      }
      str += "1";
      return double_x(str);
    }

    function getNumber2(n) {
      var str = "1";
      for (var i = 0; i < n; i++) {
        str += "0";
      }
      return double_x(str);
    }

    function xiuzheng(value, part1, part2) {
      if (value.indexOf(".") !== -1 && value.indexOf("9999999") !== -1) {
        var pos = value.indexOf("9999999");
        value = value.substr(0, pos);
        if (value.substr(value.length - 1) === ".") {
          value = cstr(Number(value.substr(0, value.length - 1)) + 1);
        } else {
          part1 = value.substr(0, value.indexOf("."));
          var t1 = value.substr(value.indexOf(".") + 1);
          var t2 = t1.substr(t1.length - 1);
          if (t1.length === t2.length) {
            part2 = Number(t2) + 1;
          } else {
            part2 = cstr(accAdd(Number("0." + t1), Math.pow(0.1, Number(t1.length))));
            part2 = part2.substr(part2.indexOf(".") + 1);
          }
          value = part1 + "." + part2;
        }
      } else if (value.indexOf(".") !== -1 && part2.indexOf("0000000") !== -1) {
        var pos = part2.indexOf("0000000");
        part2 = part2.substr(0, pos);
      }
      return { v: value, part1: part1, part2: part2 };
    }

    if (double_x(source) === 0) {
      return 0;
    }

    if (isnull(source)) {
      return double_x(source);
    }

    var str = source.toString();
    var dotPos = str.indexOf(".");
    wei = parseInt(wei);
    var part1 = str.substr(0, dotPos);
    var part2 = str.substr(dotPos + 1);
    var o = xiuzheng(str, part1, part2);
    str = o.v;
    part1 = o.part1;
    part2 = o.part2;

    if (part1 !== "" && part2 !== "") {
      if (part1.indexOf(".") !== -1) {
        source = part1 + "" + part2;
      } else {
        source = part1 + "." + part2;
      }
    } else if (part1 !== "" && part1 !== ".") {
      source = part1;
    } else if (part2 !== "" && part2 !== ".") {
      source = part2;
    }

    part1 = part1.replace(".", "");
    part2 = part2.replace(".", "");

    if (wei > 0) {
      if (dotPos === -1) {
        return double_x(source);
      }
      if (part2.length <= wei) {
        return double_x(source);
      }
      var t = part2.substr(wei, 1);
      var t1 = "0." + part2.substr(0, wei);
      var t2 = t1;
      if (t !== "0") {
        t2 = accAdd(t1, getNumber(wei));
      }
      var t3 = accAdd(part1, t2);
      return double_x(t3);
    } else if (wei === 0) {
      var t = part2.substr(0, 1);
      if (t !== "0") {
        return double_x(accAdd(part1, 1));
      }
      return double_x(part1);
    } else {
      wei = Math.abs(wei);
      var n = part1.length;
      if (n - wei >= 0) {
        var t = part1.substr(n - wei, 1);
        var t1 = part1.substr(0, n - wei);
        var t2 = 0;
        if (t !== "0") {
          t2 = getNumber2(wei);
        }
        return double_x(accAdd(t1 * getNumber2(wei), t2));
      } else {
        return double_x(part1);
      }
    }
  }

  /**
   * 综合修约方法
   * @param {number} value - 数值
   * @param {string} amendType - 修约类型
   * @param {string} presion - 精度
   * @param {string} displayValue - 显示格式
   * @param {string} fixnum - 有效位数
   * @returns {number|string} 修约结果
   */
  function gf_amel_all(value, amendType, presion, displayValue, fixnum) {
    if (typeof displayValue !== "undefined" && displayValue !== "" && displayValue.indexOf("E") > -1) {
      return gf_dotE(value, displayValue);
    } else if (amendType) {
      if (amendType === "11") {
        var num = Number(fixnum);
        return gf_dotEx(value, num);
      } else if (presion && presion !== "") {
        var precision = Number(presion);
        if (amendType === "00") {
          return gf_amel(value, precision);
        } else if (amendType === "05") {
          return gf_amelhalf(value, precision);
        } else if (amendType === "02") {
          return gf_amel02(value, precision);
        } else if (amendType === "03") {
          return gf_amel03(value, precision);
        } else if (amendType === "22") {
          return gf_amel45(value, precision);
        } else if (amendType === "04") {
          return gf_amelZero(value, precision);
        } else {
          return gf_amelsteel(value);
        }
      } else {
        return gf_amel(value, precision);
      }
    } else {
      return value;
    }
  }

  /**
   * 科学计数法修约
   * @param {number} value - 数值
   * @param {string} displayValue - 显示格式
   * @returns {number} 修约结果
   */
  function gf_dotE(value, displayValue) {
    if (value === "" || isNaN(value) || !displayValue || displayValue.indexOf("E") === -1) {
      return value;
    }
    var str = Number(value).toExponential().toString().toLowerCase();
    var ar1 = str.split("e");
    var ar2 = displayValue.toLowerCase().split("e");
    var v1 = gf_amel(Number(ar1[0]), ar2[0].length - 2);
    var result = v1.toString() + "E" + ar1[1];
    return Number(result);
  }

  /**
   * 有效位修约
   * @param {number} value - 数值
   * @param {number} n - 有效位数
   * @returns {number} 修约结果
   */
  function gf_dotEx(value, n) {
    if (!value) {
      return value;
    }
    var str = value.toExponential().toString().toLowerCase();
    var ar = str.split("e");
    var s1 = ar[0].substr(0, n + 3);
    return Number(gf_amel(Number(s1), n - 1) + "E" + ar[1]);
  }

  /**
   * 保留有效位数字
   * @param {number} num - 数值
   * @param {number} n - 有效位数
   * @returns {string} 格式化结果
   */
  function gf_dot(num, n) {
    var str = cstr(num);
    var zeros = "0000000000";
    var result = "";
    var hasDecimal = pos_x(str, ".") > 0;
    var dotPos = hasDecimal ? pos_x(str, ".") : 0;

    if (!hasDecimal) {
      if (len_x(str) === n) {
        result = str;
      } else if (len_x(str) < n) {
        result = str + "." + left_x(zeros, n - len_x(str));
      } else {
        var scientific = cstr(num / Math.pow(10, len_x(str) - 1));
        result = scientific + "*10^" + cstr(len_x(str) - 1);
      }
    } else {
      var intPart = str.substr(0, dotPos - 1);
      var decPart = str.substr(dotPos);
      var totalLen = len_x(intPart) + len_x(decPart) - 1;
      if (totalLen === n) {
        result = str;
      } else if (totalLen < n) {
        result = str + left_x(zeros, n - totalLen);
      } else {
        result = str.substr(0, n + 1);
      }
    }

    if (right_x(result, 1) === ".") {
      result = mid_x(result, 1, len_x(result) - 1);
    }
    return result;
  }

  /**
   * 判断是否包含中文
   * @param {string} name - 字符串
   * @returns {boolean} 是否包含中文
   */
  function isChinese(name) {
    if (name.length === 0) return false;
    for (var i = 0; i < name.length; i++) {
      if (name.charCodeAt(i) > 128) return true;
    }
    return false;
  }

  /**
   * 判断是否为邮箱
   * @param {string} name - 字符串
   * @returns {boolean} 是否为邮箱
   */
  function isMail(name) {
    if (!isEnglish(name)) return false;
    var atIndex = name.indexOf("@");
    var lastAtIndex = name.lastIndexOf("@");
    if (atIndex === -1) return false;
    if (atIndex !== lastAtIndex) return false;
    if (atIndex === name.length) return false;
    return true;
  }

  /**
   * 判断是否为数字字符串
   * @param {string} name - 字符串
   * @returns {boolean} 是否为数字字符串
   */
  function isNumber(name) {
    if (name.length === 0) return false;
    for (var i = 0; i < name.length; i++) {
      if (name.charAt(i) < "0" || name.charAt(i) > "9") return false;
    }
    return true;
  }

  /**
   * 设置格式
   * @param {number|string} value - 值
   * @param {Object} amendObj - 修约对象
   * @returns {number|string} 格式化后的值
   */
  function setFormat(value, amendObj) {
    if (value === "") {
      return value;
    }
    if (!amendObj) {
      return value;
    }
    var amendType = amendObj.amendType;
    var fixnum = amendObj.fixnum;
    var format = amendObj.displayValue;
    if (amendType === "11" && fixnum !== "") {
      var num = Number(fixnum);
      value = gf_dot(value, num);
    } else if (format !== "" && value.toString() !== "" && value !== null && !isNaN(value)) {
      if (format.indexOf("E") !== -1) {
        value = toExponentialEx(value, format);
      } else {
        value = formatNum(value, format);
      }
    }
    return value;
  }

  /**
   * 转换为科学计数法格式
   * @param {number} value - 数值
   * @param {string} format - 格式
   * @returns {string} 科学计数法字符串
   */
  function toExponentialEx(value, format) {
    var v = Number(value).toExponential().toString().toLowerCase();
    format = format.toLowerCase();
    var ar1 = v.split("e");
    var ar2 = format.split("e");
    var result = formatNum(ar1[0], ar2[0]) + "E" + formatNum(ar1[1], ar2[1].replace("+", ""));
    return result;
  }

  /**
   * 格式化数字
   * @param {number|string} value - 数值
   * @param {string} format - 格式
   * @returns {string} 格式化后的字符串
   */
  function formatNum(value, format) {
    value = value.toString();
    if (isNaN(value)) {
      return value;
    }
    var haveMinusSign = false;
    if (Number(value) < 0) {
      value = right_x(value, len_x(value) - 1);
      haveMinusSign = true;
    }
    if (format.indexOf(".") !== -1) {
      var decimalPlaces = format.split(".")[1].length;
      if (value.indexOf(".") !== -1) {
        if (decimalPlaces > value.split(".")[1].length) {
          if (format.indexOf("E+") === -1) {
            value = value + setFormatZero(decimalPlaces - value.split(".")[1].length);
          }
        } else {
          value = value.substring(0, value.length - (value.split(".")[1].length - decimalPlaces));
        }
      } else {
        value = value + "." + setFormatZero(decimalPlaces);
      }
    } else {
      value = setFormatZero(format.length - value.length) + value;
    }
    return haveMinusSign ? "-" + value : value;
  }

  return {
    gf_amel_all: gf_amel_all,
    setFormat: setFormat,
  };
}
