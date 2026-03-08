/**
 * 工具类库
 * 提供数组扩展、字符串扩展、通用工具函数等
 */
'use strict';

/**
 * 数组扩展方法
 */
Array.prototype.GetRange = function (index, count) {
    return this.slice(index, index + count);
};

Array.prototype.Add = function (item) {
    this.push(item);
};

Array.prototype.Insert = function (index, item) {
    this.splice(index, 0, item);
};

Array.prototype.AddRange = function (items) {
    for (var i = 0; i < items.length; i++) {
        this.push(items[i]);
    }
};

Array.prototype.RemoveAt = function (index) {
    return this.splice(index, 1);
};

Array.prototype.Clear = function () {
    this.length = 0;
};

Array.prototype.Join = function (separator) {
    return this.join(separator);
};

Array.prototype.InsertRange = function (index, array) {
    for (var i = array.length - 1; i >= 0; i--) {
        this.splice(index, 0, array[i]);
    }
};

Array.prototype.Count = function () {
    return this.length;
};

Array.prototype.Contains = function (item) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == item) {
            return true;
        }
    }
    return false;
};

Array.prototype.Find = function (predicate) {
    for (var i = 0; i < this.length; i++) {
        var item = this[i];
        if (predicate(item)) {
            return item;
        }
    }
    return null;
};

Array.prototype.FindIndex = function (predicate) {
    for (var i = 0; i < this.length; i++) {
        var item = this[i];
        if (predicate(item)) {
            return i;
        }
    }
    return -1;
};

Array.prototype.FindAll = function (predicate) {
    var result = [];
    for (var i = 0; i < this.length; i++) {
        var item = this[i];
        if (predicate(item)) {
            result.push(item);
        }
    }
    return result;
};

Array.prototype.RemoveAll = function (predicate) {
    for (var i = this.length - 1; i >= 0; i--) {
        var item = this[i];
        if (predicate(item)) {
            this.splice(i, 1);
        }
    }
};

Array.prototype.Remove = function (value) {
    for (var i = this.length - 1; i >= 0; i--) {
        var item = this[i];
        if (item == value) {
            this.splice(i, 1);
        }
    }
};

Array.prototype.Average = function () {
    if (this.length == 0) {
        return 0;
    }
    var sum = 0;
    for (var i = this.length - 1; i >= 0; i--) {
        var item = this[i];
        sum += item;
    }
    return sum / this.length;
};

Array.prototype.Min = function () {
    var result = this[0];
    for (var i = 1; i < this.length; i++) {
        result = Math.min(result, this[i]);
    }
    return result;
};

Array.prototype.Max = function () {
    var result = this[0];
    for (var i = 1; i < this.length; i++) {
        result = Math.max(result, this[i]);
    }
    return result;
};

Array.prototype.Sum = function () {
    var sum = 0;
    for (var i = 0; i < this.length; i++) {
        sum += this[i];
    }
    return sum;
};

Array.prototype.Reverse = function () {
    this.reverse();
};

/**
 * 字符串扩展方法
 */
String.prototype.Contains = function (substring) {
    return this.indexOf(substring) != -1;
};

String.prototype.Length = function () {
    return this.length;
};

String.prototype.StartWith = function (prefix) {
    return this.indexOf(prefix) == 0;
};

String.prototype.StartsWith = function (prefix) {
    return this.indexOf(prefix) == 0;
};

String.prototype.EndsWith = function (suffix) {
    return this.indexOf(suffix) == this.length - 1;
};

/**
 * 数字扩展方法
 */
Number.prototype.EndsWith = function (suffix) {
    return false;
};

Number.prototype.StartsWith = function (prefix) {
    return false;
};

String.prototype.TrimEnd = function () {
    return this.replace(/\s+$/, '');
};

String.prototype.TrimStart = function () {
    return this.replace(/^\s+/, '');
};

String.prototype.IndexOf = function (substring) {
    return this.indexOf(substring);
};

String.prototype.Replace = function (searchValue, replaceValue) {
    return this.replace(new RegExp(searchValue, "g"), replaceValue);
};

