"use strict";

/**
 * @fileoverview 左侧标签操作模块，提供行选择高亮功能
 * @module OperLeftLabel
 */

/**
 * 左侧标签鼠标是否按下
 * @type {boolean}
 */
let leftLabelIsMouseDown = false;

/**
 * 左侧标签鼠标移动行标记
 * @type {Array}
 */
let leftLabelMousemoveRowMarks = [];

/**
 * 左侧标签选择起始行
 * @type {number}
 */
let leftLabelSelectStartRow = -1;

/**
 * 左侧标签选择结束行
 * @type {number}
 */
let leftLabelSelectEndRow = -1;

/**
 * 左侧标签已绘制标记
 * @type {Array}
 */
let leftLabelHaveDrawMarks = [];

/**
 * 取消高亮左侧标签
 * @function unHilightLeftLabel
 * @param {Array} labelDivs - 标签div数组
 * @param {Array} splitorDivs - 分隔线div数组
 * @param {number} startrow - 起始行
 * @param {number} endRow - 结束行
 */
function unHilightLeftLabel(labelDivs, splitorDivs, startrow, endRow) {
  for (var i = 0; i < labelDivs.length; i++) {
    if (
      leftLabelHaveDrawMarks.indexOf(i) != -1 ||
      (i >= startrow && i <= endRow)
    ) {
      var t = labelDivs[i].div;
      t.style.backgroundColor = "#ffffff";
      var tt1 = splitorDivs[i];
      var tt2 = tt1.div.querySelector("div");
      tt2.style.backgroundColor = "#DBDBDB";

      var tt3 = t.querySelector(".leftLabelHilight");
      if (tt3) {
        tt3.parentElement.removeChild(tt3);
      }
    }
  }
}

function showHilightLeftLabelOne(labelDivs, splitorDivs, row) {
  var t1 = labelDivs[row];
  var t = t1.div;
  t.style.backgroundColor = "rgba(242, 242, 242, 1)";
  var tt1 = splitorDivs[row];
  var tt2 = tt1.div.querySelector("div");
  tt2.style.backgroundColor = "white";

  var tt3 = t.querySelector(".leftLabelHilight");
  if (!tt3) {
    tt3 = document.createElement("div");
    tt3.style.position = "absolute";
    tt3.style.top = "0px";
    tt3.style.right = "0px";
    tt3.style.height = "100%";
    tt3.style.width = "2px";
    tt3.style.backgroundColor = theme.hilightColor;
    tt3.setAttribute("class", "leftLabelHilight");
    t.appendChild(tt3);
  }
}

function OperLeftLabel(operItem, row, labelDivs, splitorDivs, parentObj) {
  // 鼠标按下事件
  operItem.addEventListener("mousedown", function (e) {
    if (e.button != 0) {
      return;
    }
    leftLabelIsMouseDown = true;
    unHilightLeftLabel(labelDivs, splitorDivs);
    leftLabelHaveDrawMarks = [];
    leftLabelMousemoveRowMarks = [row];
    parentObj.deSelectRect();
    parentObj.resetSelectRectSingle();
    parentObj.setSelectSingleStartRow(row);
    parentObj.selectRectRow(row);
    leftLabelSelectStartRow = row;
    leftLabelSelectEndRow = row;
    showHilight();
  });

  // 鼠标移动事件
  operItem.addEventListener("mousemove", function (e) {
    if (e.button != 0) {
      return;
    }
    e.preventDefault(); // 阻止默认事件，比如选中文本
    if (leftLabelIsMouseDown) {
      if (leftLabelMousemoveRowMarks.indexOf(row) == -1) {
        leftLabelMousemoveRowMarks.push(row);
        parentObj.setSelectSingleEndRow(row);
        parentObj.selectRectRow(row);
        leftLabelSelectEndRow = row;
        showHilight();
      }
    }
  });

  operItem.oncontextmenu = function (e) {
    e.preventDefault();
    if (leftLabelMousemoveRowMarks.indexOf(row) == -1) {
      return;
    }
    var pos = Comman.getMousePosition(
      operItem.parentElement.parentElement.parentElement,
      e.pageX,
      e.pageY
    );    
    var menuHeight = 80;
    pos.y = pos.y - menuHeight;
    parentObj.showLeftLabelContextMenu(pos);
  };

  function showHilight() {
    if (leftLabelSelectEndRow < leftLabelSelectStartRow) {
      var t = leftLabelSelectEndRow;
      leftLabelSelectEndRow = leftLabelSelectStartRow;
      leftLabelSelectStartRow = t;
    }
    for (var i = leftLabelSelectStartRow; i <= leftLabelSelectEndRow; i++) {
      if (leftLabelHaveDrawMarks.indexOf(i) != -1) {
        continue;
      }
      leftLabelHaveDrawMarks.push(i);
      showHilightLeftLabelOne(labelDivs, splitorDivs, i);
    }
  }
}
