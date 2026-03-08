'use strict';

/**
 * @fileoverview 选择模板模块 - 提供报表模板选择功能
 * @description 该模块根据条件信息从多个模板中选择合适的模板，
 * 支持字符串、数值、日期类型的条件比较。
 * @author MyCell Designer
 * @version 1.0.0
 */

/**
 * 选择模板类
 * @class SelectTemplate
 * @description 根据条件选择合适的报表模板
 * @param {Object} rsAll - 所有结果集数据
 * @param {Array} reportTemplateConditionInfoList - 报表模板条件信息列表
 */
function SelectTemplate(rsAll, reportTemplateConditionInfoList) {
    this.rsAll = rsAll;
    this.reportTemplateConditionInfoList = reportTemplateConditionInfoList;
}

/**
 * 获取文件键列表
 * @function GetFileKeyList
 * @description 获取满足所有条件的模板文件键列表
 * @returns {Array.<string>} 文件键列表
 */
SelectTemplate.prototype.GetFileKeyList = function () {
    var fileKeyList = [];
    for (var i = 0; i < this.reportTemplateConditionInfoList.length; i++) {
        var conditionInfo = this.reportTemplateConditionInfoList[i];
        if (this.IsAllConditionSatisfied(conditionInfo)) {
            fileKeyList.push(conditionInfo.fileKey);
        }
    }
    return fileKeyList;
};

/**
 * 检查是否所有条件都满足
 * @function IsAllConditionSatisfied
 * @description 检查条件信息中的所有条件组是否至少有一个满足
 * @param {Object} conditionInfo - 条件信息对象
 * @returns {boolean} 是否满足条件
 */
SelectTemplate.prototype.IsAllConditionSatisfied = function (conditionInfo) {
    for (var i = 0; i < conditionInfo.reportTemplateConditionList.length; i++) {
        var conditionGroup = conditionInfo.reportTemplateConditionList[i];
        if (this.IsOneGroupConditionSatisfied(conditionGroup)) {
            return true;
        }
    }
    return false;
};

/**
 * 检查单个条件组是否满足
 * @function IsOneGroupConditionSatisfied
 * @description 检查单个条件组中的所有条件是否都满足
 * @param {Array} conditionGroup - 条件组数组
 * @returns {boolean} 是否满足所有条件
 */
SelectTemplate.prototype.IsOneGroupConditionSatisfied = function (conditionGroup) {
    for (var i = 0; i < conditionGroup.length; i++) {
        var condition = conditionGroup[i];
        if (!this.IsConditionEvalIsTrue(condition)) {
            return false;
        }
    }
    return true;
};

/**
 * 检查条件评估是否为真
 * @function IsConditionEvalIsTrue
 * @description 根据条件类型（字符、数值、日期）评估条件是否满足
 * @param {Object} condition - 条件对象
 * @returns {boolean} 条件是否满足
 */
SelectTemplate.prototype.IsConditionEvalIsTrue = function (condition) {
    var tAr = condition.columnName.split('.');
    var t = tAr[0];
    var c = tAr[1];
    var v = this.rsAll[t][0][c].toString();

    if (condition.columnType === "C") {
        return this.CompareString(v, condition);
    } else if (condition.columnType === "N") {
        return this.CompareNumber(v, condition);
    } else if (condition.columnType === "D") {
        return this.CompareDate(v, condition);
    } else {
        throw new Error("模板选择字段类型" + condition.columnType + "还未实现!");
    }
};

/**
 * 比较日期
 * @function CompareDate
 * @description 比较两个日期值
 * @param {string} v - 日期字符串值
 * @param {Object} condition - 条件对象，包含operation和value属性
 * @returns {boolean} 比较结果
 */
SelectTemplate.prototype.CompareDate = function (v, condition) {
    var d1 = Common.ParseDate(v);
    var d2 = Common.ParseDate(condition.value);
    var t = d1 - d2;

    if (condition.operation === "=") {
        return t === 0;
    } else if (condition.operation === "<>") {
        return t !== 0;
    } else if (condition.operation === "<") {
        return t < 0;
    } else if (condition.operation === "<=") {
        return t <= 0;
    } else if (condition.operation === ">") {
        return t > 0;
    } else if (condition.operation === ">=") {
        return t >= 0;
    } else {
        throw new Error("模板选择日期比较符" + condition.operation + "尚未实现!");
    }
};

/**
 * 比较字符串
 * @function CompareString
 * @description 比较两个字符串值
 * @param {string} v - 字符串值
 * @param {Object} condition - 条件对象，包含operation和value属性
 * @returns {boolean} 比较结果
 */
SelectTemplate.prototype.CompareString = function (v, condition) {
    if (condition.operation === "=") {
        return v === condition.value;
    } else if (condition.operation === "<>") {
        return v !== condition.value;
    } else if (condition.operation === "like") {
        return v.indexOf(condition.value) !== -1;
    } else {
        throw new Error("模板选择字符比较操作符" + condition.operation + "未实现!");
    }
};

/**
 * 比较数值
 * @function CompareNumber
 * @description 比较两个数值
 * @param {string} v - 数值字符串
 * @param {Object} condition - 条件对象，包含operation和value属性
 * @returns {boolean} 比较结果
 */
SelectTemplate.prototype.CompareNumber = function (v, condition) {
    if (condition.operation === "=") {
        return v === condition.value;
    } else if (condition.operation === "<>") {
        return v !== condition.value;
    } else {
        try {
            var t1 = parseFloat(v);
            var t2 = parseFloat(condition.value);

            if (condition.operation === "<") {
                return t1 < t2;
            } else if (condition.operation === "<=") {
                return t1 <= t2;
            } else if (condition.operation === ">") {
                return t1 > t2;
            } else if (condition.operation === ">=") {
                return t1 >= t2;
            }
        } catch (ex) {
            throw new Error("模板条件字段设置错误!字段值不能转换成数值类型!");
        }
    }
    throw new Error("模板选择数字比较操作符" + condition.operation + "未实现!");
};

/**
 * 创建选择模板实例（静态方法）
 * @function CreateSelectTemplate
 * @description 工厂方法，创建选择模板实例
 * @param {Object} rsAll - 所有结果集数据
 * @param {Array} reportTemplateConditionInfoList - 报表模板条件信息列表
 * @returns {SelectTemplate} 选择模板实例
 */
SelectTemplate.CreateSelectTemplate = function (rsAll, reportTemplateConditionInfoList) {
    return new SelectTemplate(rsAll, reportTemplateConditionInfoList);
};