String.prototype.Trim = function (char) {
    if (!char) {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
    var regex = new RegExp("(^" + char + "+)|(" + char + "+$)", "g");
    return this.replace(regex, "");
};

String.prototype.Substring = function (start, length) {
    return this.substr(start, length);
};

String.prototype.ToLower = function () {
    return this.toLowerCase();
};

String.prototype.ToUpper = function () {
    return this.toUpperCase();
};

/**
 * 字符串工具对象
 */
var string = {};

/**
 * 检查字符串是否为空或null
 * @param {string} str - 要检查的字符串
 * @returns {boolean} 是否为空或null
 */
string.IsNullOrEmpty = function (str) {
    return str == null || str == "";
};

/**
 * 比较两个字符串
 * @param {string} str1 - 第一个字符串
 * @param {string} str2 - 第二个字符串
 * @returns {number} 1如果str1>str2，-1如果str1<str2，0如果相等
 */
string.Compare = function (str1, str2) {
    if (str1 > str2) {
        return 1;
    }
    if (str1 < str2) {
        return -1;
    }
    return 0;
};

/**
 * 使用分隔符连接数组
 * @param {string} separator - 分隔符
 * @param {Array} array - 要连接的数组
 * @returns {string} 连接后的字符串
 */
string.Join = function (separator, array) {
    return array.join(separator);
};

/**
 * 异常构造函数
 * @param {string} message - 异常消息
 */
function Exception(message) {
}

/**
 * 生成新的GUID
 * @returns {string} 新生成的GUID字符串
 */
function newGuid() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var hexDigit = Math.floor(Math.random() * 16.0).toString(16);
        guid += hexDigit;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20)) {
            guid += "-";
        }
    }
    return guid;
}

/**
 * 从字符串中提取数值（去掉px单位）
 * @param {string} value - 包含px单位的字符串
 * @returns {number} 提取的数值
 */
function getNumberValue(value) {
    return parseFloat(value.replace("px", ""));
}

/**
 * 调整矩形位置和大小，考虑内边距
 * @param {Object} rect - 矩形对象
 * @returns {Object} 调整后的矩形
 */
function adjustRect(rect) {
    var x = rect.x + GlobalV.paddingLeft;
    var y = rect.y + GlobalV.paddingTop;
    var width = rect.width - 2 * GlobalV.paddingLeft;
    var height = rect.height - 2 * GlobalV.paddingTop;
    rect.SetX(x);
    rect.SetY(y);
    rect.SetWidth(width);
    rect.SetHeight(height);
    return rect;
}

/**
 * 绘制矩形边框
 * @param {CanvasRenderingContext2D} ctx - 画布上下文
 * @param {Object} rect - 矩形对象
 * @param {string} color - 边框颜色
 */
function drawRect(ctx, rect, color) {
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = color;
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.stroke();
}

/**
 * 获取元素的垂直滚动位置
 * @param {HTMLElement} element - DOM元素
 * @param {number} findLevelCount - 向上查找的层级数
 * @returns {number} 垂直滚动位置
 */
function getScrollTop(element, findLevelCount) {
    if (element == document.documentElement || element == document.body) {
        return getScrollTopDocument();
    }
    return getScrollTopEl(element, findLevelCount) + getScrollTopDocument();
}

/**
 * 获取文档的垂直滚动位置
 * @returns {number} 文档的垂直滚动位置
 */
function getScrollTopDocument() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    }
    else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}

/**
 * 获取元素的垂直滚动位置（内部函数）
 * @param {HTMLElement} element - DOM元素
 * @param {number} findLevelCount - 向上查找的层级数
 * @returns {number} 元素的垂直滚动位置
 */
function getScrollTopEl(element, findLevelCount) {
    if (!findLevelCount) {
        return element.scrollTop;
    }
    var totalScrollTop = element.scrollTop;
    var parent = element.parentElement;
    var count = 0;
    while (count < findLevelCount && parent) {
        count++;
        totalScrollTop += parent.scrollTop;
        parent = parent.parentElement;
    }
    return totalScrollTop;
}

/**
 * 获取元素的水平滚动位置
 * @param {HTMLElement} element - DOM元素
 * @param {number} findLevelCount - 向上查找的层级数
 * @returns {number} 水平滚动位置
 */
function getScrollLeft(element, findLevelCount) {
    if (element == document.documentElement || element == document.body) {
        return getScrollLeftDocument();
    }
    return getScrollLeftEl(element, findLevelCount) + getScrollLeftDocument();
}

/**
 * 获取文档的水平滚动位置
 * @returns {number} 文档的水平滚动位置
 */
function getScrollLeftDocument() {
    var scrollLeft = 0;
    if (document.documentElement && document.documentElement.scrollLeft) {
        scrollLeft = document.documentElement.scrollLeft;
    }
    else if (document.body) {
        scrollLeft = document.body.scrollLeft;
    }
    return scrollLeft;
}

/**
 * 获取元素的水平滚动位置（内部函数）
 * @param {HTMLElement} element - DOM元素
 * @param {number} findLevelCount - 向上查找的层级数
 * @returns {number} 元素的水平滚动位置
 */
function getScrollLeftEl(element, findLevelCount) {
    if (!findLevelCount) {
        return element.scrollLeft;
    }
    var totalScrollLeft = element.scrollLeft;
    var parent = element.parentElement;
    var count = 0;
    while (count < findLevelCount && parent) {
        count++;
        totalScrollLeft += parent.scrollLeft;
        parent = parent.parentElement;
    }
    return totalScrollLeft;
}

