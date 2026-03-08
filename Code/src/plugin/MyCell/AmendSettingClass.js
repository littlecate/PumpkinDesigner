'use strict';

/**
 * @fileoverview 修约设置对话框模块，用于设置单元格数值的修约方式和精度
 * @module AmendSettingClass
 */

/**
 * 修约设置对话框拖动元素
 * @type {Object|null}
 */
let div_amendSettingDrag = null;

/**
 * 修约设置对话框类
 * @class
 * @param {Object} config - 配置对象
 * @param {Object} config.parentObj - 父对象
 * @param {string} config.parentInstanceName - 父实例名称
 * @param {Object} config.parentEl - 父元素
 * @param {Object} config.cellSheet - 单元格工作表
 * @param {Object} config.dialogThemeConfig - 对话框主题配置
 * @param {Object} config.amendObj - 修约对象
 * @param {number} config.parentElWidth - 父元素宽度
 * @param {number} config.parentElHeight - 父元素高度
 */
function AmendSettingClass(config) {
    var parentObj = config.parentObj;
    var parentInstanceName = config.parentInstanceName;
    var parentEl = config.parentEl;
    var cellSheet = config.cellSheet;
    var dialogThemeConfig = config.dialogThemeConfig;
    var amendObj = config.amendObj;
    var parentElWidth = config.parentElWidth;
    var parentElHeight = config.parentElHeight;

    var windowId = "div_amendSetting_" + parentInstanceName;
    var windowDiv = document.getElementById(windowId);
    if (windowDiv) {
        windowDiv.parentElement.removeChild(windowDiv);
    }
    let win = new MyWindow({
        id: windowId,
        parent: parentEl.parentElement,
        isDrag: true,
        width: 400,
        height: 280,
        title: "修约设置",
    });

    let mainDiv = document.createElement("div");
    win.setWindowContent(mainDiv);
    mainDiv.style.width = "100%";
    mainDiv.style.height = "100%";
    mainDiv.style.boxSizing = "border-box";
    mainDiv.style.padding = "12px";

    setupContent();
    setAmendValue();

    /**
     * 设置对话框内容
     * @function setupContent
     */
    function setupContent() {
        var confirmButtonId = parentInstanceName + "_amendSettingConfirm";
        var cancelButtonId = parentInstanceName + "_amendSettingCancel";
        var s = "<style>"
            + ".amend-setting-table { width:100%; height:95%; border-collapse: collapse; font-size:9pt; }"
            + ".amend-setting-table th{ border:1px solid #E2E8F0; width:140px; padding:8px; text-align:left; background-color:#F8FAFC; font-weight:500; color:#2D3748; height:36px; }"
            + ".amend-setting-table td{ border:1px solid #E2E8F0; padding:8px; height:36px; }"
            + ".amend-setting-textbox{ border:1px solid #E5E7EB; width:100%; font-size:9pt; padding:4px 8px; border-radius:4px; outline:none; transition:all 0.2s ease; }"
            + ".amend-setting-textbox:hover{ border-color:#C9CDD4; }"
            + ".amend-setting-textbox:focus{ border-color:#94A3B8; box-shadow:0 0 0 2px rgba(148,163,184,0.15); }"
            + ".amend-setting-button{ background-color:#F8FAFC; color:#4A5568; border:1px solid #E2E8F0; padding:6px 16px; border-radius:4px; font-size:9pt; cursor:pointer; transition:all 0.2s ease; }"
            + ".amend-setting-button:hover{ background-color:#E2E8F0; border-color:#CBD5E0; }"
            + ".amend-setting-select{ border:1px solid #E5E7EB; width:100%; padding:4px 8px; border-radius:4px; font-size:9pt; outline:none; transition:all 0.2s ease; }"
            + ".amend-setting-select:hover{ border-color:#C9CDD4; }"
            + ".amend-setting-select:focus{ border-color:#94A3B8; box-shadow:0 0 0 2px rgba(148,163,184,0.15); }" 
            + "</style>"
            + `<table class='amend-setting-table'>
               <tr>
                <th>修约方式:</th>
                <td><select id="${parentInstanceName}_amendtype" class="amend-setting-select">
                        <option value=""></option>
                        <option value="00">四舍六入五成双</option>
                        <option value="22">四舍五入</option>
                        <option value="05">零五修约</option>                        
                        <option value="03">零三修约</option>                        
                        <option value="02">零二修约</option>                        
                        <option value="04">非零进位修约</option>
                        <option value="11">固定有效数字位数</option>                        
                    </select></td>
            </tr>       
            <tr>
                <th>修约精度:</th>
                <td><select id="${parentInstanceName}_presion" class="amend-setting-select">
                        <option value=""></option>
                        <option value="-2">小数点前三位（百位）</option>
                        <option value="-1">小数点前两位（十位）</option>
                        <option value="0">小数点前一位（个位）</option>
                        <option value="1">小数点后一位</option>
                        <option value="2">小数点后二位</option>
                        <option value="3">小数点后三位</option>
                        <option value="4">小数点后四位</option>
                        <option value="5">小数点后五位</option>   
                        <option value="6">小数点后六位</option>            
                        <option value="7">小数点后七位</option>              
                    </select></td>
            </tr>  
             <tr>
                <th>显示格式:</th>
                <td><select id="${parentInstanceName}_displayvalue" class="amend-setting-select">
                    <option value=""></option>
                    <option value="0">0</option>
                    <option value="0.0">0.0</option>
                    <option value="0.00">0.00</option>
                    <option value="0.000">0.000</option>
                    <option value="0.0000">0.0000</option>
                    <option value="0.00000">0.00000</option>
                    <option value="0.000000">0.000000</option>
                    <option value="0.0000000">0.0000000</option>
                    <option value="0.0E+00">0.0E+00</option>
                    <option value="0.00E+00">0.00E+00</option>
                    <option value="0.000E+00">0.000E+00</option>
                    <option value="0.0000E+00">0.0000E+00</option>
                    <option value="0.00000E+00">0.00000E+00</option>
                    <option value="0.000000E+00">0.000000E+00</option>
                    <option value="0.0000000E+00">0.0000000E+00</option>
                    </select></td>
            </tr> 
            <tr>
                <th>固定有效数字位数:</th>
                <td><input type="text" id="${parentInstanceName}_fixnum" class="amend-setting-textbox" placeholder="非固定有效数字修约请留空"/></td>
            </tr>
            <tr>
                <td colspan=2 style='text-align:center; padding:12px;'><input type='button' class='amend-setting-button' value='确定' id='${confirmButtonId}'/>&nbsp;&nbsp;<input type='button' class='amend-setting-button' value='取消' id='${cancelButtonId}'/></td>
            </tr>
            </table>`;
        mainDiv.innerHTML = s;
        document.getElementById(confirmButtonId).onclick = function () {
            var amendType = document.getElementById(`${parentInstanceName}_amendtype`).value;
            var presion = document.getElementById(`${parentInstanceName}_presion`).value;
            var displayValue = document.getElementById(`${parentInstanceName}_displayvalue`).value;
            var fixnum = document.getElementById(`${parentInstanceName}_fixnum`).value;
            parentObj.setAmend({
                amendType: amendType,
                presion: presion,
                displayValue: displayValue,
                fixnum: fixnum
            });
            win.close();
        };
        document.getElementById(cancelButtonId).onclick = function () {
            win.close();
        };

        document.getElementById(`${parentInstanceName}_presion`).onchange = function () {
            var v = document.getElementById(`${parentInstanceName}_presion`).value;
            setDisplayvalue(v);
            function setDisplayvalue(v) {
                var t = document.getElementById(`${parentInstanceName}_displayvalue`);
                if (v == "") {
                    t.value = "";
                }
                else if (v == "-2" || v == "-1" || v == "0") {
                    t.value = "0";
                }
                else {
                    t.value = "0.0000000000000000".substring(0, 2 + parseInt(v));
                }
            }
        }
    }        

    /**
     * 设置修约值
     * @function setAmendValue
     */
    function setAmendValue() {
        document.getElementById(`${parentInstanceName}_amendtype`).value = amendObj.amendType || "";
        document.getElementById(`${parentInstanceName}_presion`).value = amendObj.presion || "";
        document.getElementById(`${parentInstanceName}_displayvalue`).value = amendObj.displayValue || "";
        document.getElementById(`${ parentInstanceName }_fixnum`).value = amendObj.fixnum || "";
    }

    /**
     * 执行任务（空实现）
     * @function doJob
     */
    function doJob() {

    }

    return {
        doJob: doJob
    }
}

