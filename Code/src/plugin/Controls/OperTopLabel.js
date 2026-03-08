"use strict";

/**
 * @fileoverview 顶部标签操作模块，提供列选择高亮功能
 * @module OperTopLabel
 */

/**
 * 顶部标签鼠标是否按下
 * @type {boolean}
 */
let topLabelIsMouseDown = false;

/**
 * 顶部标签鼠标移动列标记
 * @type {Array}
 */
let topLabelMousemoveColMarks = [];

/**
 * 顶部标签选择起始列
 * @type {number}
 */
let topLabelSelectStartCol = -1;

/**
 * 顶部标签选择结束列
 * @type {number}
 */
let topLabelSelectEndCol = -1;

/**
 * 顶部标签已绘制标记
 * @type {Array}
 */
let topLabelHaveDrawMarks = [];

/**
 * 取消高亮顶部标签
 * @function unHilightTopLabel
 * @param {Array} labelDivs - 标签div数组
 * @param {Array} splitorDivs - 分隔线div数组
 * @param {number} startcol - 起始列
 * @param {number} endCol - 结束列
 */
function unHilightTopLabel(labelDivs, splitorDivs, startcol, endCol) {
  for (var i = 0; i < labelDivs.length; i++) {
    if (
      topLabelHaveDrawMarks.indexOf(i) != -1 ||
      (i >= startcol && i <= endCol)
    ) {
      var t = labelDivs[i].div;
      t.style.backgroundColor = "#ffffff";
      var tt1 = splitorDivs[i];
      var tt2 = tt1.div.querySelector("div");
      tt2.style.backgroundColor = "#DBDBDB";

      var tt3 = t.querySelector(".topLabelHilight");
      if (tt3) {
        tt3.parentElement.removeChild(tt3);
      }
    }
  }
}

function showHilightTopLabelOne(labelDivs, splitorDivs, col) {
  var t1 = labelDivs[col];
  var t = t1.div;
  t.style.backgroundColor = "rgba(242, 242, 242, 1)";
  var tt1 = splitorDivs[col];
  var tt2 = tt1.div.querySelector("div");
  tt2.style.backgroundColor = "white";

  var tt3 = t.querySelector(".topLabelHilight");
  if (!tt3) {
    tt3 = document.createElement("div");
    tt3.style.position = "absolute";
    tt3.style.bottom = "0px";
    tt3.style.width = "100%";
    tt3.style.height = "2px";
    tt3.style.backgroundColor = theme.hilightColor;
    tt3.setAttribute("class", "topLabelHilight");
    t.appendChild(tt3);
  }
}

function OperTopLabel(operItem, col, labelDivs, splitorDivs, parentObj) {
  // 鼠标按下事件
  operItem.addEventListener("mousedown", function (e) {
    if (e.button != 0) {
      return;
    }
    topLabelIsMouseDown = true;
    unHilightTopLabel(labelDivs, splitorDivs);
    topLabelHaveDrawMarks = [];
    topLabelMousemoveColMarks = [col];
    parentObj.deSelectRect();
    parentObj.resetSelectRectSingle();
    parentObj.setSelectSingleStartCol(col);
    parentObj.selectRectCol(col);
    topLabelSelectStartCol = col;
    topLabelSelectEndCol = col;
    showHilight();
  });

  // 鼠标移动事件
  operItem.addEventListener("mousemove", function (e) {
    if (e.button != 0) {
      return;
    }
    e.preventDefault(); // 阻止默认事件，比如选中文本
    if (topLabelIsMouseDown) {
      if (topLabelMousemoveColMarks.indexOf(col) == -1) {
        topLabelMousemoveColMarks.push(col);
        parentObj.setSelectSingleEndCol(col);
        parentObj.selectRectCol(col);
        topLabelSelectEndCol = col;
        showHilight();
      }
    }
  });

  operItem.oncontextmenu = function (e) {
    e.preventDefault();
    if (topLabelMousemoveColMarks.indexOf(col) == -1) {
      return;
    }    
    var pos = Comman.getMousePosition(
      operItem.parentElement.parentElement.parentElement,
      e.pageX,
      e.pageY
    );
    parentObj.showTopLabelContextMenu(pos);
  };

  function showHilight() {
    if (topLabelSelectEndCol < topLabelSelectStartCol) {
      var t = topLabelSelectEndCol;
      topLabelSelectEndCol = topLabelSelectStartCol;
      topLabelSelectStartCol = t;
    }
    for (var i = topLabelSelectStartCol; i <= topLabelSelectEndCol; i++) {
      if (topLabelHaveDrawMarks.indexOf(i) != -1) {
        continue;
      }
      topLabelHaveDrawMarks.push(i);
      showHilightTopLabelOne(labelDivs, splitorDivs, i);
    }
  }
}