/**
 * 通用工具对象
 */
var Utils = {
    /**
     * 获取或创建文本测量用的span元素
     * @returns {HTMLSpanElement} 测量用的span元素
     */
    getMeasureTextSpan: function () {
        var measureSpan = document.getElementById("_measureSpan");
        if (!measureSpan) {
            measureSpan = document.createElement("span");
            measureSpan.setAttribute("id", "_measureSpan");
            measureSpan.style.display = "none";
            document.body.appendChild(measureSpan);
        }
        return measureSpan;
    },

    /**
     * 设置测量span的字体样式
     * @param {HTMLSpanElement} element - span元素
     * @param {Object} font - 字体配置对象
     */
    setMeasureSpanFont: function (element, font) {
        element.style.fontFamily = font.fontFamily;
        element.style.fontSize = font.fontSize;
        element.style.fontStyle = font.fontStyle;
        element.style.fontWeight = font.fontWeight;
    },

    /**
     * 测量文本宽度
     * @param {string} text - 要测量的文本
     * @param {Object} font - 字体配置
     * @returns {number} 文本宽度
     */
    measureTextWidth: function (text, font) {
        var element = this.getMeasureTextSpan();
        this.setMeasureSpanFont(element, font);
        element.textContent = text;
        return element.clientWidth + 2 + 4;
    },

    /**
     * 测量文本高度
     * @param {string} text - 要测量的文本
     * @param {Object} font - 字体配置
     * @returns {number} 文本高度
     */
    measureTextHeight: function (text, font) {
        var element = this.getMeasureTextSpan();
        this.setMeasureSpanFont(element, font);
        element.textContent = text;
        return element.clientHeight;
    },

    /**
     * 测量文本尺寸
     * @param {string} text - 要测量的文本
     * @param {Object} font - 字体配置
     * @returns {Object} 包含width和height的对象
     */
    measureText: function (text, font) {
        var element = this.getMeasureTextSpan();
        this.setMeasureSpanFont(element, font);
        element.textContent = text;
        return { width: element.clientWidth + 2 + 4, height: element.clientHeight };
    },

    /**
     * 获取Canvas绘制用的字体字符串
     * @param {Object} font - 字体配置
     * @returns {string} 字体字符串
     */
    getDrawFont: function (font) {
        var fontParts = [];
        fontParts.push(font.fontStyle || "");
        fontParts.push(font.fontWeight || "");
        fontParts.push((font.fontSize || "12") + "pt");
        fontParts.push(font.fontFamily || "");
        return fontParts.join(" ");
    },

    /**
     * 获取默认字体配置
     * @returns {Object} 默认字体配置
     */
    getDefaultFont: function () {
        return {
            fontSize: 12,
            fontFamily: "微软雅黑"
        };
    }
};

/**
 * GUID工具对象
 */
const Guid = {};

/**
 * 生成新的GUID
 * @returns {string} 新生成的GUID字符串
 */
Guid.NewGuid = function () {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var hexDigit = Math.floor(Math.random() * 16.0).toString(16);
        guid += hexDigit;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20)) {
            guid += "-";
        }
    }
    return guid;
};

Guid.Empty = {};

/**
 * 获取空GUID的字符串表示
 * @returns {string} 空GUID字符串
 */
Guid.Empty.toString = function () {
    return "00000000-0000-0000-0000-000000000000";
};

/**
 * 正则表达式工具对象
 */
const Regex = {};

/**
 * 执行正则匹配
 * @param {string} input - 输入字符串
 * @param {RegExp} regex - 正则表达式
 * @returns {Object} 匹配结果对象
 */
Regex.Match = function (input, regex) {
    var match = input.match(regex);
    if (match != null) {
        return { Success: true, Groups: match };
    }
    return { Success: false, Groups: [] };
};

/**
 * 检查是否匹配正则表达式
 * @param {string} input - 输入字符串
 * @param {RegExp} regex - 正则表达式
 * @returns {boolean} 是否匹配
 */
Regex.IsMatch = function (input, regex) {
    return regex.test(input);
};

/**
 * 类型转换工具对象
 */
const Convert = {};

/**
 * 转换为32位整数
 * @param {*} value - 要转换的值
 * @returns {number} 转换后的整数
 */
Convert.ToInt32 = function (value) {
    if (isNaN(value)) {
        value = value.Trim('"');
    }
    return parseInt(value);
};

Convert.ToInt64 = Convert.ToInt32;

/**
 * 转换为双精度浮点数
 * @param {*} value - 要转换的值
 * @returns {number} 转换后的浮点数
 */
