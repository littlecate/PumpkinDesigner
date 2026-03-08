"use strict";

/**
 * @fileoverview 顶部标签分隔线拖拽模块，提供列宽调整功能
 * @module DragTopLabelSplitor
 */

/**
 * 顶部标签父对象
 * @type {Object|null}
 */
let topLabelParentObj = null;

/**
 * 显示展开列图片
 * @function showExpandColImage
 * @param {Array} labelDivs - 标签div数组
 * @param {Array} splitorDivs - 分隔线div数组
 */
function showExpandColImage(labelDivs, splitorDivs) {
  for (var i = 0; i < labelDivs.length; i++) {
    var t = labelDivs[i];
    var w = Number(t.div.style.width.replace("px", ""));
    if (w <= 4) {
      let col1 = t.col;      
      var x = Number(t.div.style.left.replace("px", ""));
      var y = Number(t.div.style.height.replace("px", ""));
      t.expandColEl.style.position = "absolute";
      t.expandColEl.style.left = x - 6 + "px";
      t.expandColEl.style.top = y - 8 + "px";
      t.expandColEl.style.height = "8px";
      t.expandColEl.style.width = "12px";
      t.expandColEl.style.display = "block";
      t.expandColEl.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var t2 = labelDivs[col1];
        t2.div.style.width =
          Number(t2.div.style.width.replace("px", "")) + 20 + "px";
        moveTopLabelRightEls(col1, 20, labelDivs, splitorDivs);
        recordTopLabelRightElsInfo(col1, 20, labelDivs, splitorDivs);
        addTopLabelColWidth(col1, 20);
        showExpandColImage(labelDivs, splitorDivs);
      };
    } else {
      t.expandColEl.style.display = "none";
      t.expandColEl.onclick = null;
    }
  }
}

function addTopLabelColWidth(col, deltaX) {
  topLabelParentObj.addColWidth(col, deltaX);
}

function moveTopLabelRightEls(col, deltaX, labelDivs, splitorDivs) {
  moveTopLabelLabelDivs(col, deltaX, labelDivs);
  moveTopLabelSplitorDivs(col, deltaX, splitorDivs);
}

function moveTopLabelLabelDivs(col, deltaX, labelDivs) {
  for (var i = 0; i < labelDivs.length; i++) {
    var t = labelDivs[i];
    if (t.col > col) {
      t.div.style.left = t.left + deltaX + "px";
    }
  }
}

function moveTopLabelSplitorDivs(col, deltaX, splitorDivs) {
  for (var i = 0; i < splitorDivs.length; i++) {
    var t = splitorDivs[i];
    if (t.col >= col) {
      t.div.style.left = t.left + deltaX + "px";
    }
  }
}

function recordTopLabelRightElsInfo(col, deltaX, labelDivs, splitorDivs) {
  recordTopLabelLabelDivsInfo(col, deltaX, labelDivs);
  recordTopLabelSplitorDivsInfo(col, deltaX, splitorDivs);
}

function recordTopLabelLabelDivsInfo(col, deltaX, labelDivs) {
  for (var i = 0; i < labelDivs.length; i++) {
    var t = labelDivs[i];
    if (t.col > col) {
      t.left = Number(t.div.style.left.replace("px", ""));
    }
  }
}

function recordTopLabelSplitorDivsInfo(col, deltaX, splitorDivs) {
  for (var i = 0; i < splitorDivs.length; i++) {
    var t = splitorDivs[i];
    if (t.col >= col) {
      t.left = Number(t.div.style.left.replace("px", ""));
    }
  }
}

function DragTopLabelSplitor(
  dragItem,
  container,
  forElement,
  col,
  labelDivs,
  splitorDivs,
  parentObj
) {
  // 用于记录鼠标按下时的坐标与div当前的坐标
  let active = false;
  let initialX;
  let xOffset = 0;
  let minDeltaX = 0;
  let forElementWidth = 0;
  topLabelParentObj = parentObj;

  // 鼠标按下事件
  dragItem.addEventListener("mousedown", function (e) {
    if (e.button != 0) {
      return;
    }
    forElementWidth = Number(forElement.style.width.replace("px", ""));
    if (forElementWidth == 0) {
      minDeltaX = 0;
    } else {
      minDeltaX = -forElementWidth;
    }
    xOffset = 0;
    initialX = e.clientX;
    active = true;
  });

  dragItem.oncontextmenu = function (e) {
    e.preventDefault();
  };

  // 鼠标移动事件
  document.addEventListener("mousemove", function (e) {
    if (e.button != 0) {
      return;
    }
    if (active) {
      e.preventDefault(); // 阻止默认事件，比如选中文本

      if (e.clientX - initialX < minDeltaX) {
        return;
      }

      xOffset = e.clientX - initialX;

      forElement.style.width = forElementWidth + xOffset + "px";
      moveTopLabelRightEls(col, xOffset, labelDivs, splitorDivs);
      showExpandColImage(labelDivs, splitorDivs);
    }
  });

  // 鼠标放开事件
  document.addEventListener("mouseup", function (e) {
    if (e.button != 0) {
      return;
    }
    if (active) {
      recordTopLabelRightElsInfo(col, xOffset, labelDivs, splitorDivs);
      addTopLabelColWidth(col, xOffset);
      showExpandColImage(labelDivs, splitorDivs);
    }
    active = false;
  });
}
