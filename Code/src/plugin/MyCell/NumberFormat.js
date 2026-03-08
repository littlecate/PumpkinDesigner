/**
 * 数字格式化工具类
 * 提供数字与字母之间的转换功能（用于Excel列标）
 */
'use strict';

/**
 * 数字格式化工具对象
 */
const NumberFormat = {};

/**
 * ASCII码转字符
 * @param {number} asciiCode - ASCII码值（0-255）
 * @returns {string} 对应的字符
 * @throws {Error} 当ASCII码不在有效范围内时抛出错误
 */
function Chr(asciiCode) {
    if (asciiCode >= 0 && asciiCode <= 255) {
        return String.fromCharCode(asciiCode);
    } else {
        throw new Error("ASCII Code is not valid.");
    }
}

/**
 * 字母转数字（26进制转换）
 * 将Excel列标（如A, B, ..., Z, AA, AB, ...）转换为数字
 * @param {string} columnLabel - 列标字符串（如 A, B, AA）
 * @returns {number} 对应的数字
 */
NumberFormat.StringToNumber26 = function (columnLabel) {
    var result = 0;
    for (var i = 0; i < columnLabel.length; i++) {
        var charCode = columnLabel.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
        result = result * 26 + charCode;
    }
    return result;
};

/**
 * 数字转字母（26进制转换）
 * 将数字转换为Excel列标（如1->A, 2->B, ..., 26->Z, 27->AA）
 * @param {number} number - 数字（从1开始）
 * @returns {string} 对应的列标字符串
 */
NumberFormat.NumberToString26 = function (number) {
    var result = '';
    while (number > 0) {
        var remainder = (number - 1) % 26;
        result = String.fromCharCode(65 + remainder) + result;
        number = Math.floor((number - 1 - remainder) / 26);
    }
    return result;
};

/**
 * 26个字母列表
 * @type {string[]}
 */
var string26List = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
    "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
];

/**
 * 字符转ASCII码
 * @param {string} character - 单个字符
 * @returns {number} ASCII码值
 * @throws {Error} 当字符不是单个字符时抛出错误
 */
function Asc(character) {
    if (character.length === 1) {
        return character.charCodeAt(0);
    } else {
        throw new Error("Character is not valid.");
    }
}