Convert.ToDouble = function (value) {
    if (isNaN(value)) {
        value = value.Trim('"');
    }
    return parseFloat(value);
};

/**
 * 转换为单精度浮点数
 * @param {*} value - 要转换的值
 * @returns {number} 转换后的浮点数
 */
Convert.ToSingle = function (value) {
    if (isNaN(value)) {
        value = value.Trim('"');
    }
    return parseFloat(value);
};

/**
 * 转换为布尔值
 * @param {*} value - 要转换的值
 * @returns {boolean} 转换后的布尔值
 */
Convert.ToBoolean = function (value) {
    if (isNaN(value)) {
        value = value.Trim('"');
    }
    if (value == "True" || value == "true") {
        return true;
    }
    return false;
};

/**
 * 数学函数别名
 */
Math.Tan = Math.tan;
Math.Sqrt = Math.sqrt;
Math.Sin = Math.sin;
Math.Abs = Math.abs;

/**
 * IE6/7/8浏览器检测
 */
var ie678 = !-[1,];

/**
 * 获取鼠标按钮编码，处理IE6/7/8兼容性
 * @param {MouseEvent} event - 鼠标事件
 * @returns {number} 按钮编码
 */
function getButtonCode(event) {
    var code = event.button;
    var ie678Map = {
        1: 0,
        4: 1,
        2: 2
    };
    if (ie678) {
        return ie678Map[code];
    }
    return code;
}

/**
 * 动态加载脚本
 * @param {string} url - 脚本URL
 * @param {Function} callback - 加载完成后的回调函数
 */
function loadScript(url, callback) {
    var script = document.createElement("script");
    script.src = url;
    script.onload = function () {
        if (callback) {
            callback();
        }
    };
    document.head.appendChild(script);
}

/**
 * 设置文本选区
 * @param {Node} startContainer - 起始节点
 * @param {number} startOffset - 起始偏移量
 * @param {Node} endContainer - 结束节点
 * @param {number} endOffset - 结束偏移量
 */
function setSelectionA(startContainer, startOffset, endContainer, endOffset) {
    var range = document.createRange();
    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);

    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

/**
 * 选中div内的所有文本
 * @param {HTMLElement} div - 包含文本的div元素
 */
function setSelectionAll(div) {
    var firstTextNode = getFirstTextNode(div);
    var lastTextNode = getLastTextNode(div);
    if (firstTextNode && lastTextNode) {
        setSelectionA(firstTextNode, 0, lastTextNode, lastTextNode.data.length);
    }
}

/**
 * 获取div内的第一个文本节点
 * @param {HTMLElement} div - DOM元素
 * @returns {Node|null} 找到的文本节点或null
 */
function getFirstTextNode(div) {
    for (var i = 0; i < div.childNodes.length; i++) {
        var node = div.childNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
            return node;
        }
    }
    return null;
}

/**
 * 获取div内的最后一个文本节点
 * @param {HTMLElement} div - DOM元素
 * @returns {Node|null} 找到的文本节点或null
 */
function getLastTextNode(div) {
    for (var i = div.childNodes.length - 1; i >= 0; i--) {
        var node = div.childNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
            return node;
        }
    }
    return null;
}

/**
 * 设置输入框的对齐方式
 * @param {Object} cellProp - 单元格属性对象
 * @param {HTMLElement} input - 输入框元素
 */
function setInputBoxAlign(cellProp, input) {
    if (cellProp.cellHAlign == 1 || cellProp.cellHAlign == 0) {
        input.style.textAlign = "left";
    }
    else if (cellProp.cellHAlign == 2) {
        input.style.textAlign = "right";
    }
    else if (cellProp.cellHAlign == 4) {
        input.style.textAlign = "center";
    }

    if (cellProp.cellVAlign == 8) {
    }
    else if (cellProp.cellVAlign == 16) {
        input.style.position = "relative";
        input.style.top = "100%";
        input.style.transform = "translateY(-100%)";
    }
    else if (cellProp.cellVAlign == 32) {
        input.style.position = "relative";
        input.style.top = "50%";
        input.style.transform = "translateY(-50%)";
    }
}

/**
 * 设置输入框的字体样式
 * @param {Object} cellProp - 单元格属性对象
 * @param {HTMLElement} inputBox - 输入框元素
 */
function setInputBoxFont(cellProp, inputBox) {
    var font = Comman.GetCellFont(cellProp);
    inputBox.style.fontWeight = font.fontWeight;
    inputBox.style.fontStyle = font.fontStyle;
    inputBox.style.fontSize = font.fontSize + "pt";
    inputBox.style.fontFamily = font.fontFamily;
    inputBox.style.textDecoration = font.textDecoration;
    inputBox.style.color = font.color;
}
