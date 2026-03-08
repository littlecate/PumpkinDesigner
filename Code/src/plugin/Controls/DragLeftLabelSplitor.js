"use strict";

/**
 * @fileoverview 左侧标签分隔线拖拽模块，提供行高调整功能
 * @module DragLeftLabelSplitor
 */

/**
 * 左侧标签父对象
 * @type {Object|null}
 */
let leftLabelParentObj = null;

/**
 * 显示展开行图片
 * @function showExpandRowImage
 * @param {Array} labelDivs - 标签div数组
 * @param {Array} splitorDivs - 分隔线div数组
 */
function showExpandRowImage(labelDivs, splitorDivs) {
  for (var i = 0; i < labelDivs.length; i++) {
    var t = labelDivs[i];
    var w = Number(t.div.style.height.replace("px", ""));
    if (w <= 4) {
      let row1 = t.row;
      var x = Number(t.div.style.width.replace("px", ""));
      var y = Number(t.div.style.top.replace("px", ""));
      t.expandRowEl.style.position = "absolute";
      t.expandRowEl.style.left = x - 8 + "px";
      t.expandRowEl.style.top = y - 6 + "px";
      t.expandRowEl.style.height = "12px";
      t.expandRowEl.style.width = "8px";
      t.expandRowEl.style.display = "block";
      t.expandRowEl.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var t2 = labelDivs[row1];
        t2.div.style.height =
          Number(t2.div.style.height.replace("px", "")) + 20 + "px";
        moveLeftLabelBottomEls(row1, 20, labelDivs, splitorDivs);
        recordLeftLabelBottomElsInfo(row1, 20, labelDivs, splitorDivs);
        addLeftLabelRowHeight(row1, 20);
        showExpandRowImage(labelDivs, splitorDivs);
      };
    } else {
      t.expandRowEl.style.display = "none";
      t.expandRowEl.onclick = null;
    }
  }
}

function addLeftLabelRowHeight(row, deltaX) {
  leftLabelParentObj.addRowHeight(row, deltaX);
}

function moveLeftLabelBottomEls(row, deltaX, labelDivs, splitorDivs) {
  moveLeftLabelLabelDivs(row, deltaX, labelDivs);
  moveLeftLabelSplitorDivs(row, deltaX, splitorDivs);
}

function moveLeftLabelLabelDivs(row, deltaX, labelDivs) {
  for (var i = 0; i < labelDivs.length; i++) {
    var t = labelDivs[i];
    if (t.row > row) {
      t.div.style.top = t.top + deltaX + "px";
    }
  }
}

function moveLeftLabelSplitorDivs(row, deltaX, splitorDivs) {
  for (var i = 0; i < splitorDivs.length; i++) {
    var t = splitorDivs[i];
    if (t.row >= row) {
      t.div.style.top = t.top + deltaX + "px";
    }
  }
}

function recordLeftLabelBottomElsInfo(row, deltaX, labelDivs, splitorDivs) {
  recordLeftLabelLabelDivsInfo(row, deltaX, labelDivs);
  recordLeftLabelSplitorDivsInfo(row, deltaX, splitorDivs);
}

function recordLeftLabelLabelDivsInfo(row, deltaX, labelDivs) {
  for (var i = 0; i < labelDivs.length; i++) {
    var t = labelDivs[i];
    if (t.row > row) {
      t.top = Number(t.div.style.top.replace("px", ""));
    }
  }
}

function recordLeftLabelSplitorDivsInfo(row, deltaX, splitorDivs) {
  for (var i = 0; i < splitorDivs.length; i++) {
    var t = splitorDivs[i];
    if (t.row >= row) {
      t.top = Number(t.div.style.top.replace("px", ""));
    }
  }
}

function DragLeftLabelSplitor(
  dragItem,
  container,
  forElement,
  row,
  labelDivs,
  splitorDivs,
  parentObj
) {
  // 用于记录鼠标按下时的坐标与div当前的坐标
  let active = false;
  let initialY;
  let yOffset = 0;
  let minDeltaY = 0;
  let forElementHeight = 0;
  leftLabelParentObj = parentObj;

  // 鼠标按下事件
  dragItem.addEventListener("mousedown", function (e) {
    if (e.button != 0) {
      return;
    }
    forElementHeight = Number(forElement.style.height.replace("px", ""));
    if (forElementHeight == 0) {
      minDeltaY = 0;
    } else {
      minDeltaY = -forElementHeight;
    }
    yOffset = 0;
    initialY = e.clientY;
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

      if (e.clientY - initialY < minDeltaY) {
        return;
      }

      yOffset = e.clientY - initialY;

      forElement.style.height = forElementHeight + yOffset + "px";

      moveLeftLabelBottomEls(row, yOffset, labelDivs, splitorDivs);
      showExpandRowImage(labelDivs, splitorDivs);
    }
  });

  // 鼠标放开事件
  document.addEventListener("mouseup", function (e) {
    if (e.button != 0) {
      return;
    }
    if (active) {
      recordLeftLabelBottomElsInfo(row, yOffset, labelDivs, splitorDivs);
      addLeftLabelRowHeight(row, yOffset);
      showExpandRowImage(labelDivs, splitorDivs);
    }
    active = false;
  });
}
