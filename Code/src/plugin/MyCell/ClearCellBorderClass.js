'use strict';

/**
 * @fileoverview 清除单元格边框对话框模块，用于选择清除边框类型
 * @module ClearCellBorderClass
 */

/**
 * 清除单元格边框对话框类
 * @class
 * @param {Object} config - 配置对象
 * @param {Object} config.parentObj - 父对象
 * @param {string} config.parentInstanceName - 父实例名称
 * @param {Object} config.parentEl - 父元素
 * @param {Object} config.cellSheet - 单元格工作表
 * @param {Object} config.dialogThemeConfig - 对话框主题配置
 * @param {number} config.parentElWidth - 父元素宽度
 * @param {number} config.parentElHeight - 父元素高度
 */
function ClearCellBorderClass(config) {
    var parentObj = config.parentObj;
    var parentInstanceName = config.parentInstanceName;
    var parentEl = config.parentEl;
    var cellSheet = config.cellSheet;
    var dialogThemeConfig = config.dialogThemeConfig;
    var id = "div_clearCellBorder";
    var el = document.getElementById(id);
    if (el) {
        parentEl.parentElement.removeChild(el);
    }
    el = document.createElement("div");
    el.setAttribute("id", id);
    var parentElWidth = config.parentElWidth;
    var parentElHeight = config.parentElHeight;

    var w = 600;
    var h = 150;
    el.style.width = w + "px";
    el.style.height = h + "px";
    el.style.position = "absolute";
    el.style.left =(parentElWidth - w) / 2 + "px";
    el.style.top = (parentElHeight - h) / 2 + "px";
    el.style.textAlign = "center";
    el.style.backgroundColor = "white";
    el.style.border = "5px solid #e3e3e3";

    parentEl.parentElement.appendChild(el);

    setupContent();

    function setupContent() {
        var confirmButtonId = parentInstanceName + "_clearCellBorderConfirm";
        var s = "<style>"
            + ".pageSetTable{ " + (dialogThemeConfig.tableStyle || "width:590px;height:95%; margin:5px; font-size:9pt;") + " }"
            + ".pageSetTable th{ " + (dialogThemeConfig.thStyle || "border:1px solid #e3e3e3; width:80px; height:30px;") + " }"
            + ".pageSetTable td{ " + (dialogThemeConfig.tdStyle || "border:1px solid #e3e3e3; height:30px;") + " }"
            + ".myTextBox1{ " + (dialogThemeConfig.myTextBox1Style || "border:1px solid red; width:40px;font-size:9pt;") + " }"
            + ".myButton1{ " + (dialogThemeConfig.myButton1Style || "") + " }"
            + "</style>"
            + "<table class='pageSetTable'>"            
            + "<tr>"
            + "    <th>框线</th><td><input type='radio' name='radio_cellBorder' value='outborder'/></td><th>所有网络线</th><td><input type='radio' name='radio_cellBorder' value='all'/></td>"
            + "</tr>"
            + "<tr>"
            + "    <th>左网格线</th><td><input type='radio' name='radio_cellBorder' value='left'/></td><th>右网格线</th><td><input type='radio' name='radio_cellBorder' value='right'/></td>"
            + "</tr>"
            + "<tr>"
            + "    <th>上网格线</th><td><input type='radio' name='radio_cellBorder' value='top'/></td><th>下网格线</th><td><input type='radio' name='radio_cellBorder' value='bottom'/></td>"
            + "</tr>"
            + "<tr>"
            + "    <td colspan=4 style='text-align:center;'>"
            + "<input type='button' class='myButton1' value='抹线' id='" + confirmButtonId + "'/>"
            + "&nbsp;&nbsp;"
            + "<input type='button' class='myButton1' value='关闭' onclick='document.getElementById(\"" + id + "\").style.display=\"none\";'/>"
            + "</td>"
            + "</tr>"
            + "</table>";
        el.innerHTML = s;
        document.getElementById(confirmButtonId).onclick = function () {
            parentObj.clearCellBorder_setValue();
        };
    }

    function doJob() {

    }

    return {
        doJob: doJob
    }
}