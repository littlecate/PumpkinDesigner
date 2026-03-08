/**
 * @fileoverview 金额转大写工具类模块 - 将数字金额转换为人民币大写格式
 * @description 该模块提供了将阿拉伯数字金额转换为中文大写金额的功能，
 * 支持整数和小数部分的转换，支持负数金额，最大支持千万亿级别。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 金额转大写工具对象
 * @namespace ConvertUpMoney
 * @description 提供数字金额转中文大写金额的功能
 */
var ConvertUpMoney = {
    /**
     * 数字对应的大写字符
     * @type {string[]}
     */
    NUMBERS: ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"],

    /**
     * 整数部分的数位单位
     * @type {string[]}
     */
    IUNIT: ["元", "拾", "佰", "仟", "万", "拾", "佰", "仟", "亿", "拾", "佰", "仟", "万", "拾", "佰", "仟"],

    /**
     * 小数部分的单位
     * @type {string[]}
     */
    DUNIT: ["角", "分", "厘"],

    /**
     * 将数字金额转换为中文大写金额
     * @param {string|number} amount - 金额字符串或数字
     * @returns {string} 中文大写金额
     */
    ToChinese: function (amount) {
        var str = String(amount);

        if (!str || !/^\d*(\.\d*)?$/.test(str)) {
            console.log("抱歉，请输入数字！");
            return str;
        }

        if (str === "0" || str === "0.00" || str === "0.0") {
            return "零元";
        }

        var isNegative = false;
        if (str.indexOf("-") === 0) {
            isNegative = true;
            str = str.replace("-", "");
        }

        str = str.replace(',', '.');

        var integerStr, decimalStr;

        if (str.indexOf(".") > -1) {
            integerStr = str.split(".")[0];
            decimalStr = str.split(".")[1];
        } else if (str.indexOf(".") === 0) {
            integerStr = "";
            decimalStr = str.substring(1);
        } else {
            integerStr = str;
            decimalStr = "";
        }

        if (integerStr.length > ConvertUpMoney.IUNIT.length) {
            console.log(str + "：超出计算能力");
            return str;
        }

        var integers = ConvertUpMoney.ToIntArray(integerStr);

        if (integers.length > 1 && integers[0] === 0) {
            console.log("抱歉，请输入数字！");
            return isNegative ? "-" + str : str;
        }

        var isWan = ConvertUpMoney.IsWanUnits(integerStr);
        var decimals = ConvertUpMoney.ToIntArray(decimalStr);

        var result = ConvertUpMoney.GetChineseInteger(integers, isWan) + ConvertUpMoney.GetChineseDecimal(decimals);

        return isNegative ? "负" + result : result;
    },

    /**
     * 将数字字符串转为数字数组
     * @param {string|number} number - 数字字符串或数字
     * @returns {number[]} 数字数组
     */
    ToIntArray: function (number) {
        return number.toString().split('').map(Number);
    },

    /**
     * 将整数部分转为大写的金额
     * @param {number[]} integers - 整数位数组
     * @param {boolean} isWan - 是否达到万位
     * @returns {string} 中文大写金额整数部分
     */
    GetChineseInteger: function (integers, isWan) {
        var chineseInteger = "";
        var length = integers.length;

        if (length === 1 && integers[0] === 0) {
            return "";
        }

        for (var i = 0; i < length; i++) {
            var key = "";

            if (integers[i] === 0) {
                if ((length - i) === 13) {
                    key = ConvertUpMoney.IUNIT[4];
                } else if ((length - i) === 9) {
                    key = ConvertUpMoney.IUNIT[8];
                } else if ((length - i) === 5 && isWan) {
                    key = ConvertUpMoney.IUNIT[4];
                } else if ((length - i) === 1) {
                    key = ConvertUpMoney.IUNIT[0];
                }

                if ((length - i) > 1 && integers[i + 1] !== 0) {
                    key += ConvertUpMoney.NUMBERS[0];
                }
            }

            chineseInteger += integers[i] === 0
                ? key
                : (ConvertUpMoney.NUMBERS[integers[i]] + ConvertUpMoney.IUNIT[length - i - 1]);
        }

        return chineseInteger;
    },

    /**
     * 将小数部分转为大写的金额
     * @param {number[]} decimals - 小数位数组
     * @returns {string} 中文大写金额小数部分
     */
    GetChineseDecimal: function (decimals) {
        var chineseDecimal = "";

        for (var i = 0; i < decimals.length; i++) {
            if (i === 3) break;
            chineseDecimal += decimals[i] === 0
                ? ""
                : (ConvertUpMoney.NUMBERS[decimals[i]] + ConvertUpMoney.DUNIT[i]);
        }

        return chineseDecimal;
    },

    /**
     * 判断当前整数部分是否已经达到【万】
     * @param {string} integerStr - 整数部分字符串
     * @returns {boolean} 是否达到万位
     */
    IsWanUnits: function (integerStr) {
        var length = integerStr.length;

        if (length > 4) {
            var subInteger = "";
            if (length > 8) {
                subInteger = integerStr.substring(length - 8, length - 4);
            } else {
                subInteger = integerStr.substring(0, length - 4);
            }
            return parseInt(subInteger) > 0;
        } else {
            return false;
        }
    }
};
