'use strict';

/**
 * @fileoverview 检查结果窗口模块 - 提供检测结果标记功能
 * @description 该模块创建用于标记检测结果的窗口界面，
 * 支持单值、平均值、综合评价值三种标记类型。
 * @author MyCell Designer
 * @version 1.0.0
 */

/**
 * 检查结果窗口实例
 * @type {Object|null}
 * @description 存储当前检查结果窗口的实例引用
 */
let checkResultWindow;

/**
 * 检查结果映射数组
 * @type {Array.<Object>}
 * @description 存储检查结果的映射关系，每项包含parmname、parmnamename、items、itemValues属性
 * @example
 * // 数据结构示例
 * [{"parmname":"xxxx","parmnamename":"xxxxxxxxxx","items":{"danzhi":["1_1",...],"pingjunzhi": ["2_2"....],"zhonghepingjiazhi":["3_3"...]},itemValues:{"danzhi":["1_1",...],"pingjunzhi": ["2_2"....],"zhonghepingjiazhi":["3_3"...]},...]
 */
let checkResultMap = [];

/**
 * 当前选中的检查结果索引
 * @type {number|string}
 * @description 存储当前选中的检查结果类型，初始值为-1表示未选中
 */
let g_forSelectCheckResult = -1;

/**
 * 检查结果项名称数组
 * @type {Array.<string>}
 * @description 定义检查结果项的名称列表：单值、平均值、综合评价值
 */
let checkResultMapItemNames = ["danzhi", "pingjunzhi", "zhonghepingjiazhi"];

/**
 * 检查结果窗口类
 * @class CheckResultWindow
 * @description 创建用于标记检测结果的窗口，提供单值、平均值、综合评价值三种标记选项
 * @param {Object} config - 配置对象
 * @param {Object} config.parentObj - 父对象（MyCellDesigner实例）
 * @param {Object} myWindowConfig - 窗口配置对象
 * @param {string} myWindowConfig.id - 窗口ID
 * @param {number} myWindowConfig.height - 窗口高度
 * @param {number} myWindowConfig.width - 窗口宽度
 * @param {number} myWindowConfig.topBorderHeight - 顶部边框高度
 * @param {number} myWindowConfig.bottomBorderHeight - 底部边框高度
 * @param {number} myWindowConfig.leftBorderWidth - 左侧边框宽度
 * @param {number} myWindowConfig.rightBorderWidth - 右侧边框宽度
 */
function CheckResultWindow(config, myWindowConfig) {
    var parentObj = config.parentObj;
    var outerWindow;
    var o = windowExManager.find(myWindowConfig.id);
    if (!o) {
        outerWindow = new MyWindowEx(myWindowConfig);
    }
    else {
        outerWindow = o.win;
        outerWindow.show();
    }
    let middleDivHeight = myWindowConfig.height - myWindowConfig.topBorderHeight - myWindowConfig.bottomBorderHeight;
    let middleDivWidth = myWindowConfig.width - myWindowConfig.leftBorderWidth - myWindowConfig.rightBorderWidth;
    var mainDiv = document.createElement("div");
    mainDiv.style.width = "100%";
    mainDiv.style.height = "100%";
    outerWindow.setWindowContent(mainDiv);

    doJob();

    /**
     * 执行初始化
     * @function doJob
     * @description 创建窗口标题、操作说明和单选按钮组
     * @returns {void}
     */
    function doJob() {
        var t1 = document.createElement("div");
        t1.style.width = "100%";
        t1.style.height = "20px";
        t1.style.textAlign = "center";
        t1.innerHTML = "检测结果标记";
        mainDiv.appendChild(t1);

        var t3 = document.createElement("div");
        t3.style.width = "100%";
        t3.style.height = "20px";
        t3.style.textAlign = "center";
        t3.style.color = "red";
        t3.style.fontSize = "8pt";
        t3.innerHTML = "操作说明：选择下面的一项后双击单元格进行标记";
        mainDiv.appendChild(t3);        

        setupRadioButtons();

        parentObj.showCheckResultMarks();
    }

    /**
     * 设置单选按钮组
     * @function setupRadioButtons
     * @description 创建两组单选按钮，每组包含单值、平均值、综合评价值三个选项
     * @returns {void}
     */
    function setupRadioButtons() {
        var L = [{
            parmname: "",
            items: [{
                label: "单值",
                color: "yellow",
                onclick: function (e) {
                    g_forSelectCheckResult = "xx1.danzhi";
                }
            }, {
                label: "平均值",
                color: "red",
                onclick: function (e) {
                    g_forSelectCheckResult = "xx1.pingjunzhi";
                }
            }, {
                label: "综合评价值",
                color: "green",
                onclick: function (e) {
                    g_forSelectCheckResult = "xx1.zhonghepingjiazhi";
                }
            }]
        }, {
            parmname: "",
            items: [{
                label: "单值",
                color: "yellow",
                onclick: function (e) {
                    g_forSelectCheckResult = "xx2.danzhi";
                }
            }, {
                label: "平均值",
                color: "red",
                onclick: function (e) {
                    g_forSelectCheckResult = "xx2.pingjunzhi";
                }
            }, {
                label: "综合评价值",
                color: "green",
                onclick: function (e) {
                    g_forSelectCheckResult = "xx2.zhonghepingjiazhi";
                }
            }]
        }];
        for (var i = 0; i < L.length; i++) {
            var t1 = L[i];
            var t2 = document.createElement("div");
            t2.style.width = "100%";
            t2.style.height = "20px";
            t2.style.marginTop = "5px";
            mainDiv.appendChild(t2);

            var tt1 = document.createElement("span");
            tt1.innerHTML = t1.parmname;
            t2.appendChild(tt1);

            var radioName = "radio_" + newGuid();
            for (var j = 0; j < t1.items.length; j++) {
                var o = t1.items[j];                

                var radioId = "radio_" + newGuid();
                var t3 = document.createElement("input");
                t3.setAttribute("type", "radio");
                t3.setAttribute("name", radioName);
                t3.setAttribute("id", radioId);
                t3.onclick = o.onclick;
                t2.appendChild(t3);

                var t4 = document.createElement("label");
                t4.setAttribute("for", radioId);
                t4.style.color = o.color;
                t4.innerHTML = o.label;
                t2.appendChild(t4);
            }
        }
    }
}