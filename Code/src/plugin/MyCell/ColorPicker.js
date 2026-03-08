'use strict';

/**
 * @fileoverview 颜色选择器模块，提供可视化颜色选择功能
 * @module ColorPicker
 */

/**
 * 颜色选择器类
 * @class
 * @param {Object} config - 配置对象
 * @param {Object} config.parentObj - 父对象
 * @param {Object} config.parentEl - 父元素
 * @param {string} config.parentId - 父元素ID
 * @param {number} config.parentElWidth - 父元素宽度
 * @param {number} config.parentElHeight - 父元素高度
 * @param {number} config.leftLabelWidth - 左侧标签宽度
 * @param {number} config.topLabelHeight - 顶部标签高度
 * @param {number} config.leftLabelPadding - 左侧标签内边距
 * @param {number} config.topLabelPadding - 顶部标签内边距
 * @param {number} config.toolbarHeight - 工具栏高度
 * @param {string} config.useModel - 使用模式（foregroundColor/backgroundColor/cellBorderColor）
 */
function ColorPicker(config) {
    var parentObj = config.parentObj;
    var parentEl = config.parentEl;
    var parentId = config.parentId;
    var parentElWidth = config.parentElWidth;
    var parentElHeight = config.parentElHeight;
    var leftLabelWidth = config.leftLabelWidth;
    var topLabelHeight = config.topLabelHeight;
    var leftLabelPadding = config.leftLabelPadding;
    var topLabelPadding = config.topLabelPadding;
    var toolbarHeight = config.toolbarHeight;    
    var useModel = config.useModel;

    var windowId = "div_colorPicker";
    var windowDiv = document.getElementById(windowId);
    if (windowDiv) {
        windowDiv.parentElement.removeChild(windowDiv);
    }
    let win = new MyWindow({
        id: windowId,
        parent: parentEl.parentElement,
        isDrag: true,
        width: 400,
        height: 450,
        title: "颜色选择器",
    });

    let mainDiv = document.createElement("div");
    win.setWindowContent(mainDiv);
    mainDiv.style.width = "100%";
    mainDiv.style.height = "100%";
    mainDiv.style.boxSizing = "border-box";
    mainDiv.style.padding = "2px";

    var el2 = document.createElement("div");
    el2.style.width = "100%";
    el2.style.height = "100%";
    el2.innerHTML = getEl2Html();

    mainDiv.appendChild(el2);

    setupTable1();
    setupTable2();

    function setupTable2() {
        var s = '<table id="table2" class="color-picker-grid-table" border="0" cellspacing="1" cellpadding="0">';
        s += '<tr><td></td>';
        for (var i = 0; i <= 15; ++i) {
            s += '<td align="center" style="font-size:9pt; color:#4A5568;">' + toHex(i * 17) + '</td>';
        }
        s += '</tr>';
        for (var i = 0; i <= 15; ++i) {
            s += '<tr>';
            s += '<td align="center" style="font-size:9pt; color:#4A5568;">' + toHex(i * 17) + '</td>';
            for (var j = 0; j <= 15; ++j) {
                s += '<td id="Rtd' + i + 'and' + j + '" style="background-color:rgb(0,' + (i * 17) + ',' + (j * 17) + '" onclick="colorPickerGlobal.operObj.clickright(this)"></td>';
            }
            s += '</tr>';
        }
        s += '</table>';
        document.getElementById("td2").innerHTML = s;
    }

    function setupTable1() {
        var s = '<table id="table1" class="color-picker-grid-table" border="0" cellspacing="1" cellpadding="0">';
        for (var i = 0; i <= 15; ++i) {
            s += '<tr><td align="center" style="font-size:9pt; color:#4A5568;">' + toHex(i * 17) + '</td><td id="Ltd' + i + '" style="background-color:rgb(' + (i * 17) + ',0,0)" onclick="colorPickerGlobal.operObj.changeright(' + i + ')"></td></tr>';
        }
        s += '</table>';
        document.getElementById("td1").innerHTML = s;
    }

    this.selectmenu = function (which) {
        switch (which) {
            case '1': leftR(); break;
            case '2': leftG(); break;
            case '3': leftB(); break;
            case '4': leftA(); break;
        }
    }

    function leftR() {
        for (var i = 0; i <= 15; ++i) {
            document.getElementById('Ltd' + i).style.backgroundColor = 'rgb(' + (i * 17) + ',0,0)';
        }
        rightR(0)
    }

    function leftG() {
        for (var i = 0; i <= 15; ++i) {
            document.getElementById('Ltd' + i).style.backgroundColor = 'rgb(0,' + (i * 17) + ',0)';
        }
        rightG(0)
    }

    function leftB() {
        for (var i = 0; i <= 15; ++i) {
            document.getElementById('Ltd' + i).style.backgroundColor = 'rgb(0,0,' + (i * 17) + ')';
        }
        rightB(0)
    }

    function leftA() {
        for (var i = 0; i <= 15; ++i) {
            document.getElementById('Ltd' + i).style.backgroundColor = 'rgb(' + (i * 17) + ',' + (i * 17) + ',' + (i * 17) + ')';
        }
        rightA()
    }

    function rightR(which) {
        for (var i = 0; i <= 15; ++i) {
            for (var j = 0; j <= 15; ++j) {
                document.getElementById('Rtd' + i + 'and' + j).style.backgroundColor = 'rgb(' + (which * 17) + ',' + (i * 17) + ',' + (j * 17) + ')';
            }
        }
    }

    function rightG(which) {
        for (var i = 0; i <= 15; ++i) {
            for (var j = 0; j <= 15; ++j) {
                document.getElementById('Rtd' + i + 'and' + j).style.backgroundColor = 'rgb(' + (i * 17) + ',' + (which * 17) + ',' + (j * 17) + ')';
            }
        }
    }

    function rightB(which) {
        for (var i = 0; i <= 15; ++i) {
            for (var j = 0; j <= 15; ++j) {
                document.getElementById('Rtd' + i + 'and' + j).style.backgroundColor = 'rgb(' + (i * 17) + ',' + (j * 17) + ',' + (which * 17) + ')';
            }
        }
    }

    function rightA() {
        for (var i = 0; i <= 15; ++i) {
            for (var j = 0; j <= 15; ++j) {
                document.getElementById('Rtd' + i + 'and' + j).style.backgroundColor = 'rgb(' + (i * 16 + j) + ',' + (i * 16 + j) + ',' + (i * 16 + j) + ')';
            }
        }
    }

    this.clickright = function (which) {
        var a = which.style.backgroundColor.toLowerCase().replace("rgb(", "").replace(")", "").split(",");
        var color = Comman.ToIntColor(parseInt(a[0]), parseInt(a[1]), parseInt(a[2]));
        if (useModel == "foregroundColor") {
            parentObj.setFontColor(color);
        }
        else if (useModel == "backgroundColor") {
            parentObj.setBackColor(color);
        }
        else if (useModel == "cellBorderColor") {
            parentObj.selectCellBorderColor_do(color);
        }
    }

    this.changeright = function (which) {
        switch (document.getElementById("select1").value) {
            case '1': rightR(which); break;
            case '2': rightG(which); break;
            case '3': rightB(which); break;
        }
    }

    function rgbToHex(r, g, b) { return ((r << 16) | (g << 8) | b).toString(16); }

    function toHex(which) {
        var t = which.toString(16);
        if (t.length == 1) {
            t = '0' + t;
        }
        return t;
    }

    function getEl2Html() {
        return '<style>'
            + '.color-picker-table{ width:100%; border-collapse: collapse; }'
            + '.color-picker-table td{ padding:2px; border:1px solid #E2E8F0; height:30px; }'
            + '.color-picker-table .color-picker-header-row{ background-color:#F8FAFC; }'
            + '.color-picker-table .color-picker-content-row{ background-color:#FFFFFF; }'
            + '.color-picker-select{ border:1px solid #E5E7EB; padding:4px 8px; border-radius:4px; font-size:9pt; outline:none; transition:all 0.2s ease; }'
            + '.color-picker-select:hover{ border-color:#C9CDD4; }'
            + '.color-picker-select:focus{ border-color:#94A3B8; box-shadow:0 0 0 2px rgba(148,163,184,0.15); }'
            + '.color-picker-grid-table{ border-collapse: collapse; }'
            + '.color-picker-grid-table td{ width:10px; height:10px; cursor:pointer; transition:transform 0.1s ease; }'
            + '.color-picker-grid-table td:hover{ transform:scale(1.1); }'
            + '.color-picker-grid-table td:active{ transform:scale(0.95); }'
            + '.color-picker-instruction{ font-size:12px; color:#4A5568; text-align:center; }'
            + '</style>'
            + '<table class="color-picker-table" width="100%" align="center">'
            + '<tr class="color-picker-header-row">'
            + '<td width="10%" align="center">'
            + '<select name="select1" id="select1" class="color-picker-select" onchange="colorPickerGlobal.operObj.selectmenu(this.value)">'
            + '<option value="1" selected>红</option>'
            + '<option value="2">绿</option>'
            + '<option value="3">蓝</option>'
            + '<option value="4">灰</option>'
            + '</select>'
            + '</td>'
            + '<td width="90%" align="center">'
            + '<div class="color-picker-instruction">用鼠标单击颜色块选取颜色</div>'
            + '</td>'
            + '</tr>'
            + '<tr class="color-picker-content-row">'
            + '<td width="10%" align="center" id="td1"></td>'
            + '<td width="90%" align="center" id="td2"></td>'
            + '</tr>'
            + '</table>';
    }

    colorPickerGlobal.operObj = this;

    function doJob() {

    }

    return {
        doJob: doJob
    }
}