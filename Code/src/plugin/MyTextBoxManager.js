/**
 * 文本框管理器类
 * 管理所有文本框实例，提供查找、添加、删除等功能
 */
'use strict';

/**
 * 文本框管理器实例
 * @type {MyTextBoxManagerClass}
 */
let MyTextBoxManager = new MyTextBoxManagerClass();

/**
 * 文本框管理器构造函数
 * 提供文本框的集中管理功能
 */
function MyTextBoxManagerClass() {
    /**
     * 文本框数组
     * @type {Array}
     */
    var textBoxs = [];

    /**
     * 文本框ID映射
     * @type {Object}
     */
    var textBoxsA = {};

    /**
     * 按列索引的文本框映射
     * @type {Object}
     */
    var textBoxsByCol = {};

    /**
     * 按行索引的文本框映射
     * @type {Object}
     */
    var textBoxsByRow = {};

    /**
     * 最大列号
     * @type {number}
     */
    var maxCol = 0;

    /**
     * 最大行号
     * @type {number}
     */
    var maxRow = 0;

    /**
     * 是否准备好添加
     * @type {boolean}
     */
    var isAddReady = false;

    /**
     * 清空所有文本框
     */
    function clear() {
        for (var i = 0; i < textBoxs.length; i++) {
            var textBox = textBoxs[i];
            if (textBox.isCheckBox) {
                textBox.removeCheckBox();
            }
        }
        textBoxs = [];
        textBoxsA = {};
        textBoxsByCol = {};
        textBoxsByRow = {};
    }

    /**
     * 设置是否准备好添加
     * @param {boolean} value - 是否准备好
     */
    function setIsAddReady(value) {
        isAddReady = value;
    }

    /**
     * 检查是否所有文本框都已绘制完成
     * @returns {boolean} 是否都已绘制完成
     */
    function isReady() {
        if (!isAddReady) {
            return false;
        }
        for (var i = 0; i < textBoxs.length; i++) {
            var textBox = textBoxs[i];
            if (!textBox._isDrawed) {
                return false;
            }
        }
        return true;
    }

    /**
     * 获取所有文本框
     * @returns {Array} 文本框数组
     */
    function getTextBoxs() {
        return textBoxs;
    }

    /**
     * 根据ID获取文本框
     * @param {string} id - 文本框ID
     * @returns {Object|null} 文本框对象或null
     */
    function getTextBoxById(id) {
        var textBox = textBoxsA[id];
        if (textBox) {
            return textBox;
        }
        return null;
    }

    /**
     * 移除文本框
     * @param {Object} textbox - 要移除的文本框
     */
    function removeTextbox(textbox) {
        textbox.stage.remove(textbox);
        textbox = null;
    }

    /**
     * 添加文本框
     * @param {Object} textbox - 要添加的文本框
     */
    function addA(textbox) {
        textBoxs.push(textbox);
        textBoxsA[textbox.id] = textbox;

        for (var col = textbox.rangeStartCol; col <= textbox.rangeEndCol; col++) {
            if (!textBoxsByCol[col]) {
                textBoxsByCol[col] = [];
            }
            textBoxsByCol[col].push(textbox);
        }

        for (var row = textbox.rangeStartRow; row <= textbox.rangeEndRow; row++) {
            if (!textBoxsByRow[row]) {
                textBoxsByRow[row] = [];
            }
            textBoxsByRow[row].push(textbox);
        }

        if (textbox.rangeEndCol > maxCol) {
            maxCol = textbox.rangeEndCol;
        }
        if (textbox.rangeEndRow < maxRow) {
            maxRow = textbox.rangeEndRow;
        }
    }

    /**
     * 查找下一个文本框
     * @param {Object} textbox - 当前文本框
     * @param {string} type - 查找类型（"v"为垂直方向）
     * @returns {Object} 找到的文本框
     */
    function findNextTextBox(textbox, type) {
        if (type == "v") {
            return findDownTextBox(textbox);
        }
        return findRightTextBox(textbox);
    }

    /**
     * 查找上方文本框
     * @param {Object} textbox - 当前文本框
     * @returns {Object} 找到的文本框
     */
    function findUpTextBox(textbox) {
        var col = textbox.col;
        var row = textbox.rangeStartRow;
        if (row == 0) {
            return textbox;
        }
        while (true) {
            row--;
            var textBoxList = textBoxsByRow[row];
            while (!textBoxList) {
                row--;
                if (row < 0) {
                    return textbox;
                }
                textBoxList = textBoxsByRow[row];
            }
            for (var i = 0; i < textBoxList.length; i++) {
                var foundTextBox = textBoxList[i];
                if (foundTextBox.rangeStartCol <= col && foundTextBox.rangeEndCol >= col) {
                    if (foundTextBox.width > 0 && foundTextBox.height > 0) {
                        return foundTextBox;
                    }
                }
            }
        }
        return textbox;
    }

    /**
     * 查找下方文本框
     * @param {Object} textbox - 当前文本框
     * @returns {Object} 找到的文本框
     */
    function findDownTextBox(textbox) {
        var col = textbox.col;
        var row = textbox.rangeEndRow;
        if (row == maxRow) {
            return textbox;
        }
        while (true) {
            row++;
            var textBoxList = textBoxsByRow[row];
            while (!textBoxList) {
                row++;
                if (row > maxRow) {
                    return textbox;
                }
                textBoxList = textBoxsByRow[row];
            }
            for (var i = 0; i < textBoxList.length; i++) {
                var foundTextBox = textBoxList[i];
                if (foundTextBox.rangeStartCol <= col && foundTextBox.rangeEndCol >= col) {
                    if (foundTextBox.width > 0 && foundTextBox.height > 0) {
                        return foundTextBox;
                    }
                }
            }
        }
        return textbox;
    }

    /**
     * 查找左侧文本框
     * @param {Object} textbox - 当前文本框
     * @returns {Object} 找到的文本框
     */
    function findLeftTextBox(textbox) {
        var col = textbox.rangeStartCol;
        var row = textbox.row;
        if (col == 0) {
            return textbox;
        }
        while (true) {
            col--;
            var textBoxList = textBoxsByCol[col];
            while (!textBoxList) {
                col--;
                if (col < 0) {
                    return textbox;
                }
                textBoxList = textBoxsByCol[col];
            }
            for (var i = 0; i < textBoxList.length; i++) {
                var foundTextBox = textBoxList[i];
                if (foundTextBox.rangeStartRow <= row && foundTextBox.rangeEndRow >= row) {
                    if (foundTextBox.width > 0 && foundTextBox.height > 0) {
                        return foundTextBox;
                    }
                }
            }
        }
        return textbox;
    }

    /**
     * 查找右侧文本框
     * @param {Object} textbox - 当前文本框
     * @returns {Object} 找到的文本框
     */
    function findRightTextBox(textbox) {
        var col = textbox.rangeEndCol;
        var row = textbox.row;
        if (col == maxCol) {
            return textbox;
        }
        while (true) {
            col++;
            var textBoxList = textBoxsByCol[col];
            while (!textBoxList) {
                col++;
                if (col > maxCol) {
                    return textbox;
                }
                textBoxList = textBoxsByCol[col];
            }
            for (var i = 0; i < textBoxList.length; i++) {
                var foundTextBox = textBoxList[i];
                if (foundTextBox.rangeStartRow <= row && foundTextBox.rangeEndRow >= row) {
                    if (foundTextBox.width > 0 && foundTextBox.height > 0) {
                        return foundTextBox;
                    }
                }
            }
        }
        return textbox;
    }

    return {
        clear: clear,
        setIsAddReady: setIsAddReady,
        isReady: isReady,
        removeTextbox: removeTextbox,
        addA: addA,
        findNextTextBox: findNextTextBox,
        getTextBoxs: getTextBoxs,
        getTextBoxById: getTextBoxById,
        findUpTextBox: findUpTextBox,
        findDownTextBox: findDownTextBox,
        findLeftTextBox: findLeftTextBox,
        findRightTextBox: findRightTextBox
    };
}
